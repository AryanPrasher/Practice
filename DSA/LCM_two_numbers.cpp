#include <iostream>
using namespace std;
int main() {
    int num1, num2;

    cout << "Enter first number: ";
    cin >> num1;
    
    cout << "Enter second number: ";
    cin >> num2;

    int max_num;
    if (num1 > num2) {
        max_num = num1;
    } else {
        max_num = num2;
    }

    while (true) {
        if (max_num % num1 == 0 && max_num % num2 == 0) {
            cout << "The LCM is: " << max_num <<endl;
            break; 
        }
        max_num++;
    }

    return 0;
}
