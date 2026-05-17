#include <iostream>

using namespace std;

struct Node {
    int dest;
    Node* next;
};

class Graph {
    int V;
    Node** head;
public:
    Graph(int V) {
        this->V = V;
        head = new Node*[V];
        for (int i = 0; i < V; ++i)
            head[i] = NULL;
    }

    Node* createNode(int dest) {
        Node* newNode = new Node;
        newNode->dest = dest;
        newNode->next = NULL;
        return newNode;
    }

    void addEdge(int src, int dest) {
        Node* newNode = createNode(dest);
        newNode->next = head[src];
        head[src] = newNode;

        newNode = createNode(src);
        newNode->next = head[dest];
        head[dest] = newNode;
    }

    void printGraph() {
        for (int v = 0; v < V; ++v) {
            Node* pCrawl = head[v];
            cout << "\n Adjacency list of vertex " << v << "\n head ";
            while (pCrawl) {
                cout << "-> " << pCrawl->dest;
                pCrawl = pCrawl->next;
            }
            cout << endl;
        }
    }
};

int main() {
    Graph g(5);
    g.addEdge(0, 1);
    g.addEdge(0, 4);
    g.addEdge(1, 2);
    g.addEdge(1, 3);
    g.addEdge(1, 4);
    g.addEdge(2, 3);
    g.addEdge(3, 4);
    g.printGraph();
    return 0;
}
