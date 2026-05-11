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
    DWORD exitCode; // Fixed type for Windows API compatibility
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
    for (const string& keyword : blacklist) {
        if (code.find(keyword) != string::npos) {
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

        bool isRunning = true;
        while (isRunning) {
            // 1. Check if there is data in the pipe (Peek)
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

            // 2. Check for timeout
            auto now = high_resolution_clock::now();
            long long elapsed = duration_cast<milliseconds>(now - start).count();

            if (timeoutMs != INFINITE && elapsed > timeoutMs) {
                TerminateProcess(pi.hProcess, 1);
                result.isTimeout = true;
                result.exitCode = -1;
                isRunning = false;
            }

            // 3. Check if the program has finished
            // Using 0 means "don't wait, just check the current status"
            DWORD waitStatus = WaitForSingleObject(pi.hProcess, 0); 
            if (waitStatus != WAIT_TIMEOUT) {
                isRunning = false;
            }

            // Sleep shortly to avoid 100% CPU usage
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
        "}\
