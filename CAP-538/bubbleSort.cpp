#include <bits/stdc++.h>
using namespace std;

void bubbleSort(vector<int>& nums, int n) {
    if (n == 1)
        return;

    for (int i = 0; i < n - 1; i++) {
        if (nums[i] > nums[i + 1]) {
            swap(nums[i], nums[i + 1]);
        }
    }
    bubbleSort(nums, n - 1);
}

int main() {
    vector<int> nums = {1, 4, 6, 2, 3, 6, 8};
    bubbleSort(nums, nums.size());
    for (int x : nums)
        cout << x << " ";
    return 0;
}