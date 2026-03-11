import styles from "../styles";

export default function GameScreen({ players, currentPlayerIndex, currentCard, feedback, dragOverSlot, setDragOverSlot, loading, trashCards, round, placeCard, nextTurn, setScreen, selectedTrash, setSelectedTrash }) {  
  const currentPlayer = players[currentPlayerIndex];
  const slotCount = currentPlayer ? currentPlayer.timeline.length + 1 : 0;  

if (!currentPlayer) return null;

    
    return (
    <div style={styles.gameBg}>
      {/* Header */}
        <div style={styles.header}>
        <span style={styles.headerLogo}>🎵 HITSTER</span>
        <span style={{ color: "#ccc", fontSize: 15, fontWeight: 600 }}>Runde {round}</span>
        <button style={styles.endBtn} onClick={() => setScreen("result")}>Avslutt ✕</button>
        </div>


      {/* Spillerpoeng */}
      <div style={styles.playerBar}>
        {players.map((p, i) => (
          <div key={i} style={{
            ...styles.playerChip,
            borderColor: i === currentPlayerIndex ? p.color : "rgba(255,255,255,0.05)",
            background: i === currentPlayerIndex ? `${p.color}15` : "transparent",
          }}>
            <span style={{ color: i === currentPlayerIndex ? p.color : "#555", fontSize: 12, fontWeight: i === currentPlayerIndex ? 700 : 400 }}>
              {i === currentPlayerIndex ? "▶ " : ""}{p.name}
            </span>
            <span style={{ color: p.color, fontWeight: 700, fontSize: 14 }}>{p.score}⭐</span>
          </div>
        ))}
      </div>

      {/* Tur-indikator */}
      <div style={{ ...styles.turnBanner, borderColor: currentPlayer.color, background: `${currentPlayer.color}10` }}>
        <span style={{ color: currentPlayer.color, fontWeight: 700 }}>
          {currentPlayer.name} sin tur!
        </span>
      </div>

      {/* Timeline */}
      <div style={styles.timelineWrapper}>
        <div style={styles.timelineScroll}>
          <div style={styles.timelineLine} />
          {Array.from({ length: slotCount }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {!feedback && (
                <div
                  style={{ ...styles.slot, ...(dragOverSlot === i ? styles.slotActive : {}) }}
                  onDragOver={(e) => { e.preventDefault(); setDragOverSlot(i); }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={() => { setDragOverSlot(null); placeCard(i); }}
                  onClick={() => placeCard(i)}
                >
                  <div style={{ ...styles.slotInner, ...(dragOverSlot === i ? { ...styles.slotInnerActive, borderColor: currentPlayer.color, color: currentPlayer.color } : {}) }}>
                    {dragOverSlot === i ? "▼" : "+"}
                  </div>
                </div>
              )}
              {i < currentPlayer.timeline.length && (
                <div style={{ ...styles.tlCard, borderColor: `${currentPlayer.color}44` }}>
                  <div style={{ ...styles.tlCardStripe, background: currentPlayer.color }} />
                  <div style={{ ...styles.tlCardYear, color: currentPlayer.color }}>{currentPlayer.timeline[i].year}</div>
                  <div style={styles.tlCardTitle}>{currentPlayer.timeline[i].title}</div>
                  <div style={styles.tlCardArtist}>{currentPlayer.timeline[i].artist}</div>
                  <div style={styles.tlCardGenre}>{currentPlayer.timeline[i].genre}</div>
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
            <p style={{ color: "#fff", fontSize: 17, marginBottom: 8 }}>{feedback.message}</p>
            <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>
              {currentPlayerIndex + 1 < players.length
                ? `Neste: ${players[(currentPlayerIndex + 1) % players.length].name} sin tur`
                : `Neste: ${players[0].name} sin tur (Runde ${round + 1})`}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button style={styles.primaryBtn} onClick={nextTurn}>Neste tur →</button>
              <button style={styles.ghostBtn} onClick={() => setScreen("result")}>Avslutt</button>
            </div>
          </div>
        ) : currentCard ? (
          <div style={{ textAlign: "center" }}>
            <p style={styles.hint}>Trykk på en <strong style={{color: "#f5c518"}}>+</strong> på tidslinjen for å plassere kortet</p>
            <div style={{ ...styles.playCard, background: `linear-gradient(160deg, ${currentPlayer.color} 0%, ${currentPlayer.color}bb 100%)` }} draggable onDragStart={() => {}}>
              <div style={styles.playCardBadge}>?</div>
              <div style={styles.playCardTitle}>{currentCard.title}</div>
              <div style={styles.playCardArtist}>{currentCard.artist}</div>
              <div style={styles.playCardDivider} />
              <div style={styles.playCardGenre}>{currentCard.genre}</div>
                {currentCard.spotify_url && (
                <audio controls src={currentCard.spotify_url} style={{ marginTop: 14, width: "100%", borderRadius: 8 }} />
                )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Søppelkasse */}
      
      {currentPlayer.trashCards.length > 0 && (
        <div style={styles.trash}>
            <span style={styles.trashTitle}>🗑️ Feil ({currentPlayer.trashCards.length})</span>
            <div style={styles.trashList}>
            {currentPlayer.trashCards.map((c, i) => (
                <div key={i} style={{ ...styles.trashChip, cursor: "pointer" }} onClick={() => setSelectedTrash(c)}>
                <span style={{ color: "#e94560", fontWeight: 700, marginRight: 6 }}>{c.year}</span>{c.title}
                </div>
            ))}
            </div>
        </div>
        )}

        {selectedTrash && (
        <div style={styles.modalOverlay} onClick={() => setSelectedTrash(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#e94560", marginBottom: 8 }}>❌ Feil svar</h3>
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{selectedTrash.title}</p>
            <p style={{ color: "#aaa" }}>{selectedTrash.artist}</p>
            <p style={{ color: "#f5c518", fontSize: 22, fontWeight: 900 }}>{selectedTrash.year}</p>
            <p style={{ color: "#888", fontSize: 13 }}>{selectedTrash.genre}</p>
            <button style={{ ...styles.primaryBtn, marginTop: 16 }} onClick={() => setSelectedTrash(null)}>Lukk</button>
            </div>
        </div>
        )}
    </div>
  );
}