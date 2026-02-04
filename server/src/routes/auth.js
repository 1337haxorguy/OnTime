const { auth } = require('express-openid-connect');
const express = require('express');
const router = express.Router();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_KEY,
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID || '3o6VYphfSiCRq86dmuTe9N3XOBbEIEW6',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-ni8q0awoq86bppws.us.auth0.com',
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL || 'http://localhost:5173'
  }
};

router.use(auth(config));

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

router.get('/', (req, res) => {
  res.redirect(CLIENT_URL);
});

router.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;
