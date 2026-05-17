#include <iostream>

using namespace std;

struct Node {
    int data;
    Node* next;
};

void traverse(Node* head) {
    Node* current = head;
    while (current != NULL) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}

Node* insertAtBeginning(Node* head, int data) {
    Node* newNode = new Node();
    newNode->data = data;
    newNode->next = head;
    return newNode;
}

Node* insertAtEnd(Node* head, int data) {
    Node* newNode = new Node();
    newNode->data = data;
    newNode->next = NULL;
    
    if (head == NULL) {
        return newNode;
    }
    
    Node* current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = newNode;
    return head;
}

Node* deleteNode(Node* head, int key) {
    if (head == NULL) return NULL;
    
    if (head->data == key) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return head;
    }
    
    Node* current = head;
    while (current->next != NULL && current->next->data != key) {
        current = current->next;
    }
    
    if (current->next != NULL) {
        Node* temp = current->next;
        current->next = current->next->next;
        delete temp;
    }
    
    return head;
}

int main() {
    Node* head = NULL;
    head = insertAtEnd(head, 10);
    head = insertAtBeginning(head, 5);
    head = insertAtEnd(head, 15);
    traverse(head);
    
    head = deleteNode(head, 10);
    traverse(head);
    
    return 0;
}
