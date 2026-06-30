#include<bits/stdc++.h>
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

    for(int i=0; i<size; i++){
        cout<<i<<" : "<<arr[i]<<" ";
    }
    cout<<endl;
    return 0;
}