#include <iostream>

using namespace std;

class HashTable {
    int* table;
    int capacity;
    int size;

public:
    HashTable(int c) {
        capacity = c;
        size = 0;
        table = new int[capacity];
        for (int i = 0; i < capacity; i++)
            table[i] = -1;
    }

    int hashFunction(int key) {
        return key % capacity;
    }

    void insertItem(int key) {
        if (size == capacity) return;

        int index = hashFunction(key);
        while (table[index] != -1 && table[index] != key) {
            index = (index + 1) % capacity;
        }
        if (table[index] != key) {
            table[index] = key;
            size++;
        }
    }

    void displayHash() {
        for (int i = 0; i < capacity; i++) {
            if (table[i] != -1)
                cout << i << " --> " << table[i] << endl;
            else
                cout << i << " --> " << endl;
        }
    }
};

int main() {
    HashTable h(7);
    h.insertItem(15);
    h.insertItem(11);
    h.insertItem(27);
    h.insertItem(8);
    h.insertItem(12);

    h.displayHash();
    return 0;
}
