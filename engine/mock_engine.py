import subprocess
import time
import os
import uuid
import resource
from fastapi import FastAPI, Body
import uvicorn

MEMORY_LIMIT_KB = 262144  # 256MB in KB

app = FastAPI()

def execute_and_measure(cmd, timeout=5):
    start = time.perf_counter()
    try:
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        memory_exceeded = False
        peak_mem_kb = 0

        while proc.poll() is None:
            elapsed = time.perf_counter() - start
            if elapsed > timeout:
                proc.kill()
                return {"output": "Timeout", "exit_code": -1, "time_ms": int(timeout * 1000), "timeout": True}

            # Check memory via /proc on Linux
            try:
                with open(f"/proc/{proc.pid}/status", "r") as f:
                    for line in f:
                        if line.startswith("VmRSS:"):
                            mem_kb = int(line.split()[1])
                            if mem_kb > peak_mem_kb:
                                peak_mem_kb = mem_kb
                            if mem_kb > MEMORY_LIMIT_KB:
                                proc.kill()
                                memory_exceeded = True
                            break
            except (FileNotFoundError, ProcessLookupError):
                pass

            if memory_exceeded:
                break
            time.sleep(0.01)

        end = time.perf_counter()
        stdout, stderr = proc.communicate(timeout=1) if proc.poll() is not None else (b"", b"")
        output = (stdout or b"").decode(errors="replace") + (stderr or b"").decode(errors="replace")

        if memory_exceeded:
            return {"output": "Memory Limit Exceeded (256MB)", "exit_code": -1, "time_ms": int((end - start) * 1000), "memory_exceeded": True, "peak_mem_kb": peak_mem_kb}

        return {
            "output": output,
            "exit_code": proc.returncode or 0,
            "time_ms": int((end - start) * 1000),
            "peak_mem_kb": peak_mem_kb
        }
    except Exception:
        return {"output": "Execution error", "exit_code": -1, "time_ms": int((time.perf_counter() - start) * 1000)}

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
            level_data["memory_kb"] = run_res.get("peak_mem_kb", level_data["memory_kb"])
            if run_res.get("timeout"):
                level_data["status"] = "timeout"
                level_data["error_message"] = "Time Limit Exceeded"
            elif run_res.get("memory_exceeded"):
                level_data["status"] = "error"
                level_data["error_message"] = "Memory Limit Exceeded (256MB)"
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
