def is_perfect_number(N):
    total_sum = 0
    for i in range(1, N):
        if N % i == 0:
            total_sum += i
    return total_sum == N

N = 6
if is_perfect_number(N):
    print("Perfect Number")
else:
    print("Not Perfect Number")
print("Aryan Prasher")