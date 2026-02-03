#include <iostream>
using namespace std;

class A{
    public:
    A(){
        cout<<"constructor called"<<endl;
    }
    void greet(){
        cout<<"good morning"<<endl;
    }
};

int main(){
    A a;
    a.greet();
    return 0;
}