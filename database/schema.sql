CREATE DATABASE IF NOT EXISTS hitster;
CREATE USER 'hitster_user'@'%' IDENTIFIED BY 'hitster_password';
GRANT ALL PRIVILEGES ON hitster.* TO 'hitster_user'@'%';
FLUSH PRIVILEGES;

USE hitster

-- parent tables first

CREATE TABLE IF NOT EXISTS `songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `spotify_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_name` varchar(100) NOT NULL,
  `score` int(11) DEFAULT 0,
  `songs_played` int(11) DEFAULT 0,
  `wrong` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `session_songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL,
  `guessed_year` int(11) DEFAULT NULL,
  `correct` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_song_id` (`song_id`),
  CONSTRAINT `fk_session_songs_session` FOREIGN KEY (`session_id`) REFERENCES `game_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_session_songs_song` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;