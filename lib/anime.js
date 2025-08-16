const axios = require("axios");

// Cari anime lewat Jikan API
async function cariAnime(judul) {
  try {
    const res = await axios.get("https://api.jikan.moe/v4/anime", {
      params: { q: judul, limit: 3 }
    });
    return res.data.data; // array hasil pencarian
  } catch (err) {
    console.error("Error Jikan:", err.response?.data || err.message);
    return [];
  }
}

module.exports = { cariAnime };
