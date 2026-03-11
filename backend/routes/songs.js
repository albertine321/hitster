const express = require("express");
const router = express.Router();
const db = require("../db");

// Hent en tilfeldig sang
router.get("/random", (req, res) => {
  db.query("SELECT * FROM songs ORDER BY RAND() LIMIT 1", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Hent alle sanger
router.get("/", (req, res) => {
  db.query("SELECT * FROM songs", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Lagre gjett og oppdater score
router.post("/guess", (req, res) => {
  const { song_id, guessed_year, session_id, correct } = req.body;

  // Lagre gjettet i session_songs
  db.query(
    "INSERT INTO session_songs (session_id, song_id, guessed_year, correct) VALUES (?, ?, ?, ?)",
    [session_id, song_id, guessed_year, correct ? 1 : 0],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Oppdater score og songs_played i game_sessions
      if (correct) {
        db.query(
          "UPDATE game_sessions SET score = score + 1, songs_played = songs_played + 1 WHERE id = ?",
          [session_id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
          }
        );
      } else {
        db.query(
          "UPDATE game_sessions SET songs_played = songs_played + 1, wrong = wrong + 1 WHERE id = ?",
          [session_id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
          }
        );
      }
    }
  );
});

module.exports = router;