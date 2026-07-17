#include <bits/stdc++.h>
using namespace std;

int main(){
    int size=0;
    cout<<"Enter size of array: ";
    cin>>size;

    int arr[size];

    cout<<"Enter the array: "<<endl;
    for(int i=0; i<size; i++){
        cin>>arr[i];
    }

    sort(arr, arr+size);

    /*for(int i=0; i<size; i++){
        cout<<i<<": "<<arr[i]<<",  ";
    }
    cout<<endl;  */



    int key;
    cout << "\nEnter element to search: ";
    cin >> key;

    int low = 0, high = size - 1;
    bool found = false;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == key) {
            cout << "Element found at index " << mid << endl;
            found = true;
            break;
        }
        else if (arr[mid] < key) {
            low = mid + 1;
        }
        else {
            high = mid - 1;
        }
    }

    if (!found) {
        cout << "Element not found." << endl;
    }
    return 0;
}
