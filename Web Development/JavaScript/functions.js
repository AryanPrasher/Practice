// 1. Function Declaration (Hoisting)

// We can call it before its definition because function declarations are hoisted.
greetDeclaration();

function greetDeclaration() {
    console.log("Hello from Function Declaration");
}


// 2. Function Expression

const greetExpression = function () {
    console.log("Hello from Function Expression");
};

greetExpression();


// 3. Arrow Function

const greetArrow = () => {
    console.log("Hello from Arrow Function");
};

greetArrow();


// 4. Multiple Parameter Function

const sum = (a, b) => {
    return a + b;
};

console.log("Sum:", sum(10, 20));


// 5. Default Parameter Function

const add = (a = 10, b = 20) => {
    return a + b;
};

console.log("Default Parameters:", add());       // 30
console.log("One Value:", add(50));              // 70
console.log("Two Values:", add(50, 100));        // 150


// 6. Callback Function

function addNumbers(a, b) {
    return a + b;
}

function calculate(a, b, callback) {
    return callback(a, b);
}

console.log("Callback Result:", calculate(5, 7, addNumbers));


// 7. Callback using Arrow Function

console.log(
    "Arrow Callback:",
    calculate(8, 2, (a, b) => a * b)
);


// ========================================
// Array Higher Order Functions
// ========================================

const arr = [10, 20, 30, 40, 50, 60];

// forEach
console.log("\nforEach:");
arr.forEach((digit, index) => {
    console.log(`Index ${index}: ${digit}`);
});

// map
console.log("\nmap:");
const doubled = arr.map((element) => element * 2);
console.log(doubled);


// ========================================
// API Usage (Works in Browser / Node.js v18+)
// ========================================

// fetch("https://jsonplaceholder.typicode.com/users")
//     .then((res) => res.json())
//     .then((data) => {
//         console.log("\nUser Details:");

//         data.forEach((user) => {
//             console.log("Name:", user.name);
//             console.log("City:", user.address.city);
//             console.log("-------------------");
//         });
//     })
//     .catch((error) => {
//         console.log("Error:", error);
//     });


// ========================================
// find()
// Returns the FIRST matching element
// ========================================

const numbers = [23, 44, 53, 54, 34, 76, 74, 34];

const firstGreaterThan35 = numbers.find((element) => {
    return element > 35;
});

console.log("\nfind():", firstGreaterThan35);


// ========================================
// filter()
// Returns ALL matching elements
// ========================================

const allGreaterThan35 = numbers.filter((element) => {
    return element > 35
});
console.log("filter():", allGreaterThan35);

// ========================================
// reduce()
// ========================================

const numbers1 = [10, 20, 30, 40];

const total = numbers1.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
}, 0)
console.log("reduce():", total);

// ========================================
// flatmap()
// ========================================

const numbers3 = [1, 2, 3];
const result = numbers3.flatMap((num) => [num, num * 2]);
console.log(result);