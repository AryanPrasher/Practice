#include <iostream>
using namespace std;

// Node (Linked List)
class Node {
public:
    int data;
    Node* next;

    Node(int val) {
        data = val;
        next = NULL;
    }
};

// Graph Class
class Graph {
    int V;
    Node** adjList;

public:
    Graph(int v) {
        V = v;
        adjList = new Node*[V];

        for (int i = 0; i < V; i++)
            adjList[i] = NULL;
    }

    // Add edge (Undirected)
    void addEdge(int u, int v) {
        Node* newNode = new Node(v);
        newNode->next = adjList[u];
        adjList[u] = newNode;

        newNode = new Node(u);
        newNode->next = adjList[v];
        adjList[v] = newNode;
    }

    // Display adjacency list
    void display() {
        for (int i = 0; i < V; i++) {
            cout << i << " -> ";
            Node* temp = adjList[i];

            while (temp != NULL) {
                cout << temp->data << " ";
                temp = temp->next;
            }
            cout << endl;
        }
    }
};

int main() {
    Graph g(4);

    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 3);

    g.display();

    return 0;
}