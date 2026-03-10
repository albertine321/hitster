import { useState } from "react";

const API = "http://localhost:3003";

export default function App() {
  const [screen, setScreen] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [trashCards, setTrashCards] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seenIds, setSeenIds] = useState([]); // alle sanger som er vist, riktig eller feil

  const fetchSong = async (excludeIds) => {
    setLoading(true);
    setFeedback(null);
    let song = null;
    let attempts = 0;
    while (!song && attempts < 15) {
      const res = await fetch(`${API}/api/songs/random`);
      const data = await res.json();
      if (!excludeIds.includes(data.id)) song = data;
      attempts++;
    }
    setCurrentCard(song);
    setLoading(false);
  };

  const startGame = async () => {
    if (!playerName.trim()) return;
    await fetch(`${API}/api/scores/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player_name: playerName }),
    });

    // Hent ankerkort
    let anchor = null;
    while (!anchor) {
      const r = await fetch(`${API}/api/songs/random`);
      anchor = await r.json();
    }

    const newSeenIds = [anchor.id];
    setTimeline([anchor]);
    setSeenIds(newSeenIds);
    setScreen("game");
    setRound(1);

    // Hent første spillkort
    setLoading(true);
    let song = null;
    let attempts = 0;
    while (!song && attempts < 15) {
      const r = await fetch(`${API}/api/songs/random`);
      const d = await r.json();
      if (!newSeenIds.includes(d.id)) song = d;
      attempts++;
    }
    setCurrentCard(song);
    setLoading(false);
  };

  const placeCard = (slotIndex) => {
    if (!currentCard || feedback) return;

    const sorted = [...timeline].sort((a, b) => a.year - b.year);
    const cardYear = currentCard.year;
    const beforeCard = sorted[slotIndex - 1];
    const afterCard = sorted[slotIndex];

    const correct =
      (!beforeCard || beforeCard.year <= cardYear) &&
      (!afterCard || afterCard.year >= cardYear);

    // Marker sangen som sett uansett
    const newSeenIds = [...seenIds, currentCard.id];
    setSeenIds(newSeenIds);

    if (correct) {
      const newTimeline = [...sorted];
      newTimeline.splice(slotIndex, 0, currentCard);
      setTimeline(newTimeline);
      setScore((s) => s + 1);
      setFeedback({ correct: true, message: `✅ Riktig! "${currentCard.title}" er fra ${currentCard.year}` });
    } else {
      setTrashCards((t) => [...t, currentCard]);
      setFeedback({ correct: false, message: `❌ Feil! "${currentCard.title}" er fra ${currentCard.year}` });
    }
    setRound((r) => r + 1);
  };

  const nextCard = () => {
    fetchSong(seenIds);
    setFeedback(null);
  };

  const slotCount = timeline.length + 1;

  if (screen === "start") {
    return (
      <div style={styles.bg}>
        <div style={styles.startCard}>
          <div style={styles.startIcon}>🎵</div>
          <h1 style={styles.startTitle}>HITSTER</h1>
          <p style={styles.startSub}>Plasser sangene i riktig rekkefølge på tidslinjen</p>
          <input
            style={styles.input}
            placeholder="Ditt navn..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startGame()}
          />
          <button style={styles.primaryBtn} onClick={startGame}>START SPILLET →</button>
        </div>
      </div>
    );
  }

  if (screen === "result") {
    return (
      <div style={styles.bg}>
        <div style={styles.startCard}>
          <div style={styles.startIcon}>🏆</div>
          <h1 style={styles.startTitle}>FERDIG!</h1>
          <p style={styles.startSub}>
            {playerName} fikk <strong style={{ color: "#f5c518" }}>{score}</strong> av <strong style={{ color: "#f5c518" }}>{round - 1}</strong> riktige
          </p>
          <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 24 }}>
            <p style={{ color: "#777", fontSize: 13, marginBottom: 10 }}>Din tidslinje:</p>
            {timeline.map((s) => (
              <div key={s.id} style={styles.resultRow}>
                <span style={{ color: "#f5c518", fontWeight: 700, minWidth: 44 }}>{s.year}</span>
                <span style={{ color: "#fff" }}>{s.title}</span>
                <span style={{ color: "#666", fontSize: 12, marginLeft: 8 }}>– {s.artist}</span>
              </div>
            ))}
          </div>
          <button style={styles.primaryBtn} onClick={() => window.location.reload()}>SPILL IGJEN</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.gameBg}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerName}>👤 {playerName}</span>
        <span style={styles.headerLogo}>🎵 HITSTER</span>
        <span style={styles.headerScore}>⭐ {score} poeng</span>
      </div>

      {/* Timeline */}
      <div style={styles.timelineWrapper}>
        <div style={styles.timelineScroll}>
          {/* Linje bak kortene */}
          <div style={styles.timelineLine} />

          {Array.from({ length: slotCount }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {/* Drop slot */}
              {!feedback && (
                <div
                  style={{
                    ...styles.slot,
                    ...(dragOverSlot === i ? styles.slotActive : {}),
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOverSlot(i); }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={() => { setDragOverSlot(null); placeCard(i); }}
                  onClick={() => placeCard(i)}
                >
                  <div style={{ ...styles.slotInner, ...(dragOverSlot === i ? styles.slotInnerActive : {}) }}>
                    {dragOverSlot === i ? "▼" : "+"}
                  </div>
                </div>
              )}

              {/* Kort på tidslinjen */}
              {i < timeline.length && (
                <div style={styles.tlCard}>
                  <div style={styles.tlCardStripe} />
                  <div style={styles.tlCardYear}>{timeline[i].year}</div>
                  <div style={styles.tlCardTitle}>{timeline[i].title}</div>
                  <div style={styles.tlCardArtist}>{timeline[i].artist}</div>
                  <div style={styles.tlCardGenre}>{timeline[i].genre}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Spillkort / Feedback */}
      <div style={styles.center}>
        {loading ? (
          <p style={{ color: "#666" }}>Laster sang...</p>
        ) : feedback ? (
          <div style={{
            ...styles.feedbackBox,
            borderColor: feedback.correct ? "#2ed573" : "#e94560",
            background: feedback.correct ? "rgba(46,213,115,0.08)" : "rgba(233,69,96,0.08)",
          }}>
            <p style={{ color: "#fff", fontSize: 17, marginBottom: 20 }}>{feedback.message}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button style={styles.primaryBtn} onClick={nextCard}>Neste sang →</button>
              <button style={styles.ghostBtn} onClick={() => setScreen("result")}>Avslutt</button>
            </div>
          </div>
        ) : currentCard ? (
          <div style={{ textAlign: "center" }}>
            <p style={styles.hint}>Klikk eller dra kortet til riktig sted på tidslinjen</p>
            <div style={styles.playCard} draggable onDragStart={() => {}}>
              <div style={styles.playCardBadge}>?</div>
              <div style={styles.playCardTitle}>{currentCard.title}</div>
              <div style={styles.playCardArtist}>{currentCard.artist}</div>
              <div style={styles.playCardDivider} />
              <div style={styles.playCardGenre}>{currentCard.genre}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Søppelkasse */}
      {trashCards.length > 0 && (
        <div style={styles.trash}>
          <span style={styles.trashTitle}>🗑️ Feil ({trashCards.length})</span>
          <div style={styles.trashList}>
            {trashCards.map((c, i) => (
              <div key={i} style={styles.trashChip}>
                <span style={{ color: "#e94560", fontWeight: 700, marginRight: 6 }}>{c.year}</span>{c.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a14 0%, #150a25 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Georgia, serif",
  },
  startCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(245,197,24,0.15)",
    borderRadius: 24,
    padding: "56px 48px",
    maxWidth: 420,
    width: "90%",
    textAlign: "center",
  },
  startIcon: { fontSize: 52, marginBottom: 10 },
  startTitle: { fontSize: 48, fontWeight: 900, color: "#f5c518", letterSpacing: 8, marginBottom: 6 },
  startSub: { color: "#666", fontSize: 14, marginBottom: 28, lineHeight: 1.7 },
  input: {
    width: "100%",
    padding: "13px 18px",
    borderRadius: 10,
    border: "1px solid rgba(245,197,24,0.25)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 15,
    marginBottom: 14,
    outline: "none",
    fontFamily: "Georgia, serif",
    boxSizing: "border-box",
  },
  primaryBtn: {
    padding: "13px 28px",
    background: "#f5c518",
    color: "#000",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: 1.5,
    cursor: "pointer",
    width: "100%",
  },
  ghostBtn: {
    padding: "13px 28px",
    background: "transparent",
    color: "#666",
    border: "1px solid #333",
    borderRadius: 10,
    fontSize: 14,
    cursor: "pointer",
  },
  gameBg: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a0a14 0%, #150a25 100%)",
    fontFamily: "Georgia, serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    borderBottom: "1px solid rgba(245,197,24,0.1)",
    background: "rgba(0,0,0,0.4)",
  },
  headerName: { color: "#666", fontSize: 13 },
  headerLogo: { color: "#f5c518", fontSize: 20, fontWeight: 900, letterSpacing: 4 },
  headerScore: { color: "#f5c518", fontSize: 13, fontWeight: 700 },

  // Timeline
  timelineWrapper: {
    overflowX: "auto",
    padding: "28px 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  timelineScroll: {
    display: "flex",
    alignItems: "center",
    minWidth: "max-content",
    position: "relative",
    paddingBottom: 4,
  },
  timelineLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    background: "rgba(245,197,24,0.1)",
    transform: "translateY(-50%)",
    zIndex: 0,
    pointerEvents: "none",
  },

  // Slot
  slot: {
    width: 44,
    height: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    zIndex: 1,
  },
  slotInner: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "2px dashed rgba(245,197,24,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,197,24,0.3)",
    fontSize: 16,
    fontWeight: 700,
    transition: "all 0.15s",
  },
  slotInnerActive: {
    border: "2px dashed #f5c518",
    color: "#f5c518",
    background: "rgba(245,197,24,0.1)",
    transform: "scale(1.2)",
  },
  slotActive: {},

  // Timeline kort
  tlCard: {
    background: "linear-gradient(160deg, #1c1c35 0%, #251540 100%)",
    border: "1px solid rgba(245,197,24,0.3)",
    borderRadius: 12,
    padding: "14px 16px",
    minWidth: 120,
    maxWidth: 140,
    flexShrink: 0,
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    zIndex: 1,
    margin: "0 4px",
  },
  tlCardStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, #f5c518, #e6a800)",
    borderRadius: "12px 12px 0 0",
  },
  tlCardYear: {
    color: "#f5c518",
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 6,
    marginTop: 4,
  },
  tlCardTitle: {
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tlCardArtist: {
    color: "#777",
    fontSize: 10,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom: 4,
  },
  tlCardGenre: {
    color: "rgba(245,197,24,0.5)",
    fontSize: 9,
    fontStyle: "italic",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Spillkort
  center: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  hint: {
    color: "#555",
    fontSize: 12,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  playCard: {
    background: "linear-gradient(160deg, #f5c518 0%, #d4a017 100%)",
    borderRadius: 16,
    padding: "32px 40px",
    width: 240,
    textAlign: "center",
    cursor: "grab",
    boxShadow: "0 20px 60px rgba(245,197,24,0.2), 0 4px 16px rgba(0,0,0,0.4)",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",
  },
  playCardBadge: {
    fontSize: 48,
    fontWeight: 900,
    color: "rgba(0,0,0,0.12)",
    marginBottom: 10,
    lineHeight: 1,
  },
  playCardTitle: {
    fontSize: 19,
    fontWeight: 900,
    color: "#1a0a00",
    marginBottom: 5,
    lineHeight: 1.2,
  },
  playCardArtist: {
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
    marginBottom: 12,
  },
  playCardDivider: {
    height: 1,
    background: "rgba(0,0,0,0.1)",
    marginBottom: 10,
  },
  playCardGenre: {
    fontSize: 11,
    color: "rgba(0,0,0,0.4)",
    fontStyle: "italic",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Feedback
  feedbackBox: {
    border: "1px solid",
    borderRadius: 16,
    padding: "28px 36px",
    textAlign: "center",
    maxWidth: 400,
    width: "90%",
  },

  // Søppel
  trash: {
    borderTop: "1px solid rgba(233,69,96,0.15)",
    padding: "12px 24px",
    background: "rgba(233,69,96,0.03)",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    flexWrap: "wrap",
  },
  trashTitle: { color: "#e94560", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", paddingTop: 4 },
  trashList: { display: "flex", gap: 8, flexWrap: "wrap" },
  trashChip: {
    background: "rgba(233,69,96,0.08)",
    border: "1px solid rgba(233,69,96,0.2)",
    borderRadius: 20,
    padding: "3px 12px",
    fontSize: 12,
    color: "#bbb",
  },

  resultRow: {
    display: "flex",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    fontSize: 13,
    gap: 4,
  },
};