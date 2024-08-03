const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());

// Initialize the Spotify API
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5173/callback'
});

app.get('/login', (req, res) => {
    const scopes = ['user-top-read'];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    console.log('Authorize URL:', authorizeURL);
    res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    console.log('Authorization code received:', code);

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        res.send('Authorization successful! Check the console for the refresh token.');
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.send('Error getting tokens.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Go to http://localhost:3000/login to authenticate');
});
