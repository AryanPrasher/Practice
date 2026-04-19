#include <iostream>
#include <vector>
using namespace std;

class Graph {
    int V;
    vector<int> adj[100];

public:
    Graph(int v) {
        V = v;
    }

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    void DFSUtil(int node, bool visited[]) {
        visited[node] = true;
        cout << node << " ";

        for (int i = 0; i < adj[node].size(); i++) {
            int neighbor = adj[node][i];
            if (!visited[neighbor]) {
                DFSUtil(neighbor, visited);
            }
        }
    }

    void DFS(int start) {
        bool visited[100] = {false};
        DFSUtil(start, visited);
    }
};

int main() {
    Graph g(5);

    g.addEdge(0,1);
    g.addEdge(0,2);
    g.addEdge(1,3);
    g.addEdge(2,4);

    cout << "DFS: ";
    g.DFS(0);

    return 0;
}