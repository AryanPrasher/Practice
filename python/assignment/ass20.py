def is_leap(year):
    return year % 4 == 0 and (year % 20 != 0 or year % 400 == 0)

for year in range(1991, 2016):
    if is_leap(year):
        print(f"{year} : LEAP YEAR")
    else:
        print(f"{year} : Not a leap year")
print("Aryan Prasher")