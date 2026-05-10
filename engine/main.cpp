#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <chrono>
#include <memory>
#include <stdexcept>

#ifdef _WIN32
#define POPEN _popen
#define PCLOSE _pclose
#else
#define POPEN popen
#define PCLOSE pclose
#endif

using namespace std;
using namespace std::chrono;

// Helper struct to store results for each optimization level
struct OptimizationResult {
    string level;
    long long compileTimeMs;
    long long runTimeMs;
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

string executeCommand(const string& command, int& exitCode) {
    string result = "";
    char buffer[128];
    string fullCommand = command + " 2>&1";
    FILE* pipe = POPEN(fullCommand.c_str(), "r");

    if (!pipe) throw runtime_error("Failed to run command");

    while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
        result += buffer;
    }

    exitCode = PCLOSE(pipe);
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
    // A heavier CPU task to clearly see the difference between O0 and O3
    string sampleUserCode =
        "#include <iostream>\n"
        "using namespace std;\n"
        "bool isPrime(int n) {\n"
        "    if (n <= 1) return false;\n"
        "    for (int i = 2; i * i <= n; i++) {\n"
        "        if (n % i == 0) return false;\n"
        "    }\n"
        "    return true;\n"
        "}\n"
        "int main() {\n"
        "    int count = 0;\n"
        "    for(int i=2; i<500000; i++) {\n"
        "        if (isPrime(i)) count++;\n"
        "    }\n"
        "    cout << \"Found \" << count << \" primes.\" << endl;\n"
        "    return 0;\n"
        "}\n";

    string sourceFile = "temp_code.cpp";

    if (!writeCodeToFile(sourceFile, sampleUserCode)) {
        cout << "{\n  \"status\": \"error\",\n  \"message\": \"Failed to write source file\"\n}" << endl;
        return 1;
    }

    // List of optimization levels to test
    vector<string> optLevels = { "-O0", "-O1", "-O2", "-O3" };
    vector<OptimizationResult> results;

    string finalStdout = "";
    int finalExitCode = 0;

    // Loop through each optimization level
    for (const string& opt : optLevels) {
        OptimizationResult res;
        res.level = opt;

        string exeFile = "temp_" + opt.substr(1) + ".exe"; // e.g., temp_O0.exe
        string compileCommand = "g++ " + opt + " " + sourceFile + " -o " + exeFile;
        int compileExitCode = 0;

        // 1. Measure Compilation
        auto compileStart = high_resolution_clock::now();
        string compileOutput = executeCommand(compileCommand, compileExitCode);
        auto compileEnd = high_resolution_clock::now();
        res.compileTimeMs = duration_cast<milliseconds>(compileEnd - compileStart).count();

        if (compileExitCode != 0) {
            res.success = false;
            res.errorMessage = compileOutput;
            results.push_back(res);
            continue; // Skip running if compilation failed
        }

        // 2. Measure Execution
        int runExitCode = 0;
        auto runStart = high_resolution_clock::now();
        string runOutput = executeCommand(exeFile, runExitCode);
        auto runEnd = high_resolution_clock::now();
        res.runTimeMs = duration_cast<milliseconds>(runEnd - runStart).count();

        res.success = true;
        res.errorMessage = "";

        // Save stdout from the first successful run (O0) to return to frontend
        if (opt == "-O0") {
            finalStdout = runOutput;
            finalExitCode = runExitCode;
        }

        results.push_back(res);
    }

    // Step 3: Print the aggregated JSON response
    cout << "{\n";
    cout << "  \"status\": \"success\",\n";
    cout << "  \"optimizations\": [\n";

    for (size_t i = 0; i < results.size(); ++i) {
        cout << "    {\n";
        cout << "      \"level\": \"" << results[i].level << "\",\n";
        if (results[i].success) {
            cout << "      \"status\": \"success\",\n";
            cout << "      \"compile_time_ms\": " << results[i].compileTimeMs << ",\n";
            cout << "      \"run_time_ms\": " << results[i].runTimeMs << "\n";
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
