import styles from "../styles";

export default function Footer({ setScreen }) {
  return (
    <footer style={styles.footer}>
      <p style={styles.footerText}>🎵 Hitster — Skoleprosjekt 2026</p>
      <p style={styles.footerDivider}>|</p>
      <p style={styles.footerText}>Laget med React, Express & MariaDB</p>
      <p style={{ ...styles.footerText, cursor: "pointer", textDecoration: "underline" }} onClick={() => setScreen("personvern")}>Personvern</p>
    </footer>
  );
}