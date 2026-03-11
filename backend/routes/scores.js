const express = require("express");
const router = express.Router();
const db = require("../db");

// Start en ny spilløkt
router.post("/session", (req, res) => {
  const { player_name } = req.body;
  if (!player_name) return res.status(400).json({ error: "player_name mangler" });

  db.query(
    "INSERT INTO game_sessions (player_name) VALUES (?)",
    [player_name],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ session_id: results.insertId, player_name });
    }
  );
});

// Hent highscore-liste (topp 10)
router.get("/highscores", (req, res) => {
  db.query(
    "SELECT player_name, score, songs_played, wrong, created_at FROM game_sessions ORDER BY score DESC LIMIT 10",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Hent en spesifikk økt
router.get("/session/:id", (req, res) => {
  db.query(
    "SELECT * FROM game_sessions WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: "Økt ikke funnet" });
      res.json(results[0]);
    }
  );
});

module.exports = router;