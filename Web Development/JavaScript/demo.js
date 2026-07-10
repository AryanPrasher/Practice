function calculateSum() {
    const number1 = parseFloat(document.getElementById("num1").value);
    const number2 = parseFloat(document.getElementById("num2").value);
    

    const sum = number1 + number2;
    document.getElementById("result").innerHTML = "Sum is: " + sum;
}