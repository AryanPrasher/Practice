#include <iostream>

using namespace std;

class Stack {
    int top;
    int arr[100];
public:
    Stack() { top = -1; }
    void push(int x) { if (top < 99) arr[++top] = x; }
    int pop() { if (top >= 0) return arr[top--]; return -1; }
};

int evaluatePostfix(const char* exp) {
    Stack s;
    for (int i = 0; exp[i] != '\0'; i++) {
        if (exp[i] >= '0' && exp[i] <= '9') {
            s.push(exp[i] - '0');
        } else {
            int val1 = s.pop();
            int val2 = s.pop();
            switch (exp[i]) {
                case '+': s.push(val2 + val1); break;
                case '-': s.push(val2 - val1); break;
                case '*': s.push(val2 * val1); break;
                case '/': s.push(val2 / val1); break;
            }
        }
    }
    return s.pop();
}

int main() {
    const char* exp = "231*+9-";
    cout << evaluatePostfix(exp) << endl;
    return 0;
}
