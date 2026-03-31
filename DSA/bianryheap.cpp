#include <iostream>
using namespace std;

#define MAX 100

int heap[MAX];
int size = 0;

// Swap function
void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

// Insert into heap
void insert(int value) {
    if (size == MAX) {
        cout << "Heap is full\n";
        return;
    }

    // Insert at end
    int i = size;
    heap[i] = value;
    size++;

    // Heapify up
    while (i > 0 && heap[(i - 1) / 2] < heap[i]) {
        swap(heap[i], heap[(i - 1) / 2]);
        i = (i - 1) / 2;
    }
}

// Delete root
void deleteRoot() {
    if (size <= 0) {
        cout << "Heap is empty\n";
        return;
    }

    // Replace root with last element
    heap[0] = heap[size - 1];
    size--;

    // Heapify down
    int i = 0;

    while (true) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int largest = i;

        if (left < size && heap[left] > heap[largest])
            largest = left;

        if (right < size && heap[right] > heap[largest])
            largest = right;

        if (largest != i) {
            swap(heap[i], heap[largest]);
            i = largest;
        } else {
            break;
        }
    }
}

// Display heap
void display() {
    for (int i = 0; i < size; i++) {
        cout << heap[i] << " ";
    }
    cout << endl;
}

// Main
int main() {
    insert(40);
    insert(30);
    insert(35);
    insert(10);
    insert(50);

    cout << "Heap after insertion:\n";
    display();

    deleteRoot();

    cout << "Heap after deletion:\n";
    display();

    return 0;
}