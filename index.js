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
        .save-btn {
            background: #10b981;
            margin-top: 1rem;
            width: 100%;
        }
        .save-btn:hover {
            background: #059669;
        }
        .save-message {
            color: #10b981;
            text-align: center;
            margin-top: 0.5rem;
            font-size: 0.9rem;
            display: none;
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
            <button class="save-btn" onclick="saveWordList()">💾 Save Word List</button>
            <div class="save-message" id="saveMessage">Saved!</div>
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

        // Load saved word list on page load
        window.addEventListener('DOMContentLoaded', () => {
            loadWordList();
        });

        function saveWordList() {
            const input = document.getElementById('wordInput').value.trim();
            if (input) {
                localStorage.setItem('flashcardWordList', input);
                const saveMessage = document.getElementById('saveMessage');
                saveMessage.style.display = 'block';
                setTimeout(() => {
                    saveMessage.style.display = 'none';
                }, 2000);
            } else {
                alert('Please enter some words to save!');
            }
        }

        function loadWordList() {
            const saved = localStorage.getItem('flashcardWordList');
            if (saved) {
                document.getElementById('wordInput').value = saved;
            }
        }

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
            words = wordList.map(word => ({
                word: word,
                frequency: 50
            }));

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
            document.getElementById('inputSection').style.display = 'block';
            document.getElementById('flashcardSection').style.display = 'none';
            words = [];
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
