# webtest

A simple Hello World web application for Vercel's free tier using Node.js and Express.

## What's Inside

This is a minimal Node.js web application that displays "Hello World!" with a beautiful gradient background.

- **Node.js** runtime
- **Express** web framework
- Ready for Vercel deployment

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

- `GET /` - Hello World page
- `GET /health` - Health check endpoint
