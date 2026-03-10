#include <iostream>
using namespace std;

class Node{
public:
int data;    
Node *left, *right;

Node(int value){
    data = value;
    left = NULL;
    right = NULL;
}
};

class BST{
public:
Node *root;
    BST(){
        root = NULL;
    }
    Node* insert(Node* root, int value){
        if(root == NULL){
            return new Node(value);
        }

        if(value < root->data){
            root->left = insert(root->left, value);
        }else{
            root->right = insert(root->right, value);
        }

        return root;
    }

    void inorder(Node* root)
    {
        if(root == NULL)
            return;

        inorder(root->left);
        cout << root->data << " ";
        inorder(root->right);
    }
    
    void preorder(Node* root)          // Preorder Traversal (Root Left Right)
    {
        if(root == NULL)
            return;

        cout << root->data << " ";
        preorder(root->left);
        preorder(root->right);
    }


    void postorder(Node* root)         // Postorder Traversal (Left Right Root)
    {
        if(root == NULL)
            return;

        postorder(root->left);
        postorder(root->right);
        cout << root->data << " ";
    }

};
int main()
{
    BST tree;

    tree.root = tree.insert(tree.root, 50);
    tree.insert(tree.root, 30);
    tree.insert(tree.root, 20);
    tree.insert(tree.root, 40);
    tree.insert(tree.root, 70);
    tree.insert(tree.root, 60);
    tree.insert(tree.root, 80);

    cout << "Inorder Traversal: ";
    tree.inorder(tree.root);

    cout << "\nPreorder Traversal: ";
    tree.preorder(tree.root);

    cout << "\nPostorder Traversal: ";
    tree.postorder(tree.root);

    return 0;
}