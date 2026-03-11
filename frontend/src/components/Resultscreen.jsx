import styles from "../styles";

export default function Resultscreen({ players, fetchHighscores }) {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    return (
      <div style={styles.bg}>
        <div style={styles.startCard}>
          <div style={styles.startIcon}>🏆</div>
          <h1 style={styles.startTitle}>FERDIG!</h1>
          <div style={{ marginBottom: 24 }}>
            {sorted.map((p, i) => (
              <div key={i} style={{ ...styles.resultPlayerRow, borderColor: `${p.color}44` }}>
                <span style={{ fontSize: 20 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎵"}</span>
                <span style={{ flex: 1, color: "#fff", fontWeight: i === 0 ? 700 : 400 }}>{p.name}</span>
                <span style={{ color: p.color, fontWeight: 700 }}>{p.score} poeng</span>
                <span style={{ color: "#666", fontSize: 12, marginLeft: 8 }}>{p.songsPlayed} sanger</span>
              </div>
            ))}
          </div>
          <button style={styles.primaryBtn} onClick={() => window.location.reload()}>SPILL IGJEN</button>
          <button style={styles.highscoreBtn} onClick={fetchHighscores}>🏆 Se highscores</button>
        </div>
      </div>
    );
  }