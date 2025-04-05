// Notification system
function alertBox(message, type = 'info') {
    const alertElement = document.getElementById('alertBox');
    if (!alertElement) {
        console.error('Alert box element not found.');
        return;
    }
    alertElement.textContent = message;
    alertElement.className = `alert-box ${type} show`;
    
    // Hide after 5 seconds
    setTimeout(() => {
        alertElement.classList.remove('show');
    }, 5000);
}

function updateNavLinks(isLoggedIn) {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alertBox('Login successful!', 'success');
            localStorage.setItem('username', username); // เก็บ username ใน localStorage
            updateNavLinks(true); // Update navigation links
            window.location.href = "logout.html"; // Redirect to logout page
        } else {
            const error = await response.json();
            console.error('Login failed:', error.message);
            alertBox(error.message || 'Login failed. Please check your credentials.', 'error');
        }
    } catch (err) {
        console.error('Error during login:', err);
        alertBox('An error occurred during login.', 'error');
    }
}

// Call this function on page load to set the initial state of nav links
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = false; // Replace with actual login status check
    updateNavLinks(isLoggedIn);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsChecked = document.getElementById('terms').checked;

    if (!isValidEmail(email)) {
        alertBox('Please enter a valid email address.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        alertBox('Passwords do not match.', 'error');
        return;
    }

    if (!termsChecked) {
        alertBox('You must agree to the Terms and Conditions.', 'error');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            alertBox('Registration successful! You can now log in.', 'success');
            toggleForm('login');
            document.getElementById('registerForm').reset();
        } else {
            const error = await response.json();
            alertBox(error.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (err) {
        console.error('Error during registration:', err);
        alertBox('This username or email already exists.', 'error');
    }
}

function toggleForm(form) {
    if (form === 'register') {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('registerContainer').style.display = 'block';
    } else {
        document.getElementById('registerContainer').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
    }
}

function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    }
}

        // Mobile menu toggle
        document.getElementById('menuToggle').addEventListener('click', function() {
            document.getElementById('navLinks').classList.toggle('active');
        });
