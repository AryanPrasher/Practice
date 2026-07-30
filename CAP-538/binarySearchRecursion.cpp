#include <bits/stdc++.h>
using namespace std;

int binarySearch(const vector<int>& arr,int left, int right , int target) {
    
    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        }
        if (arr[mid] < target) {
            return binarySearch( arr,mid+1,right,target);
        } else {
            return binarySearch( arr,left,mid-1,target);
        }
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9};
    int target = 7;

    cout << binarySearch(arr,0, 5 ,target);
}