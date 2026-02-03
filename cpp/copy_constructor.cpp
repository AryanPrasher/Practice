#include <iostream>
using namespace std;

class  Room{
    
public:
    int l,b,h;

public:
    Room(){
       cin>>l>>b>>h;
    }

    int area(){
        return (2*(l+b)*h);
    }

    Room(const Room& r)
    {
        l=r.l;
        b=r.b;
        h=r.h;
    }
};
int main()
{
    Room r1;
    Room r2=r1;
    r2.b=-10;

    cout<<"Area of 1st room: "<<r1.area()<<endl;
    cout<<"Area of  2nd room: "<<r2.area()<<endl;
}