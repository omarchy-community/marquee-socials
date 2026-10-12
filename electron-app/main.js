const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');

// Keep a global reference to prevent garbage collection
let mainWindow;

// Persistent session for keeping logins
const SESSION_PARTITION = 'persist:marquee-socials';

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        icon: path.join(__dirname, 'icons', '256x256.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            partition: SESSION_PARTITION
        },
        titleBarStyle: 'hidden',
        frame: false,
        backgroundColor: '#0d0d12'
    });

    mainWindow.loadFile('index.html');

    // Open DevTools in development
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Handle window controls from renderer
ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
});

// Pin to dock functionality
ipcMain.on('pin-to-dock', (event, platform) => {
    const platforms = {
        youtube: { name: 'YouTube Studio', url: 'https://studio.youtube.com', icon: 'youtube' },
        tiktok: { name: 'TikTok Studio', url: 'https://www.tiktok.com/tiktokstudio/content', icon: 'tiktok' },
        instagram: { name: 'Instagram', url: 'https://www.instagram.com', icon: 'instagram' },
        twitter: { name: 'X (Twitter)', url: 'https://x.com', icon: 'twitter' },
        discord: { name: 'Discord', url: 'https://discord.com/app', icon: 'discord' },
        telegram: { name: 'Telegram', url: 'https://web.telegram.org', icon: 'telegram' }
    };

    const p = platforms[platform];
    if (!p) return;

    const desktopEntry = `[Desktop Entry]
Version=1.0
Type=Application
Name=${p.name}
Comment=Open ${p.name} via Marquee Socials
Exec=marquee-socials --platform=${platform}
Icon=marquee-socials-${p.icon}
Terminal=false
Categories=Network;Social;
Keywords=social;media;${platform};
StartupNotify=true
`;

    const desktopPath = path.join(process.env.HOME, '.local', 'share', 'applications', `marquee-${platform}.desktop`);
    fs.writeFileSync(desktopPath, desktopEntry);
    
    event.reply('pin-result', { success: true, platform: p.name });
});

app.whenReady().then(() => {
    // Set up session for persistent cookies
    const ses = session.fromPartition(SESSION_PARTITION);
    
    // Allow all cookies
    ses.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['']
            }
        });
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle command line args for direct platform launch
const args = process.argv.slice(2);
const platformArg = args.find(a => a.startsWith('--platform='));
if (platformArg) {
    global.startPlatform = platformArg.split('=')[1];
}
