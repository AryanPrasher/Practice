#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main(){
    string name ="ARYAN";
    
    stack <char>st;
    for(char ch : name){
        st.push(ch);
    }
    string rev="";
    while(!st.empty()){
        rev += st.top();
        st.pop();
    }
    cout<<rev;
    return 0;
}