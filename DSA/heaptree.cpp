#include <iostream>
using namespace std;

class MaxHeap {
private:
    int arr[100];   // heap array
    int size;

public:
    MaxHeap() {
        size = 0;
    }

    //  Insert into Heap
    void insert(int val) {
        size++;
        int i = size;
        arr[i] = val;

        // Heapify Up (using i/2)
        while (i > 1 && arr[i/2] < arr[i]) {
            swap(arr[i], arr[i/2]);
            i = i / 2;
        }
    }

    //  Delete Root (Max Element)
    void deleteRoot() {
        if (size == 0) {
            cout << "Heap is empty\n";
            return;
        }

        arr[1] = arr[size];
        size--;

        int i = 1;

        // Heapify Down (using 2*i, 2*i+1)
        while (2 * i <= size) {
            int left = 2 * i;
            int right = 2 * i + 1;
            int largest = i;

            if (left <= size && arr[left] > arr[largest])
                largest = left;

            if (right <= size && arr[right] > arr[largest])
                largest = right;

            if (largest != i) {
                swap(arr[i], arr[largest]);
                i = largest;
            } else {
                break;
            }
        }
    }

    //  Display Heap
    void display() {
        for (int i = 1; i <= size; i++) {
            cout << arr[i] << " ";
        }
        cout << endl;
    }
};