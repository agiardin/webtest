const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Initialize database
const db = new Database(path.join(__dirname, 'flashcards.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS word_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    words TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// User operations
const userOperations = {
  create: (username, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const info = stmt.run(username, hashedPassword);
    return { id: info.lastInsertRowid, username };
  },

  findByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  verifyPassword: (user, password) => {
    return bcrypt.compareSync(password, user.password);
  }
};

// Word list operations
const wordListOperations = {
  save: (userId, words) => {
    // Delete existing word list for this user, then insert new one
    const deleteStmt = db.prepare('DELETE FROM word_lists WHERE user_id = ?');
    deleteStmt.run(userId);
    
    const insertStmt = db.prepare('INSERT INTO word_lists (user_id, words, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    const info = insertStmt.run(userId, JSON.stringify(words));
    return { id: info.lastInsertRowid };
  },

  load: (userId) => {
    const stmt = db.prepare('SELECT words FROM word_lists WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1');
    const result = stmt.get(userId);
    return result ? JSON.parse(result.words) : null;
  }
};

module.exports = {
  db,
  users: userOperations,
  wordLists: wordListOperations
};
