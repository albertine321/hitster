import styles from "../styles";

export default function Personvern({ setScreen }) {
  return (
    <div style={styles.bg}>
      <div style={{ ...styles.startCard, maxWidth: 600, textAlign: "left" }}>
        <h1 style={{ ...styles.startTitle, fontSize: 32, marginBottom: 20 }}>🔒 Personvern</h1>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>Hvilke data samler vi inn?</h2>
          <p style={styles.privacyText}>
            Hitster lagrer kun spillernavn og spillresultater (score, antall sanger spilt og antall feil) i databasen. Vi samler ikke inn e-post, passord eller annen personlig informasjon.
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>Hvordan brukes dataene?</h2>
          <p style={styles.privacyText}>
            Dataene brukes utelukkende til å vise highscores i spillet. Ingen data deles med tredjeparter.
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>Hvor lagres dataene?</h2>
          <p style={styles.privacyText}>
            All data lagres lokalt i en MariaDB-database som kjører på samme maskin som spillet. Dataene sendes ikke til eksterne servere.
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>Sletting av data</h2>
          <p style={styles.privacyText}>
            Siden spillet ikke krever innlogging er det ikke mulig å slette enkeltbrukeres data direkte. All spillhistorikk kan slettes av administrator ved behov.
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>Informasjonskapsler (cookies)</h2>
          <p style={styles.privacyText}>
            Hitster bruker ingen informasjonskapsler.
          </p>
        </section>

        <section style={styles.privacySection}>
          <h2 style={styles.privacyHeading}>Kontakt</h2>
          <p style={styles.privacyText}>
            Dette er et skoleprosjekt laget i 2026. Ta kontakt med utvikleren hvis du har spørsmål om personvern.
          </p>
        </section>

        <button style={{ ...styles.highscoreBtn, marginTop: 24 }} onClick={() => setScreen("start")}>← Tilbake</button>
      </div>
    </div>
  );
}