import styles from "../styles";

export default function Highscores({ highscores, setScreen }){

    return (
      <div style={styles.bg}>
        <div style={styles.startCard}>
          <h1 style={styles.startTitle}>🏆 HIGHSCORES</h1>
          <p style={styles.startSub}>Topp 10 spillere</p>
          {highscores.length === 0 ? (
            <p style={{ color: "#666", marginBottom: 24 }}>Ingen scores ennå!</p>
          ) : (
            <div style={styles.hsTable}>
              <div style={styles.hsHeader}>
                <span style={{ width: 32 }}>#</span>
                <span style={{ flex: 1 }}>Navn</span>
                <span style={{ width: 60, textAlign: "right" }}>Score</span>
                <span style={{ width: 60, textAlign: "right" }}>Sanger</span>
                <span style={{ width: 50, textAlign: "right", color: "#e94560" }}>Feil</span>
              </div>
              {highscores.map((h, i) => (
                <div key={i} style={{ ...styles.hsRow, ...(i === 0 ? styles.hsRowFirst : {}) }}>
                  <span style={{ width: 32, color: i === 0 ? "#f5c518" : "#666" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </span>
                  <span style={{ flex: 1, color: "#fff" }}>{h.player_name}</span>
                  <span style={{ width: 60, textAlign: "right", color: "#f5c518", fontWeight: 700 }}>{h.score}</span>
                  <span style={{ width: 60, textAlign: "right", color: "#666", fontSize: 12 }}>{h.songs_played}</span>
                  <span style={{ width: 50, textAlign: "right", color: "#e94560" }}>{h.wrong}</span>
                </div>
              ))}
            </div>
          )}
          <button style={styles.highscoreBtn} onClick={() => setScreen("start")}>← Tilbake</button>
        </div>
      </div>
    );
  }