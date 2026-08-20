#include <bits/stdc++.h>
using namespace std;

void quickSort(int arr[], int low, int high) {
    int s = low;
    int e = high;
    int p = arr[(low + high) / 2];

    while (s <= e) {

        while (arr[s] < p) {
            s++;
        }

        while (arr[e] > p) {
            e--;
        }

        if (s <= e) {
            swap(arr[s], arr[e]);
            s++;
            e--;
        }
    }

    if (low < e) {
        quickSort(arr, low, e);
    }

    if (s < high) {
        quickSort(arr, s, high);
    }
}

int main() {
    int arr[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);

    quickSort(arr, 0, n - 1);

    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }

    return 0;
}