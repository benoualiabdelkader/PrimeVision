// PrimeVision - Main App JavaScript
// TMDB API integration and general scripts

class PrimeVisionApp {
    constructor() {
        this.API_KEY = '93f545a97aec858af4381e4008d9ce3c';
        this.BASE_URL = 'https://api.themoviedb.org/3';
        this.IMG_URL = 'https://image.tmdb.org/t/p/w500';
        this.BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';
        
        this.state = {
            user: null,
            favorites: [],
            watchlist: [],
            reviews: {},
            currentPage: 'home',
            viewMode: 'grid',
            genres: [],
            currentFilters: {}
        };

        this.init();
    }

    // Initialize the application
    async init() {
        this.loadUserData();
        this.setupEventListeners();
        await this.loadGenres();
        this.setupTheme();
        this.loadPage();
    }

    // API Functions
    async fetchFromTMDB(endpoint, params = {}) {
        const url = new URL(`${this.BASE_URL}/${endpoint}`);
        url.searchParams.append('api_key', this.API_KEY);
        
        // Use language manager to get the correct language
        const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'ar';
        const tmdbLang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
        url.searchParams.append('language', tmdbLang);
        
        Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.append(key, value);
        });
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Fetch Error:', error);
            const errorMsg = window.languageManager && window.languageManager.getCurrentLanguage() === 'en' 
                ? 'Failed to fetch data. Please try again later.'
                : 'فشل في جلب البيانات. يرجى المحاولة مرة أخرى في وقت لاحق.';
            this.showError(errorMsg);
            return null;
        }
    }

    // Load genres for filtering
    async loadGenres() {
        const [movieGenres, tvGenres] = await Promise.all([
            this.fetchFromTMDB('genre/movie/list'),
            this.fetchFromTMDB('genre/tv/list'),
        ]);
        
        const allGenres = [...(movieGenres?.genres || []), ...(tvGenres?.genres || [])];
        this.state.genres = [...new Map(allGenres.map(item => [item.id, item])).values()];
        
        // Populate genre select if it exists
        const genreSelect = document.getElementById('genre-select');
        if (genreSelect) {
            const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'ar';
            const allGenresText = currentLang === 'en' ? 'All Genres' : 'كل الأنواع';
            genreSelect.innerHTML = `<option value="">${allGenresText}</option>` + 
                this.state.genres.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
        }
    }

    // Render functions
    renderMoviesGrid(items) {
        return items.map(item => `
            <div class="movie-card content-card cursor-pointer group" data-id="${item.id}" data-type="${item.media_type || (item.title ? 'movie' : 'tv')}">
                <div class="poster-container relative">
                    <img loading="lazy" 
                         src="${item.poster_path ? this.IMG_URL + item.poster_path : './images/placeholder.jpg'}" 
                         alt="${item.title || item.name}" 
                         class="w-full h-full object-cover">
                    <div class="overlay absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-center">
                        <h3 class="font-bold text-lg text-white mb-2">${item.title || item.name}</h3>
                        <p class="text-sm text-slate-300 mb-2">${(item.release_date || item.first_air_date || '').split('-')[0]}</p>
                        <div class="flex items-center justify-center gap-2 text-yellow-400">
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                            <span>${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                        <div class="flex gap-2 mt-3">
                            <button class="btn-primary text-xs px-3 py-1" onclick="event.stopPropagation(); app.showDetails(${item.id}, '${item.media_type || (item.title ? 'movie' : 'tv')}')">
                                <span data-translate="details">${window.languageManager ? window.languageManager.translate('details') : 'التفاصيل'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderMoviesList(items) {
        return items.map(item => `
            <div class="search-result-item flex items-center gap-4 p-4 cursor-pointer" 
                 data-id="${item.id}" 
                 data-type="${item.media_type || (item.title ? 'movie' : 'tv')}"
                 onclick="app.showDetails(${item.id}, '${item.media_type || (item.title ? 'movie' : 'tv')}')">
                <img loading="lazy" 
                     src="${item.poster_path ? this.IMG_URL + item.poster_path : './images/placeholder.jpg'}" 
                     alt="${item.title || item.name}" 
                     class="w-16 h-24 object-cover rounded-md">
                <div class="flex-1">
                    <h3 class="font-bold text-lg">${item.title || item.name}</h3>
                    <p class="text-sm text-muted mb-2">${item.overview ? item.overview.substring(0, 100) + '...' : 'لا يوجد وصف متاح'}</p>
                    <div class="flex items-center gap-4 text-sm text-muted">
                        <span>${(item.release_date || item.first_air_date || '').split('-')[0]}</span>
                        <div class="flex items-center gap-1 text-yellow-400">
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                            <span>${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Content loading functions
    async loadTrendingContent() {
        this.showLoading();
        const data = await this.fetchFromTMDB('trending/all/week');
        return data?.results || [];
    }

    async loadPopularMovies() {
        const data = await this.fetchFromTMDB('movie/popular');
        return data?.results || [];
    }

    async loadPopularTV() {
        const data = await this.fetchFromTMDB('tv/popular');
        return data?.results || [];
    }

    async loadUpcomingMovies() {
        const data = await this.fetchFromTMDB('movie/upcoming');
        return data?.results || [];
    }

    async searchContent(query) {
        if (!query.trim()) return [];
        const data = await this.fetchFromTMDB('search/multi', { query });
        return data?.results || [];
    }

    async loadMovieDetails(id) {
        const [details, credits, videos, recommendations] = await Promise.all([
            this.fetchFromTMDB(`movie/${id}`),
            this.fetchFromTMDB(`movie/${id}/credits`),
            this.fetchFromTMDB(`movie/${id}/videos`),
            this.fetchFromTMDB(`movie/${id}/recommendations`)
        ]);
        return { details, credits, videos, recommendations };
    }

    async loadTVDetails(id) {
        const [details, credits, videos, recommendations] = await Promise.all([
            this.fetchFromTMDB(`tv/${id}`),
            this.fetchFromTMDB(`tv/${id}/credits`),
            this.fetchFromTMDB(`tv/${id}/videos`),
            this.fetchFromTMDB(`tv/${id}/recommendations`)
        ]);
        return { details, credits, videos, recommendations };
    }

    // Show movie/TV details in modal
    async showDetails(id, type) {
        const modal = document.getElementById('details-modal');
        const content = document.getElementById('details-content');
        
        if (!modal || !content) {
            // Navigate to details page if modal doesn't exist
            window.location.href = `details.html?id=${id}&type=${type}`;
            return;
        }

        this.showModal('details-modal');
        content.innerHTML = '<div class="text-center p-10"><div class="spinner mx-auto"></div></div>';

        const data = type === 'movie' ? await this.loadMovieDetails(id) : await this.loadTVDetails(id);
        
        if (!data.details) {
            this.hideModal('details-modal');
            return;
        }

        const { details, credits, videos, recommendations } = data;
        const trailer = videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        const isFavorite = this.state.favorites.some(fav => fav.id === details.id);
        const onWatchlist = this.state.watchlist.some(item => item.id === details.id);

        content.innerHTML = this.renderDetailsContent(details, credits, videos, recommendations, trailer, isFavorite, onWatchlist, type);
        lucide.createIcons();
    }

    renderDetailsContent(details, credits, videos, recommendations, trailer, isFavorite, onWatchlist, type) {
        return `
            <div class="relative">
                <img src="${details.backdrop_path ? this.BACKDROP_URL + details.backdrop_path : './images/placeholder-backdrop.jpg'}" 
                     alt="${details.title || details.name}" 
                     class="w-full h-48 md:h-96 object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <button onclick="app.hideModal('details-modal')" 
                        class="absolute top-4 left-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="p-6 md:p-8">
                <h2 class="text-3xl md:text-4xl font-bold mb-2">${details.title || details.name}</h2>
                <div class="flex flex-wrap items-center gap-4 text-muted mb-4">
                    <span>${(details.release_date || details.first_air_date || '').split('-')[0]}</span>
                    <div class="flex items-center gap-1 text-yellow-400">
                        <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                        <span>${details.vote_average.toFixed(1)}</span>
                    </div>
                    <span>${details.genres.map(g => g.name).join(', ')}</span>
                </div>
                <p class="mb-6">${details.overview}</p>
                <div class="flex items-center gap-4 mb-8">
                    ${trailer ? `<button onclick="app.playTrailer('${trailer.key}')" class="btn-primary flex items-center gap-2">
                        <i data-lucide="play"></i> تشغيل المقطع الدعائي
                    </button>` : ''}
                    <button onclick="app.toggleFavorite(${details.id}, '${type}')" 
                            class="p-3 rounded-full border-2 ${isFavorite ? 'bg-red-500 border-red-500' : 'border-slate-600'} hover:border-red-500 group">
                        <i data-lucide="heart" class="w-6 h-6 ${isFavorite ? 'fill-white text-white' : 'text-slate-400'} group-hover:text-red-500"></i>
                    </button>
                    <button onclick="app.toggleWatchlist(${details.id}, '${type}')" 
                            class="p-3 rounded-full border-2 ${onWatchlist ? 'bg-sky-500 border-sky-500' : 'border-slate-600'} hover:border-sky-500 group">
                        <i data-lucide="plus" class="w-6 h-6 ${onWatchlist ? 'text-white' : 'text-slate-400'} group-hover:text-sky-500"></i>
                    </button>
                </div>
                
                <h3 class="text-2xl font-bold mb-4">طاقم العمل</h3>
                <div class="flex overflow-x-auto gap-4 pb-4">
                    ${credits.cast.slice(0, 10).map(actor => `
                        <div class="text-center flex-shrink-0 w-28">
                            <img src="${actor.profile_path ? this.IMG_URL + actor.profile_path : './images/placeholder-person.jpg'}" 
                                 alt="${actor.name}" 
                                 class="w-24 h-24 rounded-full object-cover mx-auto mb-2">
                            <p class="font-semibold text-sm">${actor.name}</p>
                        </div>
                    `).join('')}
                </div>
                
                ${recommendations.results.length > 0 ? `
                <h3 class="text-2xl font-bold mt-8 mb-4">أعمال مشابهة</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                   ${this.renderMoviesGrid(recommendations.results.slice(0,5))}
                </div>
                ` : ''}
            </div>
        `;
    }

    // Utility functions
    showLoading() {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = '<div class="text-center p-10"><div class="spinner mx-auto"></div></div>';
        }
    }

    showError(message) {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `<div class="empty-state"><p class="text-red-400">${message}</p></div>`;
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    // User data management
    loadUserData() {
        const userJSON = localStorage.getItem('primevision_user');
        if (userJSON) {
            const userData = JSON.parse(userJSON);
            this.state.user = userData.user;
            this.state.favorites = userData.favorites || [];
            this.state.watchlist = userData.watchlist || [];
            this.state.reviews = userData.reviews || {};
        }
    }

    saveUserData() {
        if (this.state.user) {
            localStorage.setItem('primevision_user', JSON.stringify({
                user: this.state.user,
                favorites: this.state.favorites,
                watchlist: this.state.watchlist,
                reviews: this.state.reviews,
            }));
        } else {
            localStorage.removeItem('primevision_user');
        }
    }

    // Favorites and Watchlist management
    async toggleFavorite(id, type) {
        if (!this.state.user) {
            window.location.href = 'login.html';
            return;
        }

        const existingIndex = this.state.favorites.findIndex(fav => fav.id === id);
        
        if (existingIndex > -1) {
            this.state.favorites.splice(existingIndex, 1);
        } else {
            const item = await this.fetchFromTMDB(`${type}/${id}`);
            if (item) {
                item.media_type = type;
                this.state.favorites.push(item);
            }
        }
        
        this.saveUserData();
        // Refresh the details modal if open
        this.showDetails(id, type);
    }

    async toggleWatchlist(id, type) {
        if (!this.state.user) {
            window.location.href = 'login.html';
            return;
        }

        const existingIndex = this.state.watchlist.findIndex(item => item.id === id);
        
        if (existingIndex > -1) {
            this.state.watchlist.splice(existingIndex, 1);
        } else {
            const item = await this.fetchFromTMDB(`${type}/${id}`);
            if (item) {
                item.media_type = type;
                this.state.watchlist.push(item);
            }
        }
        
        this.saveUserData();
        // Refresh the details modal if open
        this.showDetails(id, type);
    }

    // Trailer functionality
    playTrailer(key) {
        const trailerModal = document.createElement('div');
        trailerModal.id = 'trailer-modal';
        trailerModal.className = 'fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 trailer-modal';
        trailerModal.innerHTML = `
            <div class="relative w-full max-w-4xl bg-black rounded-lg shadow-xl">
                <div class="aspect-video">
                    <iframe class="w-full h-full" 
                            src="https://www.youtube.com/embed/${key}?autoplay=1&enablejsapi=1" 
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
                <button onclick="document.getElementById('trailer-modal').remove()" 
                        class="absolute top-4 right-4 text-white hover:text-primary">
                    <i data-lucide="x" class="w-8 h-8"></i>
                </button>
            </div>
        `;
        document.body.appendChild(trailerModal);
        lucide.createIcons();
    }

    // Theme management
    setupTheme() {
        const savedTheme = localStorage.getItem('primevision_theme') || 'dark';
        this.applyTheme(savedTheme);
    }

    applyTheme(theme) {
        document.documentElement.className = theme;
        localStorage.setItem('primevision_theme', theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    // Event listeners setup
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language change listener
        window.addEventListener('languageChanged', (e) => {
            this.onLanguageChanged(e.detail.language);
        });

        // Search form
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = document.getElementById('search-input').value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            });
        }

        // Close modal listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                const modals = document.querySelectorAll('.modal-backdrop');
                modals.forEach(modal => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                });
            }
        });
    }

    // Handle language change
    async onLanguageChanged(newLanguage) {
        // Reload genres with new language
        await this.loadGenres();
        
        // Refresh the current page content if needed
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'index.html') {
            this.loadHomePage();
        }
    }

    // Page loading
    loadPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch(currentPage) {
            case 'index.html':
            case '':
                this.loadHomePage();
                break;
            default:
                // Other pages will handle their own loading
                break;
        }
    }

    async loadHomePage() {
        this.showLoading();
        
        const [trending, popularMovies, popularTv, upcoming] = await Promise.all([
            this.loadTrendingContent(),
            this.loadPopularMovies(),
            this.loadPopularTV(),
            this.loadUpcomingMovies()
        ]);

        const contentArea = document.getElementById('content-area');
        if (!contentArea) return;

        const heroItem = trending[0];
        contentArea.innerHTML = `
            <section class="hero-bg relative rounded-2xl overflow-hidden min-h-[50vh] flex items-end p-6 md:p-12 mb-12 text-white fade-in" 
                     style="background-image: url(${this.BACKDROP_URL + heroItem.backdrop_path})">
                <div class="hero-content">
                    <h1 class="text-3xl md:text-5xl font-extrabold mb-4">${heroItem.title || heroItem.name}</h1>
                    <p class="max-w-2xl text-slate-300 mb-6 hidden md:block">${heroItem.overview}</p>
                    <button onclick="app.showDetails(${heroItem.id}, '${heroItem.media_type}')" 
                            class="btn-primary flex items-center gap-2 transition-transform hover:scale-105">
                        <i data-lucide="play-circle" class="w-6 h-6"></i>
                        شاهد المقطع الدعائي
                    </button>
                </div>
            </section>
            
            <section class="mb-12">
                <h2 class="text-2xl md:text-3xl font-bold mb-6">شائع هذا الأسبوع</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    ${this.renderMoviesGrid(trending.slice(1))}
                </div>
            </section>
            
            <section class="mb-12">
                <h2 class="text-2xl md:text-3xl font-bold mb-6">أفلام شائعة</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    ${this.renderMoviesGrid(popularMovies)}
                </div>
            </section>
            
            <section class="mb-12">
                <h2 class="text-2xl md:text-3xl font-bold mb-6">مسلسلات شائعة</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    ${this.renderMoviesGrid(popularTv)}
                </div>
            </section>
            
            <section class="mb-12">
                <h2 class="text-2xl md:text-3xl font-bold mb-6">قادم قريباً</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    ${this.renderMoviesGrid(upcoming)}
                </div>
            </section>
        `;
        
        lucide.createIcons();
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PrimeVisionApp();
    lucide.createIcons();
});
