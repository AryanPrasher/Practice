num = 407
total = 0
x = num

while x != 0:
    rem = x % 10
    total += rem ** 3
    x //= 10

if num == total:
    print("Yes, it is an Armstrong number")
else:
    print("No, it is not an Armstrong number")
print("Aryan Prasher")