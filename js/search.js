// PrimeVision - Search Functionality
// Advanced search with filters and suggestions

class SearchManager {
    constructor() {
        this.API_KEY = '93f545a97aec858af4381e4008d9ce3c';
        this.BASE_URL = 'https://api.themoviedb.org/3';
        this.IMG_URL = 'https://image.tmdb.org/t/p/w500';
        
        this.searchHistory = this.loadSearchHistory();
        this.currentResults = [];
        this.currentFilters = {};
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPageContent();
        this.setupAutoComplete();
    }

    setupEventListeners() {
        // Search form
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Search input for live search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (e.target.value.length >= 2) {
                        this.performLiveSearch(e.target.value);
                    } else {
                        this.hideAutoComplete();
                    }
                }, 300);
            });

            searchInput.addEventListener('focus', () => {
                if (searchInput.value.length >= 2) {
                    this.showAutoComplete();
                }
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideAutoComplete(), 200);
            });
        }

        // Advanced filters
        const filterForm = document.getElementById('filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => this.handleFilterSearch(e));
        }

        // Filter toggles
        const filterBtn = document.getElementById('filter-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.toggleFilters());
        }

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        // Sort options
        const sortSelect = document.getElementById('sort-results');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.sortResults(e.target.value));
        }

        // View mode toggle
        const viewToggleBtns = document.querySelectorAll('.view-toggle');
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleViewMode(e.target.dataset.view));
        });

        // Search history
        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearSearchHistory());
        }
    }

    loadPageContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (query) {
            this.performSearch(query);
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = query;
            }
        } else {
            this.showSearchLanding();
        }
    }

    async performSearch(query, filters = {}) {
        if (!query.trim()) return;

        this.isLoading = true;
        this.showLoading();
        this.addToSearchHistory(query);

        try {
            const endpoint = 'search/multi';
            const params = {
                query: query,
                ...filters
            };

            const response = await this.fetchFromTMDB(endpoint, params);
            
            if (response && response.results) {
                this.currentResults = response.results.filter(item => 
                    item.media_type !== 'person' // Filter out people from results
                );
                this.renderSearchResults(query);
            } else {
                this.showNoResults(query);
            }
        } catch (error) {
            this.showError('فشل في البحث. يرجى المحاولة مرة أخرى.');
        } finally {
            this.isLoading = false;
        }
    }

    async performLiveSearch(query) {
        if (query.length < 2) return;

        try {
            const response = await this.fetchFromTMDB('search/multi', { 
                query: query,
                page: 1 
            });
            
            if (response && response.results) {
                const suggestions = response.results
                    .filter(item => item.media_type !== 'person')
                    .slice(0, 5);
                this.showAutoComplete(suggestions, query);
            }
        } catch (error) {
            console.error('Live search error:', error);
        }
    }

    async fetchFromTMDB(endpoint, params = {}) {
        const url = new URL(`${this.BASE_URL}/${endpoint}`);
        url.searchParams.append('api_key', this.API_KEY);
        url.searchParams.append('language', 'ar-SA');
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                url.searchParams.append(key, value);
            }
        });
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }

    renderSearchResults(query) {
        const contentArea = document.getElementById('content-area');
        if (!contentArea) return;

        const viewMode = this.getViewMode();
        const resultCount = this.currentResults.length;

        contentArea.innerHTML = `
            <div class="fade-in">
                <div class="flex flex-col lg:flex-row gap-6">
                    <!-- Filters Sidebar -->
                    <div id="filters-sidebar" class="lg:w-64 flex-shrink-0">
                        ${this.renderFiltersPanel()}
                    </div>

                    <!-- Results Area -->
                    <div class="flex-1">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h1 class="text-2xl font-bold mb-1">نتائج البحث</h1>
                                <p class="text-muted">عن "${query}" - ${resultCount} نتيجة</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <select id="sort-results" class="form-input text-sm">
                                    <option value="relevance">الأكثر صلة</option>
                                    <option value="rating-desc">التقييم (عالي إلى منخفض)</option>
                                    <option value="rating-asc">التقييم (منخفض إلى عالي)</option>
                                    <option value="date-desc">الأحدث</option>
                                    <option value="date-asc">الأقدم</option>
                                    <option value="title-asc">الاسم (أ-ي)</option>
                                </select>
                                <div class="flex items-center gap-1 border border-color rounded-lg">
                                    <button class="view-toggle p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : ''}" data-view="grid">
                                        <i data-lucide="layout-grid" class="w-4 h-4"></i>
                                    </button>
                                    <button class="view-toggle p-2 ${viewMode === 'list' ? 'bg-primary text-white' : ''}" data-view="list">
                                        <i data-lucide="list" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div id="results-container">
                            ${this.renderResults(viewMode)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        lucide.createIcons();
        this.setupResultsEventListeners();
    }

    renderFiltersPanel() {
        return `
            <div class="bg-card border border-color rounded-lg p-4">
                <h3 class="font-bold mb-4">تصفية النتائج</h3>
                <form id="filter-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">نوع المحتوى</label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" name="type" value="movie" class="mr-2">
                                <span>أفلام</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="type" value="tv" class="mr-2">
                                <span>مسلسلات</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label for="year-filter" class="block text-sm font-medium mb-2">سنة الإصدار</label>
                        <select id="year-filter" name="year" class="form-input w-full text-sm">
                            <option value="">كل السنوات</option>
                            ${this.generateYearOptions()}
                        </select>
                    </div>

                    <div>
                        <label for="genre-filter" class="block text-sm font-medium mb-2">النوع</label>
                        <select id="genre-filter" name="genre" class="form-input w-full text-sm">
                            <option value="">كل الأنواع</option>
                            <option value="28">أكشن</option>
                            <option value="12">مغامرة</option>
                            <option value="16">رسوم متحركة</option>
                            <option value="35">كوميديا</option>
                            <option value="80">جريمة</option>
                            <option value="99">وثائقي</option>
                            <option value="18">دراما</option>
                            <option value="10751">عائلي</option>
                            <option value="14">خيال علمي</option>
                            <option value="36">تاريخي</option>
                            <option value="27">رعب</option>
                            <option value="10402">موسيقي</option>
                            <option value="9648">غموض</option>
                            <option value="10749">رومانسي</option>
                            <option value="878">خيال علمي</option>
                            <option value="10770">فيلم تلفزيوني</option>
                            <option value="53">إثارة</option>
                            <option value="10752">حرب</option>
                            <option value="37">غرب</option>
                        </select>
                    </div>

                    <div>
                        <label for="rating-filter" class="block text-sm font-medium mb-2">
                            التقييم الأدنى: <span id="rating-value">0</span>
                        </label>
                        <input type="range" id="rating-filter" name="rating" min="0" max="10" step="0.5" 
                               class="w-full" oninput="document.getElementById('rating-value').textContent = this.value">
                    </div>

                    <div class="flex gap-2">
                        <button type="submit" class="btn-primary text-sm flex-1">تطبيق</button>
                        <button type="button" id="clear-filters" class="btn-secondary text-sm px-3">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                </form>

                <div class="mt-6">
                    <h4 class="font-medium mb-2">عمليات بحث حديثة</h4>
                    <div class="space-y-1">
                        ${this.renderSearchHistory()}
                    </div>
                </div>
            </div>
        `;
    }

    renderResults(viewMode) {
        if (this.currentResults.length === 0) {
            return `
                <div class="empty-state">
                    <i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 text-muted"></i>
                    <h3 class="text-xl font-bold mb-2">لا توجد نتائج</h3>
                    <p class="text-muted mb-6">جرب كلمات مفتاحية مختلفة أو قم بتعديل المرشحات</p>
                </div>
            `;
        }

        if (viewMode === 'list') {
            return `
                <div class="space-y-2">
                    ${this.currentResults.map(item => this.renderListItem(item)).join('')}
                </div>
            `;
        } else {
            return `
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    ${this.currentResults.map(item => this.renderGridItem(item)).join('')}
                </div>
            `;
        }
    }

    renderGridItem(item) {
        const posterUrl = item.poster_path ? 
            `${this.IMG_URL}${item.poster_path}` : 
            './images/placeholder.jpg';
        
        return `
            <div class="content-card group cursor-pointer" onclick="app.showDetails(${item.id}, '${item.media_type}')">
                <div class="poster-container relative">
                    <img src="${posterUrl}" 
                         alt="${item.title || item.name}" 
                         class="w-full h-full object-cover">
                    <div class="overlay absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 class="font-bold text-white mb-2 text-sm">${item.title || item.name}</h3>
                        <p class="text-xs text-slate-300 mb-2">${(item.release_date || item.first_air_date || '').split('-')[0]}</p>
                        <div class="flex items-center gap-1 text-yellow-400 mb-2 text-xs">
                            <i data-lucide="star" class="w-3 h-3 fill-current"></i>
                            <span>${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                        <span class="genre-tag text-xs">${item.media_type === 'movie' ? 'فيلم' : 'مسلسل'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderListItem(item) {
        const posterUrl = item.poster_path ? 
            `${this.IMG_URL}${item.poster_path}` : 
            './images/placeholder.jpg';
        
        return `
            <div class="search-result-item flex items-center gap-4 p-4 cursor-pointer" 
                 onclick="app.showDetails(${item.id}, '${item.media_type}')">
                <img src="${posterUrl}" 
                     alt="${item.title || item.name}" 
                     class="w-16 h-24 object-cover rounded-md">
                <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                        <h3 class="font-bold text-lg">${item.title || item.name}</h3>
                        <span class="genre-tag ml-2">${item.media_type === 'movie' ? 'فيلم' : 'مسلسل'}</span>
                    </div>
                    <p class="text-sm text-muted mb-2 line-clamp-2">
                        ${item.overview ? item.overview.substring(0, 200) + '...' : 'لا يوجد وصف متاح'}
                    </p>
                    <div class="flex items-center gap-4 text-sm text-muted">
                        <span>${(item.release_date || item.first_air_date || '').split('-')[0]}</span>
                        <div class="flex items-center gap-1 text-yellow-400">
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                            <span>${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                        ${item.genre_ids && item.genre_ids.length > 0 ? `
                            <span>${this.getGenreNames(item.genre_ids).slice(0, 2).join(', ')}</span>
                        ` : ''}
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="event.stopPropagation(); favoritesManager.addToFavorites(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
                            class="p-2 rounded-full border border-color hover:border-red-500 hover:text-red-500">
                        <i data-lucide="heart" class="w-4 h-4"></i>
                    </button>
                    <button onclick="event.stopPropagation(); favoritesManager.addToWatchlist(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
                            class="p-2 rounded-full border border-color hover:border-blue-500 hover:text-blue-500">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    }

    setupAutoComplete() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        // Create autocomplete container
        const autoCompleteContainer = document.createElement('div');
        autoCompleteContainer.id = 'autocomplete-container';
        autoCompleteContainer.className = 'absolute top-full left-0 right-0 bg-card border border-color rounded-lg shadow-lg z-50 hidden max-h-64 overflow-y-auto';
        
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(autoCompleteContainer);
    }

    showAutoComplete(suggestions = [], query = '') {
        const container = document.getElementById('autocomplete-container');
        if (!container) return;

        if (suggestions.length === 0 && this.searchHistory.length === 0) {
            this.hideAutoComplete();
            return;
        }

        let html = '';

        // Recent searches
        if (query.length < 2 && this.searchHistory.length > 0) {
            html += `
                <div class="p-2 border-b border-color">
                    <h4 class="text-sm font-medium text-muted">عمليات بحث حديثة</h4>
                </div>
            `;
            this.searchHistory.slice(0, 5).forEach(search => {
                html += `
                    <div class="autocomplete-item flex items-center gap-2 p-3 hover:bg-slate-700 cursor-pointer" 
                         onclick="searchManager.selectSuggestion('${search}')">
                        <i data-lucide="clock" class="w-4 h-4 text-muted"></i>
                        <span>${search}</span>
                    </div>
                `;
            });
        }

        // Search suggestions
        if (suggestions.length > 0) {
            if (html) html += '<div class="border-b border-color"></div>';
            suggestions.forEach(item => {
                html += `
                    <div class="autocomplete-item flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer" 
                         onclick="searchManager.selectSuggestion('${item.title || item.name}')">
                        <img src="${item.poster_path ? this.IMG_URL + item.poster_path : './images/placeholder.jpg'}" 
                             alt="${item.title || item.name}" 
                             class="w-8 h-12 object-cover rounded">
                        <div class="flex-1">
                            <div class="font-medium">${item.title || item.name}</div>
                            <div class="text-sm text-muted">${item.media_type === 'movie' ? 'فيلم' : 'مسلسل'} • ${(item.release_date || item.first_air_date || '').split('-')[0]}</div>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
        container.classList.remove('hidden');
        lucide.createIcons();
    }

    hideAutoComplete() {
        const container = document.getElementById('autocomplete-container');
        if (container) {
            container.classList.add('hidden');
        }
    }

    selectSuggestion(suggestion) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = suggestion;
            this.hideAutoComplete();
            this.performSearch(suggestion);
        }
    }

    handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const query = formData.get('query') || formData.get('search');
        
        if (query) {
            this.performSearch(query.trim());
            // Update URL
            const newUrl = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
            window.history.pushState({}, '', newUrl);
        }
    }

    handleFilterSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const filters = {};

        // Get selected content types
        const types = formData.getAll('type');
        if (types.length > 0) {
            filters.media_type = types.join(',');
        }

        // Get other filters
        if (formData.get('year')) filters.year = formData.get('year');
        if (formData.get('genre')) filters.with_genres = formData.get('genre');
        if (formData.get('rating') && formData.get('rating') > 0) {
            filters['vote_average.gte'] = formData.get('rating');
        }

        this.currentFilters = filters;
        const searchInput = document.getElementById('search-input');
        const query = searchInput ? searchInput.value : '';
        
        if (query) {
            this.performSearch(query, filters);
        }
    }

    clearFilters() {
        const filterForm = document.getElementById('filter-form');
        if (filterForm) {
            filterForm.reset();
            document.getElementById('rating-value').textContent = '0';
        }
        
        this.currentFilters = {};
        const searchInput = document.getElementById('search-input');
        const query = searchInput ? searchInput.value : '';
        
        if (query) {
            this.performSearch(query);
        }
    }

    sortResults(sortBy) {
        const sortedResults = [...this.currentResults].sort((a, b) => {
            switch (sortBy) {
                case 'rating-desc':
                    return (b.vote_average || 0) - (a.vote_average || 0);
                case 'rating-asc':
                    return (a.vote_average || 0) - (b.vote_average || 0);
                case 'date-desc':
                    return new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0);
                case 'date-asc':
                    return new Date(a.release_date || a.first_air_date || 0) - new Date(b.release_date || b.first_air_date || 0);
                case 'title-asc':
                    return (a.title || a.name || '').localeCompare(b.title || b.name || '');
                case 'relevance':
                default:
                    return (b.popularity || 0) - (a.popularity || 0);
            }
        });

        this.currentResults = sortedResults;
        this.updateResultsContainer();
    }

    toggleViewMode(mode) {
        localStorage.setItem('primevision_search_view', mode);
        this.updateResultsContainer();
    }

    getViewMode() {
        return localStorage.getItem('primevision_search_view') || 'grid';
    }

    updateResultsContainer() {
        const container = document.getElementById('results-container');
        if (container) {
            const viewMode = this.getViewMode();
            container.innerHTML = this.renderResults(viewMode);
            lucide.createIcons();
        }
    }

    setupResultsEventListeners() {
        // View toggle buttons
        const viewToggleBtns = document.querySelectorAll('.view-toggle');
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleViewMode(e.target.dataset.view));
        });

        // Sort select
        const sortSelect = document.getElementById('sort-results');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.sortResults(e.target.value));
        }

        // Filter form
        const filterForm = document.getElementById('filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => this.handleFilterSearch(e));
        }

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    showSearchLanding() {
        const contentArea = document.getElementById('content-area');
        if (!contentArea) return;

        contentArea.innerHTML = `
            <div class="text-center py-16">
                <i data-lucide="search" class="w-24 h-24 mx-auto mb-6 text-muted"></i>
                <h1 class="text-3xl font-bold mb-4">ابحث عن أفلامك ومسلسلاتك المفضلة</h1>
                <p class="text-muted mb-8 max-w-2xl mx-auto">
                    اكتشف آلاف الأفلام والمسلسلات باستخدام البحث المتقدم والمرشحات المتنوعة
                </p>
                
                <div class="max-w-md mx-auto mb-8">
                    <form id="main-search-form" class="relative">
                        <input type="text" 
                               name="query"
                               placeholder="ابحث عن أفلام، مسلسلات..."
                               class="form-input w-full pr-12 pl-4 py-3 text-lg rounded-full">
                        <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2">
                            <i data-lucide="search" class="w-6 h-6 text-muted"></i>
                        </button>
                    </form>
                </div>

                ${this.searchHistory.length > 0 ? `
                    <div class="max-w-md mx-auto">
                        <h3 class="font-medium mb-3">عمليات بحث حديثة</h3>
                        <div class="flex flex-wrap gap-2 justify-center">
                            ${this.searchHistory.slice(0, 8).map(search => `
                                <button onclick="searchManager.performSearch('${search}')" 
                                        class="genre-tag hover:bg-primary hover:text-white transition-colors">
                                    ${search}
                                </button>
                            `).join('')}
                        </div>
                        <button id="clear-history" class="text-sm text-muted hover:text-foreground mt-4">
                            مسح السجل
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        lucide.createIcons();

        // Setup main search form
        const mainSearchForm = document.getElementById('main-search-form');
        if (mainSearchForm) {
            mainSearchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Setup clear history
        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearSearchHistory());
        }
    }

    showLoading() {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="text-center py-16">
                    <div class="spinner mx-auto mb-4"></div>
                    <p class="text-muted">جاري البحث...</p>
                </div>
            `;
        }
    }

    showNoResults(query) {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 text-muted"></i>
                    <h2 class="text-2xl font-bold mb-2">لا توجد نتائج</h2>
                    <p class="text-muted mb-6">لم نجد أي نتائج لـ "${query}"</p>
                    <div class="space-y-2 text-sm text-muted">
                        <p>اقتراحات للحصول على نتائج أفضل:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>تأكد من الإملاء الصحيح</li>
                            <li>جرب كلمات مفتاحية مختلفة</li>
                            <li>استخدم كلمات أكثر عمومية</li>
                            <li>قلل من استخدام المرشحات</li>
                        </ul>
                    </div>
                </div>
            `;
        }
    }

    showError(message) {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="alert-triangle" class="w-16 h-16 mx-auto mb-4 text-red-400"></i>
                    <h2 class="text-2xl font-bold mb-2">حدث خطأ</h2>
                    <p class="text-muted">${message}</p>
                </div>
            `;
        }
    }

    // Search history management
    loadSearchHistory() {
        const history = localStorage.getItem('primevision_search_history');
        return history ? JSON.parse(history) : [];
    }

    addToSearchHistory(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery || trimmedQuery.length < 2) return;

        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== trimmedQuery);
        
        // Add to beginning
        this.searchHistory.unshift(trimmedQuery);
        
        // Keep only last 20 searches
        this.searchHistory = this.searchHistory.slice(0, 20);
        
        localStorage.setItem('primevision_search_history', JSON.stringify(this.searchHistory));
    }

    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('primevision_search_history');
        this.showSearchLanding();
    }

    renderSearchHistory() {
        if (this.searchHistory.length === 0) {
            return '<p class="text-sm text-muted">لا توجد عمليات بحث حديثة</p>';
        }

        return this.searchHistory.slice(0, 5).map(search => `
            <button onclick="searchManager.performSearch('${search}')" 
                    class="block w-full text-left text-sm py-1 px-2 rounded hover:bg-slate-700 transition-colors">
                ${search}
            </button>
        `).join('');
    }

    // Utility functions
    generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = 1950;
        let options = '';
        
        for (let year = currentYear; year >= startYear; year--) {
            options += `<option value="${year}">${year}</option>`;
        }
        
        return options;
    }

    getGenreNames(genreIds) {
        const genreMap = {
            28: 'أكشن', 12: 'مغامرة', 16: 'رسوم متحركة', 35: 'كوميديا',
            80: 'جريمة', 99: 'وثائقي', 18: 'دراما', 10751: 'عائلي',
            14: 'خيال', 36: 'تاريخي', 27: 'رعب', 10402: 'موسيقي',
            9648: 'غموض', 10749: 'رومانسي', 878: 'خيال علمي',
            10770: 'فيلم تلفزيوني', 53: 'إثارة', 10752: 'حرب', 37: 'غرب'
        };
        
        return genreIds.map(id => genreMap[id] || 'غير محدد').filter(Boolean);
    }

    toggleFilters() {
        const sidebar = document.getElementById('filters-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('hidden');
        }
    }
}

// Initialize search manager
let searchManager;
document.addEventListener('DOMContentLoaded', () => {
    searchManager = new SearchManager();
});
