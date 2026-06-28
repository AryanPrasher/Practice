#include <iostream>
using namespace std;

void selectionSort(int arr[], int n){

    for (int i=0; i<n-1; i++){
        int SI = i;
        for (int j =i+1; j<n; j++){
            if (arr[j]<arr[SI]){
                SI=j;
            }
        }
        swap(arr[i], arr[SI]);
    }
}

int main(){
    int n = 5;
    int arr[]={2, 7, 8, 5, 9};
    selectionSort(arr, n);

    for (int x : arr) {
        cout << x << " ";
    }
    cout << '\n';
    return 0;
}