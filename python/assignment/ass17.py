num = 23456
rev_num = 0

while num > 0:
    rem = num % 10
    rev_num = rev_num * 10 + rem
    num //= 10

print(f"Reverse number is {rev_num}")
print("Aryan Prasher")