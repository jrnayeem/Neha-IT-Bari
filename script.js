const CONFIG = {
    backendURL: "https://script.google.com/macros/s/AKfycbxDi9q7T5_ytpLjXgCXt0cIdvAktIqMl31dC9-9xo_8g23TKjC4D3Y4TIlWXePTivDd/exec"
};

let isLoggedIn = false;

window.onload = function() {
    checkLoginStatus();
};

function setNotice(msg) {
    const noticeEl = document.getElementById('dynamicNotice');
    if (noticeEl) noticeEl.innerText = msg;
}

function checkLoginStatus() {
    const savedUser = localStorage.getItem('proToolsUser');
    let user = null;
    try {
        user = JSON.parse(savedUser);
    } catch (e) {
        user = null;
    }

    if (user && user.isLoggedIn && user.username) {
        isLoggedIn = true;
        const homeSection = document.getElementById('home-section');
        if (homeSection) homeSection.classList.add('hidden');
        const dashSection = document.getElementById('dashboard-section');
        if (dashSection) dashSection.classList.remove('hidden');
        
        const navBtn = document.getElementById('navAuthBtn');
        if (navBtn) {
            navBtn.innerHTML = `<i class="ph-bold ph-sign-out mr-1.5"></i> Logout`;
            navBtn.className = "px-4 py-2 md:px-6 md:py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-xs md:text-sm font-black shadow-md";
            navBtn.onclick = logout;
        }

        const dashUserName = document.getElementById('dashUserName');
        if (dashUserName) dashUserName.innerText = user.name || user.username || "Md Jubaer Rahman";
        
        // Logged-in user has full access to all tools
        updateUIForLoggedInUser(user);
    } else {
        isLoggedIn = false;
        const homeSection = document.getElementById('home-section');
        if (homeSection) homeSection.classList.remove('hidden');
        const dashSection = document.getElementById('dashboard-section');
        if (dashSection) dashSection.classList.add('hidden');
        
        const navBtn = document.getElementById('navAuthBtn');
        if (navBtn) {
            navBtn.innerHTML = `Login`;
            navBtn.className = "px-4 py-2 md:px-6 md:py-2.5 rounded-lg bg-black text-white hover:bg-gray-900 transition text-xs md:text-sm font-black shadow-md";
            navBtn.onclick = openAuthModal;
        }

        setNotice("🚀 Welcome to Neha IT Bari🔥 Instant Access to All Automation Tools & Software. Please Login to access your workspace.");
    }
}

function updateUIForLoggedInUser(user) {
    setNotice("🚀 Full Workspace Access Active! Welcome to the Dashboard. You now have full access to all tools and software.");
    
    const dashPlan = document.getElementById('dashPlanName');
    if (dashPlan) {
        dashPlan.innerHTML = `FULL ACCESS <i class="ph-fill ph-check-circle text-green-400"></i>`;
        dashPlan.className = "text-green-400 font-bold flex items-center justify-center gap-1";
    }
    
    const timerBox = document.getElementById('countdownTimer');
    if (timerBox) {
        timerBox.classList.remove('hidden');
        timerBox.innerHTML = `<span class="text-[10px] text-zinc-400 uppercase font-bold block">Access Type</span><span class="text-green-400 font-bold text-sm">LIFETIME ACCESS</span>`;
    }
    
    // Toggle Views: Show Premium Grid
    const premiumContent = document.getElementById('premiumUserContent');
    if (premiumContent) premiumContent.classList.remove('hidden');
    
    // UNLOCK All Grid Icons
    const unlockClass = "ph-fill ph-check-circle absolute top-5 right-5 text-green-400 text-2xl transition z-10";
    ['course', 'ua', 'email', 'software', 'validator', 'cpa', 'proxy', 'software_mix', 'address', 'name'].forEach(id => {
        const icon = document.getElementById(`lock_${id}`);
        if (icon) icon.className = unlockClass;
    });
}

function checkAccess(urlOrAction) {
    const savedUser = localStorage.getItem('proToolsUser');

    if (!savedUser) {
        openAuthModal();
        return;
    }

    try {
        const user = JSON.parse(savedUser);

        if (!user || !user.isLoggedIn || !user.username) {
            localStorage.removeItem('proToolsUser');
            openAuthModal();
            return;
        }

        // LOGGED-IN USER = FULL ACCESS
        if (typeof urlOrAction === 'function') {
            urlOrAction();
        } else if (typeof urlOrAction === 'string' && urlOrAction) {
            window.location.href = urlOrAction;
        } else {
            const homeSection = document.getElementById('home-section');
            if (homeSection) homeSection.classList.add('hidden');
            const dashSection = document.getElementById('dashboard-section');
            if (dashSection) dashSection.classList.remove('hidden');
            window.scrollTo(0, 0);
        }
    } catch (error) {
        localStorage.removeItem('proToolsUser');
        openAuthModal();
    }
}

function handleHomeClick(urlOrAction) {
    const savedUser = localStorage.getItem('proToolsUser');
    if (!savedUser) {
        openAuthModal();
        return;
    }
    checkAccess(urlOrAction);
}

function openAuthModal() {
    if (isLoggedIn) {
        const homeSection = document.getElementById('home-section');
        if (homeSection) homeSection.classList.add('hidden');
        const dashSection = document.getElementById('dashboard-section');
        if (dashSection) dashSection.classList.remove('hidden');
        window.scrollTo(0, 0);
        return;
    }
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.remove('hidden');
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.add('hidden');
    const authMessage = document.getElementById('authMessage');
    if (authMessage) authMessage.classList.add('hidden');
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove('ph-eye');
        icon.classList.add('ph-eye-slash');
    } else {
        input.type = "password";
        icon.classList.remove('ph-eye-slash');
        icon.classList.add('ph-eye');
    }
}

function logout() {
    localStorage.removeItem('proToolsUser');
    isLoggedIn = false;
    location.reload();
}

function handleAuth(event, action) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const msgDiv = document.getElementById('authMessage');
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerText : 'Login';
    
    if (btn) {
        btn.innerHTML = `Logging in...`;
        btn.disabled = true;
    }
    if (msgDiv) msgDiv.classList.add('hidden');
    
    const userOrEmail = formData.get('username') || formData.get('email') || "";
    const password = formData.get('password') || "";
    
    const data = new URLSearchParams();
    data.append('action', 'login');
    data.append('username', userOrEmail);
    data.append('email', userOrEmail);
    data.append('password', password);
    
    fetch(CONFIG.backendURL, { method: 'POST', body: data })
    .then(res => res.json())
    .then(result => {
        if (msgDiv) msgDiv.classList.remove('hidden');
        if (result.result === 'success') {
            if (msgDiv) {
                msgDiv.className = "px-8 pb-6 text-center text-sm font-bold text-green-400 bg-black/20 pt-4 border-t border-white/5";
                msgDiv.innerText = result.message || "Login Successful!";
            }
            
            const returnedName = (result.userData && result.userData.name) || result.name || userOrEmail || "Md Jubaer Rahman";
            const returnedUsername = (result.userData && result.userData.username) || (result.userData && result.userData.email) || userOrEmail;
            const userObj = {
                isLoggedIn: true,
                username: returnedUsername,
                name: returnedName,
                status: 'active'
            };
            localStorage.setItem('proToolsUser', JSON.stringify(userObj));
            setTimeout(() => {
                closeAuthModal();
                checkLoginStatus();
            }, 800);
        } else {
            if (msgDiv) {
                msgDiv.className = "px-8 pb-6 text-center text-sm font-bold text-red-400 bg-black/20 pt-4 border-t border-white/5";
                msgDiv.innerText = result.message || "Invalid username or password.";
            }
        }
    })
    .catch(err => {
        if (msgDiv) {
            msgDiv.classList.remove('hidden');
            msgDiv.className = "px-8 pb-6 text-center text-sm font-bold text-red-400 bg-black/20 pt-4 border-t border-white/5";
            msgDiv.innerText = "Connection Failed. Please check your credentials and try again.";
        }
    })
    .finally(() => {
        if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}