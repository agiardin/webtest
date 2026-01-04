const express = require('express');
const session = require('express-session');
const database = require('./database');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'flashcard-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Authentication endpoints
app.post('/api/signup', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const existingUser = database.users.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const user = database.users.create(username, password);
    req.session.userId = user.id;
    req.session.username = user.username;
    
    res.json({ success: true, username: user.username });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = database.users.findByUsername(username);
    if (!user || !database.users.verifyPassword(user, password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    req.session.userId = user.id;
    req.session.username = user.username;
    
    res.json({ success: true, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.json({ success: true });
  });
});

app.get('/api/user', (req, res) => {
  if (req.session.userId) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Word list endpoints
app.post('/api/wordlist/save', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { words } = req.body;
    if (!words || !Array.isArray(words)) {
      return res.status(400).json({ error: 'Invalid word list' });
    }
    
    database.wordLists.save(req.session.userId, words);
    res.json({ success: true });
  } catch (error) {
    console.error('Save word list error:', error);
    res.status(500).json({ error: 'Error saving word list' });
  }
});

app.get('/api/wordlist/load', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const words = database.wordLists.load(req.session.userId);
    res.json({ words: words || [] });
  } catch (error) {
    console.error('Load word list error:', error);
    res.status(500).json({ error: 'Error loading word list' });
  }
});

// Serve the flashcard app page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flashcard App</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 600px;
            width: 90%;
        }
        h1 {
            font-size: 2rem;
            margin: 0 0 1.5rem 0;
            color: #333;
            text-align: center;
        }
        .input-section {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
            font-weight: 500;
        }
        textarea {
            width: 100%;
            min-height: 120px;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-family: inherit;
            font-size: 1rem;
            resize: vertical;
            box-sizing: border-box;
        }
        textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.3s;
        }
        button:hover {
            background: #5568d3;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .start-btn {
            width: 100%;
        }
        .flashcard-section {
            display: none;
            text-align: center;
        }
        .flashcard {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            min-height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .word {
            font-size: 2.5rem;
            font-weight: 700;
        }
        .button-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        .pass-btn {
            background: #10b981;
        }
        .pass-btn:hover {
            background: #059669;
        }
        .fail-btn {
            background: #ef4444;
        }
        .fail-btn:hover {
            background: #dc2626;
        }
        .info {
            color: #666;
            font-size: 0.9rem;
            margin-top: 1rem;
        }
        .back-btn {
            background: #6b7280;
            margin-top: 1rem;
            width: 100%;
        }
        .back-btn:hover {
            background: #4b5563;
        }
        .auth-section {
            display: none;
        }
        .auth-section input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-family: inherit;
            font-size: 1rem;
            box-sizing: border-box;
            margin-bottom: 1rem;
        }
        .auth-section input:focus {
            outline: none;
            border-color: #667eea;
        }
        .auth-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .auth-tab {
            flex: 1;
            padding: 0.75rem;
            background: #f3f4f6;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.3s;
        }
        .auth-tab.active {
            background: #667eea;
            color: white;
        }
        .error-message {
            color: #ef4444;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: none;
        }
        .user-info {
            display: none;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            background: #f3f4f6;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        .user-info span {
            font-weight: 600;
            color: #667eea;
        }
        .logout-btn {
            background: #6b7280;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }
        .logout-btn:hover {
            background: #4b5563;
        }
        .save-btn {
            background: #10b981;
            width: 100%;
            margin-top: 1rem;
        }
        .save-btn:hover {
            background: #059669;
        }
        .save-status {
            color: #10b981;
            font-size: 0.9rem;
            text-align: center;
            margin-top: 0.5rem;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Flashcard App</h1>
        
        <!-- User Info Section -->
        <div id="userInfo" class="user-info">
            <span id="usernameDisplay"></span>
            <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
        
        <!-- Authentication Section -->
        <div id="authSection" class="auth-section">
            <div class="auth-tabs">
                <button class="auth-tab active" onclick="showAuthTab('login')">Login</button>
                <button class="auth-tab" onclick="showAuthTab('signup')">Sign Up</button>
            </div>
            
            <div id="authError" class="error-message"></div>
            
            <div id="loginForm">
                <input type="text" id="loginUsername" placeholder="Username" />
                <input type="password" id="loginPassword" placeholder="Password" />
                <button class="start-btn" onclick="login()">Login</button>
            </div>
            
            <div id="signupForm" style="display: none;">
                <input type="text" id="signupUsername" placeholder="Username" />
                <input type="password" id="signupPassword" placeholder="Password (min 6 characters)" />
                <button class="start-btn" onclick="signup()">Sign Up</button>
            </div>
        </div>
        
        <div id="inputSection" class="input-section">
            <label for="wordInput">Enter words (one per line):</label>
            <textarea id="wordInput" placeholder="apple&#10;banana&#10;cherry&#10;date"></textarea>
            <button class="start-btn" onclick="startFlashcards()">Start Flashcards</button>
            <button class="save-btn" onclick="saveWordList()" id="saveBtn" style="display: none;">💾 Save Word List</button>
            <div id="saveStatus" class="save-status">Saved!</div>
        </div>
        </div>
        
        <div id="flashcardSection" class="flashcard-section">
            <div class="flashcard">
                <div class="word" id="currentWord"></div>
            </div>
            <div class="button-group">
                <button class="pass-btn" onclick="nextWord('pass')">✓ Pass</button>
                <button class="fail-btn" onclick="nextWord('fail')">✗ Fail</button>
            </div>
            <p class="info" id="cardInfo"></p>
            <button class="back-btn" onclick="backToInput()">← Back to Input</button>
        </div>
    </div>

    <script>
        let words = [];
        let currentWordObj = null;
        let currentUser = null;

        // Check authentication status on page load
        async function checkAuth() {
            try {
                const response = await fetch('/api/user');
                if (response.ok) {
                    const data = await response.json();
                    currentUser = data.username;
                    showAuthenticatedUI();
                    await loadWordList();
                } else {
                    showUnauthenticatedUI();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                showUnauthenticatedUI();
            }
        }

        function showAuthenticatedUI() {
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('userInfo').style.display = 'flex';
            document.getElementById('inputSection').style.display = 'block';
            document.getElementById('usernameDisplay').textContent = 'Logged in as ' + currentUser;
            document.getElementById('saveBtn').style.display = 'block';
        }

        function showUnauthenticatedUI() {
            document.getElementById('authSection').style.display = 'block';
            document.getElementById('userInfo').style.display = 'none';
            document.getElementById('inputSection').style.display = 'none';
            document.getElementById('flashcardSection').style.display = 'none';
        }

        function showAuthTab(tab) {
            const tabs = document.querySelectorAll('.auth-tab');
            tabs.forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
            
            if (tab === 'login') {
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('signupForm').style.display = 'none';
            } else {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('signupForm').style.display = 'block';
            }
            document.getElementById('authError').style.display = 'none';
        }

        async function login() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    currentUser = data.username;
                    showAuthenticatedUI();
                    await loadWordList();
                } else {
                    showError(data.error || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Network error. Please try again.');
            }
        }

        async function signup() {
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;
            
            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }
            
            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }
            
            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    currentUser = data.username;
                    showAuthenticatedUI();
                } else {
                    showError(data.error || 'Signup failed');
                }
            } catch (error) {
                console.error('Signup error:', error);
                showError('Network error. Please try again.');
            }
        }

        async function logout() {
            try {
                await fetch('/api/logout', { method: 'POST' });
                currentUser = null;
                words = [];
                currentWordObj = null;
                document.getElementById('wordInput').value = '';
                showUnauthenticatedUI();
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        async function saveWordList() {
            if (!currentUser) {
                alert('Please log in to save your word list');
                return;
            }
            
            // Get words from textarea if words array is empty
            let wordsToSave = words;
            if (words.length === 0) {
                const input = document.getElementById('wordInput').value.trim();
                if (input) {
                    const wordList = input.split('\\n')
                        .map(w => w.trim())
                        .filter(w => w.length > 0);
                    wordsToSave = wordList.map(word => ({
                        word: word,
                        frequency: 50
                    }));
                }
            }
            
            try {
                const response = await fetch('/api/wordlist/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ words: wordsToSave })
                });
                
                if (response.ok) {
                    const saveStatus = document.getElementById('saveStatus');
                    saveStatus.style.display = 'block';
                    setTimeout(() => {
                        saveStatus.style.display = 'none';
                    }, 2000);
                } else {
                    alert('Error saving word list');
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Network error. Please try again.');
            }
        }

        async function loadWordList() {
            if (!currentUser) return;
            
            try {
                const response = await fetch('/api/wordlist/load');
                if (response.ok) {
                    const data = await response.json();
                    if (data.words && data.words.length > 0) {
                        words = data.words;
                        // Display words in the textarea
                        const wordTexts = words.map(w => w.word).join('\\n');
                        document.getElementById('wordInput').value = wordTexts;
                    }
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        function showError(message) {
            const errorDiv = document.getElementById('authError');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        // Initialize auth on page load
        checkAuth();

        function startFlashcards() {
            const input = document.getElementById('wordInput').value.trim();
            
            if (!input) {
                alert('Please enter at least one word!');
                return;
            }

            // Split by newlines and filter empty lines
            const wordList = input.split('\\n')
                .map(w => w.trim())
                .filter(w => w.length > 0);

            if (wordList.length === 0) {
                alert('Please enter at least one word!');
                return;
            }

            // Initialize words with frequency property (default 50)
            // But preserve existing frequency data if words haven't changed
            const existingWords = words.map(w => w.word);
            const newWords = wordList.filter(w => !existingWords.includes(w));
            const removedWords = existingWords.filter(w => !wordList.includes(w));
            
            if (newWords.length > 0 || removedWords.length > 0 || words.length === 0) {
                // Words have changed, reinitialize
                words = wordList.map(word => ({
                    word: word,
                    frequency: 50
                }));
            }

            document.getElementById('inputSection').style.display = 'none';
            document.getElementById('flashcardSection').style.display = 'block';
            
            showNextWord();
        }

        function showNextWord() {
            // Get words with frequency > 0, excluding the current word
            let availableWords = words.filter(w => w.frequency > 0 && w !== currentWordObj);
            
            // If no other words are available, check if only the current word has frequency > 0
            if (availableWords.length === 0) {
                // Check if the current word still has frequency > 0
                if (currentWordObj && currentWordObj.frequency > 0) {
                    // Only the current word is available, keep showing it
                    availableWords = [currentWordObj];
                } else {
                    // No words with frequency > 0
                    alert('All words have frequency 0. No words to display!');
                    backToInput();
                    return;
                }
            }

            // Find the maximum frequency
            const maxFrequency = Math.max(...availableWords.map(w => w.frequency));
            
            // Get all words with the maximum frequency
            const highestFrequencyWords = availableWords.filter(w => w.frequency === maxFrequency);
            
            // If there are multiple words with the same highest frequency, pick one randomly
            const randomIndex = Math.floor(Math.random() * highestFrequencyWords.length);
            currentWordObj = highestFrequencyWords[randomIndex];
            
            document.getElementById('currentWord').textContent = currentWordObj.word;
            updateCardInfo();
        }

        function updateCardInfo() {
            const activeWords = words.filter(w => w.frequency > 0);
            const avgFrequency = activeWords.length > 0 
                ? Math.round(activeWords.reduce((sum, w) => sum + w.frequency, 0) / activeWords.length)
                : 0;
            
            document.getElementById('cardInfo').textContent = 
                \`Frequency: \${currentWordObj.frequency} | Active cards: \${activeWords.length}/\${words.length} | Avg frequency: \${avgFrequency}\`;
        }

        function nextWord(result) {
            if (!currentWordObj) return;

            if (result === 'pass') {
                // Decrease frequency by 50% (rounded down to ensure we can reach 0)
                currentWordObj.frequency = Math.floor(currentWordObj.frequency * 0.5);
            } else if (result === 'fail') {
                // Increase frequency by 5%, capped at 100 (rounded up to ensure we can increase from 1)
                currentWordObj.frequency = Math.min(100, Math.ceil(currentWordObj.frequency * 1.05));
            }

            showNextWord();
        }

        function backToInput() {
            // Auto-save word list before going back
            if (currentUser && words.length > 0) {
                saveWordList();
            }
            document.getElementById('inputSection').style.display = 'block';
            document.getElementById('flashcardSection').style.display = 'none';
            currentWordObj = null;
        }
    </script>
</body>
</html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
