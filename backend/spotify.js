/*const axios = require("axios");

let accessToken = null;
let tokenExpiry = null;

// Hent access token fra Spotify
async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = res.data.access_token;
  tokenExpiry = Date.now() + res.data.expires_in * 1000;
  return accessToken;
}

// Søk opp en sang og hent preview URL
async function getPreviewUrl(title, artist) {
  const token = await getAccessToken();
  const query = encodeURIComponent(`track:${title} artist:${artist}`);

  const res = await axios.get(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const tracks = res.data.tracks.items;
  if (tracks.length === 0) return null;

  return tracks[0].preview_url;
}

module.exports = { getPreviewUrl };*/