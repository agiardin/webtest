const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the plants directory
app.use('/plants', express.static('plants'));

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
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .app-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
        }
        .nav-bar {
            background: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 1.5rem;
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .nav-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        .nav-btn:hover {
            background: #5568d3;
        }
        .nav-btn.active {
            background: #764ba2;
            box-shadow: 0 4px 12px rgba(118, 75, 162, 0.4);
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            /* Add padding bottom for mobile keyboard */
            padding-bottom: 3rem;
        }
        h1 {
            font-size: 2rem;
            margin: 0 0 1.5rem 0;
            color: #333;
            text-align: center;
        }
        .page {
            display: none;
        }
        .page.active {
            display: block;
        }
        
        /* Testing Page Styles */
        .flashcard-section {
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
        
        /* Settings Section Styles */
        .settings-section {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }
        .settings-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 1rem;
        }
        .setting-item {
            margin-bottom: 1rem;
        }
        .setting-label {
            display: block;
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        .setting-description {
            display: block;
            color: #999;
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
            font-style: italic;
        }
        .slider-container {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .slider {
            flex: 1;
            height: 6px;
            border-radius: 3px;
            background: #ddd;
            outline: none;
            -webkit-appearance: none;
        }
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #667eea;
            cursor: pointer;
        }
        .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #667eea;
            cursor: pointer;
            border: none;
        }
        .slider-value {
            min-width: 50px;
            text-align: center;
            font-weight: 600;
            color: #667eea;
            font-size: 1.1rem;
        }
        
        /* Word List Management Styles */
        .word-list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        .add-word-section {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .add-word-input {
            flex: 1;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            /* Add scroll margin for mobile keyboards */
            scroll-margin-top: 20px;
            scroll-margin-bottom: 20px;
        }
        .add-word-input:focus {
            outline: none;
            border-color: #667eea;
        }
        .add-btn {
            background: #10b981;
            padding: 0.75rem 1.5rem;
        }
        .add-btn:hover {
            background: #059669;
        }
        .word-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .word-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            transition: transform 0.2s;
        }
        .word-item:hover {
            transform: translateX(5px);
        }
        .word-name {
            font-size: 1.1rem;
            font-weight: 600;
        }
        .word-stats {
            font-size: 0.85rem;
            color: #666;
            margin-left: 0.5rem;
        }
        .remove-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1.2rem;
            line-height: 1;
        }
        .remove-btn:hover {
            background: #dc2626;
        }
        .empty-message {
            text-align: center;
            color: #999;
            padding: 2rem;
            font-style: italic;
        }
        
        /* Progress Report Styles */
        .report-card {
            text-align: center;
            padding: 2rem;
        }
        .progress-circle {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 2rem auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
        }
        .progress-number {
            font-size: 3rem;
            font-weight: 700;
            line-height: 1;
        }
        .progress-label {
            font-size: 1rem;
            margin-top: 0.5rem;
        }
        .progress-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .stat-box {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
        }
        .stat-label {
            color: #666;
            margin-top: 0.5rem;
            font-size: 0.9rem;
        }
        
        /* Dopamine Garden Page Styles */
        .garden-container {
            text-align: center;
        }
        /* Grid layout: 4 columns (GRID_COLS) × 6 rows (GRID_ROWS) */
        .garden-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.75rem;
            max-width: 600px;
            margin: 1.5rem auto;
            padding: 0.5rem;
        }
        .garden-cell {
            aspect-ratio: 1;
            background: #f0f9ff;
            border: 3px solid #bfdbfe;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            transition: all 0.3s;
            position: relative;
        }
        .garden-cell:hover {
            background: #e0f2fe;
            border-color: #60a5fa;
            transform: scale(1.05);
        }
        .garden-cell.empty {
            background: #fefce8;
            border-color: #fde047;
            font-size: 2rem;
            color: #ca8a04;
        }
        .garden-cell .plant-size {
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 0.7rem;
            background: rgba(255, 255, 255, 0.9);
            padding: 2px 6px;
            border-radius: 10px;
            color: #666;
        }
        .plant-selector {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .plant-selector.active {
            display: block;
        }
        .plant-selector-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }
        .plant-selector-overlay.active {
            display: block;
        }
        .plant-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .plant-option {
            padding: 1rem;
            border: 3px solid #ddd;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            background: white;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .plant-option:hover {
            border-color: #667eea;
            transform: scale(1.05);
        }
        .garden-info {
            margin-top: 1rem;
            color: #666;
            font-size: 0.9rem;
        }
        .continue-btn {
            background: #10b981;
            margin-top: 1rem;
        }
        .continue-btn:hover {
            background: #059669;
        }
        
        /* Flame animation styles */
        .garden-cell.burning {
            animation: shake 0.3s infinite, burn 2s forwards;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-5px) rotate(-5deg); }
            75% { transform: translateX(5px) rotate(5deg); }
        }
        @keyframes burn {
            0% { 
                background: #f0f9ff;
                border-color: #bfdbfe;
            }
            30% {
                background: #fef3c7;
                border-color: #fbbf24;
            }
            60% {
                background: #fed7aa;
                border-color: #f97316;
            }
            100% {
                background: #fee2e2;
                border-color: #ef4444;
                opacity: 0;
                transform: scale(0.5);
            }
        }
        .garden-cell.burning::after {
            content: '🔥';
            position: absolute;
            font-size: 4rem;
            animation: flameFlicker 0.3s infinite;
        }
        @keyframes flameFlicker {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        /* Checkbox styles */
        .checkbox-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
        }
        .checkbox-container input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <nav class="nav-bar">
            <button class="nav-btn" onclick="showPage('testing', event)">📝 Testing</button>
            <button class="nav-btn active" onclick="showPage('wordlist', event)">⚙️ Settings</button>
            <button class="nav-btn" onclick="showPage('progress', event)">📊 Progress</button>
            <button class="nav-btn" onclick="showPage('dopamine', event)">🌱 Garden</button>
        </nav>
        
        <div class="container">
            <!-- Testing Page -->
            <div id="testingPage" class="page">
                <h1>📝 Testing</h1>
                
                <div class="flashcard-section">
                    <div id="noWordsMessage" class="empty-message">
                        No active words available. Please add words in the Word List page.
                    </div>
                    <div id="flashcardContent" style="display: none;">
                        <div class="flashcard">
                            <div class="word" id="currentWord"></div>
                        </div>
                        <div class="button-group">
                            <button class="pass-btn" onclick="nextWord('pass')">Great Job!</button>
                            <button class="fail-btn" onclick="nextWord('fail')">Try Again</button>
                        </div>
                        <p class="info" id="cardInfo"></p>
                    </div>
                </div>
            </div>
            
            <!-- Settings Page -->
            <div id="wordlistPage" class="page active">
                <h1>⚙️ Settings</h1>
                
                <!-- Settings Section -->
                <div class="settings-section">
                    <div class="settings-title">⚙️ Word Selection Settings</div>
                    <div class="setting-item">
                        <label class="setting-label">Word Selection Pool:</label>
                        <span class="setting-description">Control how many words are in the selection pool. Lower values focus more on difficult words, higher values give all words more equal chances.</span>
                        <div class="slider-container">
                            <input type="range" min="10" max="100" value="50" class="slider" id="poolPercentSlider" oninput="updatePoolPercent(this.value)">
                            <span class="slider-value" id="poolPercentDisplay">50%</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">Punishment Mode:</label>
                        <span class="setting-description">When enabled, a wrong answer will burn one of your garden plants. Use this to add consequences for mistakes!</span>
                        <label class="checkbox-container">
                            <input type="checkbox" id="punishModeCheckbox" onchange="updatePunishMode(this.checked)">
                            <span>Punish for wrong answers</span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">Auto-Advance:</label>
                        <span class="setting-description">Automatically return to the testing page after 3 seconds when you plant or grow a plant in the garden, or when a plant burns down from a wrong answer.</span>
                        <label class="checkbox-container">
                            <input type="checkbox" id="autoAdvanceCheckbox" onchange="updateAutoAdvance(this.checked)">
                            <span>Auto-advance from garden to testing</span>
                        </label>
                    </div>
                </div>
                
                <!-- Spaced Repetition Settings -->
                <div class="settings-section">
                    <div class="settings-title">📅 Spaced Repetition Settings</div>
                    <span class="setting-description">Configure how long to wait before showing a word again after a correct answer. Each bucket represents a stage of learning.</span>
                    <div class="setting-item">
                        <label class="setting-label">Bucket 0 (New Words):</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="number" min="0" max="365" value="1" id="bucket0Input" onchange="updateBucketDelay(0, this.value)" style="flex: 1; padding: 0.5rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;">
                            <span>days</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">Bucket 1 (Learning):</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="number" min="0" max="365" value="3" id="bucket1Input" onchange="updateBucketDelay(1, this.value)" style="flex: 1; padding: 0.5rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;">
                            <span>days</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">Bucket 2 (Familiar):</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="number" min="0" max="365" value="7" id="bucket2Input" onchange="updateBucketDelay(2, this.value)" style="flex: 1; padding: 0.5rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;">
                            <span>days</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">Bucket 3 (Mastered):</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="number" min="0" max="365" value="28" id="bucket3Input" onchange="updateBucketDelay(3, this.value)" style="flex: 1; padding: 0.5rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;">
                            <span>days</span>
                        </div>
                    </div>
                </div>
                
                <!-- Data Management Section -->
                <div class="settings-section">
                    <div class="settings-title">🔄 Data Management</div>
                    <div class="setting-item">
                        <label class="setting-label">Reset Options:</label>
                        <span class="setting-description">Clear your progress or garden. These actions cannot be undone!</span>
                        <div class="button-group">
                            <button onclick="resetWordStatistics()">Reset Word Statistics</button>
                            <button onclick="resetGarden()">Reset Garden</button>
                        </div>
                    </div>
                </div>
                
                <!-- Word List Selector Section -->
                <div class="settings-section">
                    <div class="settings-title">📚 Word Lists</div>
                    <div class="setting-item">
                        <label class="setting-label">Current Word List:</label>
                        <span class="setting-description">Select a word list to study. Each list has its own words and garden progress.</span>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            <select id="wordListSelector" onchange="switchToList(this.value)" style="flex: 1; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; cursor: pointer;">
                            </select>
                            <button onclick="createNewList()" style="background: #10b981; white-space: nowrap;">+ New List</button>
                        </div>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            <button onclick="renameCurrentList()" style="flex: 1;">✏️ Rename</button>
                            <button onclick="deleteCurrentList()" style="flex: 1; background: #ef4444;">🗑️ Delete</button>
                        </div>
                    </div>
                </div>
                
                <div class="add-word-section">
                    <input type="text" id="newWordInput" class="add-word-input" placeholder="Enter a new word..." onkeypress="if(event.key==='Enter')addWord()" onfocus="scrollInputIntoView(this)">
                    <button class="add-btn" onclick="addWord()">+ Add</button>
                </div>
                <ul class="word-list" id="wordListContainer">
                    <li class="empty-message">No words yet. Add some words above!</li>
                </ul>
            </div>
            
            <!-- Progress Report Page -->
            <div id="progressPage" class="page">
                <h1>📊 Progress Report</h1>
                <div class="report-card">
                    <div class="progress-circle">
                        <div class="progress-number" id="progressPercent">0%</div>
                        <div class="progress-label">Learned</div>
                    </div>
                    <div class="progress-details">
                        <div class="stat-box">
                            <div class="stat-value" id="learnedCount">0</div>
                            <div class="stat-label">Words Learned</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value" id="totalCount">0</div>
                            <div class="stat-label">Total Words</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value" id="activeCount">0</div>
                            <div class="stat-label">Active Words</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Dopamine Garden Page -->
            <div id="dopaminePage" class="page">
                <h1>🌱 Your Garden</h1>
                <div class="garden-container">
                    <p class="garden-info">✨ Great job! Click an empty spot to plant, or water a plant to help it grow!</p>
                    <div class="garden-grid" id="gardenGrid"></div>
                    <button class="continue-btn" onclick="continueTesting()">Continue Testing</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Plant Selector Modal -->
    <div class="plant-selector-overlay" id="plantSelectorOverlay" onclick="closePlantSelector()"></div>
    <div class="plant-selector" id="plantSelector">
        <h2 style="margin: 0 0 1rem 0; color: #333;">Choose a Plant</h2>
        <div class="plant-options" id="plantOptions"></div>
    </div>

    <script>
        let words = [];
        let currentWordObj = null;
        let currentPage = 'wordlist';
        let garden = [];
        let selectedCellIndex = null;
        let punishMode = false; // Whether to punish wrong answers by burning plants
        let gardenActionAllowed = false; // Whether a garden action is allowed for the current correct answer
        let autoAdvance = true; // Whether to auto-advance from garden to testing after 3 seconds
        let autoAdvanceTimeout = null; // Timeout for auto-advance
        
        // Word list management
        let wordLists = []; // Array of {id, name, words, garden}
        let currentListId = null; // ID of currently active list
        
        // Plant types with growth stages
        const PLANT_TYPES = {
            'sunflower': {
                name: 'Sunflower',
                stages: ['plants/sunflower-0.svg', 'plants/sunflower-1.svg', 'plants/sunflower-2.svg', 'plants/sunflower-3.svg']  // sprout, sapling, mature, flowering
            },
            'pine': {
                name: 'Pine Tree',
                stages: ['plants/pine-0.svg', 'plants/pine-1.svg', 'plants/pine-2.svg', 'plants/pine-3.svg']  // sprout, sapling, mature, with pinecones
            },
            'oak': {
                name: 'Oak Tree',
                stages: ['plants/oak-0.svg', 'plants/oak-1.svg', 'plants/oak-2.svg', 'plants/oak-3.svg']  // sprout, sapling, mature, full grown
            },
            'rose': {
                name: 'Rose Bush',
                stages: ['plants/rose-0.svg', 'plants/rose-1.svg', 'plants/rose-2.svg', 'plants/rose-3.svg']  // sprout, sapling, mature, flowering
            },
            'crepe': {
                name: 'Crepe Myrtle',
                stages: ['plants/crepe-0.svg', 'plants/crepe-1.svg', 'plants/crepe-2.svg', 'plants/crepe-3.svg']  // sprout, sapling, mature, flowering
            },
            'dogwood': {
                name: 'Dogwood Tree',
                stages: ['plants/dogwood-0.svg', 'plants/dogwood-1.svg', 'plants/dogwood-2.svg', 'plants/dogwood-3.svg']  // sprout, sapling, mature, flowering
            },
            'daisy': {
                name: 'Daisy',
                stages: ['plants/daisy-0.svg', 'plants/daisy-1.svg', 'plants/daisy-2.svg', 'plants/daisy-3.svg']  // sprout, sapling, mature, flowering
            },
            'queenanne': {
                name: "Queen Anne's Lace",
                stages: ['plants/queenanne-0.svg', 'plants/queenanne-1.svg', 'plants/queenanne-2.svg', 'plants/queenanne-3.svg']  // sprout, sapling, mature, flowering
            }
        };
        
        // Garden grid dimensions
        const GRID_COLS = 4;
        const GRID_ROWS = 6;
        const GRID_TOTAL_CELLS = GRID_COLS * GRID_ROWS;
        
        // Learning criteria constants
        const MIN_ATTEMPTS_FOR_LEARNED = 3;
        const MIN_ACCURACY_FOR_LEARNED = 0.8;
        
        // Spaced repetition bucket delays (in days)
        let bucketDelays = [1, 3, 7, 28]; // Default delays for buckets 0, 1, 2, 3
        const MAX_BUCKET = 3; // Final bucket index
        
        // Animation constants
        const BURN_ANIMATION_DURATION = 2000; // milliseconds, matches CSS animation
        const AUTO_ADVANCE_DELAY = 3000; // milliseconds, delay before auto-advancing from garden to testing
        
        // Word selection configuration
        let wordSelectionPoolPercent = 50; // Default to 50% of words in selection pool

        // Load saved data on page load
        window.addEventListener('DOMContentLoaded', () => {
            loadWordLists();
            loadSettings();
            updateAllViews();
        });

        // Page Navigation
        function showPage(pageName, event) {
            // Ensure we have the latest data from the current list
            loadCurrentList();
            
            // Clear any active auto-advance timer when navigating away from garden
            if (autoAdvanceTimeout) {
                clearTimeout(autoAdvanceTimeout);
                autoAdvanceTimeout = null;
            }
            
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Remove active class from all nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageName + 'Page').classList.add('active');
            
            // Add active class to clicked button if event is provided
            if (event && event.target) {
                event.target.classList.add('active');
            } else {
                // Fallback: find and activate the correct button based on pageName
                const buttons = document.querySelectorAll('.nav-btn');
                const buttonTexts = ['testing', 'wordlist', 'progress', 'dopamine'];
                const index = buttonTexts.indexOf(pageName);
                if (index !== -1 && buttons[index]) {
                    buttons[index].classList.add('active');
                }
            }
            
            currentPage = pageName;
            
            // Update views when switching pages
            if (pageName === 'testing') {
                updateTestingView();
            } else if (pageName === 'wordlist') {
                updateWordListView();
            } else if (pageName === 'progress') {
                updateProgressView();
            } else if (pageName === 'dopamine') {
                updateGardenView();
            }
        }

        // Data Management
        function loadWordLists() {
            const saved = localStorage.getItem('wordLists');
            const savedCurrentListId = localStorage.getItem('currentListId');
            
            if (saved) {
                // Load existing word lists structure
                wordLists = JSON.parse(saved);
                currentListId = savedCurrentListId;
                
                // Migrate words to new time-based structure if needed
                wordLists.forEach(list => {
                    if (list.words) {
                        list.words = list.words.map(word => migrateWord(word));
                    }
                });
                
                // Verify current list exists
                if (!wordLists.find(list => list.id === currentListId)) {
                    currentListId = wordLists.length > 0 ? wordLists[0].id : null;
                }
            } else {
                // Migration: Check for old single list format
                const oldWords = localStorage.getItem('flashcardWords');
                const oldGarden = localStorage.getItem('gardenData');
                
                if (oldWords || oldGarden) {
                    // Migrate old data to new format
                    const defaultList = {
                        id: 'list_' + Date.now(),
                        name: 'My Word List',
                        words: oldWords ? JSON.parse(oldWords).map(word => migrateWord(word)) : [],
                        garden: oldGarden ? JSON.parse(oldGarden) : Array(GRID_TOTAL_CELLS).fill(null)
                    };
                    wordLists = [defaultList];
                    currentListId = defaultList.id;
                    
                    // Clear old storage
                    localStorage.removeItem('flashcardWords');
                    localStorage.removeItem('gardenData');
                    
                    saveWordLists();
                } else {
                    // Create default list
                    const defaultList = {
                        id: 'list_' + Date.now(),
                        name: 'My Word List',
                        words: [],
                        garden: Array(GRID_TOTAL_CELLS).fill(null)
                    };
                    wordLists = [defaultList];
                    currentListId = defaultList.id;
                    saveWordLists();
                }
            }
            
            // Load current list data into global variables
            loadCurrentList();
        }
        
        // Migrate word from old structure to new time-based structure
        function migrateWord(word) {
            // If word already has new structure, return it
            if (word.hasOwnProperty('timesSeen') && word.hasOwnProperty('delayBucket') && word.hasOwnProperty('nextSeenDate')) {
                return word;
            }
            
            // Convert old structure to new
            const now = new Date();
            const migrated = {
                word: word.word,
                active: word.active !== undefined ? word.active : true,
                timesSeen: 0, // Reset to 0 for fresh start
                delayBucket: 0, // Start at bucket 0
                nextSeenDate: now.toISOString() // Available immediately
            };
            
            // Keep old data for reference (can be removed later)
            if (word.correct !== undefined) migrated.correct = word.correct;
            if (word.incorrect !== undefined) migrated.incorrect = word.incorrect;
            
            return migrated;
        }
        
        function loadCurrentList() {
            const currentList = wordLists.find(list => list.id === currentListId);
            if (currentList) {
                words = currentList.words;
                garden = currentList.garden || [];
                
                // Ensure garden is properly initialized
                if (garden.length !== GRID_TOTAL_CELLS) {
                    garden = Array(GRID_TOTAL_CELLS).fill(null);
                    // Copy any existing plants
                    if (currentList.garden) {
                        for (let i = 0; i < Math.min(currentList.garden.length, GRID_TOTAL_CELLS); i++) {
                            garden[i] = currentList.garden[i];
                        }
                    }
                }
            } else {
                words = [];
                garden = Array(GRID_TOTAL_CELLS).fill(null);
            }
        }
        
        function saveWordLists() {
            // Save current state back to current list
            const currentList = wordLists.find(list => list.id === currentListId);
            if (currentList) {
                currentList.words = words;
                currentList.garden = garden;
            }
            
            localStorage.setItem('wordLists', JSON.stringify(wordLists));
            localStorage.setItem('currentListId', currentListId);
        }
        
        function loadWords() {
            // This function is now handled by loadCurrentList
            loadCurrentList();
        }

        function saveWords() {
            saveWordLists();
        }
        
        // Garden Management
        function loadGarden() {
            // This function is now handled by loadCurrentList
            loadCurrentList();
        }
        
        function saveGarden() {
            saveWordLists();
        }
        
        function switchToList(listId) {
            // Save current list state before switching
            saveWordLists();
            
            // Switch to new list
            currentListId = listId;
            loadCurrentList();
            
            // Update all views
            updateAllViews();
        }
        
        function createNewList() {
            const listName = prompt('Enter a name for the new word list:');
            if (!listName || listName.trim() === '') {
                return;
            }
            
            const newList = {
                id: 'list_' + Date.now(),
                name: listName.trim(),
                words: [],
                garden: Array(GRID_TOTAL_CELLS).fill(null)
            };
            
            wordLists.push(newList);
            switchToList(newList.id);
        }
        
        function renameCurrentList() {
            const currentList = wordLists.find(list => list.id === currentListId);
            if (!currentList) return;
            
            const newName = prompt('Enter a new name for this word list:', currentList.name);
            if (!newName || newName.trim() === '') {
                return;
            }
            
            currentList.name = newName.trim();
            saveWordLists();
            updateWordListView();
        }
        
        function deleteCurrentList() {
            if (wordLists.length === 1) {
                alert('Cannot delete the last word list!');
                return;
            }
            
            const currentList = wordLists.find(list => list.id === currentListId);
            if (!currentList) return;
            
            if (!confirm(\`Are you sure you want to delete "\${currentList.name}"? This cannot be undone!\`)) {
                return;
            }
            
            // Remove the list
            wordLists = wordLists.filter(list => list.id !== currentListId);
            
            // Switch to first remaining list
            if (wordLists.length > 0) {
                switchToList(wordLists[0].id);
            }
        }
        
        function loadSettings() {
            const savedPoolPercent = localStorage.getItem('wordSelectionPoolPercent');
            if (savedPoolPercent !== null) {
                wordSelectionPoolPercent = parseInt(savedPoolPercent, 10);
            }
            // Update the slider if it exists
            const slider = document.getElementById('poolPercentSlider');
            if (slider) {
                slider.value = wordSelectionPoolPercent;
            }
            const display = document.getElementById('poolPercentDisplay');
            if (display) {
                display.textContent = wordSelectionPoolPercent + '%';
            }
            
            // Load punish mode setting
            const savedPunishMode = localStorage.getItem('punishMode');
            if (savedPunishMode !== null) {
                punishMode = savedPunishMode === 'true';
            }
            // Update the checkbox if it exists
            const checkbox = document.getElementById('punishModeCheckbox');
            if (checkbox) {
                checkbox.checked = punishMode;
            }
            
            // Load auto-advance setting
            const savedAutoAdvance = localStorage.getItem('autoAdvance');
            if (savedAutoAdvance !== null) {
                autoAdvance = savedAutoAdvance === 'true';
            }
            // Update the checkbox if it exists
            const autoAdvanceCheckbox = document.getElementById('autoAdvanceCheckbox');
            if (autoAdvanceCheckbox) {
                autoAdvanceCheckbox.checked = autoAdvance;
            }
            
            // Load bucket delays
            const savedBucketDelays = localStorage.getItem('bucketDelays');
            if (savedBucketDelays !== null) {
                bucketDelays = JSON.parse(savedBucketDelays);
            }
            // Update bucket delay inputs if they exist
            for (let i = 0; i <= MAX_BUCKET; i++) {
                const input = document.getElementById(`bucket${i}Input`);
                if (input) {
                    input.value = bucketDelays[i];
                }
            }
        }
        
        function saveSettings() {
            localStorage.setItem('wordSelectionPoolPercent', wordSelectionPoolPercent.toString());
            localStorage.setItem('punishMode', punishMode.toString());
            localStorage.setItem('autoAdvance', autoAdvance.toString());
            localStorage.setItem('bucketDelays', JSON.stringify(bucketDelays));
        }
        
        function updateBucketDelay(bucketIndex, value) {
            const days = parseInt(value, 10);
            if (isNaN(days) || days < 0 || days > 365) {
                alert('Please enter a valid number of days between 0 and 365');
                return;
            }
            bucketDelays[bucketIndex] = days;
            saveSettings();
        }
        
        function updatePoolPercent(value) {
            wordSelectionPoolPercent = parseInt(value, 10);
            document.getElementById('poolPercentDisplay').textContent = wordSelectionPoolPercent + '%';
            saveSettings();
        }
        
        function updatePunishMode(checked) {
            punishMode = checked;
            saveSettings();
        }
        
        function updateAutoAdvance(checked) {
            autoAdvance = checked;
            saveSettings();
        }
        
        // Word List Selector Management
        function updateWordListSelector() {
            const selector = document.getElementById('wordListSelector');
            if (!selector) return;
            
            selector.innerHTML = '';
            wordLists.forEach(list => {
                const option = document.createElement('option');
                option.value = list.id;
                option.textContent = list.name;
                if (list.id === currentListId) {
                    option.selected = true;
                }
                selector.appendChild(option);
            });
        }
        
        function updateGardenView() {
            const grid = document.getElementById('gardenGrid');
            grid.innerHTML = '';
            
            garden.forEach((cell, index) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = cell === null ? 'garden-cell empty' : 'garden-cell';
                cellDiv.onclick = () => cell === null ? selectPlant(index) : waterPlant(index);
                
                // Disable interaction if no action is allowed
                if (!gardenActionAllowed) {
                    cellDiv.style.cursor = 'not-allowed';
                    cellDiv.onclick = null;
                }
                
                // Disable interaction for plants at final stage (stage 3)
                if (cell !== null && cell.stage >= 3) {
                    cellDiv.style.cursor = 'not-allowed';
                    cellDiv.style.opacity = '0.7';
                    cellDiv.onclick = null;
                }
                
                if (cell === null) {
                    cellDiv.textContent = '+';
                } else {
                    // Get the current image for this plant's stage
                    const plantType = PLANT_TYPES[cell.type];
                    const stageIndex = Math.min(cell.stage, plantType.stages.length - 1);
                    const img = document.createElement('img');
                    img.src = plantType.stages[stageIndex];
                    img.alt = plantType.name + ' - Stage ' + (stageIndex + 1);
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'contain';
                    cellDiv.appendChild(img);
                    
                    // Show stage indicator with simple dots (stage 0=1 dot, stage 1=2 dots, stage 2=3 dots, stage 3=4 dots)
                    const stageSpan = document.createElement('span');
                    stageSpan.className = 'plant-size';
                    const dots = '•'.repeat(Math.max(1, Math.min(cell.stage + 1, 4)));
                    stageSpan.textContent = dots;
                    cellDiv.appendChild(stageSpan);
                }
                
                grid.appendChild(cellDiv);
            });
            
            // Update info message based on whether action is allowed
            const gardenInfo = document.querySelector('.garden-info');
            if (gardenInfo) {
                if (gardenActionAllowed) {
                    gardenInfo.textContent = '✨ Great job! Click an empty spot to plant, or water a plant to help it grow!';
                } else {
                    gardenInfo.textContent = '✅ Garden action completed! Click "Continue Testing" to answer more questions.';
                }
            }
        }
        
        function selectPlant(cellIndex) {
            if (!gardenActionAllowed) {
                return; // Don't allow action if already performed
            }
            
            selectedCellIndex = cellIndex;
            
            // Show plant selector
            const overlay = document.getElementById('plantSelectorOverlay');
            const selector = document.getElementById('plantSelector');
            const options = document.getElementById('plantOptions');
            
            options.innerHTML = '';
            Object.keys(PLANT_TYPES).forEach(plantKey => {
                const plant = PLANT_TYPES[plantKey];
                const plantDiv = document.createElement('div');
                plantDiv.className = 'plant-option';
                const img = document.createElement('img');
                img.src = plant.stages[3];
                img.alt = plant.name;
                img.style.width = '80px';
                img.style.height = '80px';
                img.style.objectFit = 'contain';
                img.style.marginBottom = '0.5rem';
                const nameDiv = document.createElement('div');
                nameDiv.style.fontSize = '0.8rem';
                nameDiv.textContent = plant.name;
                plantDiv.appendChild(img);
                plantDiv.appendChild(nameDiv);
                plantDiv.onclick = () => plantInCell(plantKey);
                options.appendChild(plantDiv);
            });
            
            overlay.classList.add('active');
            selector.classList.add('active');
        }
        
        function closePlantSelector() {
            document.getElementById('plantSelectorOverlay').classList.remove('active');
            document.getElementById('plantSelector').classList.remove('active');
            selectedCellIndex = null;
        }
        
        function plantInCell(plantType) {
            if (selectedCellIndex !== null) {
                garden[selectedCellIndex] = {
                    type: plantType,
                    stage: 0  // Start as tiny sprout
                };
                gardenActionAllowed = false; // Disable further actions after planting
                saveGarden();
                updateGardenView();
                closePlantSelector();
                
                // Start auto-advance timer if enabled
                if (autoAdvance) {
                    startAutoAdvanceTimer();
                }
            }
        }
        
        function waterPlant(cellIndex) {
            if (!gardenActionAllowed) {
                return; // Don't allow action if already performed
            }
            
            if (garden[cellIndex]) {
                const plant = garden[cellIndex];
                const plantType = PLANT_TYPES[plant.type];
                
                // Don't allow watering plants at final stage (stage 3)
                if (plant.stage >= 3) {
                    return;
                }
                
                // Progress to next stage (max stage is 3: 0=sprout, 1=sapling, 2=mature, 3=flowering)
                plant.stage++;
                
                gardenActionAllowed = false; // Disable further actions after watering
                saveGarden();
                updateGardenView();
                
                // Start auto-advance timer if enabled
                if (autoAdvance) {
                    startAutoAdvanceTimer();
                }
            }
        }
        
        function burnRandomPlant() {
            // Find all cells with plants
            const plantCells = garden.reduce((indices, cell, index) => {
                if (cell !== null) indices.push(index);
                return indices;
            }, []);
            
            if (plantCells.length === 0) {
                // No plants to burn, just continue
                return;
            }
            
            // Select a random plant
            const randomIndex = plantCells[Math.floor(Math.random() * plantCells.length)];
            
            // Get the cell element
            const grid = document.getElementById('gardenGrid');
            const cellDiv = grid.children[randomIndex];
            
            // Add burning animation
            cellDiv.classList.add('burning');
            
            // After animation completes, remove the plant
            setTimeout(() => {
                garden[randomIndex] = null;
                saveGarden();
                updateGardenView();
                
                // Start auto-advance timer if enabled
                if (autoAdvance) {
                    startAutoAdvanceTimer();
                }
            }, BURN_ANIMATION_DURATION);
        }
        
        function continueTesting() {
            // Clear any active auto-advance timer
            if (autoAdvanceTimeout) {
                clearTimeout(autoAdvanceTimeout);
                autoAdvanceTimeout = null;
            }
            gardenActionAllowed = false; // Reset for next time
            showPage('testing');
        }
        
        function startAutoAdvanceTimer() {
            // Clear any existing timer
            if (autoAdvanceTimeout) {
                clearTimeout(autoAdvanceTimeout);
            }
            
            // Set timer to auto-advance to testing page
            autoAdvanceTimeout = setTimeout(() => {
                continueTesting();
            }, AUTO_ADVANCE_DELAY);
        }

        function addWord() {
            const input = document.getElementById('newWordInput');
            const word = input.value.trim();
            
            if (!word) {
                alert('Please enter a word!');
                return;
            }
            
            // Check if word already exists
            if (words.find(w => w.word.toLowerCase() === word.toLowerCase())) {
                alert('This word already exists!');
                return;
            }
            
            // Add new word with time-based structure
            const now = new Date();
            words.push({
                word: word,
                active: true,
                timesSeen: 0,
                delayBucket: 0,
                nextSeenDate: now.toISOString()
            });
            
            input.value = '';
            saveWords();
            updateAllViews();
        }

        function removeWord(word) {
            const wordObj = words.find(w => w.word === word);
            if (wordObj) {
                wordObj.active = false;
                saveWords();
                updateAllViews();
            }
        }

        // Testing Page
        function updateTestingView() {
            const activeWords = words.filter(w => w.active);
            
            if (activeWords.length === 0) {
                document.getElementById('noWordsMessage').style.display = 'block';
                document.getElementById('flashcardContent').style.display = 'none';
                return;
            }
            
            document.getElementById('noWordsMessage').style.display = 'none';
            document.getElementById('flashcardContent').style.display = 'block';
            
            // Check if currentWordObj is valid for the current list
            if (!currentWordObj || !currentWordObj.active || !words.includes(currentWordObj)) {
                showNextWord();
            } else {
                updateCardInfo();
            }
        }

        function showNextWord() {
            const activeWords = words.filter(w => w.active);
            
            if (activeWords.length === 0) {
                updateTestingView();
                return;
            }
            
            const now = new Date();
            
            // Filter words that are due (nextSeenDate <= now)
            const dueWords = activeWords.filter(w => {
                const nextSeen = new Date(w.nextSeenDate);
                return nextSeen <= now;
            });
            
            // If no words are due, show the next word that will be due soonest
            let availableWords;
            if (dueWords.length === 0) {
                // Sort by nextSeenDate and take the earliest
                const sortedByDate = [...activeWords].sort((a, b) => {
                    return new Date(a.nextSeenDate) - new Date(b.nextSeenDate);
                });
                availableWords = [sortedByDate[0]];
            } else {
                availableWords = dueWords;
            }
            
            // Filter out current word to avoid showing the same word twice in a row
            let candidateWords = availableWords.filter(w => w !== currentWordObj);
            
            // If no other words available, use all available words
            if (candidateWords.length === 0) {
                candidateWords = availableWords;
            }
            
            // Select randomly from available words
            const randomIndex = Math.floor(Math.random() * candidateWords.length);
            currentWordObj = candidateWords[randomIndex];
            
            document.getElementById('currentWord').textContent = currentWordObj.word;
            updateCardInfo();
        }

        function updateCardInfo() {
            const activeWords = words.filter(w => w.active);
            const now = new Date();
            const dueWords = activeWords.filter(w => new Date(w.nextSeenDate) <= now);
            
            const bucketNames = ['New', 'Learning', 'Familiar', 'Mastered'];
            const bucketName = bucketNames[currentWordObj.delayBucket] || `Bucket ${currentWordObj.delayBucket}`;
            
            document.getElementById('cardInfo').textContent = 
                `This word: Seen ${currentWordObj.timesSeen} times, ${bucketName} | Active cards: ${activeWords.length} | Due now: ${dueWords.length}`;
        }

        function nextWord(result) {
            if (!currentWordObj) return;

            const now = new Date();
            const isFirstSeen = currentWordObj.timesSeen === 0;

            if (result === 'pass') {
                // Increment times seen
                currentWordObj.timesSeen++;
                
                if (isFirstSeen) {
                    // First time seeing the word: keep bucket 0, set nextSeenDate to now
                    currentWordObj.nextSeenDate = now.toISOString();
                } else {
                    // Not first time: increment bucket
                    currentWordObj.delayBucket++;
                    
                    // Check if we've reached the final bucket
                    if (currentWordObj.delayBucket > MAX_BUCKET) {
                        // Prompt user to remove from list
                        if (confirm(`Congratulations! You've mastered "${currentWordObj.word}"! Would you like to remove it from your active list?`)) {
                            removeWord(currentWordObj.word);
                            saveWords();
                            showNextWord();
                            return;
                        } else {
                            // Keep at max bucket
                            currentWordObj.delayBucket = MAX_BUCKET;
                        }
                    }
                    
                    // Set nextSeenDate to now + bucket delay
                    const delayDays = bucketDelays[currentWordObj.delayBucket];
                    const nextSeen = new Date(now);
                    nextSeen.setDate(nextSeen.getDate() + delayDays);
                    currentWordObj.nextSeenDate = nextSeen.toISOString();
                }
                
                saveWords();
                showNextWord(); // Select next word before showing garden
                gardenActionAllowed = true; // Allow one garden action for correct answer
                // Show dopamine page on correct answer
                showPage('dopamine');
            } else if (result === 'fail') {
                // Increment times seen
                currentWordObj.timesSeen++;
                
                // Set bucket to 0 and nextSeenDate to now (may be asked again immediately)
                currentWordObj.delayBucket = 0;
                currentWordObj.nextSeenDate = now.toISOString();
                
                saveWords();
                
                // If punish mode is enabled, show garden and burn a plant
                if (punishMode) {
                    showNextWord(); // Select next word before showing garden
                    showPage('dopamine');
                    burnRandomPlant();
                } else {
                    showNextWord();
                }
            }
        }

        // Word List Page
        function updateWordListView() {
            const container = document.getElementById('wordListContainer');
            
            // Initialize slider with saved value
            loadSettings();
            
            // Update word list selector
            updateWordListSelector();
            
            if (words.length === 0) {
                container.innerHTML = '<li class="empty-message">No words yet. Add some words above!</li>';
                return;
            }
            
            const activeWords = words.filter(w => w.active);
            
            if (activeWords.length === 0) {
                container.innerHTML = '<li class="empty-message">All words are disabled. Add new words above!</li>';
                return;
            }
            
            const now = new Date();
            
            // Sort words by nextSeenDate (due first at top) and then by bucket (lower buckets first)
            const sortedWords = [...activeWords].sort((a, b) => {
                const nextSeenA = new Date(a.nextSeenDate);
                const nextSeenB = new Date(b.nextSeenDate);
                
                // If both are due now, sort by bucket (lower bucket = needs more practice)
                if (nextSeenA <= now && nextSeenB <= now) {
                    return a.delayBucket - b.delayBucket;
                }
                
                // Otherwise sort by due date
                return nextSeenA - nextSeenB;
            });
            
            const bucketNames = ['New', 'Learning', 'Familiar', 'Mastered'];
            
            container.innerHTML = sortedWords.map(w => {
                const nextSeen = new Date(w.nextSeenDate);
                const isDue = nextSeen <= now;
                
                // Calculate color based on bucket level and due status
                let color;
                if (isDue) {
                    // Due words get more attention-grabbing colors based on bucket
                    if (w.delayBucket === 0) {
                        color = '#fee2e2'; // Light red for new/reset words
                    } else if (w.delayBucket === 1) {
                        color = '#fed7aa'; // Light orange for learning
                    } else {
                        color = '#fef3c7'; // Light yellow for familiar/mastered but due
                    }
                } else {
                    // Not due words get calm colors based on bucket
                    if (w.delayBucket === 0) {
                        color = '#e5e7eb'; // Gray
                    } else if (w.delayBucket === 1) {
                        color = '#dbeafe'; // Light blue
                    } else if (w.delayBucket === 2) {
                        color = '#dcfce7'; // Very light green
                    } else {
                        color = '#d1fae5'; // Light green
                    }
                }
                
                const bucketName = bucketNames[w.delayBucket] || `Bucket ${w.delayBucket}`;
                
                // Format next seen date
                let nextSeenText;
                if (isDue) {
                    nextSeenText = 'Due now';
                } else {
                    const diffMs = nextSeen - now;
                    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        nextSeenText = 'Due in 1 day';
                    } else {
                        nextSeenText = `Due in ${diffDays} days`;
                    }
                }
                
                return \`
                    <li class="word-item" style="background: \${color};">
                        <div>
                            <span class="word-name">\${w.word}</span>
                            <span class="word-stats">Seen \${w.timesSeen} times | \${bucketName} | \${nextSeenText}</span>
                        </div>
                        <button class="remove-btn" onclick="removeWord('\${w.word}')">✕</button>
                    </li>
                \`;
            }).join('');
        }

        // Progress Report Page
        function updateProgressView() {
            const activeWords = words.filter(w => w.active);
            // Consider a word "learned" if it has been seen at least 3 times and is at bucket 2 or higher
            const learnedWords = activeWords.filter(w => {
                return w.timesSeen >= MIN_ATTEMPTS_FOR_LEARNED && w.delayBucket >= 2;
            });
            
            const totalWords = activeWords.length;
            const learnedCount = learnedWords.length;
            const percentage = totalWords === 0 ? 0 : Math.round((learnedCount / totalWords) * 100);
            
            document.getElementById('progressPercent').textContent = percentage + '%';
            document.getElementById('learnedCount').textContent = learnedCount;
            document.getElementById('totalCount').textContent = totalWords;
            document.getElementById('activeCount').textContent = activeWords.length;
        }

        function updateAllViews() {
            updateWordListSelector();
            updateTestingView();
            updateWordListView();
            updateProgressView();
            updateGardenView();
        }
        
        // Reset Functions
        function resetGarden() {
            if (confirm('Are you sure you want to reset your garden? This will remove all plants and cannot be undone!')) {
                garden = Array(GRID_TOTAL_CELLS).fill(null);
                saveGarden();
                updateGardenView();
                alert('Garden has been reset successfully!');
            }
        }
        
        function resetWordStatistics() {
            if (confirm('Are you sure you want to reset all word statistics? This will reset all progress and cannot be undone!')) {
                const now = new Date();
                words.forEach(word => {
                    word.timesSeen = 0;
                    word.delayBucket = 0;
                    word.nextSeenDate = now.toISOString();
                    // Clean up old fields if they exist
                    delete word.correct;
                    delete word.incorrect;
                });
                saveWords();
                updateAllViews();
                alert('Word statistics have been reset successfully!');
            }
        }
        
        // Mobile keyboard handling - scroll input into view when focused
        function scrollInputIntoView(element) {
            // Delay to allow the mobile keyboard animation to complete before scrolling.
            // Most mobile browsers take 200-300ms to animate the keyboard appearance.
            const KEYBOARD_ANIMATION_DELAY = 300;
            setTimeout(() => {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
            }, KEYBOARD_ANIMATION_DELAY);
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
