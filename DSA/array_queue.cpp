#include <iostream>
using namespace std;

#define MAX 5

int arr[MAX];
int front = -1;
int rear = -1;

// Insert operation (Enqueue)
void enqueue(int value) {
    if (rear == MAX - 1) {
        cout << "Queue Overflow\n";
        return;
    }

    if (front == -1)
        front = 0;

    arr[++rear] = value;
    cout << value << " inserted into queue\n";
}

// Delete operation (Dequeue)
void dequeue() {
    if (front == -1 || front > rear) {
        cout << "Queue Underflow\n";
        return;
    }

    cout << arr[front] << " removed from queue\n";
    front++;
}

// Display queue
void display() {
    if (front == -1 || front > rear) {
        cout << "Queue is empty\n";
        return;
    }

    cout << "Queue elements: ";
    for (int i = front; i <= rear; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int main() {

    enqueue(10);
    enqueue(20);
    enqueue(30);
    enqueue(40);
    enqueue(50);
    enqueue(60);   // Overflow

    display();

    dequeue();
    display();

    return 0;
}
