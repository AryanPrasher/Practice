#include <iostream>
#include <string>
using namespace std;

union PayDetail {
    float amt;     // Cash on Delivery
    char card[20]; // Credit Card
    char upi[50];  // UPI
};

class Payment {
private:
    string name;   // customer name
    int flag;      // 0 = COD, 1 = CARD, 2 = UPI
    PayDetail det; // union to store payment detail

public:
    void input() {
        cin.ignore(); // clear leftover input
        cout << "\nEnter customer name: ";
        getline(cin, name);

        cout << "Select Payment Mode (0: COD, 1: CARD, 2: UPI): ";
        cin >> flag;
        cin.ignore(); // clear newline after flag input

        switch (flag) {
            case 0: // COD
                cout << "Enter amount: ";
                cin >> det.amt;
                cin.ignore(); // clear newline after amount
                break;
            case 1: // Card
                cout << "Enter card number: ";
                cin.getline(det.card, 20);
                break;
            case 2: // UPI
                cout << "Enter UPI ID: ";
                cin.getline(det.upi, 50);
                break;
            default:
                cout << "Invalid choice! Try again...\n";
                input(); // retry input
        }
    }

    void display() const {
        cout << "\nCustomer: " << name << endl;
        cout << "Payment Mode: ";
        switch (flag) {
            case 0:
                cout << "Cash on Delivery\nAmount: ₹" << det.amt << endl;
                break;
            case 1:
                cout << "Credit Card\nCard Number: " << det.card << endl;
                break;
            case 2:
                cout << "UPI\nUPI ID: " << det.upi << endl;
                break;
            default:
                cout << "Unknown\n";
        }
    }

}; // <-- Add this closing brace to end the Payment class

int main() {
    int n;
    cout << "Enter number of customers: ";
    cin >> n;

    Payment cust[100]; // array of 100 customers
        for (int i = 0; i < n; i++) {
        cust[i].input();
    }
        cout << "\n--- Payment Records ---\n";
    for (int i = 0; i < n; i++) {
        cust[i].display();
    }

    return 0;
}
