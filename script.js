document.addEventListener('DOMContentLoaded', function() {
    
    // Database Keys
    const USERS_KEY = 'mr_haule_users';
    const CURRENT_USER_KEY = 'mr_haule_current_user';
    const REQUESTS_KEY = 'mr_haule_requests';
    const PAYMENTS_KEY = 'mr_haule_payments';
    const PASSWORD_RESET_KEY = 'mr_haule_password_reset';
    
    // Helper Functions
    function getUsers() {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    }
    
    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    function getCurrentUser() {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    }
    
    function setCurrentUser(user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    
    function logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
        window.location.href = 'index.html';
    }
    
    function isLoggedIn() {
        return getCurrentUser() !== null;
    }
    
    // Initialize demo users if empty
    if (!localStorage.getItem(USERS_KEY)) {
        const demoUsers = [
            {
                fullName: "Demo User",
                email: "demo@example.com",
                phone: "+255625568661",
                password: "demo123",
                registeredAt: new Date().toISOString()
            }
        ];
        saveUsers(demoUsers);
        console.log("Demo user created: demo@example.com / demo123");
    }
    
    // Copyright
    document.querySelectorAll('#copyright').forEach(el => {
        if (el) el.innerHTML = `© ${new Date().getFullYear()} Mr. Haule Services. Elimu na Maisha yako tunayasimamia kwa usalama kabisa.`;
    });
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // ============================================
    // LOGIN PAGE
    // ============================================
    
    if (currentPage === 'login.html') {
        if (isLoggedIn()) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value;
                
                document.getElementById('loginEmailError').textContent = '';
                document.getElementById('loginPasswordError').textContent = '';
                
                if (!email) {
                    document.getElementById('loginEmailError').textContent = 'Email is required';
                    return;
                }
                if (!password) {
                    document.getElementById('loginPasswordError').textContent = 'Password is required';
                    return;
                }
                
                const users = getUsers();
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    setCurrentUser({ fullName: user.fullName, email: user.email, phone: user.phone });
                    alert('Login successful! Redirecting to dashboard...');
                    window.location.href = 'dashboard.html';
                } else {
                    document.getElementById('loginPasswordError').textContent = 'Invalid email or password';
                }
            });
        }
    }
    
    // ============================================
    // REGISTER PAGE
    // ============================================
    
    if (currentPage === 'register.html') {
        if (isLoggedIn()) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const fullName = document.getElementById('regFullName').value.trim();
                const email = document.getElementById('regEmail').value.trim();
                const phone = document.getElementById('regPhone').value.trim();
                const password = document.getElementById('regPassword').value;
                const confirmPassword = document.getElementById('regConfirmPassword').value;
                
                let isValid = true;
                
                const nameWords = fullName.split(/\s+/).filter(w => w.length > 0);
                if (nameWords.length < 2) {
                    document.getElementById('regNameError').textContent = 'Full name must contain at least two words';
                    isValid = false;
                } else {
                    document.getElementById('regNameError').textContent = '';
                }
                
                const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    document.getElementById('regEmailError').textContent = 'Enter a valid email address';
                    isValid = false;
                } else {
                    document.getElementById('regEmailError').textContent = '';
                }
                
                const phonePattern = /^\+255[0-9]{9}$/;
                if (!phonePattern.test(phone)) {
                    document.getElementById('regPhoneError').textContent = 'Phone must be +255 followed by 9 digits';
                    isValid = false;
                } else {
                    document.getElementById('regPhoneError').textContent = '';
                }
                
                if (password.length < 6) {
                    document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
                    isValid = false;
                } else {
                    document.getElementById('regPasswordError').textContent = '';
                }
                
                if (password !== confirmPassword) {
                    document.getElementById('regConfirmError').textContent = 'Passwords do not match';
                    isValid = false;
                } else {
                    document.getElementById('regConfirmError').textContent = '';
                }
                
                const users = getUsers();
                if (users.some(u => u.email === email)) {
                    document.getElementById('regEmailError').textContent = 'Email already registered. Please login.';
                    isValid = false;
                }
                
                if (!isValid) return;
                
                users.push({ fullName, email, phone, password, registeredAt: new Date().toISOString() });
                saveUsers(users);
                setCurrentUser({ fullName, email, phone });
                
                alert('Registration successful! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            });
        }
    }
    
    // ============================================
    // DASHBOARD PAGE (Protected)
    // ============================================
    
    if (currentPage === 'dashboard.html') {
        if (!isLoggedIn()) {
            alert('Please login to access your dashboard');
            window.location.href = 'login.html';
            return;
        }
        
        const currentUser = getCurrentUser();
        
        // Set user info
        document.getElementById('fullname').value = currentUser.fullName;
        document.getElementById('email').value = currentUser.email;
        document.getElementById('phone').value = currentUser.phone;
        
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (welcomeMsg) welcomeMsg.innerHTML = `Welcome back, <strong>${currentUser.fullName}</strong>! Ready to get started?`;
        
        // Load request history
        function loadRequestHistory() {
            const allRequests = JSON.parse(localStorage.getItem(REQUESTS_KEY) || '{}');
            const requests = allRequests[currentUser.email] || [];
            const historyContainer = document.getElementById('requestHistory');
            
            if (requests.length === 0) {
                historyContainer.innerHTML = `<div class="empty-history"><i class="fas fa-inbox"></i><p>No requests made yet</p><small>Submit your first request using the form above</small></div>`;
                return;
            }
            
            historyContainer.innerHTML = requests.map(req => `
                <div class="history-item">
                    <p><strong><i class="fas fa-tag"></i> ${escapeHtml(req.service)}</strong></p>
                    ${req.details ? `<p><i class="fas fa-comment"></i> ${escapeHtml(req.details.substring(0, 100))}${req.details.length > 100 ? '...' : ''}</p>` : ''}
                    <div class="history-date"><i class="far fa-calendar-alt"></i> ${req.date}</div>
                </div>
            `).join('');
        }
        
        // Setup service request form
        const serviceForm = document.getElementById('serviceRequestForm');
        if (serviceForm) {
            serviceForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const service = document.getElementById('service').value;
                const details = document.getElementById('details').value.trim();
                const serviceError = document.getElementById('serviceError');
                
                if (!service) {
                    serviceError.textContent = 'Please select a service';
                    return;
                }
                serviceError.textContent = '';
                
                const message = `📋 *NEW SERVICE REQUEST*%0A` +
                    `━━━━━━━━━━━━━━━━━━━━%0A` +
                    `👤 *Name:* ${currentUser.fullName}%0A` +
                    `📧 *Email:* ${currentUser.email}%0A` +
                    `📞 *Phone:* ${currentUser.phone}%0A` +
                    `🛠️ *Service:* ${service}%0A` +
                    `${details ? `📝 *Details:* ${details}%0A` : ''}` +
                    `📅 *Date:* ${new Date().toLocaleString()}`;
                
                // Save request
                const allRequests = JSON.parse(localStorage.getItem(REQUESTS_KEY) || '{}');
                if (!allRequests[currentUser.email]) allRequests[currentUser.email] = [];
                allRequests[currentUser.email].unshift({
                    service: service,
                    details: details,
                    date: new Date().toLocaleString(),
                    timestamp: Date.now()
                });
                localStorage.setItem(REQUESTS_KEY, JSON.stringify(allRequests));
                
                window.open(`https://wa.me/255625568661?text=${message}`, '_blank');
                alert('Request sent! Check WhatsApp for confirmation.\nRequest saved to history.');
                
                document.getElementById('details').value = '';
                document.getElementById('service').value = '';
                loadRequestHistory();
            });
        }
        
        loadRequestHistory();
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
    }
    
    // ============================================
    // FORGOT PASSWORD PAGE
    // ============================================
    
    if (currentPage === 'forgot-password.html') {
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('resetEmail').value.trim();
                
                if (!email) {
                    document.getElementById('resetEmailError').textContent = 'Email is required';
                    return;
                }
                
                const users = getUsers();
                const user = users.find(u => u.email === email);
                
                if (!user) {
                    document.getElementById('resetEmailError').textContent = 'Email not found. Please register first.';
                    return;
                }
                
                const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
                
                localStorage.setItem(PASSWORD_RESET_KEY, JSON.stringify({
                    email: email,
                    code: resetCode,
                    expires: Date.now() + 30 * 60 * 1000
                }));
                
                const message = `🔐 *PASSWORD RESET - Mr. Haule Services*%0A` +
                    `━━━━━━━━━━━━━━━━━━━━%0A` +
                    `👤 *Name:* ${user.fullName}%0A` +
                    `📧 *Email:* ${email}%0A` +
                    `🔑 *Verification Code:* ${resetCode}%0A` +
                    `⏰ *Valid for:* 30 minutes`;
                
                window.open(`https://wa.me/255625568661?text=${message}`, '_blank');
                sessionStorage.setItem('resetEmail', email);
                
                alert(`Verification code sent to ${email} via WhatsApp!\n\nCheck your WhatsApp for the 6-digit code.`);
                window.location.href = 'verify-code.html';
            });
        }
    }
    
    // ============================================
    // VERIFY CODE PAGE
    // ============================================
    
    if (currentPage === 'verify-code.html') {
        const verifyForm = document.getElementById('verifyCodeForm');
        
        if (verifyForm) {
            verifyForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const enteredCode = document.getElementById('verificationCode').value.trim();
                const storedData = JSON.parse(localStorage.getItem(PASSWORD_RESET_KEY) || 'null');
                
                if (!storedData) {
                    document.getElementById('codeError').textContent = 'No reset request found. Please try again.';
                    return;
                }
                
                if (Date.now() > storedData.expires) {
                    document.getElementById('codeError').textContent = 'Code has expired. Please request a new one.';
                    localStorage.removeItem(PASSWORD_RESET_KEY);
                    return;
                }
                
                if (enteredCode !== storedData.code) {
                    document.getElementById('codeError').textContent = 'Invalid verification code. Please try again.';
                    return;
                }
                
                sessionStorage.setItem('verifiedEmail', storedData.email);
                localStorage.removeItem(PASSWORD_RESET_KEY);
                window.location.href = 'reset-password.html';
            });
        }
        
        const resendLink = document.getElementById('resendCode');
        if (resendLink) {
            resendLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                const resetEmail = sessionStorage.getItem('resetEmail');
                if (!resetEmail) {
                    window.location.href = 'forgot-password.html';
                    return;
                }
                
                const users = getUsers();
                const user = users.find(u => u.email === resetEmail);
                
                if (user) {
                    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                    localStorage.setItem(PASSWORD_RESET_KEY, JSON.stringify({
                        email: resetEmail,
                        code: newCode,
                        expires: Date.now() + 30 * 60 * 1000
                    }));
                    
                    const message = `🔐 *NEW VERIFICATION CODE*%0A` +
                        `━━━━━━━━━━━━━━━━━━━━%0A` +
                        `👤 *Name:* ${user.fullName}%0A` +
                        `🔑 *New Code:* ${newCode}%0A` +
                        `⏰ *Valid for:* 30 minutes`;
                    
                    window.open(`https://wa.me/255625568661?text=${message}`, '_blank');
                    alert(`New verification code sent to ${resetEmail} via WhatsApp!`);
                }
            });
        }
    }
    
    // ============================================
    // RESET PASSWORD PAGE
    // ============================================
    
    if (currentPage === 'reset-password.html') {
        const resetForm = document.getElementById('resetPasswordForm');
        const verifiedEmail = sessionStorage.getItem('verifiedEmail');
        
        if (!verifiedEmail) {
            window.location.href = 'forgot-password.html';
            return;
        }
        
        if (resetForm) {
            resetForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmNewPassword').value;
                
                let isValid = true;
                
                if (newPassword.length < 6) {
                    document.getElementById('newPasswordError').textContent = 'Password must be at least 6 characters';
                    isValid = false;
                } else {
                    document.getElementById('newPasswordError').textContent = '';
                }
                
                if (newPassword !== confirmPassword) {
                    document.getElementById('confirmNewPasswordError').textContent = 'Passwords do not match';
                    isValid = false;
                } else {
                    document.getElementById('confirmNewPasswordError').textContent = '';
                }
                
                if (!isValid) return;
                
                const users = getUsers();
                const userIndex = users.findIndex(u => u.email === verifiedEmail);
                
                if (userIndex !== -1) {
                    users[userIndex].password = newPassword;
                    saveUsers(users);
                    
                    sessionStorage.removeItem('verifiedEmail');
                    sessionStorage.removeItem('resetEmail');
                    
                    alert('Password reset successful! You can now login with your new password.');
                    window.location.href = 'login.html';
                }
            });
        }
    }
    
    // ============================================
    // PAYMENT PAGE
    // ============================================
    
    if (currentPage === 'payment.html') {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }
        
        const currentUser = getCurrentUser();
        
        document.getElementById('payerName').value = currentUser.fullName;
        document.getElementById('payerEmail').value = currentUser.email;
        document.getElementById('paymentPhone').value = currentUser.phone;
        
        const controlNumber = 'CTL-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('controlNumber').textContent = controlNumber;
        
        const methodOptions = document.querySelectorAl