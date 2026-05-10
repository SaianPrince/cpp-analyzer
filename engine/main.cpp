#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <chrono>
#include <memory>
// Windows Kernel headers for CreateProcess and Memory Info
#include <windows.h>
#include <psapi.h>

using namespace std;
using namespace std::chrono;

struct ProcessResult {
    string output;
    int exitCode;
    long long runTimeMs;
    SIZE_T peakMemoryKb; // Sadece Bellek eklendi
};

struct OptimizationResult {
    string level;
    long long compileTimeMs;
    long long runTimeMs;
    SIZE_T peakMemoryKb;
    bool success;
    string errorMessage;
};

bool writeCodeToFile(const string& filename, const string& code) {
    ofstream file(filename);
    if (!file.is_open()) return false;
    file << code;
    file.close();
    return true;
}

// Windows API Process Execution (Saf 1.3)
ProcessResult executeAndMeasure(const string& command) {
    ProcessResult result = { "", -1, 0, 0 };

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

    // Programi baslat
    if (CreateProcessA(NULL, cmd, NULL, NULL, TRUE, 0, NULL, NULL, &si, &pi)) {
        CloseHandle(hWritePipe);

        char buffer[4096];
        DWORD bytesRead;
        while (ReadFile(hReadPipe, buffer, sizeof(buffer) - 1, &bytesRead, NULL) && bytesRead != 0) {
            buffer[bytesRead] = '\0';
            result.output += buffer;
        }

        // Programin bitmesini sonsuza kadar bekle (Guvenlik 1.4'te eklenecek)
        WaitForSingleObject(pi.hProcess, INFINITE);
        auto end = high_resolution_clock::now();
        result.runTimeMs = duration_cast<milliseconds>(end - start).count();

        DWORD exitCode;
        GetExitCodeProcess(pi.hProcess, &exitCode);
        result.exitCode = exitCode;

        // --- PHASE 1.3: MEMORY MEASUREMENT ---
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
        case '\b': output += "\\b";  break;
        case '\f': output += "\\f";  break;
        case '\n': output += "\\n";  break;
        case '\r': output += "\\r";  break;
        case '\t': output += "\\t";  break;
        default:   output += c;      break;
        }
    }
    return output;
}

int main() {
    // RAM yiyecek 40MB'lik test kodu
    string sampleUserCode =
        "#include <iostream>\n"
        "#include <vector>\n"
        "using namespace std;\n"
        "int main() {\n"
        "    vector<int> bigArray(10000000, 42);\n"
        "    long long sum = 0;\n"
        "    for(int num : bigArray) sum += num;\n"
        "    cout << \"Calculation Complete, Sum: \" << sum << endl;\n"
        "    return 0;\n"
        "}\n";

    string sourceFile = "temp_code.cpp";

    if (!writeCodeToFile(sourceFile, sampleUserCode)) {
        cout << "{\n  \"status\": \"error\",\n  \"message\": \"Failed to write source file\"\n}" << endl;
        return 1;
    }

    vector<string> optLevels = { "-O0", "-O1", "-O2", "-O3" };
    vector<OptimizationResult> results;

    string finalStdout = "";
    int finalExitCode = 0;

    for (const string& opt : optLevels) {
        OptimizationResult res;
        res.level = opt;

        string exeFile = "temp_" + opt.substr(1) + ".exe";
        string compileCommand = "g++ " + opt + " " + sourceFile + " -o " + exeFile;

        ProcessResult compRes = executeAndMeasure(compileCommand);
        res.compileTimeMs = compRes.runTimeMs;

        if (compRes.exitCode != 0) {
            res.success = false;
            res.errorMessage = compRes.output;
            results.push_back(res);
            continue;
        }

        ProcessResult runRes = executeAndMeasure(exeFile);
        res.runTimeMs = runRes.runTimeMs;
        res.peakMemoryKb = runRes.peakMemoryKb; // YENI
        res.success = true;
        res.errorMessage = "";

        if (opt == "-O0") {
            finalStdout = runRes.output;
            finalExitCode = runRes.exitCode;
        }

        results.push_back(res);
    }

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
    cout << "  \"stderr\": \"\",\n";
    cout << "  \"exit_code\": " << finalExitCode << "\n";
    cout << "}\n";

    return 0;
}
