#include <iostream>
using namespace std;

class Complex {
public:
    int real;
    int imaginary;
};

int main() {
    Complex obj1, obj2;
    Complex *p1 = &obj1;
    Complex *p2 = &obj2;

    cout << "Enter real and imaginary part of first complex number: "<<endl;
    cin >> p1->real >> p1->imaginary;

    cout << "Enter real and imaginary part of second complex number: "<<endl;
    cin >> p2->real >> p2->imaginary;

    cout << "First Complex Number = " << p1->real << " + " << p1->imaginary << "i" << endl;
    cout << "Second Complex Number = " << p2->real << " + " << p2->imaginary << "i" << endl;

    return 0;
}
