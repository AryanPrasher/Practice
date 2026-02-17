#include <iostream>
using namespace std;

#define MAX 5

int arr[MAX];   // stack array
int top = -1;   // stack is initially empty

// Push operation
void stackIn(int value) {
    if (top == MAX - 1) {
        cout << "Stack Overflow\n";
        return;
    }
    top++;
    arr[top] = value;
    cout << value << " inserted into stack\n";
}

// Pop operation
void stackOut() {
    if (top == -1) {
        cout << "Stack Underflow\n";
        return;
    }
    cout << arr[top] << " removed from stack\n";
    top--;
}

// Display stack
void display() {
    if (top == -1) {
        cout << "Stack is empty\n";
        return;
    }

    cout << "Stack elements: ";
    for (int i = top; i >= 0; i--)
        cout << arr[i] << " ";
    cout << endl;
}

int main() {
    stackIn(10);
    stackIn(20);
    stackIn(30);
    stackIn(40);
    stackIn(50);
    stackIn(60);
    display();

    stackOut();
    display();

    return 0;
}
