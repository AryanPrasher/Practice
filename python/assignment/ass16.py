def palindrome(n):
    number = n
    reversed_num = 0

    while number > 0:
        rem = number % 10
        reversed_num = reversed_num * 10 + rem
        number //= 10

    return reversed_num

input_number = 1235321
if input_number == palindrome(input_number):
    print(f"{input_number} is a Palindrome number")
else:
    print(f"{input_number} is not a Palindrome number")
print("Aryan Prasher")