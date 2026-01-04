# webtest

A flashcard app for learning and memorization built with Node.js and Express, featuring user authentication and word list storage.

## What's Inside

This is a Node.js web application that helps you study and memorize words using flashcards with session-based storage.

- **Node.js** runtime
- **Express** web framework
- **In-memory storage** for development (serverless-compatible)
- Interactive flashcard interface
- User authentication system
- Word list storage
- Random word presentation with frequency tracking
- Pass/Fail tracking
- Ready for Vercel deployment

## Features

### Authentication
- **User Registration**: Create an account with username and password
- **Secure Login**: Session-based authentication with encrypted passwords
- **Persistent Sessions**: Stay logged in across browser sessions

### Word Management
- **Word Input**: Enter a list of words (one per line) that you want to study
- **Save Word Lists**: Save your word lists during your session
- **Auto-load**: Word lists automatically load when you log in
- **Persistent Storage**: Your word lists are saved even after closing the browser

### Flashcard System
- **Smart Presentation**: Words are presented based on frequency (words you struggle with appear more often)
- **Pass/Fail Buttons**: Mark each word as you study it
- **Adaptive Learning**: Failing a word increases its frequency, passing decreases it
- **Progress Tracking**: See frequency, active cards, and average frequency stats
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

4. **Create an account:**
   - Click "Sign Up" and create a username and password
   - Your data will be stored in memory during the session

**Note**: The current implementation uses in-memory storage, which means:
- Data persists during the server session
- Data is lost when the server restarts
- Suitable for development and testing

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

**Important for Vercel Deployment**: 
- The app uses in-memory storage compatible with serverless functions
- User data and word lists are stored in memory and reset on function cold starts
- For production use with persistent data, integrate with [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Vercel KV](https://vercel.com/docs/storage/vercel-kv), or an external database

**Note**: When deploying to production, make sure to set the `SESSION_SECRET` environment variable to a secure random string.

## API Endpoints

### Public
- `GET /` - Flashcard app interface
- `GET /health` - Health check endpoint

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - Login with username and password
- `POST /api/logout` - Logout and destroy session
- `GET /api/user` - Get current user information

### Word Lists
- `POST /api/wordlist/save` - Save word list (requires authentication)
- `GET /api/wordlist/load` - Load saved word list (requires authentication)

## Technology Stack

- **Backend**: Express.js with session-based authentication
- **Storage**: In-memory storage (serverless-compatible)
- **Security**: bcryptjs for password hashing
- **Session Management**: express-session with secure cookies

## Storage Notes

The current implementation uses in-memory storage for compatibility with serverless platforms like Vercel. This means:

- ✅ Works on Vercel's free tier without additional setup
- ✅ No database configuration needed
- ⚠️ Data resets when serverless functions restart (cold starts)
- ⚠️ Not suitable for production use with persistent data requirements

### For Production Use

To enable persistent data storage, you can integrate with:

1. **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)** - PostgreSQL database
2. **[Vercel KV](https://vercel.com/docs/storage/vercel-kv)** - Redis-compatible key-value store
3. **External Database** - MongoDB Atlas, PlanetScale, Supabase, etc.

Replace the `database.js` implementation with your chosen database adapter.
