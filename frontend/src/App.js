import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:3003";

function App() {
  const [screen, setScreen] = useState("start"); // start | game | result
  const [playerName, setPlayerName] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [song, setSong] = useState(null);
  const [guessedYear, setGuessedYear] = useState(1990);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [songsPlayed, setSongsPlayed] = useState(0);
  const [highscores, setHighscores] = useState([]);

  // Start spill
  const startGame = async () => {
    if (!playerName.trim()) return alert("Skriv inn navnet ditt!");

    const res = await fetch(`${API}/api/scores/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player_name: playerName }),
    });
    const data = await res.json();
    setSessionId(data.session_id);
    setScreen("game");
    fetchSong();
  };

  // Hent tilfeldig sang
  const fetchSong = async () => {
    setFeedback(null);
    const res = await fetch(`${API}/api/songs/random`);
    const data = await res.json();
    setSong(data);
    setGuessedYear(1990);
  };

  // Send gjett
  const submitGuess = async () => {
    const res = await fetch(`${API}/api/songs/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_id: song.id,
        guessed_year: guessedYear,
        session_id: sessionId,
      }),
    });
    const data = await res.json();
    setFeedback(data);
    if (data.correct) setScore((s) => s + 1);
    setSongsPlayed((s) => s + 1);
  };

  // Hent highscores
  const fetchHighscores = async () => {
    const res = await fetch(`${API}/api/scores/highscores`);
    const data = await res.json();
    setHighscores(data);
    setScreen("result");
  };

  if (screen === "start") {
    return (
      <div className="container">
        <h1>🎵 Hitster</h1>
        <p>Gjett hvilket år sangen ble utgitt!</p>
        <input
          type="text"
          placeholder="Skriv inn navnet ditt"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={startGame}>Start spill</button>
      </div>
    );
  }

  if (screen === "game") {
    return (
      <div className="container">
        <div className="score-bar">
          <span>👤 {playerName}</span>
          <span>⭐ {score} / {songsPlayed}</span>
        </div>

        {song && (
          <div className="song-card">
            <h2>{song.title}</h2>
            <p>{song.artist}</p>
            <p className="genre">{song.genre}</p>
          </div>
        )}

        {!feedback ? (
          <div className="guess-section">
            <h3>Hvilket år ble sangen utgitt?</h3>
            <input
              type="range"
              min="1960"
              max="2024"
              value={guessedYear}
              onChange={(e) => setGuessedYear(Number(e.target.value))}
            />
            <div className="year-display">{guessedYear}</div>
            <button onClick={submitGuess}>Gjett!</button>
          </div>
        ) : (
          <div className={`feedback ${feedback.correct ? "correct" : "wrong"}`}>
            {feedback.correct ? (
              <h3>✅ Riktig! Sangen er fra {feedback.correctYear}</h3>
            ) : (
              <h3>❌ Feil! Sangen er fra {feedback.correctYear} (du gjettet {guessedYear}, {feedback.diff} år unna)</h3>
            )}
            <div className="buttons">
              <button onClick={fetchSong}>Neste sang →</button>
              <button className="secondary" onClick={fetchHighscores}>Avslutt</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (screen === "result") {
    return (
      <div className="container">
        <h1>🏆 Spillet er over!</h1>
        <p>{playerName} fikk <strong>{score}</strong> av <strong>{songsPlayed}</strong> riktige!</p>

        <h2>Highscores</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Navn</th>
              <th>Score</th>
              <th>Sanger</th>
            </tr>
          </thead>
          <tbody>
            {highscores.map((h, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{h.player_name}</td>
                <td>{h.score}</td>
                <td>{h.songs_played}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => { setScreen("start"); setScore(0); setSongsPlayed(0); }}>
          Spill igjen
        </button>
      </div>
    );
  }
}

export default App;