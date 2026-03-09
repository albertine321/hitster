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

// Sjekk om gjettet år er riktig
router.post("/guess", (req, res) => {
  const { song_id, guessed_year, session_id } = req.body;

  db.query("SELECT year FROM songs WHERE id = ?", [song_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Sang ikke funnet" });

    const correctYear = results[0].year;
    const correct = guessed_year === correctYear;
    const diff = Math.abs(guessed_year - correctYear);

    // Lagre gjettet i session_songs
    db.query(
      "INSERT INTO session_songs (session_id, song_id, guessed_year, correct) VALUES (?, ?, ?, ?)",
      [session_id, song_id, guessed_year, correct],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Oppdater score hvis riktig
        if (correct) {
          db.query(
            "UPDATE game_sessions SET score = score + 1, songs_played = songs_played + 1 WHERE id = ?",
            [session_id]
          );
        } else {
          db.query(
            "UPDATE game_sessions SET songs_played = songs_played + 1 WHERE id = ?",
            [session_id]
          );
        }

        res.json({ correct, correctYear, diff });
      }
    );
  });
});

module.exports = router;