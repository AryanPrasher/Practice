#include <iostream>

using namespace std;

class Node {
public:
    int keys[2];
    Node* children[3];
    int numKeys;
    bool isLeaf;

    Node(bool leaf = true) {
        isLeaf = leaf;
        numKeys = 0;
        for (int i = 0; i < 3; i++) children[i] = NULL;
    }
};

class TwoThreeTree {
    Node* root;

    void insertNonFull(Node* node, int key) {
        int i = node->numKeys - 1;
        if (node->isLeaf) {
            while (i >= 0 && node->keys[i] > key) {
                node->keys[i + 1] = node->keys[i];
                i--;
            }
            node->keys[i + 1] = key;
            node->numKeys++;
        } else {
            while (i >= 0 && node->keys[i] > key) i--;
            i++;
            if (node->children[i]->numKeys == 2) {
                splitChild(node, i, node->children[i]);
                if (node->keys[i] < key) i++;
            }
            insertNonFull(node->children[i], key);
        }
    }

    void splitChild(Node* parent, int index, Node* child) {
        Node* newNode = new Node(child->isLeaf);
        newNode->numKeys = 1;
        newNode->keys[0] = child->keys[1];
        
        if (!child->isLeaf) {
            newNode->children[0] = child->children[1];
            newNode->children[1] = child->children[2];
        }
        child->numKeys = 1;

        for (int j = parent->numKeys; j >= index + 1; j--) {
            parent->children[j + 1] = parent->children[j];
        }
        parent->children[index + 1] = newNode;

        for (int j = parent->numKeys - 1; j >= index; j--) {
            parent->keys[j + 1] = parent->keys[j];
        }
        parent->keys[index] = child->keys[0];
        parent->numKeys++;
    }

    void traverse(Node* node) {
        if (node != NULL) {
            int i;
            for (i = 0; i < node->numKeys; i++) {
                if (!node->isLeaf) traverse(node->children[i]);
                cout << node->keys[i] << " ";
            }
            if (!node->isLeaf) traverse(node->children[i]);
        }
    }

public:
    TwoThreeTree() { root = NULL; }

    void insert(int key) {
        if (root == NULL) {
            root = new Node();
            root->keys[0] = key;
            root->numKeys = 1;
        } else {
            if (root->numKeys == 2) {
                Node* s = new Node(false);
                s->children[0] = root;
                splitChild(s, 0, root);
                int i = 0;
                if (s->keys[0] < key) i++;
                insertNonFull(s->children[i], key);
                root = s;
            } else {
                insertNonFull(root, key);
            }
        }
    }

    void print() {
        traverse(root);
        cout << endl;
    }
};

int main() {
    TwoThreeTree tree;
    tree.insert(10);
    tree.insert(20);
    tree.insert(5);
    tree.insert(6);
    tree.insert(12);
    tree.insert(30);
    tree.insert(7);
    tree.insert(17);

    tree.print();
    return 0;
}
