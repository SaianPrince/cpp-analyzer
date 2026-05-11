#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <chrono>
#include <windows.h>
#include <psapi.h>

using namespace std;
using namespace std::chrono;

struct ProcessResult {
    string output;
    DWORD exitCode; // ERROR FIX: Changed int to DWORD for Windows API compatibility
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

// Phase 1.4: Security Blacklist
bool isCodeSafe(const string& code) {
    vector<string> blacklist = {
        "system(", "exec(", "_popen", "CreateProcess", "ShellExecute", "remove(", "rename("
    };
    for (const string& badWord : blacklist) {
        if (code.find(badWord) != string::npos) {
            return false;
        }
    }
    return true;
}

bool writeCodeToFile(const string& filename, const string& code) {
    ofstream file(filename);
    if (!file.is_open()) return false;
    file << code;
    file.close();
    return true;
}

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

    auto start = high_resolution_clock::now();

    if (CreateProcessA(NULL, cmd, NULL, NULL, TRUE, 0, NULL, NULL, &si, &pi)) {
        CloseHandle(hWritePipe);

        bool running = true;
        while (running) {
            // 1. Boruda veri var mý diye kontrol et (Peek)
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

            // 2. Süre doldu mu kontrol et
            auto now = high_resolution_clock::now();
            long long elapsed = duration_cast<milliseconds>(now - start).count();

            if (timeoutMs != INFINITE && elapsed > timeoutMs) {
                TerminateProcess(pi.hProcess, 1);
                result.isTimeout = true;
                result.exitCode = -1;
                running = false;
            }

            // 3. Program bitti mi kontrol et
            DWORD waitStatus = WaitForSingleObject(pi.hProcess, 0); // 0 yazarak "bekleme, sadece bak" diyoruz
            if (waitStatus != WAIT_TIMEOUT) {
                running = false;
            }

            // Ýþlemciyi yormamak için çok kýsa uyu
            Sleep(10);
        }

        if (!result.isTimeout) {
            GetExitCodeProcess(pi.hProcess, &result.exitCode);
        }

        auto end = high_resolution_clock::now();
        result.runTimeMs = duration_cast<milliseconds>(end - start).count();

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


string escapeJsonString(const string& input) {
    string output;
    for (char c : input) {
        switch (c) {
        case '\"': output += "\\\""; break;
        case '\\': output += "\\\\"; break;
        case '\n': output += "\\n";  break;
        case '\r': output += "\\r";  break;
        case '\t': output += "\\t";  break;
        default:   output += c;      break;
        }
    }
    return output;
}

int main() {
    // TEST: Infinite loop to trigger timeout
    string sampleUserCode =
        "#include <iostream>\n"
        "using namespace std;\n"
        "int main() {\n"
        "    cout << \"Loop starting...\" << endl;\n"
        "    while(true) {} \n"
        "    return 0;\n"
        "}\n";

    if (!isCodeSafe(sampleUserCode)) {
        cout << "{\n  \"status\": \"error\",\n  \"message\": \"Security Violation detected!\"\n}" << endl;
        return 0;
    }

    string sourceFile = "temp_code.cpp";
    writeCodeToFile(sourceFile, sampleUserCode);

    vector<string> optLevels = { "-O0", "-O1", "-O2", "-O3" };
    vector<OptimizationResult> results;

    string finalStdout = "";
    DWORD finalExitCode = 0;

    for (const string& opt : optLevels) {
        OptimizationResult res;
        res.level = opt;
        string exeFile = "temp_" + opt.substr(1) + ".exe";
        string compileCommand = "g++ " + opt + " " + sourceFile + " -o " + exeFile;

        ProcessResult compRes = executeAndMeasure(compileCommand, INFINITE);
        res.compileTimeMs = compRes.runTimeMs;

        if (compRes.exitCode != 0) {
            res.success = false;
            res.errorMessage = compRes.output;
            results.push_back(res);
            continue;
        }

        // Running user code with a 5-second (5000ms) safety limit
        ProcessResult runRes = executeAndMeasure(exeFile, 5000);
        res.runTimeMs = runRes.runTimeMs;
        res.peakMemoryKb = runRes.peakMemoryKb;

        if (runRes.isTimeout) {
            res.success = false;
            res.errorMessage = "Time Limit Exceeded (>5000 ms)";
        }
        else {
            res.success = true;
            res.errorMessage = "";
            if (opt == "-O0") {
                finalStdout = runRes.output;
                finalExitCode = runRes.exitCode;
            }
        }
        results.push_back(res);
    }

    // Print JSON Output
    cout << "{\n";
    cout << "  \"status\": \"success\",\n";
    cout << "  \"optimizations\": [\n";
    for (size_t i = 0; i < results.size(); ++i) {
        cout << "    {\n";
        cout << "      \"level\": \"" << results[i].level << "\",\n";
        if (results[i].success) {
            cout << "      \"status\": \"success\",\n";
            cout << "      \"compile_time_ms\": " << results[i].compileTimeMs << ",\n";
            cout << "      \"run_time_ms\": " << results[i].runTimeMs << ",\n";
            cout << "      \"memory_kb\": " << results[i].peakMemoryKb << "\n";
        }
        else {
            cout << "      \"status\": \"error\",\n";
            cout << "      \"compile_time_ms\": " << results[i].compileTimeMs << ",\n";
            cout << "      \"error_message\": \"" << escapeJsonString(results[i].errorMessage) << "\"\n";
        }
        cout << "    }" << (i == results.size() - 1 ? "" : ",") << "\n";
    }
    cout << "  ],\n";
    cout << "  \"stdout\": \"" << escapeJsonString(finalStdout) << "\",\n";
    cout << "  \"exit_code\": " << finalExitCode << "\n";
    cout << "}\n";

    return 0;
}
