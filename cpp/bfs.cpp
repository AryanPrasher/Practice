#include <iostream>

using namespace std;

class Graph {
    int V;
    int** adj;
public:
    Graph(int V);
    void addEdge(int v, int w);
    void BFS(int s);
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

void Graph::BFS(int s) {
    bool* visited = new bool[V];
    for (int i = 0; i < V; i++) visited[i] = false;

    int queue[100];
    int front = 0, rear = 0;

    visited[s] = true;
    queue[rear++] = s;

    while (front < rear) {
        s = queue[front++];
        cout << s << " ";

        for (int i = 0; i < V; i++) {
            if (adj[s][i] == 1 && !visited[i]) {
                visited[i] = true;
                queue[rear++] = i;
            }
        }
    }
}

int main() {
    Graph g(4);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 2);
    g.addEdge(2, 0);
    g.addEdge(2, 3);
    g.addEdge(3, 3);

    cout << "Following is Breadth First Traversal " << "(starting from vertex 2) \n";
    g.BFS(2);

    return 0;
}
