#include <iostream>
#include <string>
using namespace std;

class Book {
public:
    string author, publisher;
    int pages;

    Book(string a, string p, int pg) {
        author = a;
        publisher = p;
        pages = pg;
    }

    Book(const Book& other) {
        author = other.author;
        publisher = other.publisher;
        pages = other.pages;
    }

    void input() {
        getline(cin, author);
        getline(cin, publisher);
        cin>>pages;
    }

    void display() {
        cout <<"BOOK DETAILS ARE: "<<endl;
        cout << "Author: " << author << endl;
        cout << "Publisher: " << publisher << endl;
        cout << "Pages: " << pages << endl;
    }
};

int main() {
    Book book1("", "", 0);
    book1.input();
    Book book2 = book1;
    book2.display();
    return 0;
}