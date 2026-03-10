const express = require("express");
const cors = require("cors");
const app = express();

//Hello

app.use(cors());
app.use(express.json());

// Ruter
const songsRouter = require("./routes/songs");
const scoresRouter = require("./routes/scores");

app.use("/api/songs", songsRouter);
app.use("/api/scores", scoresRouter);

// Test-rute
app.get("/", (req, res) => {
  res.json({ message: "Hitster API kjører!" });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});