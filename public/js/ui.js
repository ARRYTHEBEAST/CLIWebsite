import { PAGES } from './constants.js';

let output, input, terminal, cursor, loginForm, usernameInput, passwordInput, loginButton;
let doomFace = null;
let doomFaceState = {
    eyeDirection: 'center',
    mouthState: 'neutral',
    blinking: false
};

export function initializeUI() {
    output = document.getElementById('output');
    input = document.getElementById('input');
    terminal = document.getElementById('terminal');
    cursor = document.getElementById('cursor');
    loginForm = document.getElementById('login-form');
    usernameInput = document.getElementById('username');
    passwordInput = document.getElementById('password');
    loginButton = document.getElementById('login-button');

    input.addEventListener('keyup', handleKeyUp);
    input.addEventListener('input', updateCursorPosition);
    input.addEventListener('focus', () => cursor.style.display = 'block');
    input.addEventListener('blur', () => cursor.style.display = 'none');
}

export function displayOutput(text, clearFirst = false) {
    if (clearFirst) {
        output.textContent = '';
    }
    if (!doomFace) {
        createDoomFace();
    }
    const clockHTML = `<pre id="ascii-clock" style="position: fixed; top: 10px; right: 10px; font-family: monospace; font-size: 10px; line-height: 1; color: #0f0;"></pre>`;
    output.innerHTML += text.replace(/\n/g, '<br>') + '<br>';
    output.innerHTML += clockHTML;
    updateClock();
    terminal.scrollTop = terminal.scrollHeight;
}

export function clearScreen() {
    output.textContent = '';
    if (doomFace) {
        document.body.removeChild(doomFace);
        doomFace = null;
        clearInterval(doomFaceInterval);
    }
    displayOutput(PAGES.home);
}

function handleKeyUp(event) {
    if (event.key === 'Enter') {
        const command = input.value;
        processCommand(command);
        input.value = '';
    }
    updateCursorPosition();
}

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

// Add other UI-related functions like createDoomFace, updateClock, etc.