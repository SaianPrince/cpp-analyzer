#ifdef _WIN32
    #define _WIN32_WINNT 0x0A00 
    #include <windows.h>
    #include <psapi.h>
#else
    #include <unistd.h>
    #include <sys/wait.h>
    #include <sys/resource.h>
    #include <fcntl.h>
    #include <signal.h>
#endif

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <chrono>
#include <cstring>

// External libraries
#include "httplib.h"
#include "json.hpp"

using namespace std;
using namespace std::chrono;
using json = nlohmann::json;

// --- DATA STRUCTURES ---
struct ProcessResult {
    string output;
    int exitCode;
    long long runTimeMs;
    long long peakMemoryKb;
    bool isTimeout;
};

// --- SECURITY SANDBOX ---
bool isCodeSafe(const string& code) {
    vector<string> blacklist = {
        "system(", "exec(", "_popen", "CreateProcess", "ShellExecute", "remove(", "rename("
    };
    for (const string& keyword : blacklist) {
        if (code.find(keyword) != string::npos) return false;
    }
    return true;
}

// --- CORE EXECUTION ENGINE ---
#ifdef _WIN32
ProcessResult executeAndMeasure(const string& command, int timeoutMs = -1) {
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
    char cmd[1024];
    strncpy(cmd, command.c_str(), sizeof(cmd));

    auto startTime = high_resolution_clock::now();
    if (CreateProcessA(NULL, cmd, NULL, NULL, TRUE, 0, NULL, NULL, &si, &pi)) {
        CloseHandle(hWritePipe);
        bool isRunning = true;
        while (isRunning) {
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
            auto currentTime = high_resolution_clock::now();
            if (timeoutMs != -1 && duration_cast<milliseconds>(currentTime - startTime).count() > timeoutMs) {
                TerminateProcess(pi.hProcess, 1);
                result.isTimeout = true;
                isRunning = false;
            }
            if (WaitForSingleObject(pi.hProcess, 0) != WAIT_TIMEOUT) isRunning = false;
            Sleep(10);
        }
        if (!result.isTimeout) {
            DWORD winExitCode;
            GetExitCodeProcess(pi.hProcess, &winExitCode);
            result.exitCode = (int)winExitCode;
        }
        result.runTimeMs = duration_cast<milliseconds>(high_resolution_clock::now() - startTime).count();
        PROCESS_MEMORY_COUNTERS pmc;
        if (GetProcessMemoryInfo(pi.hProcess, &pmc, sizeof(pmc))) {
            result.peakMemoryKb = pmc.PeakWorkingSetSize / 1024;
        }
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
    }
    CloseHandle(hReadPipe);
    return result;
}
#else
ProcessResult executeAndMeasure(const string& command, int timeoutMs = -1) {
    ProcessResult result = { "", 0, 0, 0, false };
    int pipefd[2];
    if (pipe(pipefd) == -1) return result;

    auto startTime = high_resolution_clock::now();
    pid_t pid = fork();

    if (pid == 0) { // Child
        close(pipefd[0]);
        dup2(pipefd[1], STDOUT_FILENO);
        dup2(pipefd[1], STDERR_FILENO);
        execl("/bin/sh", "sh", "-c", command.c_str(), (char*)NULL);
        exit(1);
    } else if (pid > 0) { // Parent
        close(pipefd[1]);
        fcntl(pipefd[0], F_SETFL, O_NONBLOCK);

        bool isRunning = true;
        while (isRunning) {
            char buffer[4096];
            ssize_t bytesRead = read(pipefd[0], buffer, sizeof(buffer) - 1);
            if (bytesRead > 0) {
                buffer[bytesRead] = '\0';
                result.output += buffer;
            }

            int status;
            pid_t waitRes = waitpid(pid, &status, WNOHANG);
            if (waitRes != 0) {
                if (WIFEXITED(status)) result.exitCode = WEXITSTATUS(status);
                isRunning = false;
            }

            auto currentTime = high_resolution_clock::now();
            if (timeoutMs != -1 && duration_cast<milliseconds>(currentTime - startTime).count() > timeoutMs) {
                kill(pid, SIGKILL);
                result.isTimeout = true;
                isRunning = false;
            }
            usleep(10000);
        }
        result.runTimeMs = duration_cast<milliseconds>(high_resolution_clock::now() - startTime).count();
        struct rusage usage;
        getrusage(RUSAGE_CHILDREN, &usage);
        result.peakMemoryKb = usage.ru_maxrss; // On Linux, ru_maxrss is in KB
        close(pipefd[0]);
    }
    return result;
}
#endif

// --- ANALYSIS LOGIC ---
json analyzeCode(const string& userSourceCode) {
    json response;
    if (!isCodeSafe(userSourceCode)) {
        response["status"] = "error";
        response["message"] = "Security Violation: Dangerous functions detected!";
        return response;
    }

    ofstream file("temp_code.cpp");
    file << userSourceCode;
    file.close();

    vector<string> optimizationLevels = { "-O0", "-O1", "-O2", "-O3" };
    string capturedStdout = "";

    for (const string& level : optimizationLevels) {
        json levelData;
        levelData["level"] = level;

        string binaryFile = "temp_" + level.substr(1);
#ifdef _WIN32
        binaryFile += ".exe";
        string runCmd = ".\\" + binaryFile;
#else
        string runCmd = "./" + binaryFile;
#endif
        string compileCmd = "g++ " + level + " temp_code.cpp -o " + binaryFile;

        ProcessResult compilationResult = executeAndMeasure(compileCmd);
        levelData["compile_time_ms"] = compilationResult.runTimeMs;

        if (compilationResult.exitCode != 0) {
            levelData["status"] = "error";
            levelData["error_message"] = compilationResult.output;
            response["optimizations"].push_back(levelData);
            continue;
        }

        ProcessResult executionResult = executeAndMeasure(runCmd, 5000);
        levelData["run_time_ms"] = executionResult.runTimeMs;
        levelData["memory_kb"] = (int)executionResult.peakMemoryKb;

        if (executionResult.isTimeout) {
            levelData["status"] = "error";
            levelData["error_message"] = "Time Limit Exceeded";
        } else {
            levelData["status"] = "success";
            if (level == "-O0") capturedStdout = executionResult.output;
        }
        response["optimizations"].push_back(levelData);
    }

    response["status"] = "success";
    response["stdout"] = capturedStdout;
    return response;
}

int main() {
    httplib::Server httpServer;
    httpServer.Get("/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("C++ Engine is operational!", "text/plain");
    });

    httpServer.Post("/analyze", [](const httplib::Request& req, httplib::Response& res) {
        try {
            auto requestBody = json::parse(req.body);
            string source = requestBody["code"];
            json analysisResult = analyzeCode(source);
            res.set_content(analysisResult.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid JSON format\"}", "application/json");
        }
    });

    cout << ">> C++ Engine HTTP Server is listening on http://localhost:8080" << endl;
    httpServer.listen("0.0.0.0", 8080);
    return 0;
}
