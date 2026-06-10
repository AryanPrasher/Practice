#include <iostream>
#include <string>

using namespace std;

int main() {
    string code = "(max_num++)";

    if (!code.empty() && code.front() == '(' && code.back() == ')') {
        code = code.substr(1, code.length() - 2);
    }

    cout << "Cleaned code: " << code << endl;

    return 0;
}