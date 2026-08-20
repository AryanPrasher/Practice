#include <bits/stdc++.h>
using namespace std;

void merge(vector<int>& arr, int low, int mid, int high) {

    vector<int> left;
    vector<int> right;

    for (int i = low; i <= mid; i++) {
        left.push_back(arr[i]);
    }

    for (int i = mid + 1; i <= high; i++) {
        right.push_back(arr[i]);
    }

    int i = 0;
    int j = 0;

    vector<int> ans;

    while (i < left.size() && j < right.size()) {

        if (left[i] <= right[j]) {
            ans.push_back(left[i]);
            i++;
        }
        else {
            ans.push_back(right[j]);
            j++;
        }
    }

    while (i < left.size()) {
        ans.push_back(left[i]);
        i++;
    }

    while (j < right.size()) {
        ans.push_back(right[j]);
        j++;
    }

    for (int k = 0; k < ans.size(); k++) {
        arr[low + k] = ans[k];
    }
}

void mergeSort(vector<int>& arr, int low, int high) {

    if (low >= high) {
        return;
    }

    int mid = low + (high - low) / 2;

    mergeSort(arr, low, mid);
    mergeSort(arr, mid + 1, high);

    merge(arr, low, mid, high);
}

int main() {

    vector<int> arr = {5, 2, 8, 1, 3, 7};

    mergeSort(arr, 0, arr.size() - 1);

    for (int x : arr) {
        cout << x << " ";
    }

    return 0;
}