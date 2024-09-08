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
let currentPath = '/home';
let isAdmin = false;

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
- ls         : List contents of the current directory
- cd [dir]   : Change directory
- pwd        : Print working directory
- cat [file] : View the contents of a text file
- mkdir [dir]: Create a new directory
- touch [file]: Create a new empty file
- rm [item]  : Remove a file or directory
- mv [src] [dest]: Move or rename a file or directory
- help       : Show this guide
- clear      : Clear the screen and show the navigation guide
- secret     : Access the secret page (requires password)
- logout     : Log out of the system
- projects   : List all projects
- project [name] : View details of a specific project
- social     : List all social media platforms
- social [platform] : View link for a specific platform
- social [platform] -o : Open link for a specific platform
- snake start [difficulty] : Start a new Snake game in the bottom right corner
                             Difficulties: easy, medium (default), hard
                             The game will start after a 5-second countdown.
- Note: An animated ASCII art face will appear in the top-left corner.

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

// Add these variables for the Doom face
let doomFace = null;
let doomFaceState = {
    eyeDirection: 'center',
    mouthState: 'neutral',
    blinking: false
};
let doomFaceInterval = null;

function createDoomFace() {
    if (doomFace) return; // Face already exists

    doomFace = document.createElement('pre');
    doomFace.id = 'doom-face';
    doomFace.style.position = 'fixed';
    doomFace.style.top = '0px';
    doomFace.style.right = '300px';
    doomFace.style.fontFamily = 'monospace';
    doomFace.style.color = '#0f0';
    doomFace.style.zIndex = '1000';
    document.body.appendChild(doomFace);

    updateDoomFace();
    doomFaceInterval = setInterval(updateDoomFace, 200); // Update every 200ms for smoother animation
}

function updateDoomFace() {
    const baseFace = `
               _____    ____
             .#########.#######..
          .#######################.
        .############################.
       .################################.
      .#########,##,#####################.
     .#########-#,'########## ############.
    .######'#-##' # ##'### #. \`####:#######.
    #####:'# #'###,##' # # +#. \`###:':######
   .####,'###,##  ###  # # #\`#. -####\`######.
  .####+.' ,'#  ##' #   # # #\`#\`.\`#####::####
  ####'    #  '##'  #   #_'# #.## \`#######;##
  #:##'      '       #   # \`\`..__ \`#######:#
  #:##'  .#######s.   #.  .s######.\`#####:##
  #:##   ."______""'    '""_____"". \`.#####:#
 .#:##   ><'(##)'> )    ( <'(##)\`><   \`####;#
 ##:##  , , -==-' '.    .\` \`-==- . \\  ######'
 #|-'| / /      ,  :    : ,       \\ \` :####:'
 :#  |: '  '   /  .     .  .  \`    \`  |\`####
 #|  :|   /   '  '       \`  \\   . ,   :  #:# 
 #L. | | ,  /   \`.-._ _.-.'   .  \\ \\  : ) J##
###\\ \`  /  '                   \\  : : |  /##
 ## #|.:: '       _    _        \` | | |'####
 #####|\\  |  (.-'.__\`-'__.\`-.)   :| ' ######
 ######\\:      \`-...___..-' '     :: /######
 #######\`\`.                   ,'|  /#######
.# ######\\  \\       ___       / /' /#######
# #'#####|\\  \\    -     -    /  ,'|### #. #.
\`#  #####| '-.\`             ' ,-'  |### #  #
    #' \`#|    '._         ,.-'     #\`#\`#.
         |       .'------' :       |#   #
         |       :         :       |
         |       :         :       |
                 :         :
`;

    let face = baseFace;

    // Update eyes
    const leftEye = face.indexOf("><'(##)'>");
    const rightEye = face.indexOf("( <'(##)`><");
    
    const eyes = {
        left:   ["<'(##)'<<<<<<", "( <'(##)<<<<<"],
        center: ["<>'(##)'>", "( <'(##)><"],
        right:  ["<<<<<'(##)'>", "( <<<<<'(##)>"]
    };

    face = face.slice(0, leftEye) + eyes[doomFaceState.eyeDirection][0] + face.slice(leftEye + 10);
    face = face.slice(0, rightEye) + eyes[doomFaceState.eyeDirection][1] + face.slice(rightEye + 11);

    // Update mouth
    const mouthIndex = face.indexOf("-     -");
    const mouths = {
        neutral: "------",
        happy:   "\\___/",
        sad:     "/___\\",
        ooh:     "  O  "
    };
    face = face.slice(0, mouthIndex) + mouths[doomFaceState.mouthState].padStart(7, " ") + face.slice(mouthIndex + 7);

    // Apply blinking
    if (doomFaceState.blinking) {
        face = face.replace("><'(##)'>", "--'-----'--").replace("<'(##)\`><", "(-'-----'--)");
    }

    doomFace.textContent = face;

    // Randomly change eye direction
    if (Math.random() < 0.1) {
        doomFaceState.eyeDirection = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
    }

    // Randomly change mouth state
    if (Math.random() < 0.05) {
        doomFaceState.mouthState = ['neutral', 'happy', 'sad', 'ooh'][Math.floor(Math.random() * 4)];
    }
    

    // Randomly blink
    doomFaceState.blinking = Math.random() < 0.1;
}

// Modify the displayOutput function to create the Doom face if it doesn't exist
function displayOutput(text, clearFirst = false) {
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

// Modify the clearScreen function to remove the Doom face
function clearScreen() {
    output.textContent = '';
    if (doomFace) {
        document.body.removeChild(doomFace);
        doomFace = null;
        clearInterval(doomFaceInterval);
    }
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
╠═════════════════════════════════=══════════════════════════════╣
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

// Add these variables for the Snake game
let snakeGame = null;
let snake = [];
let food = {};
let direction = 'right';
let gameLoop = null;
let gameArea = { width: 20, height: 15 };
let gameDifficulty = 'medium';

const difficulties = {
    easy: { speed: 200, growthRate: 1 },
    medium: { speed: 150, growthRate: 1 },
    hard: { speed: 100, growthRate: 2 }
};

const directionArrows = {
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→'
};

function startSnakeGame(difficulty = 'medium') {
    if (snakeGame) return; // Game already running

    gameDifficulty = difficulty.toLowerCase();
    if (!difficulties[gameDifficulty]) {
        gameDifficulty = 'medium';
    }

    const snakeArt = `
           /^\\/^\\
         _|__|  O|
\\/     /~     \\_/ \\
 \\____|__________/  \\
        \\_______      \\
                \`\\     \\                 \\
                  |     |                  \\
                 /      /                    \\
                /     /                       \\\\
              /      /                         \\ \\
             /     /                            \\  \\
           /     /             _----_            \\   \\
          /     /           _-~      ~-_         |   |
         (      (        _-~    _--_    ~-_     _/   |
          \\      ~-____-~    _-~    ~-_    ~-_-~    /
            ~-_           _-~          ~-_       _-~
               ~--______-~                ~-___-~
    `;

    displayOutput(snakeArt);
    displayOutput(`Snake game is starting on ${gameDifficulty} difficulty...`);

    let countdown = 5;
    const countdownInterval = setInterval(() => {
        displayOutput(`${countdown}...`);
        countdown--;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            initializeGame();
        }
    }, 1000);

    function initializeGame() {
        snakeGame = document.createElement('pre');
        snakeGame.id = 'snake-game';
        snakeGame.style.position = 'fixed';
        snakeGame.style.bottom = '10px';
        snakeGame.style.right = '10px';
        snakeGame.style.width = `${gameArea.width + 2}ch`;
        snakeGame.style.height = `${gameArea.height + 3}em`;
        snakeGame.style.lineHeight = '1';
        snakeGame.style.fontFamily = 'monospace';
        snakeGame.style.border = '1px solid #0f0';
        snakeGame.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        snakeGame.style.zIndex = '1000';
        snakeGame.tabIndex = 0; // Make div focusable
        document.body.appendChild(snakeGame);

        snake = [{ x: 5, y: 5 }];
        direction = 'right';
        spawnFood();

        snakeGame.focus();
        document.addEventListener('keydown', handleKeyPress);
        gameLoop = setInterval(updateSnakeGame, difficulties[gameDifficulty].speed);

        displayOutput(`Game started! Use arrow keys to control the snake.`);
    }
}

function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * gameArea.width),
            y: Math.floor(Math.random() * gameArea.height)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function handleKeyPress(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (key === 'ArrowRight' && direction !== 'left') direction = 'right';
    event.preventDefault();
}

function updateSnakeGame() {
    // Move snake
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check collision with walls or self
    if (head.x < 0 || head.x >= gameArea.width || head.y < 0 || head.y >= gameArea.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        for (let i = 0; i < difficulties[gameDifficulty].growthRate; i++) {
            snake.push({...snake[snake.length - 1]});
        }
        spawnFood();
    } else {
        snake.pop();
    }

    renderGame();
}

function renderGame() {
    let gameDisplay = Array(gameArea.height).fill().map(() => Array(gameArea.width).fill(' '));
    snake.forEach((segment, index) => {
        if (index === 0) {
            gameDisplay[segment.y][segment.x] = directionArrows[direction];
        } else {
            gameDisplay[segment.y][segment.x] = 'o';
        }
    });
    gameDisplay[food.y][food.x] = '*';

    const borderTop = '┌' + '─'.repeat(gameArea.width) + '┐\n';
    const borderBottom = '└' + '─'.repeat(gameArea.width) + '┘\n';
    const gameContent = gameDisplay.map(row => '│' + row.join('') + '│\n').join('');

    snakeGame.textContent = borderTop + gameContent + borderBottom + `Score: ${snake.length - 1}  ${gameDifficulty} mode`;
}

function endGame() {
    clearInterval(gameLoop);
    document.removeEventListener('keydown', handleKeyPress);
    displayOutput(`Game Over! Your score: ${snake.length - 1}. Difficulty: ${gameDifficulty}`);
    setTimeout(() => {
        document.body.removeChild(snakeGame);
        snakeGame = null;
    }, 3000);
}

async function handleCd(args) {
    if (args.length !== 1) {
      displayOutput('Usage: cd <directory>');
      return;
    }
    let newPath;
    if (args[0] === '..') {
      const pathParts = currentPath.split('/').filter(Boolean);
      pathParts.pop();
      newPath = '/' + pathParts.join('/');
    } else if (args[0].startsWith('/')) {
      newPath = args[0];
    } else {
      newPath = pathJoin(currentPath, args[0]);
    }
    try {
      console.log('Changing directory to:', newPath);
      const response = await fetch(`/fs${newPath}`);
      const data = await response.json();
      if (data.success) {
        currentPath = newPath;
        displayOutput(`Changed directory to ${currentPath}`);
      } else {
        displayOutput(data.message);
      }
    } catch (error) {
      console.error('Error in handleCd:', error);
      displayOutput('Error: Unable to change directory. Please try again.');
    }
  }

async function handleLs() {
  try {
    console.log('Fetching directory contents for:', currentPath);
    const response = await fetch(`/fs${currentPath}`);
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Server response:', data);
    if (data.success) {
      const items = Object.keys(data.data).map(item => {
        return typeof data.data[item] === 'string' ? `📄 ${item}` : `📁 ${item}`;
      });
      displayOutput(items.join('\n') || 'Empty directory');
    } else {
      displayOutput(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error in handleLs:', error);
    displayOutput('Error: Unable to list directory contents. Please try again.');
  }
}

async function handleCat(args) {
    if (args.length !== 1) {
    displayOutput('Usage: cat <filename>');
    return;
    }
    try {
    const filePath = pathJoin(currentPath, args[0]);
    console.log('Fetching file contents for:', filePath);
    const response = await fetch(`/file${filePath}`);
    const data = await response.json();
    if (data.success) {
    displayOutput(data.content);
        } else {
            displayOutput(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error in handleCat:', error);
        displayOutput('Error: Unable to read file. Please try again.');
    }
}

function pathJoin(...parts) {
    return parts.join('/').replace(/\/+/g, '/');
}

async function handleCd(args) {
  if (args.length !== 1) {
    displayOutput('Usage: cd <directory>');
    return;
  }
  let newPath;
  if (args[0] === '..') {
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    newPath = '/' + pathParts.join('/');
  } else if (args[0].startsWith('/')) {
    newPath = args[0];
  } else {
    newPath = pathJoin(currentPath, args[0]);
  }
  try {
    console.log('Changing directory to:', newPath);
    const response = await fetch(`/fs${newPath}`);
    const data = await response.json();
    if (data.success) {
      currentPath = newPath;
      displayOutput(`Changed directory to ${currentPath}`);
    } else {
      displayOutput(data.message);
    }
  } catch (error) {
    console.error('Error in handleCd:', error);
    displayOutput('Error: Unable to change directory. Please try again.');
  }
}

function handlePwd() {
  displayOutput(`Current directory: ${currentPath}`);
}

async function login(username, password) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.success) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            hideLoginForm();
            displayOutput('Login successful. Welcome, ' + username + '!');
        } else {
            displayOutput('Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        displayOutput('An error occurred during login. Please try again.');
    }
}

async function handleMkdir(args) {
  if (args.length !== 1) {
    displayOutput('Usage: mkdir <directory_name>');
    return;
  }
  try {
    const dirPath = pathJoin(currentPath, args[0]);
    const response = await fetch(`/directory${dirPath}`, { method: 'POST' });
    const data = await response.json();
    if (data.success) {
      displayOutput(`Directory '${args[0]}' created successfully.`);
    } else {
      displayOutput(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error in handleMkdir:', error);
    displayOutput('Error: Unable to create directory. Please try again.');
  }
}

async function handleTouch(args) {
  if (args.length !== 1) {
    displayOutput('Usage: touch <filename>');
    return;
  }
  try {
    const filePath = pathJoin(currentPath, args[0]);
    const response = await fetch(`/file${filePath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '' })
    });
    const data = await response.json();
    if (data.success) {
      displayOutput(`File '${args[0]}' created successfully.`);
    } else {
      displayOutput(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error in handleTouch:', error);
    displayOutput('Error: Unable to create file. Please try again.');
  }
}

async function handleRm(args) {
  if (args.length !== 1) {
    displayOutput('Usage: rm <filename_or_directory>');
    return;
  }
  try {
    const itemPath = pathJoin(currentPath, args[0]);
    const response = await fetch(`/fs${itemPath}`, { method: 'DELETE' });
    const data = await response.json();
    if (data.success) {
      displayOutput(`'${args[0]}' deleted successfully.`);
    } else {
      displayOutput(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error in handleRm:', error);
    displayOutput('Error: Unable to delete item. Please try again.');
  }
}

async function handleMv(args) {
  if (args.length !== 2) {
    displayOutput('Usage: mv <source> <destination>');
    return;
  }
  try {
    const sourcePath = pathJoin(currentPath, args[0]);
    const destPath = pathJoin(currentPath, args[1]);
    const response = await fetch(`/fs${sourcePath}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPath: destPath })
    });
    const data = await response.json();
    if (data.success) {
      displayOutput(`'${args[0]}' moved to '${args[1]}' successfully.`);
    } else {
      displayOutput(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error in handleMv:', error);
    displayOutput('Error: Unable to move item. Please try again.');
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
    } else if (parts[0] === 'snake' && parts[1] === 'start') {
        const difficulty = parts[2] || 'medium';
        startSnakeGame(difficulty);
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
        switch (parts[0]) {
            case 'ls':
                handleLs();
                break;
            case 'cd':
                handleCd(parts.slice(1));
                break;
            case 'pwd':
                handlePwd();
                break;
            case 'cat':
                handleCat(parts.slice(1));
                break;
            case 'mkdir':
                handleMkdir(parts.slice(1));
                break;
            case 'touch':
                handleTouch(parts.slice(1));
                break;
            case 'rm':
                handleRm(parts.slice(1));
                break;
            case 'mv':
                handleMv(parts.slice(1));
                break;
            case 'help':
                displayOutput(pages.home);
                break;
            case 'clear':
                clearScreen();
                break;
            case 'secret':
                awaitingPassword = true;
                displayOutput('Enter the password to access the secret page:');
                break;
            case 'logout':
                logout();
                break;
            case 'projects':
                listProjects();
                break;
            case 'project':
                currentProject = parts[1];
                viewProject(parts[1]);
                break;
            default:
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
async function login(username, password) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.success) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            hideLoginForm();
            displayOutput('Login successful. Welcome to the terminal!');
        } else {
            displayOutput('Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        displayOutput('An error occurred during login. Please try again.');
    }
}

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
        "================================",
        "  ____ _     ___   ____ _  __",
        " / ___| |   / _ \\ / ___| |/ /",
        "| |   | |  | | | | |   | ' / ",
        "| |___| |__| |_| | |___| . \\ ",
        " \\____|_____\\___/ \\____|_|\\_\\"
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

