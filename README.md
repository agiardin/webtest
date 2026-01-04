# webtest

A flashcard app for learning and memorization built with Node.js and Express.

## What's Inside

This is a minimal Node.js web application that helps you study and memorize words using flashcards.

- **Node.js** runtime
- **Express** web framework
- Interactive flashcard interface
- Random word presentation
- Pass/Fail tracking
- Ready for Vercel deployment

## Features

- **Word Input**: Enter a list of words (one per line) that you want to study
- **Random Presentation**: Words are presented in random order to aid memorization
- **Pass/Fail Buttons**: Mark each word as you study it
- **Progress Tracking**: See which card you're on out of the total
- **Cycle Through Cards**: After going through all words, the deck resets automatically
- **Easy Navigation**: Return to the input screen anytime to change your word list

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

## Deploy to Vercel

You can deploy this app to Vercel's free tier in seconds:

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

## API Endpoints

- `GET /` - Flashcard app interface
- `GET /health` - Health check endpoint
