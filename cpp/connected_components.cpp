#include <iostream>

using namespace std;

struct Node {
    int dest;
    Node* next;
};

class Graph {
    int V;
    Node** adj;
    void DFSUtil(int v, bool visited[]);
public:
    Graph(int V);
    void addEdge(int v, int w);
    void connectedComponents();
};

Graph::Graph(int V) {
    this->V = V;
    adj = new Node*[V];
    for (int i = 0; i < V; i++) adj[i] = NULL;
}

void Graph::addEdge(int v, int w) {
    Node* newNode = new Node;
    newNode->dest = w;
    newNode->next = adj[v];
    adj[v] = newNode;

    newNode = new Node;
    newNode->dest = v;
    newNode->next = adj[w];
    adj[w] = newNode;
}

void Graph::DFSUtil(int v, bool visited[]) {
    visited[v] = true;
    cout << v << " ";
    Node* temp = adj[v];
    while (temp != NULL) {
        if (!visited[temp->dest])
            DFSUtil(temp->dest, visited);
        temp = temp->next;
    }
}

void Graph::connectedComponents() {
    bool* visited = new bool[V];
    for (int v = 0; v < V; v++) visited[v] = false;
    for (int v = 0; v < V; v++) {
        if (visited[v] == false) {
            DFSUtil(v, visited);
            cout << "\n";
        }
    }
    delete[] visited;
}

int main() {
    Graph g(5);
    g.addEdge(1, 0);
    g.addEdge(2, 3);
    g.addEdge(3, 4);
    cout << "Following are connected components \n";
    g.connectedComponents();
    return 0;
}
