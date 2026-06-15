#include <iostream>
using namespace std;

bool isPalindrome(string s) {

    int i = 0;
    int j = s.length() - 1;

    while(i < j) {

        while(i < j && !isalnum(s[i]))
            i++;

        while(i < j && !isalnum(s[j]))
            j--;

        if(tolower(s[i]) != tolower(s[j]))
            return false;

        i++;
        j--;
    }

    return true;
}

int main(){
    bool result = isPalindrome("asasasasasa");

    cout << (result ? "Palindrome" : "Not Palindrome") << endl;
    return 0;
}