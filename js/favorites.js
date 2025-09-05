// PrimeVision - Favorites & Watchlist Management
// Handle user's favorite movies/shows and watchlist

class FavoritesManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadPageContent();
    }

    loadUserData() {
        const userJSON = localStorage.getItem('primevision_user');
        if (userJSON) {
            try {
                const userData = JSON.parse(userJSON);
                this.favorites = userData.favorites || [];
                this.watchlist = userData.watchlist || [];
                this.user = userData.user;
            } catch (e) {
                this.favorites = [];
                this.watchlist = [];
                this.user = null;
            }
        } else {
            this.favorites = [];
            this.watchlist = [];
            this.user = null;
        }
    }

    saveUserData() {
        if (this.user) {
            const existingData = JSON.parse(localStorage.getItem('primevision_user') || '{}');
            const updatedData = {
                ...existingData,
                favorites: this.favorites,
                watchlist: this.watchlist
            };
            localStorage.setItem('primevision_user', JSON.stringify(updatedData));
        }
    }

    setupEventListeners() {
        // Tab switching
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // View mode toggle
        const viewToggleBtns = document.querySelectorAll('.view-toggle');
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleViewMode(e.target.dataset.view));
        });

        // Sort options
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.sortItems(e.target.value));
        }

        // Clear all buttons
        const clearFavoritesBtn = document.getElementById('clear-favorites');
        const clearWatchlistBtn = document.getElementById('clear-watchlist');
        
        if (clearFavoritesBtn) {
            clearFavoritesBtn.addEventListener('click', () => this.clearFavorites());
        }
        
        if (clearWatchlistBtn) {
            clearWatchlistBtn.addEventListener('click', () => this.clearWatchlist());
        }
    }

    loadPageContent() {
        // Check if user is logged in
        if (!this.user) {
            this.showLoginRequired();
            return;
        }

        this.renderFavoritesPage();
    }

    showLoginRequired() {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="heart" class="w-16 h-16 mx-auto mb-4 text-muted"></i>
                    <h2 class="text-2xl font-bold mb-2">تسجيل الدخول مطلوب</h2>
                    <p class="text-muted mb-6">يجب تسجيل الدخول لعرض المفضلة وقائمة المشاهدة</p>
                    <a href="login.html" class="btn-primary">تسجيل الدخول</a>
                </div>
            `;
            lucide.createIcons();
        }
    }

    renderFavoritesPage() {
        const contentArea = document.getElementById('content-area');
        if (!contentArea) return;

        const currentTab = this.getCurrentTab();
        const items = currentTab === 'favorites' ? this.favorites : this.watchlist;
        const viewMode = this.getViewMode();

        contentArea.innerHTML = `
            <div class="fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 class="text-3xl font-bold">مكتبتي</h1>
                    <div class="flex items-center gap-2">
                        <select id="sort-select" class="form-input text-sm">
                            <option value="date-desc">الأحدث أولاً</option>
                            <option value="date-asc">الأقدم أولاً</option>
                            <option value="rating-desc">التقييم (عالي إلى منخفض)</option>
                            <option value="rating-asc">التقييم (منخفض إلى عالي)</option>
                            <option value="title-asc">الاسم (أ-ي)</option>
                            <option value="title-desc">الاسم (ي-أ)</option>
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

                <div class="flex gap-1 mb-6 border-b border-color">
                    <button class="tab-btn px-4 py-2 ${currentTab === 'favorites' ? 'border-b-2 border-primary text-primary' : 'text-muted'}" data-tab="favorites">
                        المفضلة (${this.favorites.length})
                    </button>
                    <button class="tab-btn px-4 py-2 ${currentTab === 'watchlist' ? 'border-b-2 border-primary text-primary' : 'text-muted'}" data-tab="watchlist">
                        قائمة المشاهدة (${this.watchlist.length})
                    </button>
                </div>

                <div id="items-container">
                    ${this.renderItems(items, viewMode, currentTab)}
                </div>
            </div>
        `;

        lucide.createIcons();
        this.setupItemEventListeners();
    }

    renderItems(items, viewMode = 'grid', listType = 'favorites') {
        if (items.length === 0) {
            return this.renderEmptyState(listType);
        }

        if (viewMode === 'list') {
            return this.renderListView(items, listType);
        } else {
            return this.renderGridView(items, listType);
        }
    }

    renderEmptyState(listType) {
        const isWatchlist = listType === 'watchlist';
        return `
            <div class="empty-state">
                <i data-lucide="${isWatchlist ? 'list-video' : 'heart'}" class="w-16 h-16 mx-auto mb-4 text-muted"></i>
                <h3 class="text-xl font-bold mb-2">${isWatchlist ? 'قائمة المشاهدة فارغة' : 'لا توجد مفضلة'}</h3>
                <p class="text-muted mb-6">${isWatchlist ? 'لم تقم بإضافة أي عنصر إلى قائمة المشاهدة بعد' : 'لم تقم بإضافة أي عنصر إلى المفضلة بعد'}</p>
                <a href="index.html" class="btn-primary">استكشاف المحتوى</a>
                ${items.length > 0 ? `
                    <button id="clear-${listType}" class="btn-secondary mt-3">
                        مسح جميع العناصر
                    </button>
                ` : ''}
            </div>
        `;
    }

    renderGridView(items, listType) {
        return `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                ${items.map(item => this.renderGridItem(item, listType)).join('')}
            </div>
            ${items.length > 0 ? `
                <div class="text-center mt-8">
                    <button id="clear-${listType}" class="btn-secondary">
                        <i data-lucide="trash-2" class="w-4 h-4 mr-2"></i>
                        مسح جميع العناصر
                    </button>
                </div>
            ` : ''}
        `;
    }

    renderListView(items, listType) {
        return `
            <div class="space-y-2">
                ${items.map(item => this.renderListItem(item, listType)).join('')}
            </div>
            ${items.length > 0 ? `
                <div class="text-center mt-8">
                    <button id="clear-${listType}" class="btn-secondary">
                        <i data-lucide="trash-2" class="w-4 h-4 mr-2"></i>
                        مسح جميع العناصر
                    </button>
                </div>
            ` : ''}
        `;
    }

    renderGridItem(item, listType) {
        const posterUrl = item.poster_path ? 
            `https://image.tmdb.org/t/p/w500${item.poster_path}` : 
            './images/placeholder.jpg';
        
        return `
            <div class="content-card group relative">
                <div class="poster-container relative">
                    <img src="${posterUrl}" 
                         alt="${item.title || item.name}" 
                         class="w-full h-full object-cover">
                    <div class="overlay absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 class="font-bold text-white mb-2 text-sm">${item.title || item.name}</h3>
                        <p class="text-xs text-slate-300 mb-2">${(item.release_date || item.first_air_date || '').split('-')[0]}</p>
                        <div class="flex items-center gap-1 text-yellow-400 mb-3 text-xs">
                            <i data-lucide="star" class="w-3 h-3 fill-current"></i>
                            <span>${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="app.showDetails(${item.id}, '${item.media_type}')" 
                                    class="btn-primary text-xs px-2 py-1">
                                التفاصيل
                            </button>
                            <button onclick="favoritesManager.removeItem(${item.id}, '${listType}')" 
                                    class="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">
                                إزالة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderListItem(item, listType) {
        const posterUrl = item.poster_path ? 
            `https://image.tmdb.org/t/p/w500${item.poster_path}` : 
            './images/placeholder.jpg';
        
        return `
            <div class="search-result-item flex items-center gap-4 p-4">
                <img src="${posterUrl}" 
                     alt="${item.title || item.name}" 
                     class="w-16 h-24 object-cover rounded-md">
                <div class="flex-1">
                    <h3 class="font-bold text-lg mb-1">${item.title || item.name}</h3>
                    <p class="text-sm text-muted mb-2">${item.overview ? item.overview.substring(0, 150) + '...' : 'لا يوجد وصف متاح'}</p>
                    <div class="flex items-center gap-4 text-sm text-muted">
                        <span>${(item.release_date || item.first_air_date || '').split('-')[0]}</span>
                        <div class="flex items-center gap-1 text-yellow-400">
                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                            <span>${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                        <span class="genre-tag">${item.media_type === 'movie' ? 'فيلم' : 'مسلسل'}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="app.showDetails(${item.id}, '${item.media_type}')" 
                            class="btn-primary text-sm px-3 py-1">
                        التفاصيل
                    </button>
                    <button onclick="favoritesManager.removeItem(${item.id}, '${listType}')" 
                            class="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600">
                        إزالة
                    </button>
                </div>
            </div>
        `;
    }

    setupItemEventListeners() {
        // Remove item buttons
        const removeButtons = document.querySelectorAll('[onclick^="favoritesManager.removeItem"]');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Clear all buttons
        const clearFavoritesBtn = document.getElementById('clear-favorites');
        const clearWatchlistBtn = document.getElementById('clear-watchlist');
        
        if (clearFavoritesBtn) {
            clearFavoritesBtn.addEventListener('click', () => this.clearFavorites());
        }
        
        if (clearWatchlistBtn) {
            clearWatchlistBtn.addEventListener('click', () => this.clearWatchlist());
        }
    }

    switchTab(tab) {
        localStorage.setItem('primevision_favorites_tab', tab);
        this.renderFavoritesPage();
    }

    getCurrentTab() {
        return localStorage.getItem('primevision_favorites_tab') || 'favorites';
    }

    toggleViewMode(mode) {
        localStorage.setItem('primevision_favorites_view', mode);
        this.renderFavoritesPage();
    }

    getViewMode() {
        return localStorage.getItem('primevision_favorites_view') || 'grid';
    }

    sortItems(sortBy) {
        const currentTab = this.getCurrentTab();
        const items = currentTab === 'favorites' ? this.favorites : this.watchlist;
        
        const sortedItems = [...items].sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0);
                case 'date-asc':
                    return new Date(a.release_date || a.first_air_date || 0) - new Date(b.release_date || b.first_air_date || 0);
                case 'rating-desc':
                    return (b.vote_average || 0) - (a.vote_average || 0);
                case 'rating-asc':
                    return (a.vote_average || 0) - (b.vote_average || 0);
                case 'title-asc':
                    return (a.title || a.name || '').localeCompare(b.title || b.name || '');
                case 'title-desc':
                    return (b.title || b.name || '').localeCompare(a.title || a.name || '');
                default:
                    return 0;
            }
        });

        if (currentTab === 'favorites') {
            this.favorites = sortedItems;
        } else {
            this.watchlist = sortedItems;
        }

        this.saveUserData();
        this.updateItemsContainer();
    }

    updateItemsContainer() {
        const currentTab = this.getCurrentTab();
        const items = currentTab === 'favorites' ? this.favorites : this.watchlist;
        const viewMode = this.getViewMode();
        
        const container = document.getElementById('items-container');
        if (container) {
            container.innerHTML = this.renderItems(items, viewMode, currentTab);
            lucide.createIcons();
            this.setupItemEventListeners();
        }
    }

    removeItem(id, listType) {
        if (confirm('هل أنت متأكد من إزالة هذا العنصر؟')) {
            if (listType === 'favorites') {
                this.favorites = this.favorites.filter(item => item.id !== id);
            } else {
                this.watchlist = this.watchlist.filter(item => item.id !== id);
            }
            
            this.saveUserData();
            this.updateItemsContainer();
            this.updateTabCounts();
        }
    }

    clearFavorites() {
        if (confirm('هل أنت متأكد من مسح جميع المفضلة؟ لا يمكن التراجع عن هذا الإجراء.')) {
            this.favorites = [];
            this.saveUserData();
            this.renderFavoritesPage();
        }
    }

    clearWatchlist() {
        if (confirm('هل أنت متأكد من مسح جميع عناصر قائمة المشاهدة؟ لا يمكن التراجع عن هذا الإجراء.')) {
            this.watchlist = [];
            this.saveUserData();
            this.renderFavoritesPage();
        }
    }

    updateTabCounts() {
        const favTab = document.querySelector('[data-tab="favorites"]');
        const watchlistTab = document.querySelector('[data-tab="watchlist"]');
        
        if (favTab) {
            favTab.textContent = `المفضلة (${this.favorites.length})`;
        }
        
        if (watchlistTab) {
            watchlistTab.textContent = `قائمة المشاهدة (${this.watchlist.length})`;
        }
    }

    // Public methods to add/remove items (called from other parts of the app)
    addToFavorites(item) {
        if (!this.user) return false;
        
        const exists = this.favorites.some(fav => fav.id === item.id);
        if (!exists) {
            this.favorites.push(item);
            this.saveUserData();
            return true;
        }
        return false;
    }

    removeFromFavorites(itemId) {
        if (!this.user) return false;
        
        const index = this.favorites.findIndex(fav => fav.id === itemId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveUserData();
            return true;
        }
        return false;
    }

    addToWatchlist(item) {
        if (!this.user) return false;
        
        const exists = this.watchlist.some(wItem => wItem.id === item.id);
        if (!exists) {
            this.watchlist.push(item);
            this.saveUserData();
            return true;
        }
        return false;
    }

    removeFromWatchlist(itemId) {
        if (!this.user) return false;
        
        const index = this.watchlist.findIndex(wItem => wItem.id === itemId);
        if (index > -1) {
            this.watchlist.splice(index, 1);
            this.saveUserData();
            return true;
        }
        return false;
    }

    isFavorite(itemId) {
        return this.favorites.some(fav => fav.id === itemId);
    }

    isInWatchlist(itemId) {
        return this.watchlist.some(wItem => wItem.id === itemId);
    }

    exportData() {
        const data = {
            favorites: this.favorites,
            watchlist: this.watchlist,
            exportDate: new Date().toISOString(),
            user: this.user?.username || 'unknown'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `primevision-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.favorites && data.watchlist) {
                    if (confirm('هل تريد استبدال البيانات الحالية أم دمجها مع البيانات المستوردة؟\\n\\nاختر "موافق" للاستبدال أو "إلغاء" للدمج')) {
                        this.favorites = data.favorites;
                        this.watchlist = data.watchlist;
                    } else {
                        // Merge data
                        data.favorites.forEach(item => {
                            if (!this.favorites.some(fav => fav.id === item.id)) {
                                this.favorites.push(item);
                            }
                        });
                        data.watchlist.forEach(item => {
                            if (!this.watchlist.some(wItem => wItem.id === item.id)) {
                                this.watchlist.push(item);
                            }
                        });
                    }
                    this.saveUserData();
                    this.renderFavoritesPage();
                    alert('تم استيراد البيانات بنجاح');
                } else {
                    alert('ملف غير صالح');
                }
            } catch (error) {
                alert('خطأ في قراءة الملف');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize favorites manager
let favoritesManager;
document.addEventListener('DOMContentLoaded', () => {
    favoritesManager = new FavoritesManager();
});
