📽️ PrimeVision

PrimeVision is a modern web application that allows users to explore movies and TV shows with advanced features such as search, favorites management, watchlists, and multilingual support. It leverages the TMDB API to provide accurate and up-to-date content.

✨ Features

🔍 Search for movies and TV shows.

⭐ Add and remove from Favorites.

📺 Create and manage Watchlists.

👤 User authentication (including Google OAuth).

🌙 Dark/Light mode toggle.

🌐 Multilingual support (Arabic 🇸🇦 / English 🇬🇧).

🎬 Detailed content pages (overview, cast, trailers, recommendations).

📱 Responsive design for all devices.

🛠️ Tech Stack

Frontend: HTML, CSS (Tailwind CSS), JavaScript

API: TMDB API

Icons: Lucide Icons

Authentication: Google OAuth + custom login system

📂 Project Structure
primevision/
├── css/
│   └── style.css
├── images/
├── js/
│   ├── app.js        # Core logic + TMDB API integration
│   ├── auth.js       # Authentication + Google OAuth
│   ├── favorites.js  # Favorites and watchlist management
│   ├── language.js   # Language toggle (EN/AR)
│   └── search.js     # Search functionality
├── index.html        # Homepage
├── details.html      # Movie/TV details page
├── favorites.html    # Favorites page
├── login.html        # Login page
├── profile.html      # User profile page
└── search.html       # Search results page

🚀 Getting Started
1. Clone the repository
git clone https://github.com/benoualiabdelkader/PrimeVision.git
cd PrimeVision

2. Setup TMDB API Key

Create an account on TMDB
.

Generate your API Key (v3).

Replace it in js/app.js:

this.API_KEY = 'YOUR_TMDB_API_KEY';

3. (Optional) Setup Google OAuth

Go to Google Cloud Console
.

Create an OAuth Client ID.

Replace 'YOUR_GOOGLE_CLIENT_ID' inside js/auth.js.

4. Run a local server

Using Node.js with serve:

npm install -g serve
serve -s

5. Open the app

Navigate to:

http://localhost:3000

📸 Screenshots

(Add screenshots of your app here)

📌 Roadmap

Add custom rating system for movies and TV shows.

Support custom notifications for upcoming releases.

Enhance recommendations with AI-powered suggestions.

🤝 Contributing

Contributions are welcome! 🛠️

Fork the repository.

Create a new branch:

git checkout -b feature/my-feature


Commit your changes.

Push to the branch:

git push origin feature/my-feature


Open a Pull Request.

📜 License

This project is licensed under the MIT License
.
