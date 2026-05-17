#include <iostream>

using namespace std;

struct Node {
    int val, degree;
    Node *parent, *child, *sibling;
};

Node* newNode(int key) {
    Node* temp = new Node;
    temp->val = key;
    temp->degree = 0;
    temp->parent = temp->child = temp->sibling = NULL;
    return temp;
}

Node* mergeBinomialTrees(Node* b1, Node* b2) {
    if (b1->val > b2->val) swap(b1, b2);
    b2->parent = b1;
    b2->sibling = b1->child;
    b1->child = b2;
    b1->degree++;
    return b1;
}

class BinomialHeap {
public:
    Node* root;
    BinomialHeap() { root = NULL; }

    Node* merge(Node* h1, Node* h2) {
        if (!h1) return h2;
        if (!h2) return h1;
        Node* res = NULL;
        Node** pos = &res;
        while (h1 && h2) {
            if (h1->degree <= h2->degree) {
                *pos = h1;
                h1 = h1->sibling;
            } else {
                *pos = h2;
                h2 = h2->sibling;
            }
            pos = &(*pos)->sibling;
        }
        if (h1) *pos = h1;
        else *pos = h2;
        return res;
    }

    void unionHeap(Node* h2) {
        Node* h = merge(root, h2);
        if (!h) {
            root = NULL;
            return;
        }
        Node *prev = NULL, *x = h, *next = x->sibling;
        while (next != NULL) {
            if ((x->degree != next->degree) || ((next->sibling != NULL) && (next->sibling->degree == x->degree))) {
                prev = x;
                x = next;
            } else {
                if (x->val <= next->val) {
                    x->sibling = next->sibling;
                    mergeBinomialTrees(x, next);
                } else {
                    if (prev == NULL) h = next;
                    else prev->sibling = next;
                    mergeBinomialTrees(next, x);
                    x = next;
                }
            }
            next = x->sibling;
        }
        root = h;
    }

    void insert(int val) {
        Node* temp = newNode(val);
        unionHeap(temp);
    }
    
    int getMin() {
        if (!root) return -1;
        Node* temp = root;
        int min_val = temp->val;
        while (temp) {
            if (temp->val < min_val) min_val = temp->val;
            temp = temp->sibling;
        }
        return min_val;
    }
};

int main() {
    BinomialHeap h;
    h.insert(10);
    h.insert(20);
    h.insert(5);
    cout << h.getMin() << endl;
    return 0;
}
