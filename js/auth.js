// PrimeVision - Authentication Management
// Login/Signup functionality with Google OAuth

class AuthManager {
    constructor() {
        this.googleClientId = '1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com'; // Replace with your actual Google Client ID
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.initializeGoogleAuth();
    }

    initializeGoogleAuth() {
        // Initialize Google Sign-In
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: (response) => this.handleGoogleCallback(response),
                auto_select: false,
                cancel_on_tap_outside: true
            });
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Toggle between login and signup
        const toggleBtns = document.querySelectorAll('.auth-toggle');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleAuthMode(e));
        });

        // Google login buttons
        const googleLoginBtn = document.getElementById('google-login');
        const googleSignupBtn = document.getElementById('google-signup');
        
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.initiateGoogleLogin());
        }
        
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', () => this.initiateGoogleLogin());
        }

        // User menu toggle
        const userBtn = document.getElementById('user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Auth button in sidebar
        const authBtn = document.getElementById('auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', () => {
                const user = this.getCurrentUser();
                if (user) {
                    this.handleLogout();
                } else {
                    window.location.href = 'login.html';
                }
            });
        }

        // Language change event
        window.addEventListener('languageChanged', () => {
            this.updateUITexts();
        });
    }

    checkAuthStatus() {
        const userData = this.getCurrentUser();
        if (userData) {
            this.updateUIForLoggedInUser(userData);
        } else {
            this.updateUIForGuestUser();
        }
    }

    updateUITexts() {
        // Update translatable auth-related texts
        if (typeof languageManager !== 'undefined') {
            const authBtn = document.getElementById('auth-btn');
            if (authBtn) {
                const user = this.getCurrentUser();
                authBtn.textContent = user ? 
                    languageManager.translate('logout') : 
                    languageManager.translate('login');
            }

            // Update username display for guest users
            const usernameDisplays = document.querySelectorAll('.username-display');
            usernameDisplays.forEach(element => {
                if (element.textContent === 'زائر' || element.textContent === 'Guest') {
                    element.textContent = languageManager.translate('guest');
                }
            });
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username') || formData.get('email'),
            password: formData.get('password')
        };

        if (this.validateCredentials(credentials)) {
            this.loginUser(credentials);
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirm-password')
        };

        if (this.validateSignupData(userData)) {
            this.registerUser(userData);
        }
    }

    validateCredentials(credentials) {
        const errors = [];

        if (!credentials.username || credentials.username.length < 3) {
            const message = typeof languageManager !== 'undefined' ? 
                'Username must be at least 3 characters' : 
                'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
            errors.push(message);
        }

        if (!credentials.password || credentials.password.length < 6) {
            const message = typeof languageManager !== 'undefined' ? 
                'Password must be at least 6 characters' : 
                'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
            errors.push(message);
        }

        if (errors.length > 0) {
            this.showAuthError(errors.join('\n'));
            return false;
        }

        return true;
    }

    validateSignupData(userData) {
        const errors = [];

        if (!userData.username || userData.username.length < 3) {
            const message = typeof languageManager !== 'undefined' ? 
                'Username must be at least 3 characters' : 
                'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
            errors.push(message);
        }

        if (!userData.email || !this.isValidEmail(userData.email)) {
            const message = typeof languageManager !== 'undefined' ? 
                languageManager.translate('invalid_email') : 
                'يرجى إدخال بريد إلكتروني صحيح';
            errors.push(message);
        }

        if (!userData.password || userData.password.length < 6) {
            const message = typeof languageManager !== 'undefined' ? 
                'Password must be at least 6 characters' : 
                'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
            errors.push(message);
        }

        if (userData.password !== userData.confirmPassword) {
            const message = typeof languageManager !== 'undefined' ? 
                languageManager.translate('passwords_not_match') : 
                'كلمات المرور غير متطابقة';
            errors.push(message);
        }

        if (this.userExists(userData.username, userData.email)) {
            const message = typeof languageManager !== 'undefined' ? 
                languageManager.translate('user_exists') : 
                'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل';
            errors.push(message);
        }

        if (errors.length > 0) {
            this.showAuthError(errors.join('\n'));
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
    }

    userExists(username, email) {
        const existingUsers = this.getStoredUsers();
        return existingUsers.some(user => 
            user.username === username || user.email === email
        );
    }

    loginUser(credentials) {
        // In a real app, this would make an API call
        // For now, we'll simulate with localStorage
        const existingUsers = this.getStoredUsers();
        const user = existingUsers.find(u => 
            (u.username === credentials.username || u.email === credentials.username) &&
            u.password === credentials.password
        );

        if (user) {
            this.setCurrentUser({
                id: user.id,
                username: user.username,
                email: user.email,
                displayName: user.displayName || user.username,
                avatar: user.avatar || './images/default-avatar.jpg',
                provider: 'local'
            });
            
            const message = typeof languageManager !== 'undefined' ? 
                languageManager.translate('login_success') : 
                'تم تسجيل الدخول بنجاح';
            this.showAuthSuccess(message);
            this.redirectAfterLogin();
        } else {
            const message = typeof languageManager !== 'undefined' ? 
                languageManager.translate('invalid_credentials') : 
                'اسم المستخدم أو كلمة المرور غير صحيحة';
            this.showAuthError(message);
        }
    }

    registerUser(userData) {
        const newUser = {
            id: Date.now(),
            username: userData.username,
            email: userData.email,
            displayName: userData.username,
            password: userData.password, // In real app, this should be hashed
            avatar: './images/default-avatar.jpg',
            provider: 'local',
            createdAt: new Date().toISOString()
        };

        const existingUsers = this.getStoredUsers();
        existingUsers.push(newUser);
        localStorage.setItem('primevision_users', JSON.stringify(existingUsers));

        // Auto-login after registration
        this.setCurrentUser({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            displayName: newUser.displayName,
            avatar: newUser.avatar,
            provider: 'local'
        });

        const message = typeof languageManager !== 'undefined' ? 
            languageManager.translate('register_success') : 
            'تم إنشاء الحساب بنجاح';
        this.showAuthSuccess(message);
        this.redirectAfterLogin();
    }

    handleLogout() {
        localStorage.removeItem('primevision_user');
        this.updateUIForGuestUser();
        
        const message = typeof languageManager !== 'undefined' ? 
            languageManager.translate('logout_success') : 
            'تم تسجيل الخروج بنجاح';
        this.showAuthSuccess(message);
        
        // Redirect to home page if on protected pages
        const protectedPages = ['favorites.html', 'profile.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'index.html';
        }
    }

    // Google OAuth methods
    initiateGoogleLogin() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.prompt();
        } else {
            // Fallback for demo purposes
            this.handleGoogleLogin();
        }
    }

    handleGoogleCallback(response) {
        try {
            // Decode the JWT token (in a real app, you should verify this on your server)
            const payload = this.parseJwt(response.credential);
            
            const googleUser = {
                id: payload.sub,
                username: payload.name || payload.email.split('@')[0],
                displayName: payload.name,
                email: payload.email,
                avatar: payload.picture || './images/default-avatar.jpg',
                provider: 'google',
                verified: payload.email_verified
            };

            this.setCurrentUser(googleUser);
            
            const message = typeof languageManager !== 'undefined' ? 
                'Login successful with Google' : 
                'تم تسجيل الدخول عبر جوجل بنجاح';
            this.showAuthSuccess(message);
            this.redirectAfterLogin();
        } catch (error) {
            console.error('Google login error:', error);
            this.showAuthError('Google login failed');
        }
    }

    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    handleGoogleLogin() {
        // Fallback simulation for demo
        const mockGoogleUser = {
            id: Date.now(),
            username: 'Google User',
            displayName: 'Google User',
            email: 'user@gmail.com',
            avatar: 'https://lh3.googleusercontent.com/a/default-user',
            provider: 'google'
        };

        this.setCurrentUser(mockGoogleUser);
        
        const message = typeof languageManager !== 'undefined' ? 
            'Login successful with Google' : 
            'تم تسجيل الدخول عبر جوجل بنجاح';
        this.showAuthSuccess(message);
        this.redirectAfterLogin();
    }

    toggleUserMenu() {
        // Toggle user dropdown menu
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.classList.toggle('hidden');
        }
    }

    toggleAuthMode(e) {
        e.preventDefault();
        const loginForm = document.getElementById('login-section');
        const signupForm = document.getElementById('signup-section');
        
        if (loginForm && signupForm) {
            loginForm.classList.toggle('hidden');
            signupForm.classList.toggle('hidden');
        }
    }

    getCurrentUser() {
        const userJSON = localStorage.getItem('primevision_user');
        if (userJSON) {
            try {
                return JSON.parse(userJSON);
            } catch (e) {
                localStorage.removeItem('primevision_user');
                return null;
            }
        }
        return null;
    }

    setCurrentUser(userData) {
        localStorage.setItem('primevision_user', JSON.stringify({
            user: userData,
            favorites: [],
            watchlist: [],
            reviews: {},
            loginTime: new Date().toISOString()
        }));
        this.updateUIForLoggedInUser(userData);
    }

    getStoredUsers() {
        const usersJSON = localStorage.getItem('primevision_users');
        if (usersJSON) {
            try {
                return JSON.parse(usersJSON);
            } catch (e) {
                return this.getDefaultUsers();
            }
        }
        return this.getDefaultUsers();
    }

    getDefaultUsers() {
        // Create default demo users
        const defaultUsers = [
            {
                id: 1,
                username: 'demo_user',
                email: 'demo@primevision.com',
                displayName: 'Demo User',
                password: 'demo123',
                avatar: './images/default-avatar.jpg',
                provider: 'local',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                username: 'admin',
                email: 'admin@primevision.com',
                displayName: 'Administrator',
                password: 'admin123',
                avatar: './images/default-avatar.jpg',
                provider: 'local',
                createdAt: new Date().toISOString()
            }
        ];
        
        // Store default users
        localStorage.setItem('primevision_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }

    updateUIForLoggedInUser(userData) {
        // Update user display elements
        const usernameDisplays = document.querySelectorAll('.username-display');
        usernameDisplays.forEach(element => {
            element.textContent = userData.username || userData.user?.username || 'مستخدم';
        });

        // Update avatar
        const avatarImages = document.querySelectorAll('.user-avatar');
        avatarImages.forEach(img => {
            img.src = userData.avatar || userData.user?.avatar || './images/default-avatar.jpg';
        });

        // Show/hide auth-related elements
        const loginBtns = document.querySelectorAll('.login-btn');
        const logoutBtns = document.querySelectorAll('.logout-btn');
        const userMenus = document.querySelectorAll('.user-menu');

        loginBtns.forEach(btn => btn.classList.add('hidden'));
        logoutBtns.forEach(btn => btn.classList.remove('hidden'));
        userMenus.forEach(menu => menu.classList.remove('hidden'));
    }

    updateUIForGuestUser() {
        // Update user display elements
        const usernameDisplays = document.querySelectorAll('.username-display');
        usernameDisplays.forEach(element => {
            element.textContent = 'زائر';
        });

        // Reset avatar
        const avatarImages = document.querySelectorAll('.user-avatar');
        avatarImages.forEach(img => {
            img.src = './images/default-avatar.jpg';
        });

        // Show/hide auth-related elements
        const loginBtns = document.querySelectorAll('.login-btn');
        const logoutBtns = document.querySelectorAll('.logout-btn');
        const userMenus = document.querySelectorAll('.user-menu');

        loginBtns.forEach(btn => btn.classList.remove('hidden'));
        logoutBtns.forEach(btn => btn.classList.add('hidden'));
        userMenus.forEach(menu => menu.classList.add('hidden'));
    }

    showAuthError(message) {
        this.showAuthMessage(message, 'error');
    }

    showAuthSuccess(message) {
        this.showAuthMessage(message, 'success');
    }

    showAuthMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message fixed top-4 right-4 z-50 p-4 rounded-lg max-w-sm ${
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'success' ? 'bg-green-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        messageDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="${type === 'error' ? 'alert-circle' : type === 'success' ? 'check-circle' : 'info'}" class="w-5 h-5"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        document.body.appendChild(messageDiv);
        lucide.createIcons();

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    redirectAfterLogin() {
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return') || 'index.html';
        
        setTimeout(() => {
            window.location.href = returnUrl;
        }, 1500);
    }

    // Check if user is authenticated (for protected pages)
    requireAuth() {
        const user = this.getCurrentUser();
        if (!user) {
            const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `login.html?return=${currentUrl}`;
            return false;
        }
        return true;
    }

    // Update user profile
    updateProfile(profileData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        const updatedUser = {
            ...currentUser,
            user: {
                ...currentUser.user,
                ...profileData
            }
        };

        this.setCurrentUser(updatedUser.user);
        
        // Update stored users list
        const storedUsers = this.getStoredUsers();
        const userIndex = storedUsers.findIndex(u => u.id === currentUser.user.id);
        if (userIndex > -1) {
            storedUsers[userIndex] = { ...storedUsers[userIndex], ...profileData };
            localStorage.setItem('primevision_users', JSON.stringify(storedUsers));
        }

        return true;
    }

    // Change password
    changePassword(currentPassword, newPassword) {
        const userData = this.getCurrentUser();
        if (!userData) return false;

        const storedUsers = this.getStoredUsers();
        const user = storedUsers.find(u => u.id === userData.user.id);
        
        if (!user || user.password !== currentPassword) {
            this.showAuthError('كلمة المرور الحالية غير صحيحة');
            return false;
        }

        user.password = newPassword;
        localStorage.setItem('primevision_users', JSON.stringify(storedUsers));
        this.showAuthSuccess('تم تغيير كلمة المرور بنجاح');
        return true;
    }
}

// Initialize auth manager
let authManager;
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
});
