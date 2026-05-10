#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <chrono>
#include <memory>
#include <stdexcept>

// Platform specific popen/pclose definitions
#ifdef _WIN32
#define POPEN _popen
#define PCLOSE _pclose
#else
#define POPEN popen
#define PCLOSE pclose
#endif

using namespace std;
using namespace std::chrono;

// Writes the user-provided C++ code to a temporary file
bool writeCodeToFile(const string& filename, const string& code) {
    ofstream file(filename);
    if (!file.is_open()) {
        return false;
    }
    file << code;
    file.close();
    return true;
}

// Executes a shell command and captures its stdout/stderr
string executeCommand(const string& command, int& exitCode) {
    string result = "";
    char buffer[128];

    // Redirect stderr to stdout to capture compilation errors as well
    string fullCommand = command + " 2>&1";
    FILE* pipe = POPEN(fullCommand.c_str(), "r");

    if (!pipe) {
        throw runtime_error("Failed to run command");
    }

    while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
        result += buffer;
    }

    exitCode = PCLOSE(pipe);
    return result;
}

// Function to escape string for JSON formatting
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
    // Simulated code coming from the frontend/user
    string sampleUserCode =
        "#include <iostream>\n"
        "using namespace std;\n"
        "int main() {\n"
        "    int sum = 0;\n"
        "    for(int i=0; i<1000000; i++) sum += i;\n"
        "    cout << \"Calculation Complete!\" << endl;\n"
        "    return 0;\n"
        "}\n";

    string sourceFile = "temp_code.cpp";
    string exeFile = "temp_code.exe"; // For Windows

    // Step 1: Write code to file
    if (!writeCodeToFile(sourceFile, sampleUserCode)) {
        cout << "{\n  \"status\": \"error\",\n  \"message\": \"Failed to write source file\"\n}" << endl;
        return 1;
    }

    // Step 2: Compile the code
    string compileCommand = "g++ " + sourceFile + " -o " + exeFile;
    int compileExitCode = 0;

    auto compileStart = high_resolution_clock::now();
    string compileOutput = executeCommand(compileCommand, compileExitCode);
    auto compileEnd = high_resolution_clock::now();

    long long compileTimeMs = duration_cast<milliseconds>(compileEnd - compileStart).count();

    if (compileExitCode != 0) {
        cout << "{\n"
            << "  \"status\": \"error\",\n"
            << "  \"compile_time_ms\": " << compileTimeMs << ",\n"
            << "  \"stderr\": \"" << escapeJsonString(compileOutput) << "\"\n"
            << "}\n";
        return 0; // Return gracefully with JSON
    }

    // Step 3: Run the compiled code
    string runCommand = exeFile;
    int runExitCode = 0;

    auto runStart = high_resolution_clock::now();
    string runOutput = executeCommand(runCommand, runExitCode);
    auto runEnd = high_resolution_clock::now();

    long long runTimeMs = duration_cast<milliseconds>(runEnd - runStart).count();

    // Step 4: Output the final JSON
    cout << "{\n"
        << "  \"status\": \"success\",\n"
        << "  \"compile_time_ms\": " << compileTimeMs << ",\n"
        << "  \"run_time_ms\": " << runTimeMs << ",\n"
        << "  \"stdout\": \"" << escapeJsonString(runOutput) << "\",\n"
        << "  \"stderr\": \"\",\n"
        << "  \"exit_code\": " << runExitCode << "\n"
        << "}\n";

    return 0;
}
