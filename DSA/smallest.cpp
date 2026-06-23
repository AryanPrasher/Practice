#include <iostream>
#include <climits>
using namespace std;

int main(){

    int arr[] = {1,4,64,666,44,-4,-99,-5};
    int last = sizeof(arr)/ sizeof(arr[0]);
    int smallest = INT_MAX;
    for(int i =0; i<last; i++){
        if (arr[i]<smallest){
            smallest=arr[i];
        }
    }
    cout<<arr<<endl;
    cout<<smallest;
    return 0;
}
