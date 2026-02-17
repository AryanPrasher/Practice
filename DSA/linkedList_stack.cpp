#include <iostream>
using namespace std;

// Node structure
struct Node {
    int data;
    Node* next;
};

Node* top = NULL;   // Initially stack is empty

// Push operation
void stackIn(int value) {
    Node* newNode = new Node();   // Create new node

    newNode->data = value;
    newNode->next = top;          // Point to old top
    top = newNode;                // Update top

    cout << value << " inserted into stack\n";
}

// Pop operation
void stackOut() {
    if (top == NULL) {
        cout << "Stack Underflow\n";
        return;
    }

    Node* temp = top;
    cout << top->data << " removed from stack\n";
    top = top->next;   // Move top down
    delete temp;       // Free memory
}

// Display stack
void display() {
    if (top == NULL) {
        cout << "Stack is empty\n";
        return;
    }

    Node* temp = top;
    cout << "Stack elements: ";

    while (temp != NULL) {
        cout << temp->data << " ";
        temp = temp->next;
    }

    cout << endl;
}

int main() {

    stackIn(10);
    stackIn(20);
    stackIn(30);
    stackIn(40);
    stackIn(50);

    display();

    stackOut();
    display();

    return 0;
}
