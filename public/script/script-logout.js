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
            // สำคัญ: ลบกล่องเก่าก่อนสร้างกล่องใหม่
            const oldConfirmBox = document.getElementById('confirmBox');
            if (oldConfirmBox) {
                oldConfirmBox.remove();
            }
            
            confirmLogout(
                'คุณต้องการออกจากระบบหรือไม่?',
                () => logout(), // เมื่อกดตกลง
                () => alertBox('ยกเลิกการออกจากระบบ', 'info') // เมื่อกดยกเลิก
            );
        });
    }

    // Initial setup
    const isLoggedIn = localStorage.getItem('username') ? true : false; // Use actual login status
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
        // เรียก API เพื่อนับจำนวนลิงก์ของผู้ใช้ปัจจุบัน
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
    // สร้างกล่องยืนยันใหม่ทุกครั้งและใช้ ID แยก
    const confirmElement = document.createElement('div');
    confirmElement.id = 'confirmBox';
    confirmElement.className = 'alert-box confirm';
    confirmElement.innerHTML = `
        <p>${message}</p>
        <div class="alert-actions">
            <button id="confirmButton" class="alert-btn confirm-btn">ตกลง</button>
            <button id="cancelButton" class="alert-btn cancel-btn">ยกเลิก</button>
        </div>
    `;
    
    document.body.appendChild(confirmElement);
    
    // แสดงกล่องยืนยันด้วย setTimeout เพื่อให้ DOM อัพเดท
    setTimeout(() => {
        confirmElement.classList.add('show');
    }, 10);

    // ตั้งค่า event listeners สำหรับปุ่มตกลงและยกเลิก
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    
    if (confirmButton && cancelButton) {
        // กดปุ่มตกลง
        confirmButton.onclick = () => {
            confirmElement.classList.remove('show');
            // ลบกล่องออกหลังจากอนิเมชันการซ่อนเสร็จสิ้น
            setTimeout(() => {
                confirmElement.remove();
            }, 300);
            if (onConfirm) onConfirm();
        };

        // กดปุ่มยกเลิก
        cancelButton.onclick = () => {
            confirmElement.classList.remove('show');
            // ลบกล่องออกหลังจากอนิเมชันการซ่อนเสร็จสิ้น
            setTimeout(() => {
                confirmElement.remove();
            }, 300);
            if (onCancel) onCancel();
        };
    }
}

// ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือน
function alertBox(message, type = 'info') {
    // ลบกล่องแจ้งเตือนเก่าก่อนสร้างใหม่
    const oldAlerts = document.querySelectorAll('.alert-message');
    oldAlerts.forEach(alert => {
        alert.remove();
    });
    
    // สร้างกล่องแจ้งเตือนใหม่ทุกครั้ง
    const alertElement = document.createElement('div');
    alertElement.id = `alertMessage-${Date.now()}`; // ใช้ ID ที่ไม่ซ้ำกันโดยใช้ timestamp
    alertElement.className = `alert-message ${type}`;
    alertElement.textContent = message;
    
    document.body.appendChild(alertElement);
    
    // แสดงกล่องแจ้งเตือนด้วย setTimeout
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);

    // ซ่อนข้อความหลังจาก 2 วินาที
    setTimeout(() => {
        alertElement.classList.remove('show');
        // ลบกล่องออกหลังจากอนิเมชันการซ่อนเสร็จสิ้น
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
            localStorage.removeItem('username'); // เพิ่มการลบ username จาก localStorage
            updateNavLinks(false);
            setTimeout(() => {
                window.location.href = "login.html"; // เปลี่ยนเส้นทางไปยังหน้า login
            }, 1000);
        } else {
            alertBox('Logout failed.', 'error');
        }
    } catch (err) {
        console.error('Error during logout:', err);
        alertBox('An error occurred during logout.', 'error');
    }
}

// ดึงข้อมูลผู้ใช้
async function fetchUserProfile() {
    try {
        const username = localStorage.getItem('username'); // ดึง username จาก localStorage
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (!profileName || !profileEmail) return;
        
        if (!username) {
            profileName.textContent = 'ผู้เยี่ยมชม';
            profileEmail.textContent = 'กรุณาเข้าสู่ระบบ';
            return;
        }

        // ส่งคำขอไปยังเซิร์ฟเวอร์เพื่อดึงข้อมูลผู้ใช้
        const response = await fetch('/current-user', {
            headers: {
                'x-username': username
            }
        });

        if (response.ok) {
            const user = await response.json();
            if (user.username && user.email) {
                profileName.textContent = user.username;
                profileEmail.textContent = user.email;
            } else {
                profileName.textContent = 'ไม่พบข้อมูลผู้ใช้';
                profileEmail.textContent = '';
            }
        } else {
            console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
            profileName.textContent = 'เกิดข้อผิดพลาด';
            profileEmail.textContent = '';
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        if (profileName) profileName.textContent = 'เกิดข้อผิดพลาด';
        if (profileEmail) profileEmail.textContent = '';
    }
}