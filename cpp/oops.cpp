#include <iostream>
#include <string>
using namespace std;

class Teacher{
private:
    double salary;

public:
    string name;
    string dept;
    string subject;

    void changeDept (string newDept){
        dept = newDept;
    }
};

int main() {
    Teacher t1;
    t1.name = "aryan";
    t1.dept = "computer";
    t1.subject = "C++";

    cout<< t1.name <<endl;
    cout<< t1.dept <<endl;
    cout<< t1.subject <<endl;
    return 0;
}
