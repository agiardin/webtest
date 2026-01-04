# webtest

A flashcard app for learning and memorization built with Node.js and Express, featuring browser localStorage for persistence.

## Features

### Word Management
- **Word Input**: Enter a list of words (one per line) that you want to study
- **Save to Browser**: Save your word lists locally in your browser  
- **Auto-load**: Word lists automatically load when you return
- **No login required**: Everything stored in your browser

### Flashcard System
- **Smart Presentation**: Words you struggle with appear more frequently
- **Pass/Fail Buttons**: Mark each word as you study it
- **Adaptive Learning**: Failing increases frequency, passing decreases it
- **Progress Tracking**: See frequency, active cards, and average frequency stats
- **Easy Navigation**: Return to input screen anytime to change your word list

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   npm start
   ```

3. **Visit the app:**
   Open your browser to `http://localhost:3000`

4. **Start studying:**
   - Enter your words (one per line)
   - Click "Save Word List" to save locally
   - Click "Start Flashcards" to begin

## Deploy to Vercel

Deploy this app to Vercel's free tier in seconds:

1. **Using Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Using Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import this repository
   - Deploy!

3. **One-Click Deploy:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/agiardin/webtest)

## Storage

- **Browser localStorage**: Word lists are saved in your browser
- **No server storage**: Everything stays on your device
- **Privacy**: Your data never leaves your browser
- **Cross-device**: Use different word lists on different devices

## API Endpoints

- `GET /` - Flashcard app interface
- `GET /health` - Health check endpoint

## Technology Stack

- **Backend**: Express.js (minimal server)
- **Storage**: Browser localStorage API
- **Frontend**: Vanilla JavaScript with adaptive learning algorithm
