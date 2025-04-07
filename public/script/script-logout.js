// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const navLinks = document.getElementById('navLinks');
            if (navLinks) {
                navLinks.classList.toggle('active');
            }
        });
    }

    // Set up logout button event listener
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            const oldConfirmBox = document.getElementById('confirmBox');
            if (oldConfirmBox) {
                oldConfirmBox.remove();
            }
            
            confirmLogout(
                'Do you want to log out?',
                () => logout(),
                () => alertBox('Cancel logout', 'info')
            );
        });
    }

    // Initial setup
    const isLoggedIn = localStorage.getItem('username') ? true : false;
    updateNavLinks(isLoggedIn);
    fetchUserLinksCount();
    fetchUserProfile();
});

function setActive(element) {
    if (!element) return;
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
}

// ฟังก์ชันตรวจสอบผู้ใช้พิเศษ
function isSpecialUser() {
    const username = localStorage.getItem('currentUsername') || '';
    const email = localStorage.getItem('currentUserEmail') || '';
    
    return username === 'panuwat' && email === 'panuwat@gmail.com';
}

// ฟังก์ชันที่สามารถใช้ในหน้า data.html เพื่อตรวจสอบผู้ใช้พิเศษ
function checkSpecialUserPrivileges() {
    return isSpecialUser();
}

// Fetch and display total links count for logged-in user
async function fetchUserLinksCount() {
    const linksCountElement = document.getElementById('number_of_links');
    if (!linksCountElement) return;
    
    const username = localStorage.getItem('username');
    if (!username) {
        linksCountElement.textContent = "Please login to see your links";
        return;
    }

    try {
        const response = await fetch(`/user-links-count?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        linksCountElement.textContent = ` ${data.count}`;
    } catch (error) {
        console.error("Error fetching user links count:", error);
        linksCountElement.textContent = "Unable to load your links count.";
    }
}

function updateNavLinks(isLoggedIn) {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (!loginLink || !logoutLink) return;
    
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

// ฟังก์ชันสำหรับแสดง alertBox พร้อมปุ่มตกลงและยกเลิก
function confirmLogout(message, onConfirm, onCancel) {
    const confirmElement = document.createElement('div');
    confirmElement.id = 'confirmBox';
    confirmElement.className = 'alert-box confirm';
    confirmElement.innerHTML = `
        <p>${message}</p>
        <div class="alert-actions">
            <button id="cancelButton" class="alert-btn cancel-btn">Cancel</button>
            <button id="confirmButton" class="alert-btn confirm-btn"> OK  </button>
        </div>
    `;
    
    document.body.appendChild(confirmElement);
    
    setTimeout(() => {
        confirmElement.classList.add('show');
    }, 10);

    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    
    if (confirmButton && cancelButton) {
        confirmButton.onclick = () => {
            confirmElement.classList.remove('show');
            setTimeout(() => {
                confirmElement.remove();
            }, 300);
            if (onConfirm) onConfirm();
        };

        cancelButton.onclick = () => {
            confirmElement.classList.remove('show');
            setTimeout(() => {
                confirmElement.remove();
            }, 300);
            if (onCancel) onCancel();
        };
    }
}

// ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือน
function alertBox(message, type = 'info') {
    const oldAlerts = document.querySelectorAll('.alert-message');
    oldAlerts.forEach(alert => {
        alert.remove();
    });
    
    const alertElement = document.createElement('div');
    alertElement.id = `alertMessage-${Date.now()}`;
    alertElement.className = `alert-message ${type}`;
    alertElement.textContent = message;
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);

    setTimeout(() => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            alertElement.remove();
        }, 300);
    }, 2000);
}

// ฟังก์ชัน logout
async function logout() {
    try {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            alertBox('Logout successful!', 'success');
            localStorage.removeItem('username');
            localStorage.removeItem('currentUsername');
            localStorage.removeItem('currentUserEmail');
            localStorage.removeItem('email');
            updateNavLinks(false);
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        } else {
            alertBox('Logout failed.', 'error');
        }
    } catch (err) {
        console.error('Error during logout:', err);
        alertBox('An error occurred during logout.', 'error');
    }
}

async function fetchUserProfile() {
    try {
        const username = localStorage.getItem('username');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const usernameHeader = document.getElementById('usernameHeader');
        
        if (!profileName || !profileEmail) return;
        
        if (!username) {
            profileName.textContent = 'ผู้เยี่ยมชม';
            profileEmail.textContent = 'กรุณาเข้าสู่ระบบ';
            if (usernameHeader) usernameHeader.textContent = 'Welcome';
            return;
        }

        const response = await fetch('/current-user', {
            headers: {
                'x-username': username
            }
        });

        if (response.ok) {
            const user = await response.json();
            if (user.username && user.email) {
                // ตัดข้อความ username ให้มีความยาวไม่เกิน 20 ตัวอักษร
                const displayName = user.username.length > 20 
                    ? user.username.substring(0, 20) + '...' 
                    : user.username;
                
                profileName.textContent = displayName;
                profileEmail.textContent = user.email;
                
                // Update welcome message with username
                if (usernameHeader) {
                    usernameHeader.textContent = `Welcome ${displayName}`;
                    usernameHeader.title = user.username; // แสดงชื่อเต็มเมื่อ hover
                }
                
                // เก็บข้อมูลผู้ใช้ใน localStorage เพื่อใช้ตรวจสอบในหน้าอื่น
                localStorage.setItem('currentUsername', user.username);
                localStorage.setItem('currentUserEmail', user.email);
                localStorage.setItem('email', user.email);
            } else {
                profileName.textContent = 'ไม่พบข้อมูลผู้ใช้';
                profileEmail.textContent = '';
                if (usernameHeader) usernameHeader.textContent = 'Welcome';
            }
        } else {
            console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
            profileName.textContent = 'เกิดข้อผิดพลาด';
            profileEmail.textContent = '';
            if (usernameHeader) usernameHeader.textContent = 'Welcome';
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        if (profileName) profileName.textContent = 'เกิดข้อผิดพลาด';
        if (profileEmail) profileEmail.textContent = '';
        const usernameHeader = document.getElementById('usernameHeader');
        if (usernameHeader) usernameHeader.textContent = 'Welcome';
    }
}