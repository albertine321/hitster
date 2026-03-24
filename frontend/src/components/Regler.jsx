import styles from "../styles";

export default function Regler({ setScreen }) {
  return (
    <div style={styles.bg}>
      <div style={{ ...styles.startCard, maxWidth: 600, textAlign: "left" }}>
        <h1 style={{ ...styles.startTitle, fontSize: 32, marginBottom: 4, textAlign: "center" }}>🎵 Spilleregler</h1>
        <p style={{ color: "#666", fontSize: 13, textAlign: "center", marginBottom: 32 }}>Slik spiller du Hitster</p>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>🎯 Mål</h2>
          <p style={styles.privacyText}>
            Plasser sangkortene i riktig kronologisk rekkefølge på tidslinjen. Jo flere kort du plasserer riktig, jo flere poeng får du!
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>🚀 Slik starter du</h2>
          <p style={styles.privacyText}>
            1. Velg antall spillere (1–4) på startskjermen.<br /><br />
            2. Skriv inn navn på alle spillerne.<br /><br />
            3. Trykk <strong style={{ color: "#f5c518" }}>START SPILLET</strong> for å begynne.
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>🎮 Slik spiller du</h2>
          <p style={styles.privacyText}>
            1. Øverst på skjermen ser du <strong style={{ color: "#f5c518" }}>tidslinjen</strong> med kort som allerede er plassert.<br /><br />
            2. I midten av skjermen får du et <strong style={{ color: "#f5c518" }}>sangkort</strong> med tittel, artist og sjanger – men ikke årstallet.<br /><br />
            3. Trykk på en <strong style={{ color: "#f5c518" }}>+</strong> mellom kortene på tidslinjen for å plassere sangen der du tror den hører hjemme.<br /><br />
            4. Hvis sangen har musikk tilgjengelig kan du spille den av på kortet for å få et hint!
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>✅ Riktig og ❌ Feil</h2>
          <p style={styles.privacyText}>
            <strong style={{ color: "#2ed573" }}>Riktig</strong> – kortet blir liggende på tidslinjen og du får ett poeng. Det blir vanskeligere for hvert kort som plasseres riktig!<br /><br />
            <strong style={{ color: "#e94560" }}>Feil</strong> – kortet havner i søppelkassen nederst på skjermen. Du kan trykke på kortene i søppelkassen for å se mer informasjon.
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>👥 Flere spillere</h2>
          <p style={styles.privacyText}>
            Ved flere spillere bytter dere på tur. Det vises tydelig hvem sin tur det er øverst på skjermen. Poengene til alle spillerne vises løpende, og når spillet avsluttes kåres en vinner!
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>🥇 Slik avslutter du</h2>
          <p style={styles.privacyText}>
            Når alle sangkortene er spilt og plassert må spillet avsluttes ved å trykke på avslutt-knappen øverst i høyre hjørnet. Man kan også avslutte midt under runden ved å trykke på avslutt-knappen som dukker opp på midten av skjermen når du har lagt ned et kort på tidslinjen.
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>🏆 Highscores</h2>
          <p style={styles.privacyText}>
            Etter spillet kan du se highscores fra alle som har spilt. Highscores viser navn, poeng, antall sanger spilt og antall feil. Spilleren med flest poeng vinner og blir kåret til Hitster-mester!
          </p>
        </section>

        <button style={{ ...styles.highscoreBtn, marginTop: 8 }} onClick={() => setScreen("start")}>← Tilbake</button>
      </div>
    </div>
  );
}