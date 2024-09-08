const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.static('public'));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Root directory for the virtual file system
const ROOT_DIR = path.join(__dirname, 'vfs');

// Ensure the root directory exists
fs.mkdir(ROOT_DIR, { recursive: true }).catch(console.error);

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Authentication required' });
  }
}

// File system operations
async function listDirectory(dirPath) {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  return items.reduce((acc, item) => {
    acc[item.name] = item.isDirectory() ? 'directory' : 'file';
    return acc;
  }, {});
}

async function readFile(filePath) {
  return fs.readFile(filePath, 'utf-8');
}

async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, 'utf-8');
}

async function createDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function deleteItem(itemPath) {
  const stats = await fs.stat(itemPath);
  if (stats.isDirectory()) {
    await fs.rmdir(itemPath, { recursive: true });
  } else {
    await fs.unlink(itemPath);
  }
}

async function renameItem(oldPath, newPath) {
  await fs.rename(oldPath, newPath);
}

async function getFileInfo(filePath) {
  const stats = await fs.stat(filePath);
  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
    isDirectory: stats.isDirectory()
  };
}

// API routes
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // For demonstration purposes, we'll use a simple check
    // In a real application, you should use proper authentication
    if (username === 'admin' && password === 'password') {
        req.session.user = { username };
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/fs/*', requireAuth, async (req, res) => {
  try {
    const requestedPath = path.join(ROOT_DIR, req.params[0] || '');
    const contents = await listDirectory(requestedPath);
    res.json({ success: true, data: contents });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/file/*', requireAuth, async (req, res) => {
  try {
    const filePath = path.join(ROOT_DIR, req.params[0]);
    const content = await readFile(filePath);
    res.json({ success: true, content });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/file/*', requireAuth, async (req, res) => {
  try {
    const filePath = path.join(ROOT_DIR, req.params[0]);
    await writeFile(filePath, req.body.content);
    res.json({ success: true, message: 'File created/updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/directory/*', requireAuth, async (req, res) => {
  try {
    const dirPath = path.join(ROOT_DIR, req.params[0]);
    await createDirectory(dirPath);
    res.json({ success: true, message: 'Directory created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/fs/*', requireAuth, async (req, res) => {
  try {
    const itemPath = path.join(ROOT_DIR, req.params[0]);
    await deleteItem(itemPath);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/fs/*', requireAuth, async (req, res) => {
  try {
    const oldPath = path.join(ROOT_DIR, req.params[0]);
    const newPath = path.join(ROOT_DIR, req.body.newPath);
    await renameItem(oldPath, newPath);
    res.json({ success: true, message: 'Item renamed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/info/*', requireAuth, async (req, res) => {
  try {
    const itemPath = path.join(ROOT_DIR, req.params[0]);
    const info = await getFileInfo(itemPath);
    res.json({ success: true, info });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Import file
app.post('/import', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { filename, path: tempPath } = req.file;
    const targetPath = path.join(ROOT_DIR, filename);
    await fs.rename(tempPath, targetPath);
    res.json({ success: true, message: 'File imported successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Export file
app.get('/export/*', requireAuth, async (req, res) => {
  try {
    const filePath = path.join(ROOT_DIR, req.params[0]);
    res.download(filePath);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});