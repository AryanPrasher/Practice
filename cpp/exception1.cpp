#include <iostream>
using namespace std;

int main(){
    int a, b;
    cin>>a>>b;
    try{
        if(b==0)
        throw"zero division exception";
        float c = a/b;
        cout<<c<<endl;
    }
    catch(const char* p){
        cout<<p<<endl;
    }
    return 0;
}