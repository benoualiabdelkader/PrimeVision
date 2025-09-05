// PrimeVision - Language Management
// Multi-language support for Arabic and English

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('primevision_language') || 'ar';
        this.isInitialized = false;
        this.translations = {
            ar: {
                // Navigation
                'home': 'الرئيسية',
                'search': 'البحث',
                'movies': 'أفلام',
                'tv_shows': 'مسلسلات',
                'favorites': 'المفضلة',
                'watchlist': 'قائمة المشاهدة',
                'profile': 'الملف الشخصي',
                'login': 'تسجيل الدخول',
                'signup': 'إنشاء حساب',
                'logout': 'تسجيل الخروج',
                
                // Common
                'welcome': 'مرحباً بك',
                'guest': 'زائر',
                'loading': 'جاري التحميل...',
                'error': 'خطأ',
                'success': 'نجح',
                'save': 'حفظ',
                'cancel': 'إلغاء',
                'delete': 'حذف',
                'edit': 'تعديل',
                'close': 'إغلاق',
                
                // Search
                'search_placeholder': 'ابحث عن أفلام، مسلسلات...',
                'search_movies': 'ابحث عن أفلام',
                'search_tv': 'ابحث عن مسلسلات',
                'no_results': 'لا توجد نتائج',
                'search_results': 'نتائج البحث',
                
                // Authentication
                'username': 'اسم المستخدم',
                'email': 'البريد الإلكتروني',
                'password': 'كلمة المرور',
                'confirm_password': 'تأكيد كلمة المرور',
                'remember_me': 'تذكرني',
                'forgot_password': 'نسيت كلمة المرور؟',
                'login_success': 'تم تسجيل الدخول بنجاح',
                'logout_success': 'تم تسجيل الخروج بنجاح',
                'register_success': 'تم إنشاء الحساب بنجاح',
                'google_login': 'متابعة باستخدام جوجل',
                'google_signup': 'التسجيل باستخدام جوجل',
                'already_have_account': 'لديك حساب بالفعل؟',
                'no_account': 'ليس لديك حساب؟',
                'create_account': 'إنشاء حساب جديد',
                
                // Profile
                'my_profile': 'ملفي الشخصي',
                'account_settings': 'إعدادات الحساب',
                'preferences': 'التفضيلات',
                'display_name': 'الاسم المعروض',
                'bio': 'نبذة تعريفية',
                'notifications': 'الإشعارات',
                'theme': 'السمة',
                'language': 'اللغة',
                'dark_mode': 'الوضع المظلم',
                'light_mode': 'الوضع المضيء',
                
                // Favorites & Watchlist
                'add_to_favorites': 'إضافة للمفضلة',
                'remove_from_favorites': 'إزالة من المفضلة',
                'add_to_watchlist': 'إضافة لقائمة المشاهدة',
                'remove_from_watchlist': 'إزالة من قائمة المشاهدة',
                'my_favorites': 'مفضلتي',
                'my_watchlist': 'قائمة مشاهدتي',
                'empty_favorites': 'لا توجد عناصر في المفضلة',
                'empty_watchlist': 'قائمة المشاهدة فارغة',
                
                // Favorites page additional translations
                'favorites_and_watchlist': 'المفضلة وقائمة المشاهدة',
                'manage_favorites': 'إدارة قوائمك المفضلة',
                'all_types': 'جميع الأنواع',
                'newest_first': 'الأحدث أولاً',
                'oldest_first': 'الأقدم أولاً',
                'title_a_z': 'العنوان (أ-ي)',
                'highest_rated': 'أعلى تقييم',
                'clear_all': 'مسح الكل',
                'no_favorites': 'لا توجد مفضلة',
                'add_favorites_desc': 'ابدأ بإضافة أفلام ومسلسلات إلى قائمة المفضلة',
                'browse_content': 'تصفح المحتوى',
                'no_watchlist': 'قائمة المشاهدة فارغة',
                'add_watchlist_desc': 'أضف أفلام ومسلسلات لمشاهدتها لاحقاً',
                
                // Profile page additional translations
                'edit_profile': 'تعديل الملف الشخصي',
                'change_password': 'تغيير كلمة المرور',
                'statistics': 'الإحصائيات',
                'recent_activity': 'النشاط الأخير',
                'no_recent_activity': 'لا يوجد نشاط حديث',
                'account_settings': 'إعدادات الحساب',
                'email_notifications': 'إشعارات البريد الإلكتروني',
                'email_notifications_desc': 'احصل على إشعارات حول المحتوى الجديد',
                'auto_play': 'التشغيل التلقائي',
                'auto_play_desc': 'تشغيل المقاطع التريلر تلقائياً',
                'data_export': 'تصدير البيانات',
                'data_export_desc': 'تحميل نسخة من بياناتك',
                'export': 'تصدير',
                'delete_account': 'حذف الحساب',
                'delete_account_desc': 'حذف حسابك وجميع بياناتك نهائياً',
                'delete': 'حذف',
                'reviews': 'المراجعات',
                
                // Content
                'details': 'التفاصيل',
                'rating': 'التقييم',
                'release_date': 'تاريخ الإصدار',
                'runtime': 'المدة',
                'genres': 'التصنيفات',
                'overview': 'نظرة عامة',
                'cast': 'الممثلون',
                'reviews': 'المراجعات',
                'similar': 'محتوى مشابه',
                'recommendations': 'التوصيات',
                'trailer': 'المقطع الدعائي',
                'watch_trailer': 'مشاهدة المقطع الدعائي',
                
                // Errors & Messages
                'auth_required': 'تسجيل الدخول مطلوب',
                'invalid_credentials': 'اسم المستخدم أو كلمة المرور غير صحيحة',
                'user_exists': 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل',
                'passwords_not_match': 'كلمات المرور غير متطابقة',
                'invalid_email': 'يرجى إدخال بريد إلكتروني صحيح',
                'network_error': 'خطأ في الشبكة، يرجى المحاولة مرة أخرى',
                
                // Filters & Sorting
                'filter': 'تصفية',
                'sort': 'ترتيب',
                'sort_by': 'ترتيب حسب',
                'popularity': 'الشعبية',
                'release_date_desc': 'الأحدث',
                'release_date_asc': 'الأقدم',
                'rating_desc': 'تقييم عالي',
                'rating_asc': 'تقييم منخفض',
                'title_asc': 'الاسم (أ-ي)',
                'title_desc': 'الاسم (ي-أ)',
                'all_genres': 'جميع التصنيفات',
                // Page titles
                'app_title': 'PrimeVision - عالمك المتدفق',
                'home_title': 'PrimeVision - الصفحة الرئيسية',
                'search_title': 'PrimeVision - البحث',
                'login_title': 'PrimeVision - تسجيل الدخول',
                'profile_title': 'PrimeVision - الملف الشخصي',
                'favorites_title': 'PrimeVision - المفضلة وقائمة المشاهدة',
                
                // Welcome messages
                'welcome_back': 'أهلاً بك مرة أخرى',
                'join_primevision': 'انضم إلى عائلة PrimeVision',
                'streaming_world': 'عالمك المتدفق',
            },
            en: {
                // Navigation
                'home': 'Home',
                'search': 'Search',
                'movies': 'Movies',
                'tv_shows': 'TV Shows',
                'favorites': 'Favorites',
                'watchlist': 'Watchlist',
                'profile': 'Profile',
                'login': 'Login',
                'signup': 'Sign Up',
                'logout': 'Logout',
                
                // Common
                'welcome': 'Welcome',
                'guest': 'Guest',
                'loading': 'Loading...',
                'error': 'Error',
                'success': 'Success',
                'save': 'Save',
                'cancel': 'Cancel',
                'delete': 'Delete',
                'edit': 'Edit',
                'close': 'Close',
                
                // Search
                'search_placeholder': 'Search for movies, TV shows...',
                'search_movies': 'Search Movies',
                'search_tv': 'Search TV Shows',
                'no_results': 'No results found',
                'search_results': 'Search Results',
                
                // Authentication
                'username': 'Username',
                'email': 'Email',
                'password': 'Password',
                'confirm_password': 'Confirm Password',
                'remember_me': 'Remember me',
                'forgot_password': 'Forgot password?',
                'login_success': 'Login successful',
                'logout_success': 'Logout successful',
                'register_success': 'Account created successfully',
                'google_login': 'Continue with Google',
                'google_signup': 'Sign up with Google',
                'already_have_account': 'Already have an account?',
                'no_account': 'Don\'t have an account?',
                'create_account': 'Create new account',
                
                // Profile
                'my_profile': 'My Profile',
                'account_settings': 'Account Settings',
                'preferences': 'Preferences',
                'display_name': 'Display Name',
                'bio': 'Bio',
                'notifications': 'Notifications',
                'theme': 'Theme',
                'language': 'Language',
                'dark_mode': 'Dark Mode',
                'light_mode': 'Light Mode',
                
                // Favorites & Watchlist
                'add_to_favorites': 'Add to Favorites',
                'remove_from_favorites': 'Remove from Favorites',
                'add_to_watchlist': 'Add to Watchlist',
                'remove_from_watchlist': 'Remove from Watchlist',
                'my_favorites': 'My Favorites',
                'my_watchlist': 'My Watchlist',
                'empty_favorites': 'No items in favorites',
                'empty_watchlist': 'Watchlist is empty',
                
                // Content
                'details': 'Details',
                'rating': 'Rating',
                'release_date': 'Release Date',
                'runtime': 'Runtime',
                'genres': 'Genres',
                'overview': 'Overview',
                'cast': 'Cast',
                'reviews': 'Reviews',
                'similar': 'Similar Content',
                'recommendations': 'Recommendations',
                'trailer': 'Trailer',
                'watch_trailer': 'Watch Trailer',
                
                // Errors & Messages
                'auth_required': 'Authentication required',
                'invalid_credentials': 'Invalid username or password',
                'user_exists': 'Username or email already exists',
                'passwords_not_match': 'Passwords do not match',
                'invalid_email': 'Please enter a valid email',
                'network_error': 'Network error, please try again',
                
                // Filters & Sorting
                'filter': 'Filter',
                'sort': 'Sort',
                'sort_by': 'Sort by',
                'popularity': 'Popularity',
                'release_date_desc': 'Newest',
                'release_date_asc': 'Oldest',
                'rating_desc': 'High Rating',
                'rating_asc': 'Low Rating',
                'title_asc': 'Title (A-Z)',
                'title_desc': 'Title (Z-A)',
                'all_genres': 'All Genres',
                // Page titles  
                'app_title': 'PrimeVision - Your Streaming World',
                'home_title': 'PrimeVision - Home',
                'search_title': 'PrimeVision - Search',
                'login_title': 'PrimeVision - Login',
                'profile_title': 'PrimeVision - Profile',
                'favorites_title': 'PrimeVision - Favorites & Watchlist',
                
                // Welcome messages
                'welcome_back': 'Welcome back',
                'join_primevision': 'Join the PrimeVision family',
                'streaming_world': 'Your Streaming World',
                
                // Profile page
                'profile': 'Profile',
                'edit_profile': 'Edit Profile',
                'change_password': 'Change Password',
                'statistics': 'Statistics',
                'recent_activity': 'Recent Activity',
                'no_recent_activity': 'No recent activity',
                'account_settings': 'Account Settings',
                'email_notifications': 'Email Notifications',
                'email_notifications_desc': 'Get notifications about new content',
                'auto_play': 'Auto Play',
                'auto_play_desc': 'Automatically play trailers',
                'data_export': 'Data Export',
                'data_export_desc': 'Download a copy of your data',
                'export': 'Export',
                'delete_account': 'Delete Account',
                'delete_account_desc': 'Permanently delete your account and all data',
                'delete': 'Delete',
                'reviews': 'Reviews',
                
                // Favorites page
                'favorites_and_watchlist': 'Favorites & Watchlist',
                'manage_favorites': 'Manage your favorite lists',
                'all_types': 'All Types',
                'newest_first': 'Newest First',
                'oldest_first': 'Oldest First',
                'title_a_z': 'Title (A-Z)',
                'highest_rated': 'Highest Rated',
                'clear_all': 'Clear All',
                'no_favorites': 'No Favorites',
                'add_favorites_desc': 'Start adding movies and TV shows to your favorites',
                'browse_content': 'Browse Content',
                'no_watchlist': 'Empty Watchlist',
                'add_watchlist_desc': 'Add movies and TV shows to watch later',
            }
        };
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        
        // Clear any existing language state
        this.clearLanguageState();
        
        // Apply the current language
        this.applyLanguage(this.currentLanguage);
        this.setupLanguageToggle();
    }

    clearLanguageState() {
        // Clear any existing translations to prevent mixing
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            element.textContent = '';
        });
    }

    setupLanguageToggle() {
        // Create language toggle if it doesn't exist
        const existingToggle = document.getElementById('language-toggle');
        if (!existingToggle) {
            this.createLanguageToggle();
        }

        // Add event listener
        document.addEventListener('click', (e) => {
            if (e.target.closest('#language-toggle')) {
                this.toggleLanguage();
            }
        });
    }

    createLanguageToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const languageToggle = document.createElement('button');
            languageToggle.id = 'language-toggle';
            languageToggle.className = 'w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors mt-2';
            languageToggle.innerHTML = `
                <i data-lucide="languages" class="w-5 h-5 text-slate-400"></i>
                <span id="language-text">${this.currentLanguage === 'ar' ? 'English' : 'العربية'}</span>
            `;
            themeToggle.parentNode.insertBefore(languageToggle, themeToggle.nextSibling);
            lucide.createIcons();
        }
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
        this.setLanguage(newLanguage);
    }

    setLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('primevision_language', language);
        this.applyLanguage(language);
    }

    applyLanguage(language) {
        const html = document.documentElement;
        
        // Clear existing state first to prevent mixing
        this.clearLanguageState();
        
        // Set HTML attributes
        html.setAttribute('lang', language);
        html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        
        // Add language-specific body class
        document.body.className = document.body.className.replace(/lang-(ar|en)/g, '');
        document.body.classList.add(`lang-${language}`);
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            // Update page title
            document.title = this.translate('app_title');
            
            // Update all translatable elements
            this.updateTranslatableElements();
            
            // Update language toggle text
            const languageText = document.getElementById('language-text');
            if (languageText) {
                languageText.textContent = language === 'ar' ? 'English' : 'العربية';
            }
            
            // Update placeholders
            this.updatePlaceholders();
        }, 50);
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));
    }

    updateTranslatableElements() {
        // Update elements with data-translate attribute
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translate(key);
            if (translation && translation !== key) {
                // Only update if we have a valid translation
                element.textContent = translation;
            }
        });
        
        // Force re-render of any dynamic content
        this.updateDynamicContent();
    }

    updateDynamicContent() {
        // Update any content that might be dynamically generated
        const movieCards = document.querySelectorAll('.movie-card, .tv-card');
        movieCards.forEach(card => {
            // Update any translatable elements within cards
            const translatableInCard = card.querySelectorAll('[data-translate]');
            translatableInCard.forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = this.translate(key);
                if (translation && translation !== key) {
                    element.textContent = translation;
                }
            });
        });
    }

    updatePlaceholders() {
        // Update input placeholders
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.placeholder = this.translate('search_placeholder');
        }
    }

    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isRTL() {
        return this.currentLanguage === 'ar';
    }
}

// Initialize language manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Ensure language manager is initialized after DOM is loaded
    if (window.languageManager && !window.languageManager.isInitialized) {
        window.languageManager.init();
    }
});

// Initialize language manager immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (window.languageManager && !window.languageManager.isInitialized) {
            window.languageManager.init();
        }
    });
} else {
    // DOM is already loaded
    if (window.languageManager && !window.languageManager.isInitialized) {
        window.languageManager.init();
    }
}
