import httpx
import time
import uuid

BASE_URL = "http://localhost:8000/api"

def test_hello_world():
    print("Testing Hello World...")
    code = "#include <iostream>\nint main() { std::cout << \"Hello World\"; return 0; }"
    try:
        response = httpx.post(f"{BASE_URL}/analyze", json={"code": code}, timeout=30.0)
        print(f"Status: {response.status_code}")
        data = response.json()
        if response.status_code == 200 and data["status"] == "success":
            print("✅ Hello World Success")
            print(f"Output: {data['engine_result']['stdout']}")
        else:
            print("❌ Hello World Failed")
    except Exception as e:
        print(f"Error: {e}")

def test_timeout():
    print("\nTesting Infinite Loop (Timeout)...")
    code = "int main() { while(true); return 0; }"
    try:
        response = httpx.post(f"{BASE_URL}/analyze", json={"code": code}, timeout=30.0)
        data = response.json()
        # The engine should return "Time Limit Exceeded" in optimizations
        timeout_detected = any(opt["error_message"] == "Time Limit Exceeded" for opt in data["engine_result"]["optimizations"])
        if timeout_detected:
            print("✅ Timeout (TLE) Success")
        else:
            print("❌ Timeout (TLE) Failed")
    except Exception as e:
        print(f"Error: {e}")

def test_compile_error():
    print("\nTesting Compilation Error...")
    code = "int main() { invalid_code; return 0; }"
    try:
        response = httpx.post(f"{BASE_URL}/analyze", json={"code": code}, timeout=30.0)
        data = response.json()
        error_detected = any(opt["status"] == "error" and "error_message" in opt for opt in data["engine_result"]["optimizations"])
        if error_detected:
            print("✅ Compilation Error Success")
        else:
            print("❌ Compilation Error Failed")
    except Exception as e:
        print(f"Error: {e}")

def test_rate_limit():
    print("\nTesting Rate Limit (20 requests)...")
    code = "int main() { return 0; }"
    # We will send 21 requests to see if the 21st fails with 429
    # NOTE: This assumes a fresh IP/DB state or few previous requests.
    for i in range(1, 22):
        response = httpx.post(f"{BASE_URL}/analyze", json={"code": code}, timeout=30.0)
        if response.status_code == 429:
            print(f"✅ Rate Limit Triggered at request {i}")
            return
    print("❌ Rate Limit Failed to trigger within 21 requests")

if __name__ == "__main__":
    test_hello_world()
    test_timeout()
    test_compile_error()
    test_rate_limit()
