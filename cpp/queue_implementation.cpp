#include <iostream>

using namespace std;

#define MAX 100

class Queue {
    int front, rear, size;
    int arr[MAX];
public:
    Queue() {
        front = size = 0;
        rear = MAX - 1;
    }
    
    bool isFull() {
        return (size == MAX);
    }
    
    bool isEmpty() {
        return (size == 0);
    }
    
    void enqueue(int item) {
        if (isFull()) return;
        rear = (rear + 1) % MAX;
        arr[rear] = item;
        size = size + 1;
    }
    
    int dequeue() {
        if (isEmpty()) return -1;
        int item = arr[front];
        front = (front + 1) % MAX;
        size = size - 1;
        return item;
    }
    
    int getFront() {
        if (isEmpty()) return -1;
        return arr[front];
    }
};

int main() {
    Queue q;
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    
    cout << q.dequeue() << endl;
    cout << q.getFront() << endl;
    return 0;
}
