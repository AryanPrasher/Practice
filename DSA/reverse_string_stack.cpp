#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    int num = 12345;

    string s = to_string(num);

    stack<char> st;

    for(char ch : s) {
        st.push(ch);
    }

    string rev = "";

    while(!st.empty()) {
        rev += st.top();
        st.pop();
    }

    cout << stoi(rev);

    return 0;
}