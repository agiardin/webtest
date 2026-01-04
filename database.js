const bcrypt = require('bcryptjs');

// In-memory storage for serverless compatibility
// NOTE: Data will be lost on serverless function restart
// For production, use a persistent database like Vercel Postgres or external DB
const users = new Map(); // Map<userId, user>
const usersByUsername = new Map(); // Map<username, user> for lookup
const wordLists = new Map(); // Map<userId, wordList>
let userIdCounter = 1;
let wordListIdCounter = 1;

// User operations
const userOperations = {
  create: (username, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = {
      id: userIdCounter++,
      username,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };
    users.set(user.id, user);
    usersByUsername.set(username, user);
    return { id: user.id, username: user.username };
  },

  findByUsername: (username) => {
    return usersByUsername.get(username);
  },

  findById: (userId) => {
    return users.get(userId);
  },

  verifyPassword: (user, password) => {
    return bcrypt.compareSync(password, user.password);
  }
};

// Word list operations
const wordListOperations = {
  save: (userId, words) => {
    const wordList = {
      id: wordListIdCounter++,
      user_id: userId,
      words: JSON.stringify(words),
      updated_at: new Date().toISOString()
    };
    wordLists.set(userId, wordList);
    return { id: wordList.id };
  },

  load: (userId) => {
    const wordList = wordLists.get(userId);
    return wordList ? JSON.parse(wordList.words) : null;
  }
};

module.exports = {
  users: userOperations,
  wordLists: wordListOperations
};
