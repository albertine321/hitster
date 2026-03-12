# Hitster

Hitster er et webbasert musikk-trivia spill inspirert av det populære kortspillet med samme navn. Systemet består av en REST API-backend bygget med Express og Node.js, en MariaDB-database som lagrer sanger og spillhistorikk, og en React-frontend som håndterer selve spillopplevelsen. Spillet støtter 1-4 spillere som bytter på tur, og går ut på å plassere sangkort i riktig kronologisk rekkefølge på en tidslinje. Spillere får poeng for riktige plasseringer, og feilplasseringer havner i en personlig søppelkasse. Systemet har også highscores, musikkavspilling på utvalgte sanger og er deployet med Docker for enkel oppstart.

/*This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).*/

## Teknisk beskrivelse

* Backend: Node.js (Express)

    * Viktige biblioteker: `express`, `cors`, `mysql2`, `axios`

* Database: `MariaDB`

    * Databasenavn: `hitster`

    * Tabeller: 
    
        `songs` (kolonner: `id, title, artist, year, genre, spotify_url, created_at`)

        `game_sessions` (kolonner: `id, player_name, score, songs_played, wrong, created_at`)

        `session_songs` (kolonner: `id, session_id, song_id, guessed_year, correct`)



* Frontend: React

* Drift: Docker & Docker Compose

    * `hitster-backend` – Express-server

    * `hitster-db` – MariaDB-database



* Teknologier & versjoner

    * Node.js: 25.x

    * MariaDB: 12.x

    * React: 18.x

    * Docker: Kreves for å kjøre backend og database

    * NPM-pakker: `express`, `cors`, `mysql2`, `axios` (se `backend/package.json`)

* Hardware: Kan kjøres lokalt på en vanlig utviklermaskin (macOS/Linux/Windows). Krever kun nok disk/minne til å kjøre Docker, Node.js og React.



## Oppsett og installasjon 🚀

Følgende beskriver steg for oppsett på en lokal maskin.

1. Klon repository
    ```
    git clone <https://github.com/albertine321/hitster.git>
    cd Hitster
    ```

2. Start database og backend med Docker i terminal:

    ```
    docker-compose up -d
    ```

    Dette starter `hitster-db` (MariaDB) og `hitster-backend` (Express) automatisk.

3. Last inn sanger i databasen (kjør kun én gang):

    ```
    docker exec -i hitster-db mariadb -u hitster_user -phitster123 hitster < database/schema.sql
    ```

4. Installer avhengigheter og start frontend:
    
   ```
    cd frontend 
    npm install
    npm start
    ```

Frontend er tilgjengelig på `http://localhost:3004/`.

5. Backend API er tilgjengelig på `http://localhost:3003/`.


6. Stopp applikasjonen: 

    ```
    docker-compose down
    ```


## Endepunkter (API) 📡

`GET /` — helsesjekk, bekrefter at API kjører

`GET /api/songs/random` — returnerer en tilfeldig sang

`GET /api/songs` — returnerer alle sanger

`POST /api/songs/guess` — send et gjett

Eksempel på POST-body:

```
{
  "song_id": 1,
  "guessed_year": 1985,
  "session_id": 3,
  "correct": true
}
```

`POST /api/scores/session` — opprett en ny spilløkt

Eksempel på POST_body:

```
{
  "player_name": "Albertine"
}
```

`GET /api/scores/highscores` — returnerer topp 10 spillere

`GET /api/scores/session/:id` — returnerer info om en spesifikk spilløkt


## Sikkerhet & kjente forbedringer ⚠️

* Databasepassord er hardkodet i `docker-compose.yml` — ideelt sett bør disse flyttes til en `.env`-fil som ikke committes til GitHub.
* `spotify_url`-kolonnen inneholder hardkodede `localhost`-URLer i databasen — disse må oppdateres dersom applikasjonen deployes til en annen maskin eller server.
* Ingen autentisering på API-et — alle endepunkter er åpne og kan kalles av hvem som helst. Bør legges til hvis applikasjonen skal brukes i produksjon.
* Spotify preview-URLer fungerer ikke lenger da Spotify fjernet denne funksjonaliteten i 2023. Musikk spilles i stedet av fra lokalt lagrede mp3-filer.
* Highscores sorteres kun etter score og ikke etter dato — to spillere med samme score får tilfeldig rekkefølge.
* Docker-imaget bygges lokalt og er ikke publisert til Docker Hub — andre brukere må bygge imaget selv med `--build` flagget.

## Lisens & bidrag

Dette er et skoleprosjekt laget som prøveeksamen i IT. Det er ikke satt opp noen formell lisens, men koden er åpen og kan brukes som inspirasjon. Legg gjerne til en `LICENSE`-fil (f.eks. MIT) og en `CONTRIBUTING.md` hvis du ønsker bidrag fra andre i fremtiden.


Skrevet med hjelp av Claude Sonnet 4.5 i februar 2026.



In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
