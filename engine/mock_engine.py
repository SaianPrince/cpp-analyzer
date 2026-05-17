import subprocess
import time
import os
import uuid
from fastapi import FastAPI, Body
import uvicorn

app = FastAPI()

def execute_and_measure(cmd, timeout=5):
    start = time.perf_counter()
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, shell=True)
        end = time.perf_counter()
        return {
            "output": proc.stdout + proc.stderr,
            "exit_code": proc.returncode,
            "time_ms": int((end - start) * 1000)
        }
    except subprocess.TimeoutExpired:
        return {"output": "Timeout", "exit_code": -1, "time_ms": timeout * 1000, "timeout": True}

@app.get("/health")
def health():
    return "Python Mock Engine is operational!"

@app.post("/analyze")
def analyze(payload: dict = Body(...)):
    code = payload.get("code", "")
    temp_file = f"temp_{uuid.uuid4().hex}.cpp"
    with open(temp_file, "w") as f:
        f.write(code)
    
    results = []
    stdout_captured = ""
    
    # Simulate -O0 to -O3
    for opt in ["-O0", "-O1", "-O2", "-O3"]:
        exe_file = temp_file.replace(".cpp", f"_{opt}.exe")
        
        # Compile
        compile_res = execute_and_measure(f"g++ {opt} {temp_file} -o {exe_file}")
        
        level_data = {
            "level": opt,
            "compile_time_ms": compile_res["time_ms"],
            "status": "success" if compile_res["exit_code"] == 0 else "error",
            "run_time_ms": 0,
            "memory_kb": 1240 + (len(code) % 300) if compile_res["exit_code"] == 0 else 0
        }
        
        if compile_res["exit_code"] == 0:
            # Run
            run_res = execute_and_measure(f"./{exe_file}")
            level_data["run_time_ms"] = run_res["time_ms"]
            level_data["status"] = "success" if not run_res.get("timeout") else "timeout"
            if opt == "-O0":
                stdout_captured = run_res["output"]
            
            # Cleanup exe
            if os.path.exists(exe_file): os.remove(exe_file)
        else:
            level_data["error_message"] = compile_res["output"]
            
        results.append(level_data)
        
    # Cleanup cpp
    if os.path.exists(temp_file): os.remove(temp_file)
    
    overall_status = "success"
    if any(res["status"] == "error" for res in results):
        overall_status = "error"
    elif any(res["status"] == "timeout" for res in results):
        overall_status = "timeout"
        
    return {
        "status": overall_status,
        "stdout": stdout_captured,
        "optimizations": results
    }

if __name__ == "__main__":
    print(">> Mock Engine starting on http://localhost:8080")
    uvicorn.run(app, host="0.0.0.0", port=8080)
