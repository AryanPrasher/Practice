// adding two numbers
#include <iostream>
using namespace std;

int Sum(int a, int b){
    return a+b;
}

int main(){
    int a, b;
    cin>>a>>b;
    int c= Sum(a,b);
    cout<<c<<endl;
    return 0;
}

//2 print funtion

#include <iostream>
#include <string>
using namespace std;

void print() {
	cout<<"Hello";
}
int main() {
	print();
	return 0;
}

//3 returning square

#include <iostream>
using namespace std;

int square(int a) {
	return a*a;
}

int main() {
	int a;
	cout<<"Enter the number: "<<endl;
	cin>>a;
	int c= square(a);
	cout<<c<<endl;
	return 0;
}

//4 multiplication of three number

#include <iostream>
using namespace std;

int multiply(int a, int b, int c){
    return a*b*c;
}

int main(){
    int a,b,c;
	cout<<"Enter the number: "<<endl;
	cin>>a>>b>>c;
	int d= multiply(a,b,c);
	cout<<d<<endl;
	return 0;
}

//5 finding the odd number

include <iostream>
using namespace std;


int main() {
	int n;
	cin>>n;
	if(n % 2 == 0 ) {
		cout<<n<<" is an even number"<<endl;
	} else {
		cout<<n<<" is an odd number"<<endl;
	}
	return 0;
}

//6 finding zero, negative, positive

#include <iostream>
using namespace std;

int main() {
	int n;
	cin>>n;
	if(n == 0) {
		cout<<n<<" is zero";
	} else if(n < 1) {
		cout<<n<<" is a negative number"<<endl;
	} else {
		cout<<n<<" is a positive number"<<endl;
	}
	return 0;
}

//7 print from n to 1 

#include <iostream>
using namespace std;

int main() {
	int n;
	cin>>n;
	for(int i=n; i>=0; i--) {
    //for(int i=0; i<=n; i++)
		cout<<i<<" ";
	}
	return 0;
}


//8 print any table

#include <iostream>
using namespace std;

int main() {
	int n;
	int j;
	cout<<"Enter table number you want to print: ";
	cin>>j;
	cout<<"Enter until how much you want to print: ";
	cin>>n;
	for(int i=j; i<=n; i++) {
		if(i%j == 0) {
			cout<<i<<endl;
		}
	}
	return 0;
}

//9 finding sum of n natural number

#include <iostream>
using namespace std;

int main() {
	int n;
	cin>>n;
	int i=1;
	int sum = 0;
	
	while(i<=n) {
		sum= sum+i;
		i++;
	}
	cout<<sum<<endl;
	return 0;
}

//10 reverse the number

#include <iostream>
using namespace std;

int main(){
    int n;
    cin>>n;
    int rev =0;
    while(n>0){
        int lastdigit = n%10;
        rev = rev*10 + lastdigit;
        n=n/10;
    }
    cout<<rev;
}

//11 star pattern

#include <iostream>
using namespace std;

int main(){
	int n;
	cin>>n;
	for(int i=0; i<n; i++){
		cout<<*;
		cout<<endl;
	}
}