#include <iostream>

using namespace std;

struct Node {
    int key;
    Node* next;
};

class HashTable {
    int BUCKET;
    Node** table;

public:
    HashTable(int b) {
        this->BUCKET = b;
        table = new Node*[BUCKET];
        for (int i = 0; i < BUCKET; i++) {
            table[i] = NULL;
        }
    }

    int hashFunction(int x) {
        return (x % BUCKET);
    }

    void insertItem(int key) {
        int index = hashFunction(key);
        Node* newNode = new Node();
        newNode->key = key;
        newNode->next = table[index];
        table[index] = newNode;
    }

    void deleteItem(int key) {
        int index = hashFunction(key);
        Node* temp = table[index];
        Node* prev = NULL;

        while (temp != NULL && temp->key != key) {
            prev = temp;
            temp = temp->next;
        }

        if (temp == NULL) return;

        if (prev == NULL) {
            table[index] = temp->next;
        } else {
            prev->next = temp->next;
        }
        delete temp;
    }

    void displayHash() {
        for (int i = 0; i < BUCKET; i++) {
            cout << i;
            Node* temp = table[i];
            while (temp != NULL) {
                cout << " --> " << temp->key;
                temp = temp->next;
            }
            cout << endl;
        }
    }
};

int main() {
    int a[] = {15, 11, 27, 8, 12};
    int n = sizeof(a)/sizeof(a[0]);

    HashTable h(7);
    for (int i = 0; i < n; i++)
        h.insertItem(a[i]);

    h.deleteItem(12);
    h.displayHash();

    return 0;
}
