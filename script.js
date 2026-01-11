// Calculator class to handle all operations
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.shouldResetScreen || this.currentOperand === '0') {
            this.currentOperand = number === '.' ? '0.' : number;
            this.shouldResetScreen = false;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case 'xʸ':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    performScientificOperation(operation) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        switch (operation) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(current);
                break;
            case 'ln':
                result = Math.log(current);
                break;
            case 'sqrt':
                result = Math.sqrt(current);
                break;
            case 'power':
                result = Math.pow(current, 2);
                break;
            case 'percent':
                result = current / 100;
                break;
            case 'negate':
                result = current * -1;
                break;
            default:
                return;
        }
        
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
    }

    insertConstant(constant) {
        let value;
        switch (constant) {
            case 'pi':
                value = Math.PI;
                break;
            case 'e':
                value = Math.E;
                break;
            default:
                return;
        }
        this.currentOperand = value.toString();
        this.shouldResetScreen = true;
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previous');
const currentOperandElement = document.getElementById('current');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Number buttons
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

// Action buttons
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        
        switch (action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'equals':
                calculator.compute();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'pow':
                const operationMap = {
                    'add': '+',
                    'subtract': '-',
                    'multiply': '×',
                    'divide': '/',
                    'pow': 'xʸ'
                };
                calculator.chooseOperation(operationMap[action]);
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case 'sqrt':
            case 'power':
            case 'percent':
            case 'negate':
                calculator.performScientificOperation(action);
                break;
            case 'pi':
            case 'e':
                calculator.insertConstant(action);
                break;
        }
        
        calculator.updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    } else if (event.key === 'Enter' || event.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (event.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (event.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (['+', '-', '*', '/'].includes(event.key)) {
        const operationMap = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '/'
        };
        calculator.chooseOperation(operationMap[event.key]);
        calculator.updateDisplay();
    }
});

// Initialize display
calculator.updateDisplay();
