#include <iostream>
#include <exception>
using namespace std;

int main(){
    double balance;
    double withdrawl;
    cout<<"Enter balance and withdrawl amount: "<<endl;
    cin>>balance>>withdrawl;
    try{
        if(balance<withdrawl)
        throw underflow_error ("Low Balance ");
        cout<<"The amount withdrawl: "<<withdrawl<<endl;
    }
    catch(const underflow_error &e){
        cout<<e.what()<<endl;
    }
    return 0;
}