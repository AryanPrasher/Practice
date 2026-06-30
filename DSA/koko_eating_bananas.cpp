#include <bits/stdc++.h>
using namespace std;

int main()
{
    int size;
    cout << "Enter size of array: ";
    cin >> size;

    int target;
    cout << "Enter the target(hours): ";
    cin >> target;

    vector<int> arr(size);

    cout << "Enter the array:\n";
    for (int i = 0; i < size; i++)
    {
        cin >> arr[i];
    }

    int maxx = *max_element(arr.begin(), arr.end());

    for (int speed = 1; speed <= maxx; speed++){
        int hours = 0;

        for (int i = 0; i < size; i++){
            hours += (arr[i] + speed - 1) / speed;
        }

        if (hours <= target){
            cout << "\nMinimum eating speed = " << speed << endl;
            return 0;
        }
    }

    cout << "\nNo possible eating speed found!" << endl;

    return 0;
}