#include <iostream>
using namespace std;

class Graph {
    int V;
    int** adjMatrix;

public:
    Graph(int v) {
        V = v;
        adjMatrix = new int*[V];
        for (int i = 0; i < V; i++) {
            adjMatrix[i] = new int[V];
            for (int j = 0; j < V; j++) {
                adjMatrix[i][j] = 0;
            }
        }
    }

    void addEdge(int u, int v) {
        adjMatrix[u][v] = 1;
        adjMatrix[v][u] = 1; // remove for directed graph
    }

    void display() {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                cout << adjMatrix[i][j] << " ";
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