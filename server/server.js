
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const users = {
  admin: '$2b$10$HkfxfIy9Y12mky4p7kyIxOS6BqOhgD5Z5TmjD/jtUfm.rOszobbSu' // bcrypt hash for 'password'
};

const virtualFS = {
  'home': {
    'documents': {
      'note.txt': 'This is a sample note.'
    },
    'images': {}
  }
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && bcrypt.compareSync(password, users[username])) {
    req.session.user = username;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/fs/*', (req, res) => {
  console.log('Received request for path:', req.params[0]);
  console.log('Session:', req.session);
  if (!req.session.user) {
    console.log('User not authenticated');
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const path = req.params[0].split('/').filter(Boolean);
  console.log('Parsed path:', path);
  let current = virtualFS;
  for (let dir of path) {
    if (current[dir] === undefined) {
      console.log('Path not found:', dir);
      return res.status(404).json({ success: false, message: 'Path not found' });
    }
    current = current[dir];
  }
  console.log('Returning directory contents:', current);
  res.json({ success: true, data: current });
});

app.get('/file/*', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const filePath = req.params[0].split('/');
  let current = virtualFS;
  for (let i = 0; i < filePath.length - 1; i++) {
    if (current[filePath[i]] === undefined) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    current = current[filePath[i]];
  }
  const fileName = filePath[filePath.length - 1];
  if (typeof current[fileName] !== 'string') {
    return res.status(400).json({ success: false, message: 'Not a file' });
  }
  res.json({ success: true, content: current[fileName] });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// const session = require('express-session');
// const bcrypt = require('bcrypt');
// const path = require('path');

// const app = express();
// const port = 3000;

// app.use(express.json());
// app.use(express.static(path.join(__dirname, '../public')));
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true
// }));

// const users = {
//   admin: '$2b$10$HkfxfIy9Y12mky4p7kyIxOS6BqOhgD5Z5TmjD/jtUfm.rOszobbSu' // Replace with a bcrypt hash of the actual password
// };

// const virtualFS = {
//   'home': {
//     'documents': {
//       'note.txt': 'This is a sample note.'
//     },
//     'images': {}
//   }
// };

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if (users[username] && bcrypt.compareSync(password, users[username])) {
//     req.session.user = username;
//     res.json({ success: true });
//   } else {
//     res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }
// });

// app.get('/fs/*', (req, res) => {
//   console.log('Received request for path:', req.params[0]);
//   if (!req.session.user) {
//     console.log('User not authenticated');
//     return res.status(401).json({ success: false, message: 'Not authenticated' });
//   }
  
//   const path = req.params[0].split('/').filter(Boolean);
//   console.log('Parsed path:', path);
//   let current = virtualFS;
//   for (let dir of path) {
//     if (current[dir] === undefined) {
//       console.log('Path not found:', dir);
//       return res.status(404).json({ success: false, message: 'Path not found' });
//     }
//     current = current[dir];
//   }
//   console.log('Returning directory contents:', current);
//   res.json({ success: true, data: current });
// });

// app.get('/file/*', (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ success: false, message: 'Not authenticated' });
//   }
  
//   const filePath = req.params[0].split('/');
//   let current = virtualFS;
//   for (let i = 0; i < filePath.length - 1; i++) {
//     if (current[filePath[i]] === undefined) {
//       return res.status(404).json({ success: false, message: 'File not found' });
//     }
//     current = current[filePath[i]];
//   }
//   const fileName = filePath[filePath.length - 1];
//   if (typeof current[fileName] !== 'string') {
//     return res.status(400).json({ success: false, message: 'Not a file' });
//   }
//   res.json({ success: true, content: current[fileName] });
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// // ... existing code ...

// let currentPath = '/home';
// let isLoggedIn = false;

// async function login(username, password) {
//   const response = await fetch('/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password })
//   });
//   const data = await response.json();
//   if (data.success) {
//     isLoggedIn = true;
//     output('Login successful. Welcome to the virtual file system!');
//     // Hide login form, show terminal
//   } else {
//     output('Login failed. Please try again.');
//   }
// }

// async function fetchDirectory(path) {
//   if (!isLoggedIn) {
//     output('Please login first.');
//     return;
//   }
//   const response = await fetch(`/fs${path}`);
//   const data = await response.json();
//   if (data.success) {
//     return data.data;
//   } else {
//     output(data.message);
//     return null;
//   }
// }

// // Update your existing command handlers to use these new functions
// // For example:

// async function handleLs() {
//   const directory = await fetchDirectory(currentPath);
//   if (directory) {
//     output(Object.keys(directory).join('\n'));
//   }
// }

// async function handleCd(args) {
//   const newPath = path.join(currentPath, args[0]);
//   const directory = await fetchDirectory(newPath);
//   if (directory) {
//     currentPath = newPath;
//     output(`Changed directory to ${currentPath}`);
//   }
// }

// // ... rest of your existing code ...