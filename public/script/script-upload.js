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

// Elements
const authBtn = document.getElementById('authBtn');
const uploadBtn = document.getElementById('uploadBtn');
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const selectFilesBtn = document.getElementById('selectFiles');
const fileList = document.getElementById('fileList');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

const signOutBtn = document.createElement('button'); // Create sign-out button
signOutBtn.className = 'google-btn';
signOutBtn.style.display = 'none';
signOutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
document.querySelector('.upload-container').appendChild(signOutBtn); // Append to container

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
            const expirationTime = Date.now() + 3600 * 1000; // Set expiration time to 1 hour
            sessionStorage.setItem('access_token', response.access_token); // Save token
            sessionStorage.setItem('token_expiration', expirationTime); // Save expiration time
            authBtn.style.display = 'none';
            signOutBtn.style.display = 'block'; // Show sign-out button
            uploadBtn.disabled = filesToUpload.length === 0;
            checkFolderAccess();
        },
    });
    gisInited = true;
    maybeEnableButtons();
}

// Check if both GAPI and GIS are initialized
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        authBtn.style.display = 'block'; // Ensure the button is visible
        authBtn.disabled = false;
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
    sessionStorage.removeItem('token_expiration'); // Clear token expiration from sessionStorage
    gapi.client.setToken(null); // Clear token from Google API client
    authBtn.style.display = 'block';
    signOutBtn.style.display = 'none';
    uploadBtn.disabled = true;
    showSuccess('You have signed out successfully.');
}

// Check if we have access to the target folder
function checkFolderAccess() {
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
selectFilesBtn.addEventListener('click', () => {
    fileInput.click();
});

// Handle file selection change
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Handle drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
};

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('dragover');
}

function unhighlight() {
    dropArea.classList.remove('dragover');
}

// Handle dropped files
dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
});

// Process selected files
function handleFiles(files) {
    filesToUpload = Array.from(files);
    updateFileList();
    if (gapi.client.getToken() !== null) {
        uploadBtn.disabled = filesToUpload.length === 0;
    }
}

// Update the file list display
function updateFileList() {
    fileList.innerHTML = '';

    if (filesToUpload.length === 0) {
        return;
    }
    
    filesToUpload.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        fileInfo.innerHTML = `
            <i class="fas fa-file file-icon"></i>
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
        `;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeFile(index);
        
        fileItem.appendChild(fileInfo);
        fileItem.appendChild(removeBtn);
        fileList.appendChild(fileItem);
        
        if (file.size > 750 * 1024 * 1024) {
            const warning = document.createElement('div');
            warning.style.color = '#ff9800';
            warning.style.fontSize = '0.8rem';
            warning.style.marginTop = '5px';
            warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> File exceeds 750MB limit and may not upload';
            fileItem.appendChild(warning);
        }
    });
}

// Remove a file from the list
function removeFile(index) {
    filesToUpload.splice(index, 1);
    updateFileList();
    uploadBtn.disabled = filesToUpload.length === 0;
}

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle file upload to Google Drive
uploadBtn.addEventListener('click', async () => {
    if (filesToUpload.length === 0) {
        showError('Please select at least one file to upload');
        return;
    }
    
    clearMessages();
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    let successCount = 0;
    let errorFiles = [];
    
    for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        try {
            await uploadFileToDrive(file);
            successCount++;
        } catch (error) {
            console.error('Error uploading file:', error);
            errorFiles.push(file.name);
        }
    }
    
    // Show upload results
    if (errorFiles.length === 0) {
        showSuccess(`Successfully uploaded ${successCount} ${successCount === 1 ? 'file' : 'files'} to Google Drive!`);
        filesToUpload = [];
        fileList.innerHTML = '';
    } else {
        showError(`Uploaded ${successCount} ${successCount === 1 ? 'file' : 'files'}. Failed to upload: ${errorFiles.join(', ')}`);
    }
    
    uploadBtn.disabled = false;
    uploadBtn.innerHTML = 'Upload to Google Drive';
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
    successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
};

// Clear all messages
function clearMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Toggle mobile menu
menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
});

async function fetchEnvVariables() {
    try {
        const response = await fetch('/env');
        if (!response.ok) {
            throw new Error('Failed to fetch environment variables');
        }
        const env = await response.json();
        return env;
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
        gapi.load('client', initializeGapiClient);
        gisInit();

        // Restore token from sessionStorage
        const savedToken = sessionStorage.getItem('access_token');
        const tokenExpiration = sessionStorage.getItem('token_expiration');
        if (savedToken && tokenExpiration && Date.now() < tokenExpiration) {
            console.log('Restoring access token from sessionStorage...');
            gapi.client.setToken({ access_token: savedToken });
            authBtn.style.display = 'none';
            signOutBtn.style.display = 'block'; // Show sign-out button
            uploadBtn.disabled = filesToUpload.length === 0;
            checkFolderAccess();
        } else if (savedToken && tokenExpiration && Date.now() >= tokenExpiration) {
            console.log('Access token expired. Attempting to refresh...');
            tokenClient.requestAccessToken({ prompt: '' }); // Attempt silent refresh
        } else {
            console.log('No valid access token found.');
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('token_expiration');
        }
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Please login before use.');
    }
});

// Ensure the auth button is bound to the click event
authBtn.addEventListener('click', handleAuthClick);

// Bind sign-out button to click event
signOutBtn.addEventListener('click', handleSignOutClick);