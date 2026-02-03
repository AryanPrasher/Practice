#include <iostream>
using namespace std;

class Distance{
public:
    int meter;
    int centemeter;
public:
    Distance(float m=0, float c=0){
        meter = m;
        centemeter = c;
    }operator float(){
        return (meter + centemeter/100.0);  //to return decimal value
    }
    void display(){
        cout<<"Distance: "<<meter<<" meters and "<<centemeter<<" centimeters"<<endl;
    }
};
int main(){
    int a,b;
    cin>>a>>b;
    Distance d1(a,b);
    d1.display();
    float totalDistance = d1;
    cout<<"Total Distance in meters: "<<totalDistance<<"m"<<endl;
    return 0;
}