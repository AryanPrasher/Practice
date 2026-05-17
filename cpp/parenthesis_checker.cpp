#include <iostream>

using namespace std;

class Stack {
    int top;
    char arr[100];
public:
    Stack() {
        top = -1;
    }
    void push(char x) {
        if (top < 99) arr[++top] = x;
    }
    char pop() {
        if (top >= 0) return arr[top--];
        return '\0';
    }
    bool isEmpty() {
        return top == -1;
    }
};

bool areBracketsBalanced(const char* expr) {
    Stack s;
    for (int i = 0; expr[i] != '\0'; i++) {
        if (expr[i] == '(' || expr[i] == '[' || expr[i] == '{') {
            s.push(expr[i]);
            continue;
        }
        
        if (s.isEmpty()) return false;
        
        char x;
        switch (expr[i]) {
            case ')':
                x = s.pop();
                if (x == '{' || x == '[') return false;
                break;
            case '}':
                x = s.pop();
                if (x == '(' || x == '[') return false;
                break;
            case ']':
                x = s.pop();
                if (x == '(' || x == '{') return false;
                break;
        }
    }
    return s.isEmpty();
}

int main() {
    const char* expr = "{()}[]";
    if (areBracketsBalanced(expr)) {
        cout << "Balanced\n";
    } else {
        cout << "Not Balanced\n";
    }
    return 0;
}
