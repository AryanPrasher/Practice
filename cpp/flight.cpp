/*an airine wants to maintain records of multiple flights  with details like flight number, destination, and ticket price.
write a c++ program to create an object of the class and use menber function and display it using member function using pointer*/
#include <iostream>
#include <string>
using namespace std;

class Flight {
public:
    int f_no;
    string dest;
    float t_price;

public:
    void set() {
        cout << "Enter Flight Number, Destination, and Ticket Price: ";
        cin >> f_no >> dest >> t_price;
    }

    void get() {
        cout << "Flight Number: " << f_no
             << "\nDestination: " << dest
             << "\nTicket Price: " << t_price << endl;
    }
};

int main() {
    Flight *f1 = new Flight; 
    f1->set();   
    f1->get();   

    delete f1;   
    return 0;
}
