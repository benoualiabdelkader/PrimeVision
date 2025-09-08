# PrimeVision

PrimeVision is a modern web application for browsing movies and TV shows, powered by The Movie Database (TMDB) API. It offers a rich user experience with features like content search, favorites management, watchlists, and user authentication.

## Features

- **Extensive Content Library**: Browse a vast collection of movies and TV shows from the TMDB API.
- **Search Functionality**: Easily find specific titles using the integrated search bar.
- **Favorites & Watchlist**: Mark your favorite movies/TV shows and manage a personalized watchlist.
- **User Authentication**: Securely log in and sign up using traditional email/password or Google OAuth.
- **Responsive Design**: Enjoy a seamless experience across various devices with a mobile-first approach.
- **Multi-language Support**: The application supports multiple languages (e.g., Arabic and English).
- **Theme Toggling**: Switch between light and dark themes for a personalized viewing experience.
- **Detailed Content Pages**: View comprehensive details for each movie or TV show, including overview, cast, trailers, and recommendations.

## Technologies Used

- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **API Integration**: The Movie Database (TMDB) API
- **Icons**: Lucide Icons
- **Authentication**: Google OAuth

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- A web browser (e.g., Chrome, Firefox)
- A local web server (e.g., `serve` from npm, Apache, Nginx) to serve the static files.

### Installation

1. **Clone the repository (if applicable):**
   ```bash
   git clone <repository_url>
   cd primevision
   ```
   *(Note: If you received this project as a direct download, you can skip this step.)*

2. **Install a local web server (if you don't have one):**
   If you have Node.js installed, you can use `serve`:
   ```bash
   npm install -g serve
   ```

3. **Obtain a TMDB API Key:**
   - Go to [The Movie Database (TMDB) website](https://www.themoviedb.org/)
   - Sign up for an account.
   - Navigate to your account settings and generate a new API key (v3).
   - Open `js/app.js` and replace `'YOUR_TMDB_API_KEY'` with your actual API key:
     ```javascript
     this.API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual TMDB API key
     ```

4. **(Optional) Configure Google OAuth:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one.
   - Enable the Google People API.
   - Go to "Credentials" and create OAuth 2.0 Client IDs (Web application type).
   - Add `http://localhost:3000` (or your server's address) to "Authorized JavaScript origins" and "Authorized redirect URIs".
   - Open `js/auth.js` and replace `'YOUR_GOOGLE_CLIENT_ID'` with your actual Google Client ID:
     ```javascript
     this.googleClientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
     ```

### Running the Application

1. **Navigate to the project directory:**
   ```bash
   cd c:\Users\New Tech\Desktop\primevision
   ```

2. **Start the web server:**
   If you are using `serve`:
   ```bash
   serve -s
   ```
   This will typically start the server on `http://localhost:3000`.

3. **Open in browser:**
   Open your web browser and go to the address provided by your web server (e.g., `http://localhost:3000`).

## Project Structure

```
primevision/
├── css/
│   └── style.css         # Custom CSS styles
├── details.html          # Details page for movies/TV shows
├── favorites-new.html    # Alternative favorites page
├── favorites.html        # User's favorite content page
├── images/               # Image assets
├── index.html            # Main application entry point
├── js/
│   ├── app.js            # Core application logic, TMDB API integration
│   ├── auth.js           # User authentication (local & Google OAuth)
│   ├── favorites.js      # Favorites and watchlist management
│   ├── language.js       # Language switching functionality
│   └── search.js         # Search related logic
├── login.html            # Login/Signup page
├── profile.html          # User profile page
└── search.html           # Search results page
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name/Project Maintainer - [Your Email/Contact Info]

Project Link: [https://github.com/your_username/PrimeVision](https://github.com/your_username/PrimeVision)
