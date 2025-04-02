// Google Drive API configuration
let API_KEY;
let CLIENT_ID;
let FOLDER_ID;

// API discovery docs and scopes
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Cache DOM elements to avoid repeated lookups
const elements = {
    authBtn: document.getElementById('authBtn'),
    uploadBtn: document.getElementById('uploadBtn'),
    dropArea: document.getElementById('dropArea'),
    fileInput: document.getElementById('fileInput'),
    selectFilesBtn: document.getElementById('selectFiles'),
    fileList: document.getElementById('fileList'),
    successMessage: document.getElementById('successMessage'),
    errorMessage: document.getElementById('errorMessage'),
    menuToggle: document.getElementById('menuToggle'),
    navLinks: document.getElementById('navLinks'),
    uploadContainer: document.querySelector('.upload-container'),
};

// Create sign-out button once and append it
const signOutBtn = document.createElement('button');
signOutBtn.className = 'google-btn';
signOutBtn.style.display = 'none';
signOutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
elements.uploadContainer.appendChild(signOutBtn);

// Files to upload
let filesToUpload = [];

// Initialize the API client
function initializeGapiClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    }).then(() => {
        gapiInited = true;
        maybeEnableButtons();
    });
}

// Initialize Google Identity Services
function gisInit() {
    console.log('Initializing Google Identity Services...');
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            console.log('Authentication response received:', response);
            if (response.error) {
                console.error('Error during authentication:', response.error);
                showError('Authentication failed. Please try again.');
                return;
            }
            console.log('Authentication successful.');
            const token = response.access_token;
            sessionStorage.setItem('access_token', token); // Save token in sessionStorage
            localStorage.setItem('access_token', token); // Save token in localStorage for persistence
            elements.authBtn.style.display = 'none';
            signOutBtn.style.display = 'block'; // Show sign-out button
            elements.uploadBtn.disabled = filesToUpload.length === 0;
            checkFolderAccess();
        },
    });
    gisInited = true;
    maybeEnableButtons();
}

// Check if both GAPI and GIS are initialized
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        elements.authBtn.style.display = 'block'; // Ensure the button is visible
        elements.authBtn.disabled = false;
    }
}

// Handle sign-in
function handleAuthClick() {
    console.log('Sign-in button clicked.');
    try {
        if (gapi.client.getToken() === null) {
            console.log('Requesting new access token...');
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            console.log('Using existing access token...');
            tokenClient.requestAccessToken({ prompt: '' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        showError('Sign-in failed. Please try again.');
    }
}

// Handle sign-out
function handleSignOutClick() {
    console.log('Sign-out button clicked.');
    sessionStorage.removeItem('access_token'); // Clear token from sessionStorage
    localStorage.removeItem('access_token'); // Clear token from localStorage
    gapi.client.setToken(null); // Clear token from Google API client
    elements.authBtn.style.display = 'block';
    signOutBtn.style.display = 'none';
    elements.uploadBtn.disabled = true;
    showSuccess('You have signed out successfully.');
}

// Check if we have access to the target folder
function checkFolderAccess() {
    if (!gapi.client || !gapi.client.drive) {
        console.error('Google API client is not initialized.');
        return;
    }
    gapi.client.drive.files.get({
        fileId: FOLDER_ID,
        fields: 'name'
    }).then(function(response) {
        console.log('Folder accessible:', response.result.name);
    }).catch(function(error) {
        showError('Select the file you want to upload.');
        console.error('Error accessing folder:', error);
    });
}

// Handle file selection via button
elements.selectFilesBtn.addEventListener('click', () => {
    elements.fileInput.click();
});

// Handle file selection change
elements.fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Optimize event listeners for drag and drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    elements.dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
};

['dragenter', 'dragover'].forEach(eventName => {
    elements.dropArea.addEventListener(eventName, () => elements.dropArea.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    elements.dropArea.addEventListener(eventName, () => elements.dropArea.classList.remove('dragover'), false);
});

// Handle dropped files
elements.dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
});

// Process selected files
function handleFiles(files) {
    filesToUpload = Array.from(files);
    updateFileList();
    if (gapi.client.getToken() !== null) {
        elements.uploadBtn.disabled = filesToUpload.length === 0;
    }
}

// Optimize file list rendering
function updateFileList() {
    const fragment = document.createDocumentFragment();
    elements.fileList.innerHTML = '';

    filesToUpload.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file file-icon"></i>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="remove-btn"><i class="fas fa-times"></i></button>
        `;

        const removeBtn = fileItem.querySelector('.remove-btn');
        removeBtn.onclick = () => removeFile(index);

        if (file.size > 750 * 1024 * 1024) {
            const warning = document.createElement('div');
            warning.className = 'file-warning';
            warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> File exceeds 750MB limit and may not upload';
            fileItem.appendChild(warning);
        }

        fragment.appendChild(fileItem);
    });

    elements.fileList.appendChild(fragment);
}

// Remove a file from the list
function removeFile(index) {
    filesToUpload.splice(index, 1);
    updateFileList();
    elements.uploadBtn.disabled = filesToUpload.length === 0;
}

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Optimize file upload loop
elements.uploadBtn.addEventListener('click', async () => {
    if (filesToUpload.length === 0) {
        showError('Please select at least one file to upload');
        return;
    }

    clearMessages();
    elements.uploadBtn.disabled = true;
    elements.uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    const results = await Promise.allSettled(filesToUpload.map(uploadFileToDrive));
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const errorFiles = results
        .filter(result => result.status === 'rejected')
        .map((_, index) => filesToUpload[index].name);

    if (errorFiles.length === 0) {
        showSuccess(`Successfully uploaded ${successCount} ${successCount === 1 ? 'file' : 'files'} to Google Drive!`);
        filesToUpload = [];
        elements.fileList.innerHTML = '';
    } else {
        showError(`Uploaded ${successCount} ${successCount === 1 ? 'file' : 'files'}. Failed to upload: ${errorFiles.join(', ')}`);
    }

    elements.uploadBtn.disabled = false;
    elements.uploadBtn.innerHTML = 'Upload to Google Drive';
});

// Upload a single file to Google Drive
function uploadFileToDrive(file) {
    const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: [FOLDER_ID]
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    
    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + gapi.client.getToken().access_token }),
        body: form
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}

// Show success message
function showSuccess(message) {
    elements.successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    elements.successMessage.style.display = 'block';
    elements.errorMessage.style.display = 'none';
}

// Show error message
function showError(message) {
    elements.errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    elements.errorMessage.style.display = 'block';
    elements.successMessage.style.display = 'none';
};

// Clear all messages
function clearMessages() {
    elements.successMessage.style.display = 'none';
    elements.errorMessage.style.display = 'none';
}

// Toggle mobile menu
elements.menuToggle.addEventListener('click', function() {
    elements.navLinks.classList.toggle('active');
});

// Optimize environment variable fetching
async function fetchEnvVariables() {
    try {
        const response = await fetch('/env');
        if (!response.ok) throw new Error('Failed to fetch environment variables');
        return await response.json();
    } catch (error) {
        console.error('Error fetching environment variables:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Fetching environment variables...');
        const env = await fetchEnvVariables();
        API_KEY = env.API_KEY;
        CLIENT_ID = env.CLIENT_ID;
        FOLDER_ID = env.FOLDER_ID;

        if (!CLIENT_ID || !API_KEY || !FOLDER_ID) {
            throw new Error('Missing required environment variables');
        }

        console.log('Environment variables loaded:', { API_KEY, CLIENT_ID, FOLDER_ID });

        // Initialize the Google API client
        console.log('Loading Google API client...');
        gapi.load('client', async () => {
            await initializeGapiClient();
            gisInit();

            const savedToken = localStorage.getItem('access_token');
            if (savedToken) {
                console.log('Restoring access token from localStorage...');
                gapi.client.setToken({ access_token: savedToken });

                gapi.client.load('drive', 'v3', () => {
                    console.log('Google Drive API loaded.');
                    elements.authBtn.style.display = 'none';
                    signOutBtn.style.display = 'block';
                    elements.uploadBtn.disabled = filesToUpload.length === 0;
                    checkFolderAccess();
                });
            } else {
                console.log('No saved token found. User needs to sign in.');
            }
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Please login before use.');
    }
});

// Ensure the auth button is bound to the click event
elements.authBtn.addEventListener('click', handleAuthClick);

// Bind sign-out button to click event
signOutBtn.addEventListener('click', handleSignOutClick);