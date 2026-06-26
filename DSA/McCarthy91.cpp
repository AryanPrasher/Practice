#include <iostream>
using namespace std;

int McCarthy91(int n) {
    if (n > 100)
        return n - 10;
    else
        return McCarthy91(McCarthy91(n + 11)); 
}

int main() {
    int n;
    cout << "Enter a number: ";
    cin >> n;

    cout << "McCarthy91(" << n << ") = " << McCarthy91(n);

    return 0;
}