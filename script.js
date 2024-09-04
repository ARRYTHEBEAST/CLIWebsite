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
- projects   : List all projects
- project [name] : View details of a specific project
- social     : List all social media platforms
- social [platform] : View link for a specific platform
- social [platform] -o : Open link for a specific platform

Enter a command to get started.`,
    about: 'This is a terminal-style website created as a fun project.',
    contact: 'You can reach us at contact@terminalwebsite.com',
    secret: 'Congratulations! You\'ve accessed the secret page. Here\'s a virtual cookie: 🍪',
    projects: 'Use "projects" to see all projects or "project [name]" to view details of a specific project.',
    social: 'Use "social" to list all available social media platforms, "social [platform]" to view a specific link, or "social [platform] -o" to open the link.'
};

const projects = {
    "dummy": {
        name: "Dummy Project",
        description: "This is a dummy project to showcase the project feature.",
        technologies: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/yourusername/dummy",
        demo: "https://yourusername.github.io/dummy"
    }
};

const secretPassword = 'opensesame';

const socialLinks = {
    github: "https://github.com/yourusername",
    linkedin: "https://www.linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    instagram: "https://www.instagram.com/yourusername",
    // Add more social media links as needed
};

function displayOutput(text, clearFirst = false) {
    if (clearFirst) {
        output.textContent = '';
    }
    const clockHTML = `<pre id="ascii-clock" style="position: absolute; top: 10px; right: 10px; font-family: monospace; font-size: 10px; line-height: 1; color: #0f0;"></pre>`;
    output.innerHTML += text.replace(/\n/g, '<br>') + '<br>';
    output.innerHTML += clockHTML;
    updateClock();
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

function listProjects() {
    let projectList = "Available projects:\n\n";
    for (const key in projects) {
        projectList += `${projects[key].name} (${key})\n`;
    }
    displayOutput(projectList);
}

function viewProject(projectName) {
    const project = projects[projectName];
    if (project) {
        clearScreen();
        const projectView = `
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  ${project.name.toUpperCase().padEnd(62)}║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Description:                                                  ║
║  ${project.description.match(/.{1,60}/g).join('\n║  ').padEnd(62)}║
║                                                                ║
║  Technologies:                                                 ║
║  ${project.technologies.join(', ').padEnd(62)}║
║                                                                ║
║  GitHub:${project.github.padEnd(55)}║
║  Demo:${project.demo.padEnd(57)}║
║                                                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  Commands:                                                     ║
║  - back    : Return to the main terminal                       ║
║  - github  : Open GitHub repository                            ║
║  - demo    : Open live demo                                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`;
        displayOutput(projectView, true);
        currentPage = 'project-view';
    } else {
        displayOutput(`Project "${projectName}" not found. Use 'projects' to see all available projects.`);
    }
}

function listSocialPlatforms() {
    const platforms = Object.keys(socialLinks).join(', ');
    displayOutput(`Available social media platforms: ${platforms}\n\nUse "social [platform]" to view a specific link.`);
}

function displaySocialLink(platform) {
    if (socialLinks[platform]) {
        displayOutput(`${platform}: ${socialLinks[platform]}\n\nUse "social ${platform} -o" to open this link.`);
    } else {
        displayOutput(`Invalid platform: ${platform}\n\nUse "social" to see available platforms.`);
    }
}

function openSocialLink(platform) {
    if (socialLinks[platform]) {
        window.open(socialLinks[platform], '_blank');
        displayOutput(`Opening ${platform}...`);
    } else {
        displayOutput(`Invalid platform: ${platform}\n\nUse "social" to see available platforms.`);
    }
}

function processCommand(command) {
    displayOutput(`$ ${command}`);
    
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
    const parts = cmd.split(' ');
    
    if (parts[0] === 'social') {
        if (parts.length === 1) {
            listSocialPlatforms();
        } else if (parts.length === 2) {
            displaySocialLink(parts[1]);
        } else if (parts.length === 3 && parts[2] === '-o') {
            openSocialLink(parts[1]);
        } else {
            displayOutput('Invalid social command. Use "social" for usage information.');
        }
    } else if (currentPage === 'project-view') {
        switch (cmd) {
            case 'back':
                currentPage = 'home';
                clearScreen();
                break;
            case 'github':
                window.open(projects[currentProject].github, '_blank');
                displayOutput('Opening GitHub repository...');
                break;
            case 'demo':
                window.open(projects[currentProject].demo, '_blank');
                displayOutput('Opening live demo...');
                break;
            default:
                displayOutput(`Command not recognized: ${command}`);
        }
    } else {
        if (cmd.startsWith('cd ')) {
            const page = cmd.split(' ')[1];
            if (pages.hasOwnProperty(page) && page !== 'secret') {
                currentPage = page;
                displayOutput(pages[page]);
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
        } else if (cmd === 'projects') {
            listProjects();
        } else if (cmd.startsWith('project ')) {
            const projectName = cmd.split(' ')[1];
            currentProject = projectName;
            viewProject(projectName);
        } else {
            displayOutput(`Command not recognized: ${command}`);
        }
    }
}

input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        const command = this.value;
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

// Add these new functions for the ASCII analog clock
function getAnalogClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const clockFace = [
        "==============================",
        "      ┌───────────────┐      ",
        "    ┌─┘      XII      └─┐    ",
        "  ┌─┘ •               • └─┐  ",
        "┌─┘                       └─┐ ",
        "│ •                       • │",
        "│                           │",
        "│ •                       • │",
        "│                           │",
        "| IX        ·           III |",
        "│                           │",
        "│ •                       • │",
        "│                           │",
        "│  •                      • │",
        "└─┐                       ┌─┘ ",
        "  └─┐ •               • ┌─┘  ",
        "    └─┐   •  VI   •   ┌─┘    ",
        "      └───────────────┘      ",
        "================================"

    ];

    const center = { x: 13, y: 8 };
    const handLengths = { hour: 5, minute: 7, second: 9 };

    function drawHand(angle, length, symbol) {
        for (let i = 0; i <= length; i++) {
            const x = Math.round(center.x + Math.sin(angle) * i);
            const y = Math.round(center.y - Math.cos(angle) * i);
            if (y >= 0 && y < clockFace.length && x >= 0 && x < clockFace[y].length) {
                let line = clockFace[y].split('');
                line[x] = symbol;
                clockFace[y] = line.join('');
            }
        }
    }

    const hourAngle = (hours + minutes / 60) * 30 * (Math.PI / 180);
    const minuteAngle = minutes * 6 * (Math.PI / 180);
    const secondAngle = seconds * 6 * (Math.PI / 180);

    drawHand(hourAngle, handLengths.hour, '━');
    drawHand(minuteAngle, handLengths.minute, '─');
    drawHand(secondAngle, handLengths.second, '·');

    return clockFace.join('\n');
}

function updateClock() {
    const clockElement = document.getElementById('ascii-clock');
    if (clockElement) {
        clockElement.textContent = getAnalogClock();
    }
}

// Update the clock every second for smoother movement
setInterval(updateClock, 1000);
updateClock(); // Initial update

