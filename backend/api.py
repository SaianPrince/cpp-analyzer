from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from schemas import AnalyzeRequest, AnalyzeResponse, EngineResponse, Suggestion
from core.config import settings
from database import get_db
import models
import httpx
import uuid
import re
import hashlib
from datetime import datetime, timedelta

router = APIRouter()

def generate_rule_based_suggestions(code: str) -> list[Suggestion]:
    suggestions = []
    
    # Rule: Global Variables
    # Very basic check: variable declaration outside of main or other functions
    # Looking for lines starting with type name at start of string or after newline, not followed by (
    global_var_pattern = r'^(int|double|float|char|long|string)\s+\w+(\s*=\s*.*)?\s*;'
    if re.search(global_var_pattern, code, re.MULTILINE):
        suggestions.append(Suggestion(
            title="Global Değişken Kullanımı",
            detail="Global scope'ta değişken tanımı tespit edildi. Değişkenleri fonksiyon parametresi olarak geçirmeyi tercih edin.",
            severity="low"
        ))

    # Rule: Constant calculations inside loops (Simplified regex)
    loop_invariant_pattern = r'(for|while)\s*\(.*\)\s*\{[^}]*=\s*[\d\.\s\+\-\*\/]+;'
    if re.search(loop_invariant_pattern, code):
        suggestions.append(Suggestion(
            title="Döngü İçi Sabit Hesaplama",
            detail="Döngü içerisinde sabit bir değer hesaplanıyor gibi görünüyor. Sabit değeri döngünün dışına çıkararak performansı artırabilirsiniz.",
            severity="medium"
        ))
    
    # Rule: cout count (as per plan: cout sayısı > 5 ise)
    if code.count("cout") > 5:
        suggestions.append(Suggestion(
            title="cout Kullanımı",
            detail="Çok sayıda cout tespit edildi. Performans için cout yerine printf kullanmayı veya çıktıları bir string builder/buffer'da biriktirmeyi düşünebilirsiniz.",
            severity="medium"
        ))

    # Rule: endl usage
    if "endl" in code:
        suggestions.append(Suggestion(
            title="endl Yerine '\\n' Kullanın",
            detail="std::endl her çağrıldığında buffer'ı boşaltır (flush). Performans için '\\n' tercih edin.",
            severity="medium"
        ))
        
    # Rule: vector::reserve()
    if "push_back" in code and "reserve" not in code:
        suggestions.append(Suggestion(
            title="vector::reserve() Kullanın",
            detail="std::vector::push_back kullanıyorsunuz ancak öncesinde reserve() çağrılmamış. Onceden reserve() ile boyut ayırarak yeniden bellek tahsislerini engelleyebilirsiniz.",
            severity="medium"
        ))

    return suggestions

@router.post("/analyze", response_model=AnalyzeResponse, summary="Analyze C++ Code")
async def analyze_code(request: AnalyzeRequest, fastapi_req: Request, db: AsyncSession = Depends(get_db)):
    """
    Kullanıcıdan gelen C++ kodunu alır, C++ derleme motoruna gönderir ve 
    performans analizi ile optimizasyon önerileri sunar.
    """
    # 2.5 — Rate Limiting
    client_ip = fastapi_req.client.host
    ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()
    
    # Check last 24 hours
    one_day_ago = datetime.utcnow() - timedelta(days=1)
    stmt = select(func.count(models.Analysis.id)).where(
        models.Analysis.ip_hash == ip_hash,
        models.Analysis.created_at >= one_day_ago
    )
    result = await db.execute(stmt)
    count = result.scalar()
    
    if count >= 20: 
        raise HTTPException(status_code=429, detail="Günlük analiz sınırına ulaştınız (20/gün).")

    # 1. Generate rule-based suggestions (Phase 2.3)
    suggestions = generate_rule_based_suggestions(request.code)
    
    # 2. Call C++ Engine
    engine_result = None
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.ENGINE_URL}/analyze",
                json={"code": request.code},
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            engine_result = EngineResponse(**data)
    except httpx.RequestError as exc:
        # Mocking the engine response for testing without the engine
        engine_result = EngineResponse(
            status="error",
            message=f"Engine connection failed: {str(exc)}",
            stdout="",
            optimizations=[]
        )
    except httpx.HTTPStatusError as exc:
        engine_result = EngineResponse(
            status="error",
            message=f"Engine returned an error: {exc.response.status_code}",
            stdout="",
            optimizations=[]
        )
        
    # If the code failed to compile or time out, don't show performance suggestions
    if engine_result.status != "success":
        suggestions = []
        
    # 3. Save to Database (Phase 2.4)
    analysis_id = str(uuid.uuid4())
    
    # Get peak memory if available (from -O0 or similar)
    peak_memory = 0
    if engine_result.optimizations:
        # Find max memory_kb in optimizations
        peak_memory = max([opt.memory_kb for opt in engine_result.optimizations])

    db_analysis = models.Analysis(
        id=analysis_id,
        code=request.code,
        status=engine_result.status,
        stdout=engine_result.stdout,
        optimizations=[opt.dict() for opt in engine_result.optimizations],
        suggestions=[s.dict() for s in suggestions],
        memory_kb=peak_memory,
        ip_hash=ip_hash
    )
    
    db.add(db_analysis)
    await db.commit()
    await db.refresh(db_analysis)
    
    return AnalyzeResponse(
        status="success",
        engine_result=engine_result,
        suggestions=suggestions,
        id=analysis_id
    )

@router.get("/result/{analysis_id}", response_model=AnalyzeResponse)
async def get_analysis_result(analysis_id: str, db: AsyncSession = Depends(get_db)):
    """
    Belirli bir analiz sonucunu ID ile veritabanından getirir.
    """
    stmt = select(models.Analysis).where(models.Analysis.id == analysis_id)
    result = await db.execute(stmt)
    db_analysis = result.scalar_one_or_none()
    
    if not db_analysis:
        raise HTTPException(status_code=404, detail="Analiz bulunamadı.")
    
    return AnalyzeResponse(
        status="success",
        engine_result=EngineResponse(
            status=db_analysis.status,
            message=None,
            stdout=db_analysis.stdout,
            optimizations=db_analysis.optimizations
        ),
        suggestions=[Suggestion(**s) for s in db_analysis.suggestions],
        id=db_analysis.id
    )
