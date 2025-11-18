// DOM elements
const passwordField = document.getElementById('password');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('generate-btn');
const lengthInput = document.getElementById('length');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const strengthBar = document.getElementById('strength-bar');
const strengthValue = document.getElementById('strength-value');
const strengthText = document.getElementById('strength-text');
const historyList = document.getElementById('history-list');

// Character sets
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*';

let passwordHistory = [];

// Generate password function
function generatePassword() {
    let length = parseInt(lengthInput.value);
    let charPool = '';
    let password = '';
    
    // Build character pool based on selected options
    if (uppercaseCheckbox.checked) charPool += uppercaseChars;
    if (lowercaseCheckbox.checked) charPool += lowercaseChars;
    if (numbersCheckbox.checked) charPool += numberChars;
    if (symbolsCheckbox.checked) charPool += symbolChars;
    
    // If no character types selected, use lowercase as default
    if (charPool === '') {
        charPool = lowercaseChars;
        lowercaseCheckbox.checked = true;
    }
    
    // Generate password
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool[randomIndex];
    }
    
    return password;
}

// Check password strength
function checkPasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    // Determine strength level
    let strength = '';
    let strengthClass = '';
    
    if (score <= 2) {
        strength = 'Weak';
        strengthClass = 'weak';
    } else if (score <= 4) {
        strength = 'Fair';
        strengthClass = 'fair';
    } else if (score <= 6) {
        strength = 'Good';
        strengthClass = 'good';
    } else {
        strength = 'Strong';
        strengthClass = 'strong';
    }
    
    return { strength, strengthClass, score };
}

// Update strength meter
function updateStrengthMeter(password) {
    const { strength, strengthClass, score } = checkPasswordStrength(password);
    
    strengthBar.className = 'strength-bar ' + strengthClass;
    strengthValue.textContent = strength;
    strengthText.textContent = `Score: ${score}/7 - ${strength}`;
}

// Add password to history
function addToHistory(password) {
    // Add to beginning of array
    passwordHistory.unshift(password);
    
    // Keep only last 5 passwords
    if (passwordHistory.length > 5) {
        passwordHistory.pop();
    }
    
    // Update history display
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    passwordHistory.forEach((password, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const passwordSpan = document.createElement('span');
        passwordSpan.textContent = password;
        
        const copySpan = document.createElement('span');
        copySpan.textContent = 'Copy';
        copySpan.className = 'history-copy';
        copySpan.addEventListener('click', () => {
            copyToClipboard(password);
        });
        
        historyItem.appendChild(passwordSpan);
        historyItem.appendChild(copySpan);
        historyList.appendChild(historyItem);
    });
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        passwordField.select();
        document.execCommand('copy');
    });
}

// Event listeners
generateBtn.addEventListener('click', () => {
    const password = generatePassword();
    passwordField.value = password;
    updateStrengthMeter(password);
    addToHistory(password);
});

copyBtn.addEventListener('click', () => {
    if (passwordField.value) {
        copyToClipboard(passwordField.value);
    }
});

// Check strength when password is typed manually
passwordField.addEventListener('input', () => {
    updateStrengthMeter(passwordField.value);
});

// Generate initial password on page load
window.addEventListener('load', () => {
    generateBtn.click();
});