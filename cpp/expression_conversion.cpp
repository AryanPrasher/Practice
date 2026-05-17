#include <iostream>

using namespace std;

class Stack {
    int top;
    char arr[100];
public:
    Stack() { top = -1; }
    void push(char x) { if (top < 99) arr[++top] = x; }
    char pop() { if (top >= 0) return arr[top--]; return '\0'; }
    char peek() { if (top >= 0) return arr[top]; return '\0'; }
    bool isEmpty() { return top == -1; }
};

int precedence(char c) {
    if (c == '^') return 3;
    else if (c == '/' || c == '*') return 2;
    else if (c == '+' || c == '-') return 1;
    else return -1;
}

void infixToPostfix(const char* exp) {
    Stack s;
    char result[100];
    int j = 0;
    
    for (int i = 0; exp[i] != '\0'; i++) {
        char c = exp[i];
        
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')) {
            result[j++] = c;
        } else if (c == '(') {
            s.push('(');
        } else if (c == ')') {
            while (!s.isEmpty() && s.peek() != '(') {
                result[j++] = s.pop();
            }
            if (!s.isEmpty()) s.pop();
        } else {
            while (!s.isEmpty() && precedence(exp[i]) <= precedence(s.peek())) {
                result[j++] = s.pop();
            }
            s.push(c);
        }
    }
    
    while (!s.isEmpty()) {
        result[j++] = s.pop();
    }
    result[j] = '\0';
    cout << result << endl;
}

int main() {
    const char* exp = "a+b*(c^d-e)^(f+g*h)-i";
    infixToPostfix(exp);
    return 0;
}
