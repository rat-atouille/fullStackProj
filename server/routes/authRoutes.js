const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const session = require('express-session');
const router = express.Router();

const saltRounds = 10; 
const secret_key = process.env.SECRET_KEY;

// Initialize session middleware
router.use(session({
  secret: secret_key, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production if using HTTPS
}));

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: No user logged in' });
  }
};

// login
router.post('/login_user', (req, res) => {
  const { id, password } = req.body;

  const checkUserQuery = "SELECT * FROM user_profiles WHERE (user_name = ? OR user_email = ?)";
  const lastLoginQuery = "UPDATE user_profiles SET last_login = ? WHERE (user_name = ? OR user_email = ?)";

  db.query(checkUserQuery, [id, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Server error' });
      return;
    }

    if (result.length > 0) {
      const user = result[0];
      const hash_pass = user.user_pwd;; // hashed password
      bcrypt.compare(password, hash_pass, (err, isMatch) => {
        if (err) {
          res.status(500).json({ error: 'Server error' });
          return;
        } if (isMatch) {
          // passwords match
          // update recent login time
          const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // DATETIME format
          db.query(lastLoginQuery, [timestamp, id, id], (err) => {
            if (err) {
              res.status(500).json({ error: 'Server error' });
              return;
            }
            // Send user data to the frontend
            req.session.user = user;
            res.status(200).json({ username: user.user_name });
          });  
        } else {
          // passwords don't match 
          res.status(401).json({ error: 'Invalid password' });
        }
      });
    } else {
      res.status(404).json({ error: 'Invalid username' });
    };
  });
});

// register
router.post('/add_user', (req, res) => {
  const { username, email, password } = req.body;

  const checkUsername = "SELECT * FROM user_profiles WHERE user_name = ?";
  const checkEmail = "SELECT * FROM user_profiles WHERE user_email = ?";

  // Check if username already exists
  db.query(checkUsername, [username], (err, usernameResult) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error 1' });
      return;
    }

    if (usernameResult.length > 0) {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      // Check if email already exists
      db.query(checkEmail, [email], (err, emailResult) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Server error 2' });
          return;
        }

        if (emailResult.length > 0) {
          res.status(409).json({ error: 'Email already exists' });
        } else {
          // If both username and email are unique, hash the password
          bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Error hashing password' });
              return;
            }
            // Store the hashed password
            const timestamp = new Date().toISOString().slice(0, 10);  // DATE format
            const insertUserQuery = "INSERT INTO user_profiles (user_name, user_email, acc_created, user_pwd) VALUES (?, ?, ?, ?)";

            db.query(insertUserQuery, [username, email, timestamp, hash], (err, insertResult) => {
              if (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error 3' });
                return;
              }
              console.log('User created:', insertResult);
              res.status(201).json({ success: 'User registered successfully' });
            });
          });
        }
      });
    }
  });
});

// log out
router.post('/logout_user', (req, res) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ error: 'Logout failed' });
      } else {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
      }
    });
  } else {
    res.status(400).json({ error: 'No user logged in' });
  }
});

// check if logged in
router.get('/check_login', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

module.exports = router;