const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Flashcard App</h1>
        
        <div id="inputSection" class="input-section">
            <label for="wordInput">Enter words (one per line):</label>
            <textarea id="wordInput" placeholder="apple&#10;banana&#10;cherry&#10;date"></textarea>
            <button class="start-btn" onclick="startFlashcards()">Start Flashcards</button>
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
        let currentIndex = 0;
        let usedWords = [];

        function startFlashcards() {
            const input = document.getElementById('wordInput').value.trim();
            
            if (!input) {
                alert('Please enter at least one word!');
                return;
            }

            // Split by newlines and filter empty lines
            words = input.split('\\n')
                .map(w => w.trim())
                .filter(w => w.length > 0);

            if (words.length === 0) {
                alert('Please enter at least one word!');
                return;
            }

            usedWords = [];
            document.getElementById('inputSection').style.display = 'none';
            document.getElementById('flashcardSection').style.display = 'block';
            
            showRandomWord();
        }

        function showRandomWord() {
            if (usedWords.length === words.length) {
                // All words have been shown, reset
                usedWords = [];
            }

            // Get words that haven't been shown yet
            const availableWords = words.filter(w => !usedWords.includes(w));
            
            // Select a random word from available words
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            const selectedWord = availableWords[randomIndex];
            
            usedWords.push(selectedWord);
            
            document.getElementById('currentWord').textContent = selectedWord;
            document.getElementById('cardInfo').textContent = 
                \`Card \${usedWords.length} of \${words.length}\`;
        }

        function nextWord(result) {
            // In the future, we could track pass/fail results here
            showRandomWord();
        }

        function backToInput() {
            document.getElementById('inputSection').style.display = 'block';
            document.getElementById('flashcardSection').style.display = 'none';
            words = [];
            usedWords = [];
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
