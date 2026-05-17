#include <iostream>

using namespace std;

class Graph {
    int V;
    int** adj;
    void topologicalSortUtil(int v, bool visited[], int stack[], int& top);
public:
    Graph(int V);
    void addEdge(int v, int w);
    void topologicalSort();
};

Graph::Graph(int V) {
    this->V = V;
    adj = new int*[V];
    for (int i = 0; i < V; i++) {
        adj[i] = new int[V];
        for (int j = 0; j < V; j++) adj[i][j] = 0;
    }
}

void Graph::addEdge(int v, int w) {
    adj[v][w] = 1;
}

void Graph::topologicalSortUtil(int v, bool visited[], int stack[], int& top) {
    visited[v] = true;

    for (int i = 0; i < V; ++i)
        if (adj[v][i] == 1 && !visited[i])
            topologicalSortUtil(i, visited, stack, top);

    stack[++top] = v;
}

void Graph::topologicalSort() {
    int stack[100];
    int top = -1;
    bool* visited = new bool[V];
    for (int i = 0; i < V; i++) visited[i] = false;

    for (int i = 0; i < V; i++)
        if (visited[i] == false)
            topologicalSortUtil(i, visited, stack, top);

    while (top != -1) {
        cout << stack[top--] << " ";
    }
}

int main() {
    Graph g(6);
    g.addEdge(5, 2);
    g.addEdge(5, 0);
    g.addEdge(4, 0);
    g.addEdge(4, 1);
    g.addEdge(2, 3);
    g.addEdge(3, 1);

    cout << "Following is a Topological Sort of the given graph \n";
    g.topologicalSort();

    return 0;
}
