#include <iostream>

using namespace std;

class MaxHeap {
    int* harr;
    int capacity;
    int heap_size;

    int parent(int i) { return (i - 1) / 2; }
    int left(int i) { return (2 * i + 1); }
    int right(int i) { return (2 * i + 2); }

public:
    MaxHeap(int cap) {
        heap_size = 0;
        capacity = cap;
        harr = new int[cap];
    }

    void insertKey(int k) {
        if (heap_size == capacity) return;
        heap_size++;
        int i = heap_size - 1;
        harr[i] = k;
        while (i != 0 && harr[parent(i)] < harr[i]) {
            swap(harr[i], harr[parent(i)]);
            i = parent(i);
        }
    }

    void MaxHeapify(int i) {
        int l = left(i);
        int r = right(i);
        int largest = i;
        if (l < heap_size && harr[l] > harr[i])
            largest = l;
        if (r < heap_size && harr[r] > harr[largest])
            largest = r;
        if (largest != i) {
            swap(harr[i], harr[largest]);
            MaxHeapify(largest);
        }
    }

    int extractMax() {
        if (heap_size <= 0) return -100000;
        if (heap_size == 1) {
            heap_size--;
            return harr[0];
        }
        int root = harr[0];
        harr[0] = harr[heap_size - 1];
        heap_size--;
        MaxHeapify(0);
        return root;
    }

    int getMax() { return harr[0]; }
};

int main() {
    MaxHeap h(11);
    h.insertKey(3);
    h.insertKey(2);
    h.insertKey(15);
    h.insertKey(5);
    h.insertKey(4);
    h.insertKey(45);
    cout << h.extractMax() << " ";
    cout << h.getMax() << " ";
    return 0;
}
