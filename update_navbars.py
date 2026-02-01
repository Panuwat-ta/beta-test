#!/usr/bin/env python3
"""
Script to update all HTML templates with the new navbar structure
"""

import os
import re

# New navbar HTML
NEW_NAVBAR = '''    <nav>
        <div class="nav-container">
            <a href="./index.html" class="nav-brand">
                <i class="fas fa-link"></i>
                <span>Data Links</span>
            </a>
            
            <button class="menu-toggle" id="menuToggle">
                <i class="fas fa-bars"></i>
            </button>
            
            <div class="nav-links" id="navLinks">
                <a href="./index.html"{active_home}><i class="fas fa-home"></i> Home</a>
                <a href="./files.html"{active_files}><i class="fas fa-folder-open"></i> Files</a>
                <a href="./date.html"{active_date}><i class="fas fa-calendar-alt"></i> Update</a>
                <a href="./upload.html"{active_upload}><i class="fas fa-cloud-upload-alt"></i> Upload</a>
                <a href="./note.html"{active_note}><i class="fas fa-sticky-note"></i> Notes</a>
                <a href="./add-note.html"{active_addnote}><i class="fas fa-plus"></i> Add Note</a>
                <a href="./about.html"{active_about}><i class="fas fa-info-circle"></i> About</a>
                <a href="./suport.html"{active_suport}><i class="fas fa-hand-holding-heart"></i> Support</a>
            </div>
            
            <div class="nav-user" id="navUser">
                <a href="./login.html" id="loginLink" class="user-profile"{active_login}>
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                </a>
                <a href="./logout.html" id="logoutLink" class="user-profile" style="display: none;">
                    <img src="/img/b1.jpg" alt="User" class="user-avatar-nav" id="navUserAvatar">
                    <span class="user-name" id="navUsername">Member</span>
                </a>
                <button class="theme-toggle-nav" onclick="toggleTheme()" title="Toggle Theme">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </div>
    </nav>'''

# Page configurations
PAGES = {
    'index.html': {'active': 'home'},
    'files.html': {'active': 'files'},
    'date.html': {'active': 'date'},
    'upload.html': {'active': 'upload'},
    'note.html': {'active': 'note'},
    'add-note.html': {'active': 'addnote'},
    'about.html': {'active': 'about'},
    'suport.html': {'active': 'suport'},
    'login.html': {'active': 'login'},
    'logout.html': {'active': 'logout'},
}

def update_html_file(filepath, page_name):
    """Update a single HTML file with new navbar"""
    print(f"Updating {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Determine active page
    active_page = PAGES.get(page_name, {}).get('active', '')
    
    # Create navbar with active class
    navbar = NEW_NAVBAR.format(
        active_home=' class="active"' if active_page == 'home' else '',
        active_files=' class="active"' if active_page == 'files' else '',
        active_date=' class="active"' if active_page == 'date' else '',
        active_upload=' class="active"' if active_page == 'upload' else '',
        active_note=' class="active"' if active_page == 'note' else '',
        active_addnote=' class="active"' if active_page == 'addnote' else '',
        active_about=' class="active"' if active_page == 'about' else '',
        active_suport=' class="active"' if active_page == 'suport' else '',
        active_login=' class="active"' if active_page == 'login' else ''
    )
    
    # Replace old navbar with new one
    # Pattern to match from <nav> to </nav>
    pattern = r'<nav>.*?</nav>'
    content = re.sub(pattern, navbar, content, flags=re.DOTALL)
    
    # Add navbar.css if not present
    if '/styles/navbar.css' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="/styles/theme.css">',
            '<link rel="stylesheet" href="/styles/theme.css">\n    <link rel="stylesheet" href="/styles/navbar.css">'
        )
    
    # Remove old floating theme toggle button
    theme_toggle_pattern = r'<!-- Theme Toggle Button -->.*?</button>'
    content = re.sub(theme_toggle_pattern, '', content, flags=re.DOTALL)
    
    # Write updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated {filepath}")

def main():
    """Main function to update all templates"""
    templates_dir = 'templates'
    
    if not os.path.exists(templates_dir):
        print(f"Error: {templates_dir} directory not found!")
        return
    
    for page_name in PAGES.keys():
        filepath = os.path.join(templates_dir, page_name)
        if os.path.exists(filepath):
            try:
                update_html_file(filepath, page_name)
            except Exception as e:
                print(f"✗ Error updating {filepath}: {e}")
        else:
            print(f"⚠ File not found: {filepath}")
    
    print("\n✓ All templates updated successfully!")
    print("\nNext steps:")
    print("1. Test each page in the browser")
    print("2. Verify theme toggle works")
    print("3. Check mobile menu functionality")
    print("4. Verify active page highlighting")

if __name__ == '__main__':
    main()
