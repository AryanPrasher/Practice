#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int x) {
        val = x;
        left = NULL;
        right = NULL;
    }
};

TreeNode* insert(TreeNode* root, int val) {

    if (root == NULL)
        return new TreeNode(val);

    if (val < root->val)
        root->left = insert(root->left, val);
    else
        root->right = insert(root->right, val);

    return root;
}

void preorder(TreeNode* root){
    if (root == NULL){
        return;
    }

    cout<<root->val<<" ";
    preorder(root->left);
    preorder(root->right);
}

void inorder(TreeNode* root){
    if (root == NULL){
        return;
    }

    inorder(root->left);
    cout<<root->val<<" ";
    inorder(root->right);
}

void postorder(TreeNode* root){
    if (root == NULL){
        return;
    }

    postorder(root->left);
    postorder(root->right);
    cout<<root->val<<" ";
}

int main(){

    TreeNode* root = NULL;
    root = insert(root, 5);
    insert(root, 10);
    insert(root, 20);
    insert(root, 30);
    insert(root, 40);
    insert(root, 50);
    insert(root, 60);
    insert(root, 70);
    insert(root, 80);

    cout<<"inorder: ";
    inorder(root);

    cout<<endl;
    
    cout<<"postorder: ";
    postorder(root);

    cout<<endl;

    cout<<"preorder: ";
    preorder(root);

    return 0;
}