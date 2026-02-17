#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;                                        //Self refrencial variable
};

void addAtStart(Node*& head, int value) {              //call by reffrence for actual value change 
    Node* newNode = new Node();                        //dynamic memory using 'NEW'
    newNode->data = value;
    newNode->next = head;
    head = newNode;
}

int search(Node* head, int value) {
    Node* current = head;                              //current as head using node pointer
    while (current != nullptr) {
        if (current->data == value)
            return 1;                                  // found
        current = current->next;
    }
    return 0;                                          // not found
}

void print(Node* head) {
    Node* current = head;                              //current as head using node pointer

    while (current != nullptr) {
        cout << current->data << " -> ";
        current = current->next;
    }
    cout << "NULL\n";
}

int main() {
    Node* head = nullptr;
    addAtStart(head, 12);
    addAtStart(head, 13);
    addAtStart(head, 14);

    print(head);
    
    int result = search(head, 15);
    if (result)
        cout << "Value found\n";
    else
        cout << "Value not found\n";
    return 0;
}
