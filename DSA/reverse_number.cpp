#include <iostream>
#include <stack>
#include <algorithm>

using namespace std;

int main (){
    int a = 123456789;

    stack<int> st;
    int n = a;
    while (n > 0) {
        st.push(n % 10);
        n /= 10;
    }

    int rev = 0;
    while (!st.empty()) {
        rev = rev * 10 + st.top();
        st.pop();
    }

    cout<<rev;
    return 0;
}