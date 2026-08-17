# PrimeVision

PrimeVision is a static movie and television discovery interface built around the TMDB API. The application provides search, title details, trailers, recommendations, favorites, watchlists, local profile data, bilingual navigation, and light/dark themes.

The project is a client-side demonstration. It does not provide a production backend, a secure server-side authentication layer, or persistent cloud storage for user data.

## Features

- Browse movie and television content retrieved from TMDB.
- Search by title and filter results by media type.
- View title details, cast, trailers, ratings, recommendations, and reviews.
- Save favorites and watchlists in the browser.
- Use the interface in Arabic or English.
- Switch between light and dark themes.
- Use optional Google Identity Services integration when a local OAuth client ID is configured.
- Use a responsive layout based on semantic HTML, custom CSS, Tailwind CDN utilities, and Lucide icons.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- TMDB REST API
- Tailwind CSS CDN
- Lucide Icons
- Google Identity Services, optional
- Browser `localStorage` for demo user data, favorites, watchlists, and reviews

## Requirements

A modern browser and a local static web server are required. Running the files through a local server is recommended because browser security policies can restrict API requests and module behavior when files are opened directly from the filesystem.

## Configuration

PrimeVision does not store API keys or OAuth client identifiers in version control. The application loads an ignored file at `js/config.local.js` before the application modules.

Create the local configuration from the example file:

```bash
cp js/config.example.js js/config.local.js
```

Then add the values locally:

```javascript
window.PRIMEVISION_CONFIG = {
    tmdbApiKey: "your_tmdb_api_key",
    googleClientId: "your_google_oauth_client_id"
};
```

The Google value is optional. If it is empty, the Google sign-in integration remains disabled and the local demonstration authentication continues to work.

The TMDB key previously present in the repository was removed from the tracked source. If that key is still active, it must be revoked and replaced in the TMDB account before using this project again.

## Running locally

From the project directory, start any static web server. For example, with Node.js and the `serve` package:

```bash
npx serve .
```

Open the URL printed by the server and start from `index.html`.

## Project structure

```text
PrimeVision/
├── css/
│   └── style.css
├── images/
│   ├── design01.png
│   ├── design02.png
│   ├── design03.png
│   ├── default-avatar.svg
│   ├── placeholder.svg
│   ├── placeholder-backdrop.svg
│   └── placeholder-person.svg
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── config.example.js
│   ├── favorites.js
│   ├── language.js
│   └── search.js
├── details.html
├── favorites.html
├── index.html
├── login.html
├── profile.html
├── search.html
└── README.md
```

`js/config.local.js` is intentionally excluded from the repository because it can contain local credentials.

## Data and privacy notes

Favorites, watchlists, reviews, and demo profile data are stored in the browser through `localStorage`. This implementation is suitable for a client-side demonstration and should not be presented as a secure account system. Do not use real passwords or sensitive personal information in a local demonstration account.

Movie metadata, images, and videos are supplied by TMDB and may be subject to TMDB terms and attribution requirements. Review the current TMDB documentation before deploying the application publicly.

## Maintenance conventions

Keep API credentials in `js/config.local.js` only. Do not add real keys to HTML, JavaScript, screenshots, README files, or commit messages. Keep one canonical page for each user flow and remove temporary duplicates before merging changes. Prefer small, named JavaScript methods over inline logic when adding new features.

## Current limitations

PrimeVision is currently a static frontend demonstration. It does not include a server-side API proxy, a database, secure OAuth session handling, automated tests, or a production deployment configuration. Google authentication is optional and should be configured only with an authorized client ID and valid origin settings.

## License

No license file is currently included. Usage and redistribution rights should be clarified by the repository owner before publishing the project as open source.

## Project links

- Repository: [github.com/benoualiabdelkader/PrimeVision](https://github.com/benoualiabdelkader/PrimeVision)
- TMDB: [themoviedb.org](https://www.themoviedb.org/)
- TMDB API documentation: [developer.themoviedb.org](https://developer.themoviedb.org/docs)
