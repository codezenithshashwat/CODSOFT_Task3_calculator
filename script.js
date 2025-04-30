// State variables
let currentValue = '0';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;

// DOM elements
const currentValueEl = document.getElementById('currentValue');
const calculationDisplayEl = document.getElementById('calculationDisplay');

// Helper functions
function getSymbol(op) {
  if (op === '+') return '+';
  if (op === '-') return '−';
  if (op === '*') return '×';
  if (op === '/') return '÷';
  return '';
}

function updateDisplay() {
  currentValueEl.textContent = currentValue;
  
  if (previousValue && operation) {
    calculationDisplayEl.textContent = `${previousValue} ${getSymbol(operation)}`;
  } else {
    calculationDisplayEl.textContent = '';
  }
}

// Calculator functions
function handleNumberInput(num) {
  if (currentValue === '0' || shouldResetDisplay) {
    currentValue = num;
    shouldResetDisplay = false;
  } else {
    if (currentValue.length < 12) {
      currentValue += num;
    }
  }
  updateDisplay();
}

function handleDecimalPoint() {
  if (shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
  } else if (!currentValue.includes('.')) {
    currentValue += '.';
  }
  updateDisplay();
}

function calculate() {
  const num1 = parseFloat(previousValue);
  const num2 = parseFloat(currentValue);
  
  if (isNaN(num1) || isNaN(num2)) return;
  
  let answer;
  
  if (operation === '+') {
    answer = num1 + num2;
  } else if (operation === '-') {
    answer = num1 - num2;
  } else if (operation === '*') {
    answer = num1 * num2;
  } else if (operation === '/') {
    if (num2 === 0) {
      currentValue = 'Error';
      updateDisplay();
      return;
    }
    answer = num1 / num2;
  } else {
    return;
  }
  
  const fixedResult = parseFloat(answer.toFixed(10)).toString();
  
  if (fixedResult.length > 12) {
    currentValue = Number(answer).toExponential(5);
  } else {
    currentValue = fixedResult;
  }
}

function handleOperation(op) {
  if (operation && previousValue && !shouldResetDisplay) {
    calculate();
  }
  
  previousValue = currentValue;
  operation = op;
  shouldResetDisplay = true;
  updateDisplay();
}

function handleEquals() {
  if (!operation || !previousValue) {
    return;
  }
  
  calculate();
  operation = null;
  previousValue = '';
  shouldResetDisplay = true;
  updateDisplay();
}

function handleClear() {
  currentValue = '0';
  previousValue = '';
  operation = null;
  shouldResetDisplay = false;
  updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
  const key = event.key;
  
  if (/^[0-9]$/.test(key)) {
    handleNumberInput(key);
  } else if (key === '.') {
    handleDecimalPoint();
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperation(key);
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
  } else if (['Escape', 'Delete', 'Backspace', 'c', 'C'].includes(key)) {
    handleClear();
  } else if (key.toLowerCase() === 'x') {
    handleOperation('*');
  }
});

// Initialize display
updateDisplay();