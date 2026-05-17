#include <iostream>

using namespace std;

void traverse(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int insert(int arr[], int size, int capacity, int element, int index) {
    if (size >= capacity) {
        return size;
    }
    for (int i = size - 1; i >= index; i--) {
        arr[i + 1] = arr[i];
    }
    arr[index] = element;
    return size + 1;
}

int remove(int arr[], int size, int index) {
    if (index >= size || index < 0) {
        return size;
    }
    for (int i = index; i < size - 1; i++) {
        arr[i] = arr[i + 1];
    }
    return size - 1;
}

int main() {
    int arr[100] = {1, 2, 3, 4, 5};
    int size = 5;
    
    traverse(arr, size);
    size = insert(arr, size, 100, 10, 2);
    traverse(arr, size);
    size = remove(arr, size, 3);
    traverse(arr, size);
    
    return 0;
}
