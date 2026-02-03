#include <iostream>
#include <string>
using namespace std;

class Bank {
    double acc_no; 
    string name;
    float bal;

public:
    
    void get_value(double acc, string n, float b) {
        acc_no = acc;
        name = n;
        bal = b;
    }

    void display() {
        cout << "\nBank account details are:";
        cout << "\nAccount Number: " << acc_no;
        cout << "\nName: " << name;
        cout << "\nBalance: " << bal << endl;
    }

   
    friend void creditcard_grant(Bank b);
};


void creditcard_grant(Bank b) {
    if (b.bal > 1000)
        cout << b.name << " - Credit card sanctioned\n";
    else
        cout << b.name << " - Credit card not sanctioned\n";
}

int main() {
    Bank b1, b2;

    b1.get_value(101, "Aryan", 155);
    b1.display();
    creditcard_grant(b1);

    b2.get_value(102, "Seema", 100000.05);
    b2.display();
    creditcard_grant(b2);

    return 0;
}
