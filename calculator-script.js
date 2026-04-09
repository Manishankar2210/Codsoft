// Calculator Class
class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetScreen = false;
        
        this.currentOperandElement = document.getElementById('currentOperand');
        this.previousOperandElement = document.getElementById('previousOperand');
        this.displayElement = document.querySelector('.display');
        
        this.init();
    }
    
    init() {
        // Add event listeners to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.addRippleEffect(e);
                this.handleButtonClick(button);
            });
        });
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        this.updateDisplay();
    }
    
    handleButtonClick(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        switch (action) {
            case 'number':
                this.appendNumber(value);
                break;
            case 'operator':
                this.setOperation(value);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'decimal':
                this.appendDecimal();
                break;
            case 'percent':
                this.percent();
                break;
        }
        
        this.updateDisplay();
    }
    
    handleKeyboard(e) {
        // Prevent default for calculator keys
        if (e.key.match(/[0-9]/) || ['+', '-', '*', '/', 'Enter', 'Escape', 'Backspace', '.', '%'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Number keys
        if (e.key.match(/[0-9]/)) {
            this.appendNumber(e.key);
            this.highlightButton(`[data-value="${e.key}"]`);
        }
        
        // Operators
        const operatorMap = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        
        if (operatorMap[e.key]) {
            this.setOperation(operatorMap[e.key]);
            this.highlightButton(`[data-value="${operatorMap[e.key]}"]`);
        }
        
        // Enter = Equals
        if (e.key === 'Enter') {
            this.calculate();
            this.highlightButton('[data-action="equals"]');
        }
        
        // Escape = Clear
        if (e.key === 'Escape') {
            this.clear();
            this.highlightButton('[data-action="clear"]');
        }
        
        // Backspace
        if (e.key === 'Backspace') {
            this.backspace();
            this.highlightButton('[data-action="backspace"]');
        }
        
        // Decimal
        if (e.key === '.') {
            this.appendDecimal();
            this.highlightButton('[data-action="decimal"]');
        }
        
        // Percent
        if (e.key === '%') {
            this.percent();
            this.highlightButton('[data-action="percent"]');
        }
        
        this.updateDisplay();
    }
    
    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.classList.add('pressed');
            setTimeout(() => button.classList.remove('pressed'), 150);
        }
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        // Limit length
        if (this.currentOperand.length >= 15) return;
        
        // Handle leading zero
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        
        if (this.currentOperand.includes('.')) return;
        this.currentOperand += '.';
    }
    
    setOperation(operator) {
        if (this.currentOperand === 'Error') return;
        
        if (this.operation !== null && !this.shouldResetScreen) {
            this.calculate();
        }
        
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        
        // Highlight active operator
        document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-value="${operator}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    calculate() {
        if (this.operation === null || this.shouldResetScreen) return;
        
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let result;
        
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '−':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.displayElement.classList.add('error');
                    setTimeout(() => this.displayElement.classList.remove('error'), 1500);
                    this.operation = null;
                    this.previousOperand = '';
                    this.shouldResetScreen = true;
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Round to avoid floating point issues
        result = Math.round(result * 1000000000000) / 1000000000000;
        
        // Format result
        this.currentOperand = result.toString();
        this.operation = null;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        
        // Remove active operator highlight
        document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetScreen = false;
        
        // Remove active operator highlight
        document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
    }
    
    backspace() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        
        if (this.shouldResetScreen) return;
        
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
    }
    
    percent() {
        if (this.currentOperand === 'Error') return;
        
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current / 100).toString();
    }
    
    formatNumber(number) {
        if (number === 'Error') return 'Error';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        // Update current operand
        this.currentOperandElement.textContent = this.formatNumber(this.currentOperand);
        
        // Adjust font size if number is long
        if (this.currentOperand.length > 10) {
            this.currentOperandElement.classList.add('small');
        } else {
            this.currentOperandElement.classList.remove('small');
        }
        
        // Update previous operand
        if (this.operation !== null) {
            this.previousOperandElement.textContent = `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
    
    addRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
