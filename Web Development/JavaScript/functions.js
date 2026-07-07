
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

console.log("Default Parameters:", add());        // 30
console.log("One Value:", add(50));               // 70
console.log("Two Values:", add(50, 100));         // 150



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