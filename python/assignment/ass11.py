count = 0
num = 2

while count < 15:
    div_count = 0
    for i in range(1, num + 1):
        if num % i == 0:
            div_count += 1

    if div_count < 3:
        print(num, end=", ")
        count += 1

    num += 1
print("Aryan Prasher")