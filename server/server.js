require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) {
      console.error('Error performing health check query:', err);
      res.status(500).send('Database connection error');
    } else {
      res.status(200).send('Database connected successfully ');
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*
// Endpoint to get specific users
app.get('/users', (req, res) => {
  const sql = "SELECT user_name, user_email, user_pwd FROM user_profiles WHERE (user_name = 'te' OR user_email = 'hailey@uwo.ca') AND user_pwd = 'testing123!'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Server error');
      return;
    }
    res.status(200).json(results);
  });
});
*/