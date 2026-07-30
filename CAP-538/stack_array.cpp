#include <iostream>
using namespace std;

class Stack {
private:
    int arr[100];
    int top;
    int capacity;

public:
    // Constructor
    Stack(int size) {
        capacity = size;
        top = -1;
    }

    // Push operation
    void push(int x) {
        if (top == capacity - 1) {
            cout << "Stack Overflow\n";
            return;
        }
        arr[++top] = x;
        cout << x << " pushed into stack\n";
    }

    // Pop operation
    void pop() {
        if (isEmpty()) {
            cout << "Stack Underflow\n";
            return;
        }
        cout << arr[top] << " popped from stack\n";
        top--;
    }

    // Peek (Top element)
    void peek() {
        if (isEmpty()) {
            cout << "Stack is Empty\n";
            return;
        }
        cout << "Top element: " << arr[top] << endl;
    }

    // Check if stack is empty
    bool isEmpty() {
        return top == -1;
    }

    // Check if stack is full
    bool isFull() {
        return top == capacity - 1;
    }

    // Current size
    int size() {
        return top + 1;
    }

    // Display stack
    void display() {
        if (isEmpty()) {
            cout << "Stack is Empty\n";
            return;
        }

        cout << "Stack elements (Top to Bottom): ";
        for (int i = top; i >= 0; i--)
            cout << arr[i] << " ";
        cout << endl;
    }
};

int main() {
    Stack s(5);

    s.push(10);
    s.push(20);
    s.push(30);

    s.display();

    s.peek();

    s.pop();

    s.display();

    cout << "Size: " << s.size() << endl;

    if (s.isEmpty())
        cout << "Stack is Empty\n";
    else
        cout << "Stack is Not Empty\n";

    return 0;
}