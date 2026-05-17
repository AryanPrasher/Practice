#include <iostream>

using namespace std;

struct Node {
    int key;
    int degree;
    Node* parent;
    Node* child;
    Node* left;
    Node* right;
    bool mark;
};

class FibonacciHeap {
    Node* minNode;
    int numNodes;

public:
    FibonacciHeap() {
        minNode = NULL;
        numNodes = 0;
    }

    void insert(int key) {
        Node* node = new Node;
        node->key = key;
        node->degree = 0;
        node->parent = NULL;
        node->child = NULL;
        node->left = node;
        node->right = node;
        node->mark = false;

        if (minNode != NULL) {
            node->left = minNode;
            node->right = minNode->right;
            minNode->right = node;
            node->right->left = node;
            if (node->key < minNode->key) {
                minNode = node;
            }
        } else {
            minNode = node;
        }
        numNodes++;
    }

    void display() {
        if (minNode == NULL) return;
        Node* ptr = minNode;
        cout << "Roots: ";
        do {
            cout << ptr->key << " ";
            ptr = ptr->right;
        } while (ptr != minNode && ptr->right != NULL);
        cout << endl;
    }
};

int main() {
    FibonacciHeap fh;
    fh.insert(10);
    fh.insert(20);
    fh.insert(5);
    fh.insert(15);
    fh.display();
    return 0;
}
