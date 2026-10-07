const currentValue = document.getElementById("currentValue");
const previousValue = document.getElementById("previousValue");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operation]");
const actionButtons = document.querySelectorAll("[data-action]");

let current = "";
let previous = "";
let operation = null;


/* Display */

function updateDisplay() {
    currentValue.textContent = current || "0";

    if (previous && operation) {
        previousValue.textContent = `${previous} ${operation}`;
    } else {
        previousValue.textContent = "";
    }
}


/* Numbers */

function addNumber(number) {

    if (current === "Error") {
        clearCalculator();
    }

    if (number === "." && current.includes(".")) {
        return;
    }

    if (current === "0" && number !== ".") {
        current = number;
    } else {
        current += number;
    }

    updateDisplay();
}


/* Choose Operator */

function chooseOperation(operator) {

    if (current === "" && previous === "") {
        return;
    }

    if (current === "" && previous !== "") {
        operation = operator;
        updateDisplay();
        return;
    }

    if (previous !== "" && operation !== null) {
        calculate();
    }

    previous = current;
    current = "";
    operation = operator;

    updateDisplay();
}


/* Calculate */

function calculate() {

    if (
        previous === "" ||
        current === "" ||
        operation === null
    ) {
        return;
    }

    const first = parseFloat(previous);
    const second = parseFloat(current);

    let result;

    switch (operation) {

        case "+":
            result = first + second;
            break;

        case "−":
            result = first - second;
            break;

        case "×":
            result = first * second;
            break;

        case "÷":

            if (second === 0) {

                current = "Error";
                previous = "";
                operation = null;

                updateDisplay();

                setTimeout(clearCalculator, 1000);

                return;
            }

            result = first / second;
            break;

        default:
            return;
    }

    result =
        Math.round(
            (result + Number.EPSILON) * 100000000
        ) / 100000000;

    current = result.toString();

    previous = "";
    operation = null;

    updateDisplay();
}


/* Clear */

function clearCalculator() {
    current = "";
    previous = "";
    operation = null;

    updateDisplay();
}


/* Delete */

function deleteNumber() {

    if (current === "Error") {
        clearCalculator();
        return;
    }

    current = current.slice(0, -1);

    updateDisplay();
}


/* Percentage */

function percentage() {

    if (current === "") {
        return;
    }

    current = (parseFloat(current) / 100).toString();

    updateDisplay();
}


/* Number Buttons */

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        addNumber(button.dataset.number);

    });

});


/* Operator Buttons */

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperation(button.dataset.operation);

    });

});


/* Action Buttons */

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteNumber();
        }

        if (action === "percent") {
            percentage();
        }

        if (action === "equals") {
            calculate();
        }

    });

});


/* Keyboard Support */

document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        addNumber(key);
    }

    if (key === "+") {
        chooseOperation("+");
    }

    if (key === "-") {
        chooseOperation("−");
    }

    if (key === "*") {
        chooseOperation("×");
    }

    if (key === "/") {
        event.preventDefault();
        chooseOperation("÷");
    }

    if (key === "Enter" || key === "=") {
        calculate();
    }

    if (key === "Backspace") {
        deleteNumber();
    }

    if (key === "Escape") {
        clearCalculator();
    }

    if (key === "%") {
        percentage();
    }

});