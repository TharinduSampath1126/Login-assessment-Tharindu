const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const userData = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      token: jwt.sign({ email: payload.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    };
    
    res.json(userData);
  } catch (error) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

app.post('/auth/github', async (req, res) => {
  const { code } = req.body;

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      const userData = await userResponse.json();
      userData.token = jwt.sign({ login: userData.login }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      res.json(userData);
    } else {
      res.status(400).json({ error: 'Failed to get access token' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
