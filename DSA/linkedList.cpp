#include <iostream>
using namespace std;

/* ---------- Node Structure ---------- */
struct Node {
    int data;
    Node* next;
};

/* ---------- Add at Start ---------- */
void addAtStart(Node* &head, int value) {
    Node* newNode = new Node();
    newNode->data = value;
    newNode->next = head;
    head = newNode;
}

/* ---------- Add at End ---------- */
void addAtEnd(Node* &head, int value) {
    Node* newNode = new Node();
    newNode->data = value;
    newNode->next = NULL;

    if (head == NULL) {
        head = newNode;
        return;
    }

    Node* temp = head;
    while (temp->next != NULL)
        temp = temp->next;

    temp->next = newNode;
}

/* ---------- Add at Middle ---------- */
void addAtMiddle(Node* &head, int value) {
    if (head == NULL) {
        addAtStart(head, value);
        return;
    }

    Node* slow = head;
    Node* fast = head;

    while (fast->next != NULL && fast->next->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
    }

    Node* newNode = new Node();
    newNode->data = value;
    newNode->next = slow->next;
    slow->next = newNode;
}

/* ---------- Add at Position ---------- */
void addAtPosition(Node* &head, int value, int position) {
    if (position == 1) {
        addAtStart(head, value);
        return;
    }

    Node* temp = head;
    for (int i = 1; i < position - 1 && temp != NULL; i++)
        temp = temp->next;

    if (temp == NULL) {
        cout << "Invalid position\n";
        return;
    }

    Node* newNode = new Node();
    newNode->data = value;
    newNode->next = temp->next;
    temp->next = newNode;
}

/* ---------- Delete by Value ---------- */
void deleteNode(Node* &head, int value) {
    if (head == NULL) {
        cout << "List is empty\n";
        return;
    }

    if (head->data == value) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return;
    }

    Node* current = head;
    while (current->next != NULL && current->next->data != value)
        current = current->next;

    if (current->next == NULL) {
        cout << "Value not found\n";
        return;
    }

    Node* temp = current->next;
    current->next = temp->next;
    delete temp;
}

/* ---------- Search ---------- */
Node* search(Node* head, int value) {
    Node* temp = head;

    while (temp != NULL) {
        if (temp->data == value)
            return temp;
        temp = temp->next;
    }

    return NULL;
}

/* ---------- Traverse ---------- */
void traverse(Node* head) {
    if (head == NULL) {
        cout << "List is empty\n";
        return;
    }

    Node* temp = head;
    while (temp != NULL) {
        cout << temp->data << " -> ";
        temp = temp->next;
    }
    cout << "NULL\n";
}

/* ---------- Menu ---------- */
void menu() {
    cout << "\n----- MENU -----\n";
    cout << "1. Add at Start\n";
    cout << "2. Add at End\n";
    cout << "3. Add at Middle\n";
    cout << "4. Add at Position\n";
    cout << "5. Delete by Value\n";
    cout << "6. Search\n";
    cout << "7. Display List\n";
    cout << "0. Exit\n";
    cout << "Enter choice: ";
}

/* ---------- Main ---------- */
int main() {
    Node* head = NULL;
    int choice, value, position;

    do {
        menu();
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "Enter value: ";
                cin >> value;
                addAtStart(head, value);
                break;

            case 2:
                cout << "Enter value: ";
                cin >> value;
                addAtEnd(head, value);
                break;

            case 3:
                cout << "Enter value: ";
                cin >> value;
                addAtMiddle(head, value);
                break;

            case 4:
                cout << "Enter value: ";
                cin >> value;
                cout << "Enter position: ";
                cin >> position;
                addAtPosition(head, value, position);
                break;

            case 5:
                cout << "Enter value to delete: ";
                cin >> value;
                deleteNode(head, value);
                break;

            case 6: {
                cout << "Enter value to search: ";
                cin >> value;
                Node* result = search(head, value);
                if (result != NULL)
                    cout << "Value found: " << result->data << endl;
                else
                    cout << "Value not found\n";
                break;
            }

            case 7:
                traverse(head);
                break;

            case 0:
                cout << "Exiting program\n";
                break;

            default:
                cout << "Invalid choice\n";
        }

    } while (choice != 0);

    return 0;
}
