# 🔗 Data Links - Modern Link & Note Management Platform

<div align="center">

![Data Links](public/img/gif.gif)

**A modern, secure platform for organizing your digital resources**

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.12-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

[Live Demo](https://your-demo-url.vercel.app) • [Report Bug](https://github.com/yourusername/data-links/issues) • [Request Feature](https://github.com/yourusername/data-links/issues)

</div>

---

## � Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

**Data Links** is a comprehensive web application designed to help you manage your links, notes, and files in one centralized platform. With a beautiful dark/light theme, responsive design, and powerful features, it's the perfect tool for organizing your digital life.

### Why Data Links?

- 🎨 **Beautiful UI/UX** - Modern design with smooth animations
- 🌓 **Dark/Light Theme** - Easy on the eyes, day or night
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🔒 **Secure** - Password hashing and secure authentication
- ☁️ **Cloud Integration** - Google Drive integration for file management
- 📝 **Rich Features** - Notes with edit history, link management, and more

---

## ✨ Features

### � Link Management
- ✅ Add, edit, and delete links
- ✅ Search and filter links
- ✅ Grid and List view options
- ✅ User profile display
- ✅ Category organization

### 📝 Note Management
- ✅ Create and edit notes
- ✅ Rich text editing
- ✅ Complete edit history tracking
- ✅ Version comparison
- ✅ Mobile-friendly drawer for history
- ✅ Copy note content
- ✅ Sort by last modified date

### ☁️ Google Drive Integration
- ✅ Browse files and folders
- ✅ Upload files with drag & drop
- ✅ Download files and folders as ZIP
- ✅ Create new folders
- ✅ Real-time upload progress

### 👤 User Management
- ✅ User registration and login
- ✅ Profile management
- ✅ Profile image upload
- ✅ Password reset
- ✅ Username/email availability check

### 🎨 Theme System
- ✅ Dark theme (default)
- ✅ Light theme
- ✅ Toggle in navbar
- ✅ Persistent theme preference
- ✅ Smooth transitions

### � Responsive Design
- ✅ Desktop optimized
- ✅ Tablet friendly
- ✅ Mobile responsive
- ✅ Touch-friendly interface
- ✅ Mobile menu

### 📊 Analytics
- ✅ Daily visitor tracking
- ✅ IP logging
- ✅ User link count

---

## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Home Page
![Home Page](docs/screenshots/home.png)

### Dark Theme
![Dark Theme](docs/screenshots/dark-theme.png)

### Light Theme
![Light Theme](docs/screenshots/light-theme.png)

### Notes Management
![Notes](docs/screenshots/notes.png)

### Mobile View
![Mobile](docs/screenshots/mobile.png)

</details>

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **JSZip** - ZIP file creation
- **dotenv** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (Custom Properties, Flexbox, Grid)
- **JavaScript (ES6+)** - Client-side logic
- **Font Awesome** - Icons
- **Google APIs** - Drive integration

### Deployment
- **Vercel** - Hosting platform
- **MongoDB Atlas** - Cloud database

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn
- MongoDB database
- Google Drive API credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/data-links.git
cd data-links
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` file with your credentials (see [Environment Variables](#-environment-variables))

4. **Start the server**
```bash
npm start
```

5. **Open your browser**
```
http://localhost:3000
```

---

## � Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Link?retryWrites=true&w=majority

# Google Drive API (Optional)
API_KEY=your_google_api_key
CLIENT_ID=your_google_client_id
FOLDER_ID=your_google_drive_folder_id
```

### Getting MongoDB URI
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Replace `<password>` with your password

### Getting Google Drive API Credentials (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Drive API
4. Create credentials (API Key and OAuth 2.0 Client ID)
5. Add authorized JavaScript origins

---

## � API Documentation

### Authentication Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Reset Password
```http
POST /reset-password
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "newPassword": "string"
}
```

### Link Endpoints

#### Get All Links
```http
GET /data
```

#### Add Link
```http
POST /add-link
Content-Type: application/json
x-username: string

{
  "url": "string",
  "name": "string",
  "date": "string"
}
```

#### Edit Link
```http
PUT /edit-link/:id
Content-Type: application/json

{
  "name": "string",
  "url": "string"
}
```

#### Delete Link
```http
DELETE /delete-link/:id
```

### Note Endpoints

#### Get User Notes
```http
GET /api/notes?username=string
```

#### Create Note
```http
POST /api/notes
Content-Type: application/json
x-username: string

{
  "noteName": "string",
  "content": "string"
}
```

#### Update Note
```http
PUT /api/notes/:id
Content-Type: application/json
x-username: string

{
  "noteName": "string",
  "content": "string"
}
```

#### Delete Note
```http
DELETE /api/notes/:id
```

### User Endpoints

#### Get Current User
```http
GET /current-user
x-email: string
```

#### Update Profile
```http
POST /update-profile
Content-Type: application/json
x-username: string

{
  "username": "string",
  "email": "string",
  "profileImage": "string"
}
```

---

## 📁 Project Structure

```
data-links/
├── public/                     # Static files
│   ├── img/                   # Images and assets
│   ├── script/                # Client-side JavaScript
│   │   ├── theme-manager.js   # Theme management
│   │   ├── mobile-menu.js     # Mobile menu handler
│   │   ├── script-index.js    # Home page logic
│   │   ├── script-login.js    # Authentication logic
│   │   ├── script-data.js     # Link management
│   │   ├── script-files.js    # File browser
│   │   ├── script-upload.js   # File upload
│   │   ├── script-note.js     # Note viewer
│   │   ├── script-add-note.js # Note editor
│   │   ├── script-logout.js   # Profile management
│   │   ├── script-about.js    # About page
│   │   └── script-suport.js   # Support page
│   └── styles/                # CSS files
│       ├── theme.css          # Global theme system
│       ├── navbar.css         # Navigation styles
│       ├── styles-index.css   # Home page styles
│       ├── styles-login.css   # Login page styles
│       ├── styles-data.css    # Link management styles
│       ├── styles-files.css   # File browser styles
│       ├── styles-upload.css  # Upload page styles
│       ├── styles-note.css    # Note viewer styles
│       ├── styles-add-note.css # Note editor styles
│       ├── styles-logout.css  # Profile page styles
│       ├── styles-about.css   # About page styles
│       └── styles-suport.css  # Support page styles
├── templates/                  # HTML templates
│   ├── index.html             # Home page
│   ├── login.html             # Login/Register
│   ├── date.html              # Update links
│   ├── files.html             # File browser
│   ├── upload.html            # File upload
│   ├── note.html              # Note viewer
│   ├── add-note.html          # Note editor
│   ├── logout.html            # Profile page
│   ├── about.html             # About page
│   └── suport.html            # Support page
├── index.js                    # Main server file
├── package.json               # Dependencies
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── vercel.json                # Vercel configuration
└── README.md                  # This file
```

---

## 📖 Usage Guide

### For Users

#### Getting Started
1. **Register an account** - Click "Login" → "Register here"
2. **Login** - Enter your email and password
3. **Explore features** - Use the navigation menu

#### Managing Links
1. Go to **Home** page
2. Click **"Add Link"** button
3. Enter URL and name
4. View in Grid or List mode
5. Search and filter as needed

#### Managing Notes
1. Go to **"Add Note"** page
2. Enter note name and content
3. Click **"Save Note"**
4. View all notes in **"Notes"** page
5. Click any note to view/edit
6. See complete edit history

#### Uploading Files
1. Go to **"Upload"** page
2. Drag & drop files or click to browse
3. Monitor upload progress
4. Files saved to Google Drive

#### Managing Profile
1. Click your profile picture
2. Update username, email, or profile image
3. Change password if needed
4. Save changes

### For Developers

#### Adding New Features
1. Create new route in `index.js`
2. Add HTML template in `templates/`
3. Create CSS file in `public/styles/`
4. Add JavaScript in `public/script/`
5. Update navigation in all templates

#### Customizing Theme
1. Edit CSS variables in `public/styles/theme.css`
2. Modify colors, spacing, fonts
3. Changes apply globally

#### Database Schema
See [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for detailed schema

---

## 🎨 Design System

### Color Palette

#### Light Theme
- Background: `#f5f7fa`
- Surface: `#ffffff`
- Text: `#1a1a1a`

#### Dark Theme
- Background: `#0f1419`
- Surface: `#1a2332`
- Text: `#e8eaed`

#### Brand Colors
- Primary: `#4285f4` (Blue)
- Secondary: `#34a853` (Green)
- Accent: `#ea4335` (Red)
- Warning: `#fbbc04` (Yellow)

### Typography
- Font Family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`
- Base Size: `16px`
- Scale: `0.85rem` - `2.5rem`

### Spacing
- XS: `4px`
- SM: `8px`
- MD: `16px`
- LG: `24px`
- XL: `32px`
- 2XL: `48px`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style
- Use ES6+ features
- Follow existing code structure
- Add comments for complex logic
- Test before submitting

---

## 🐛 Known Issues

- Google Drive integration requires API credentials
- Large file uploads may timeout on slow connections
- Mobile drawer animation may lag on older devices

---

## 🔮 Roadmap

### Version 2.1 (Q2 2026)
- [ ] PWA support
- [ ] Offline mode
- [ ] Push notifications
- [ ] Advanced search

### Version 2.2 (Q3 2026)
- [ ] Real-time collaboration
- [ ] Tags and categories
- [ ] Export/Import data
- [ ] Multi-language support

### Version 3.0 (Q4 2026)
- [ ] Mobile apps (iOS/Android)
- [ ] Browser extensions
- [ ] API documentation
- [ ] Third-party integrations

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Panuwat Takham**

- 📧 Email: panuwattakham2002@gmail.com
- 🌐 Facebook: [Panuwat Takham](https://web.facebook.com/panuwat.takham.b/)
- 📷 Instagram: [@panuwat.z](https://www.instagram.com/panuwat.z/)

---

## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Drive API](https://developers.google.com/drive) - File storage
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Web framework
- [Vercel](https://vercel.com/) - Hosting

---

## 💖 Support

If you find this project helpful, consider supporting the developer:

- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest new features
- 📢 Share with others
- ☕ [Buy me a coffee](https://your-support-link.com)

---

<div align="center">

**Made with ❤️ by Panuwat Takham**

**Version 2.0** • **Last Updated: February 2026**

[⬆ Back to Top](#-data-links---modern-link--note-management-platform)

</div>
