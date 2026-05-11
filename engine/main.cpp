#define _WIN32_WINNT 0x0A00 // Tell compiler we are on Windows 10 or later
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <chrono>

// External libraries
#include "httplib.h"
#include "json.hpp"

// Windows System headers
#include <windows.h>
#include <psapi.h>

using namespace std;
using namespace std::chrono;
using json = nlohmann::json;

// --- DATA STRUCTURES ---
struct ProcessResult {
    string output;
    DWORD exitCode;
    long long runTimeMs;
    SIZE_T peakMemoryKb;
    bool isTimeout;
};

struct OptimizationResult {
    string level;
    long long compileTimeMs;
    long long runTimeMs;
    SIZE_T peakMemoryKb;
    bool success;
    string errorMessage;
};

// --- SECURITY SANDBOX (Phase 1.4) ---
bool isCodeSafe(const string& code) {
    // List of forbidden function calls
    vector<string> blacklist = {
        "system(", "exec(", "_popen", "CreateProcess", "ShellExecute", "remove(", "rename("
    };
    for (const string& keyword : blacklist) {
        if (code.find(keyword) != string::npos) return false;
    }
    return true;
}

// --- CORE EXECUTION ENGINE (Phase 1.3 & 1.4) ---
ProcessResult executeAndMeasure(const string& command, DWORD timeoutMs = INFINITE) {
    ProcessResult result = { "", 0, 0, 0, false };

    HANDLE hReadPipe, hWritePipe;
    SECURITY_ATTRIBUTES saAttr = { sizeof(SECURITY_ATTRIBUTES), NULL, TRUE };
    if (!CreatePipe(&hReadPipe, &hWritePipe, &saAttr, 0)) return result;
    SetHandleInformation(hReadPipe, HANDLE_FLAG_INHERIT, 0);

    STARTUPINFOA si = { sizeof(STARTUPINFOA) };
    si.dwFlags = STARTF_USESTDHANDLES;
    si.hStdOutput = hWritePipe;
    si.hStdError = hWritePipe;

    PROCESS_INFORMATION pi;
    char cmd[512];
    strncpy(cmd, command.c_str(), sizeof(cmd));

    auto startTime = high_resolution_clock::now();

    if (CreateProcessA(NULL, cmd, NULL, NULL, TRUE, 0, NULL, NULL, &si, &pi)) {
        CloseHandle(hWritePipe);

        bool isRunning = true;
        while (isRunning) {
            // Check if there is data in the pipe without blocking
            DWORD bytesAvailable = 0;
            PeekNamedPipe(hReadPipe, NULL, 0, NULL, &bytesAvailable, NULL);
            if (bytesAvailable > 0) {
                char buffer[4096];
                DWORD bytesRead;
                if (ReadFile(hReadPipe, buffer, sizeof(buffer) - 1, &bytesRead, NULL) && bytesRead != 0) {
                    buffer[bytesRead] = '\0';
                    result.output += buffer;
                }
            }

            // Check for timeout
            auto currentTime = high_resolution_clock::now();
            if (timeoutMs != INFINITE && duration_cast<milliseconds>(currentTime - startTime).count() > timeoutMs) {
                TerminateProcess(pi.hProcess, 1);
                result.isTimeout = true;
                isRunning = false;
            }

            // Check if process has exited
            if (WaitForSingleObject(pi.hProcess, 0) != WAIT_TIMEOUT) isRunning = false;
            Sleep(10);
        }

        if (!result.isTimeout) GetExitCodeProcess(pi.hProcess, &result.exitCode);
        result.runTimeMs = duration_cast<milliseconds>(high_resolution_clock::now() - startTime).count();

        // Measure Peak Memory Usage
        PROCESS_MEMORY_COUNTERS pmc;
        if (GetProcessMemoryInfo(pi.hProcess, &pmc, sizeof(pmc))) {
            result.peakMemoryKb = pmc.PeakWorkingSetSize / 1024;
        }

        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
    }
    else {
        CloseHandle(hWritePipe);
    }

    CloseHandle(hReadPipe);
    return result;
}

// --- ANALYSIS LOGIC ---
json analyzeCode(const string& userSourceCode) {
    json response;

    // 1. Security Check
    if (!isCodeSafe(userSourceCode)) {
        response["status"] = "error";
        response["message"] = "Security Violation: Dangerous functions detected!";
        return response;
    }

    // 2. Write source to temporary file
    ofstream file("temp_code.cpp");
    file << userSourceCode;
    file.close();

    vector<string> optimizationLevels = { "-O0", "-O1", "-O2", "-O3" };
    string capturedStdout = "";

    for (const string& level : optimizationLevels) {
        json levelData;
        levelData["level"] = level;

        string binaryFile = "temp_" + level.substr(1) + ".exe";
        string compileCmd = "g++ " + level + " temp_code.cpp -o " + binaryFile;

        ProcessResult compilationResult = executeAndMeasure(compileCmd, INFINITE);
        levelData["compile_time_ms"] = compilationResult.runTimeMs;

        if (compilationResult.exitCode != 0) {
            levelData["status"] = "error";
            levelData["error_message"] = compilationResult.output;
            response["optimizations"].push_back(levelData);
            continue;
        }

        ProcessResult executionResult = executeAndMeasure(binaryFile, 5000);
        levelData["run_time_ms"] = executionResult.runTimeMs;
        levelData["memory_kb"] = executionResult.peakMemoryKb;

        if (executionResult.isTimeout) {
            levelData["status"] = "error";
            levelData["error_message"] = "Time Limit Exceeded";
        }
        else {
            levelData["status"] = "success";
            if (level == "-O0") capturedStdout = executionResult.output;
        }
        response["optimizations"].push_back(levelData);
    }

    response["status"] = "success";
    response["stdout"] = capturedStdout;
    return response;
}

// --- WEB SERVER ENTRY POINT ---
int main() {
    httplib::Server httpServer;

    // Endpoint 1: Health Check
    httpServer.Get("/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("C++ Engine is operational!", "text/plain");
        });

    // Endpoint 2: Code Analysis (Core Logic)
    httpServer.Post("/analyze", [](const httplib::Request& req, httplib::Response& res) {
        try {
            // Parse incoming JSON body
            auto requestBody = json::parse(req.body);
            string source = requestBody["code"];

            cout << ">> Incoming analysis request processed." << endl;

            // Execute analysis
            json analysisResult = analyzeCode(source);

            // Return result as JSON
            res.set_content(analysisResult.dump(), "application/json");
        }
        catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid JSON format\"}", "application/json");
        }
        });

    cout << ">> C++ Engine HTTP Server is listening on http://localhost:8080" << endl;
    httpServer.listen("0.0.0.0", 8080);

    return 0;
}
