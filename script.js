const output = document.getElementById('output');
const input = document.getElementById('input');
const terminal = document.getElementById('terminal');
const cursor = document.getElementById('cursor');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');

let currentPage = 'home';
let awaitingPassword = false;
let isLoggedIn = false;

const makaraArt = `
 __  __   _   _  __    _    ____      _    
|  \\/  | / \\ | |/ /   / \\  |  _ \\    / \\   
| |\\/| |/ _ \\| ' /   / _ \\ | |_) |  / _ \\  
| |  | / ___ \\ . \\  / ___ \\|  _ <  / ___ \\ 
|_|  |_\\_/ \\_\\_|\\_\\/_/   \\_\\_| \\_\\/_/   \\_\\
`;

const loginDescription = "Welcome to the Terminal Website - A unique, command-line interface experience.";

const pages = {
    home: `${makaraArt}
Welcome to the Terminal Website!

Navigation Guide:
- ls         : List available pages
- cd [page]  : Go to a specific page
- help       : Show this guide
- clear      : Clear the screen and show the navigation guide
- secret     : Access the secret page (requires password)
- logout     : Log out of the system

Enter a command to get started.`,
    about: 'This is a terminal-style website created as a fun project.',
    contact: 'You can reach us at contact@terminalwebsite.com',
    secret: 'Congratulations! You\'ve accessed the secret page. Here\'s a virtual cookie: 🍪'
};

const secretPassword = 'opensesame';

function displayOutput(text, clearFirst = false) {
    if (clearFirst) {
        output.textContent = '';
    }
    output.textContent += text + '\n\n';
    terminal.scrollTop = terminal.scrollHeight;
}

function clearScreen() {
    output.textContent = '';
    displayOutput(pages.home);
}

function listPages() {
    const pageList = Object.keys(pages).filter(page => page !== 'secret').join('\n');
    displayOutput(`Available pages:\n${pageList}`);
}

function processCommand(command) {
    if (awaitingPassword) {
        if (command === secretPassword) {
            awaitingPassword = false;
            currentPage = 'secret';
            displayOutput(pages.secret, true);
        } else {
            awaitingPassword = false;
            displayOutput('Incorrect password. Access denied.');
        }
        return;
    }

    const cmd = command.toLowerCase().trim();
    if (cmd.startsWith('cd ')) {
        const page = cmd.split(' ')[1];
        if (pages.hasOwnProperty(page) && page !== 'secret') {
            currentPage = page;
            displayOutput(pages[page], true);
        } else {
            displayOutput(`Error: Page "${page}" not found`);
        }
    } else if (cmd === 'help') {
        displayOutput(pages.home);
    } else if (cmd === 'clear') {
        clearScreen();
    } else if (cmd === 'ls') {
        listPages();
    } else if (cmd === 'secret') {
        awaitingPassword = true;
        displayOutput('Enter the password to access the secret page:');
    } else if (cmd === 'logout') {
        logout();
    } else {
        displayOutput(`Command not recognized: ${command}`);
    }
}

input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        const command = this.value;
        displayOutput(awaitingPassword ? '$ ********' : `$ ${command}`);
        processCommand(command);
        this.value = '';
    }
    updateCursorPosition();
});

input.addEventListener('input', updateCursorPosition);

function updateCursorPosition() {
    const inputRect = input.getBoundingClientRect();
    const inputStyle = window.getComputedStyle(input);
    const inputPaddingLeft = parseFloat(inputStyle.paddingLeft);
    const textWidth = getTextWidth(input.value, inputStyle.font);
    cursor.style.left = `${textWidth + inputPaddingLeft}px`;
}

function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text).width;
}

input.addEventListener('focus', () => cursor.style.display = 'block');
input.addEventListener('blur', () => cursor.style.display = 'none');

// Login system
function showLoginForm() {
    document.getElementById('login-art').textContent = makaraArt;
    document.getElementById('login-description').textContent = loginDescription;
    loginForm.style.display = 'block';
    terminal.style.display = 'none';
}

function hideLoginForm() {
    loginForm.style.display = 'none';
    terminal.style.display = 'block';
}

function login(username, password) {
    if (username === 'admin' && password === 'password') {
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        hideLoginForm();
        displayOutput('Login successful. Welcome, ' + username + '!');
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function logout() {
    isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    showLoginForm();
}

loginButton.addEventListener('click', function() {
    login(usernameInput.value, passwordInput.value);
});

// Check if user is already logged in
if (localStorage.getItem('isLoggedIn') === 'true') {
    isLoggedIn = true;
    hideLoginForm();
} else {
    showLoginForm();
}

// Initial display
displayOutput(pages.home);
updateCursorPosition();
