import styles from "../styles";

const COLORS = ["#f5c518", "#2ed573", "#ff4757", "#1e90ff"];

export default function StartScreen({ playerCount, setPlayerCount, playerNames, setPlayerNames, startGame, fetchHighscores }) {
  return (
    <div style={styles.bg}>
      <div style={styles.startCard}>
        <div style={styles.startIcon}>🎵</div>
        <h1 style={styles.startTitle}>HITSTER</h1>
        <p style={styles.startSub}>Plasser sangene i riktig rekkefølge på tidslinjen</p>

        <p style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>Antall spillere:</p>
        <div style={styles.playerCountRow}>
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              style={{ ...styles.countBtn, ...(playerCount === n ? styles.countBtnActive : {}) }}
              onClick={() => setPlayerCount(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          {Array.from({ length: playerCount }).map((_, i) => (
            <input
              key={i}
              style={{ ...styles.input, borderColor: `${COLORS[i]}44` }}
              placeholder={`Spiller ${i + 1} navn...`}
              value={playerNames[i]}
              onChange={(e) => {
                const updated = [...playerNames];
                updated[i] = e.target.value;
                setPlayerNames(updated);
              }}
            />
          ))}
        </div>

        <button style={styles.primaryBtn} onClick={startGame}>START SPILLET →</button>
        <button style={styles.highscoreBtn} onClick={fetchHighscores}>🏆 Se highscores</button>
      </div>
    </div>
  );
}