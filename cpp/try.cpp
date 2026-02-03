#include <iostream>
using namespace std;

struct student {
    int a, b;

    int sum() {
        return a + b;       // returns sum of a and b
    }

    int multiply(int sumValue, int z) {
        return sumValue * z;   // uses result of sum()
    }
};

int main() {
    int a, b, z;
    cin >> a >> b >> z;   // take third input for multiplication

    student s;
    s.a = a;
    s.b = b;

    int c = s.sum();              // first function result
    int d = s.multiply(c, z);     // second function uses result of first

    cout << "Addition is: " << c << endl;
    cout << "Multiplication is: " << d << endl;

    return 0;
}
