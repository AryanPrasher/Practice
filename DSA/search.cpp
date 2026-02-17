#include <iostream>
using namespace std;

int main(){
    int arr[]={10, 20, 30, 40, 50, 60};
    int n;
    int size = sizeof(arr) / sizeof(arr[0]);

    cout<<"Element you want: ";
    cin>>n;

    for(int i=0; i<size; i++){
        if(arr[i]==n){
            cout<<"Index of your element is: "<<i<<endl;    
            return 0;
        }
    }
    cout<<"Doesn't exist";
    return 0;
}