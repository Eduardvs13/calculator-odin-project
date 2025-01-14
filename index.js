const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const operate = (a, b, operation) => operations[operation](a, b);

const calculatorButtons = document.getElementById("calculator-buttons");
const calculatorScreen = document.getElementById("calculator-screen");
const operations = { x: multiply, "/": divide, "-": subtract, "+": add };
const symbols = ["x", "/", "-", "+"];
const BUTTONS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  ".",
  "x",
  "/",
  "-",
  "+",
  "=",
  "DEL",
  "CLR",
];
let operation = JSON.parse(localStorage.getItem("operation")) || [];
let number = JSON.parse(localStorage.getItem("number")) || "";
calculatorScreen.textContent = operation.join("");
const updateOperation = (char) => {
  const clickedbutton = document.getElementById(`${char}-button`);
  clickedbutton.classList.add("clicked-button");
  setTimeout(() => {
    clickedbutton.classList.remove("clicked-button");
  }, 100);
  const lastIndex = operation.length - 1;
  const calculatorScreen = document.querySelector("#calculator-screen");
  if (BUTTONS.indexOf(char) <= 9) {
    let special = false;
    if (typeof operation[lastIndex] == "number") {
      operation[lastIndex] += char;
      operation[lastIndex] = parseFloat(operation[lastIndex]);
    } else {
      if (operation[lastIndex] == ".") {
        operation.pop();
        operation[lastIndex - 1] = parseFloat(
          `${operation[lastIndex - 1]}.${char}`
        );
        number = operation[lastIndex - 1];
        special = true;
      } else {
        operation.push(parseFloat(char));
      }
    }
    if (!special) number += char;
    special = false;
  } else if (number != "" && BUTTONS.indexOf(char) < BUTTONS.length - 3) {
    operation[lastIndex] = parseFloat(number);
    operation.push(char);
    number = "";
  }
  if (char == "=") {
    calculate();
  }
  if (char == "CLR" || char == "Delete") {
    operation = [];
    number = "";
  }
  if (char == "DEL" || char == "Backspace") {
    if (typeof operation[lastIndex] == "number") {
      operation[lastIndex] = parseInt(
        operation[lastIndex].toString().slice(0, -1)
      );
      if (!operation[lastIndex]) operation.pop();
    } else {
      operation.pop();
    }
  }
  localStorage.setItem("operation", JSON.stringify(operation));
  localStorage.setItem("number", JSON.stringify(number));
  calculatorScreen.textContent = operation.join("");
};

window.addEventListener("keydown", (event) => {
  let char = event.key;
  if (char == "Delete") char = "CLR";
  if (char == "Backspace") char = "DEL";
  if (char == "*") char = "x";
  if (char == "Enter") char = "=";
  if (BUTTONS.includes(char)) updateOperation(char);
});

const generateCalculator = () => {
  for (const calculatorButton of BUTTONS) {
    const button = document.createElement("button");
    button.textContent = calculatorButton;
    button.classList.add("calculator-button");
    button.id = `${calculatorButton}-button`;
    button.addEventListener("click", (event) => {
      updateOperation(event.currentTarget.textContent);
    });
    calculatorButtons.appendChild(button);
  }
};

generateCalculator();

const calculate = () => {
  while (operation.length > 2) {
    for (let sym of symbols) {
      index = operation.indexOf(sym);
      symbol = sym;
      if (index >= 0) break;
    }
    let aux = operate(operation[index - 1], operation[index + 1], symbol);
    delete operation[index - 1];
    operation[index] = aux;
    delete operation[index + 1];
    operation = operation.filter((element) => {
      if (element) {
        return element;
      }
    });
  }
  let result = operation[0];
  number = result;
};
