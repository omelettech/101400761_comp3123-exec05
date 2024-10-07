const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

// Middleware to parse JSON body
app.use(bodyParser.json());


router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});


router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});


router.get('/profile', (req, res) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user data' });
    }

    if (!data) {
      return res.status(500).json({ message: 'User data is empty or corrupted' });
    }

    try {
      const user = JSON.parse(data);
      res.json(user);
    } catch (parseError) {
      return res.status(500).json({ message: 'Error parsing user data' });
    }
  });
});


router.get('/login', (req, res) => {
  fs.readFile(path.join(__dirname, 'login.html'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user data' });
    }

    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: 'Username and password are required',
      });
    }

    if (!data) {
      return res.status(500).json({ message: 'User data is empty or corrupted' });
    }

    let user;
    try {
      user = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({ message: 'Error parsing user data' });
    }

    // Check if the username matches
    if (user.username !== username) {
      return res.json({
        status: false,
        message: 'Username is invalid',
      });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.json({
        status: false,
        message: 'Password is invalid',
      });
    }

    // If both username and password match
    return res.json({
      status: true,
      message: 'User is valid',
    });
  });
});


router.get('/logout', (req, res) => {
  const username = req.query.username;

  if (username) {
    res.send(`<b>${username} successfully logged out.</b>`);
  } else {
    res.send('<b>Error: Username is required to log out.</b>');
  }
});


app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('<h1>Server Error</h1>');
});

app.use('/', router);

// Start the server
app.listen(process.env.port || 8081, () => {
  console.log('Web Server is listening at port ' + (process.env.port || 8081));
});
