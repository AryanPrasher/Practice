#include <iostream>

using namespace std;

struct Item {
    int value;
    int priority;
};

class PriorityQueue {
    Item arr[100];
    int size;
public:
    PriorityQueue() {
        size = 0;
    }
    
    void enqueue(int value, int priority) {
        if (size == 100) return;
        arr[size].value = value;
        arr[size].priority = priority;
        size++;
    }
    
    int peek() {
        int highestPriority = -1;
        int ind = -1;
        for (int i = 0; i < size; i++) {
            if (highestPriority == arr[i].priority && ind > -1 && arr[ind].value < arr[i].value) {
                highestPriority = arr[i].priority;
                ind = i;
            } else if (highestPriority < arr[i].priority) {
                highestPriority = arr[i].priority;
                ind = i;
            }
        }
        return ind;
    }
    
    void dequeue() {
        int ind = peek();
        if (ind == -1) return;
        for (int i = ind; i < size - 1; i++) {
            arr[i] = arr[i + 1];
        }
        size--;
    }
    
    int getHighestPriorityElement() {
        int ind = peek();
        if (ind != -1) return arr[ind].value;
        return -1;
    }
};

int main() {
    PriorityQueue pq;
    pq.enqueue(10, 2);
    pq.enqueue(14, 4);
    pq.enqueue(16, 4);
    pq.enqueue(12, 3);
    
    cout << pq.getHighestPriorityElement() << endl;
    pq.dequeue();
    cout << pq.getHighestPriorityElement() << endl;
    return 0;
}
