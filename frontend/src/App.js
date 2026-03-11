import { useState } from "react";
import StartScreen from "./components/Startscreen";
import GameScreen from "./components/Gamescreen";
import Resultscreen from "./components/Resultscreen";
import Highscores from "./components/Highscores";

const API = "http://localhost:3003";

const COLORS = ["#f5c518", "#2ed573", "#ff4757", "#1e90ff"];

export default function App() {
  const [screen, setScreen] = useState("start");
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState(["", "", "", ""]);
  const [players, setPlayers] = useState([]); // { name, score, songsPlayed, sessionId, timeline }
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seenIds, setSeenIds] = useState([]);
  const [highscores, setHighscores] = useState([]);
  const [round, setRound] = useState(1);
  const [selectedTrash, setSelectedTrash] = useState(null);

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

  const resetGame = () => {
  setPlayers([]);
  setPlayerNames(["", "", "", ""]);
  setPlayerCount(1);
  setCurrentCard(null);
  setFeedback(null);
  setSeenIds([]);
  setRound(1);
  setScreen("start");
};

  const fetchHighscores = async () => {
    const res = await fetch(`${API}/api/scores/highscores`);
    const data = await res.json();
    setHighscores(data);
    setScreen("highscores");
  };

  const startGame = async () => {
    const activePlayers = playerNames.slice(0, playerCount).filter(n => n.trim());
    if (activePlayers.length < playerCount) return alert("Fyll inn navn på alle spillerne!");

    // Opprett session for hver spiller
    const newPlayers = [];
    for (const name of activePlayers) {
      const res = await fetch(`${API}/api/scores/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_name: name }),
      });
      const data = await res.json();

      // Hent ankerkort for hver spiller
      let anchor = null;
      while (!anchor) {
        const r = await fetch(`${API}/api/songs/random`);
        anchor = await r.json();
      }

      newPlayers.push({
        name,
        score: 0,
        songsPlayed: 0,
        sessionId: data.session_id,
        timeline: [anchor],
        color: COLORS[newPlayers.length],
        trashCards: [],  // ← legg til denne
      });
    }

    const allAnchorIds = newPlayers.map(p => p.timeline[0].id);
    setSeenIds(allAnchorIds);
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setRound(1);
    setScreen("game");

    setLoading(true);
    let song = null;
    let attempts = 0;
    while (!song && attempts < 15) {
      const r = await fetch(`${API}/api/songs/random`);
      const d = await r.json();
      if (!allAnchorIds.includes(d.id)) song = d;
      attempts++;
    }
    setCurrentCard(song);
    setLoading(false);
  };

  const placeCard = async (slotIndex) => {
    if (!currentCard || feedback) return;

    const currentPlayer = players[currentPlayerIndex];
    const sorted = [...currentPlayer.timeline].sort((a, b) => a.year - b.year);
    const cardYear = currentCard.year;
    const beforeCard = sorted[slotIndex - 1];
    const afterCard = sorted[slotIndex];

    const correct =
      (!beforeCard || beforeCard.year <= cardYear) &&
      (!afterCard || afterCard.year >= cardYear);

    await fetch(`${API}/api/songs/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_id: currentCard.id,
        guessed_year: cardYear,
        session_id: currentPlayer.sessionId,
        correct,
      }),
    });

    const newSeenIds = [...seenIds, currentCard.id];
    setSeenIds(newSeenIds);

    const updatedPlayers = [...players];
    if (correct) {
      const newTimeline = [...sorted];
      newTimeline.splice(slotIndex, 0, currentCard);
      updatedPlayers[currentPlayerIndex].timeline = newTimeline;
      updatedPlayers[currentPlayerIndex].score += 1;
    } else {
      updatedPlayers[currentPlayerIndex].trashCards = [...updatedPlayers[currentPlayerIndex].trashCards, currentCard];
    }
    updatedPlayers[currentPlayerIndex].songsPlayed += 1;
    setPlayers(updatedPlayers);

    setFeedback({
      correct,
      message: correct
        ? `✅ Riktig! "${currentCard.title}" er fra ${currentCard.year}`
        : `❌ Feil! "${currentCard.title}" er fra ${currentCard.year}`,
    });
  };

  const nextTurn = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    if (nextIndex === 0) setRound(r => r + 1);
    setCurrentPlayerIndex(nextIndex);
    setFeedback(null);
    fetchSong(seenIds);
  };

if (screen === "start") {
  return <StartScreen playerCount={playerCount} setPlayerCount={setPlayerCount} playerNames={playerNames} setPlayerNames={setPlayerNames} startGame={startGame} fetchHighscores={fetchHighscores} />;
}

if (screen === "highscores") {
  return <Highscores highscores={highscores} setScreen={setScreen} resetGame={resetGame} />;
}

if (screen === "result") {
  return <Resultscreen players={players} fetchHighscores={fetchHighscores} resetGame={resetGame} />;
}

if (screen === "game") {
  return (
    <GameScreen
      players={players}
      currentPlayerIndex={currentPlayerIndex}
      currentCard={currentCard}
      feedback={feedback}
      dragOverSlot={dragOverSlot}
      setDragOverSlot={setDragOverSlot}
      loading={loading}
      round={round}
      placeCard={placeCard}
      nextTurn={nextTurn}
      setScreen={setScreen}
      selectedTrash={selectedTrash}
      setSelectedTrash={setSelectedTrash}
    />
  );
}
}