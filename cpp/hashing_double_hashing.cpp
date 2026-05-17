#include <iostream>

using namespace std;

class HashTable {
    int* table;
    int capacity;
    int size;
    int PRIME;

public:
    HashTable(int c) {
        capacity = c;
        size = 0;
        PRIME = 5;
        table = new int[capacity];
        for (int i = 0; i < capacity; i++)
            table[i] = -1;
    }

    int hash1(int key) {
        return key % capacity;
    }

    int hash2(int key) {
        return (PRIME - (key % PRIME));
    }

    void insertItem(int key) {
        if (size == capacity) return;

        int index = hash1(key);
        if (table[index] != -1) {
            int index2 = hash2(key);
            int i = 1;
            while (1) {
                int newIndex = (index + i * index2) % capacity;
                if (table[newIndex] == -1) {
                    table[newIndex] = key;
                    break;
                }
                i++;
            }
        } else {
            table[index] = key;
        }
        size++;
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
