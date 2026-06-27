#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        int n = nums.size();
        for (int i=0; i<n-1; i++){
            for(int j=0; j<n-i-1; j++){
                if (nums[j]>nums[j+1]){
                    swap(nums[j], nums[j+1]);
                }
            }
        }
        return nums;
    }
};

int main(){
    Solution s;
    vector<int> nums = {5, 2, 8, 4, 9, 9, 3, 2, 1};
    s.sortArray(nums);
    for (int x : nums) {
        cout << x << " ";
    }
    cout << '\n';
    return 0;
}