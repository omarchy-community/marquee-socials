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

// ---- Import logins from the Omarchy Social Chromium profile (cookies over CDP) ----
const { spawn } = require('child_process');
const http = require('http');
const SOCIAL_PROFILE = path.join(process.env.HOME, 'omarchy-social', 'browser-profile');
const CDP_PORT = 9333;        // the running Omarchy Social browser
const CDP_TMP_PORT = 9334;    // headless copy if it isn't running

function httpJson(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, res => {
            let b = ''; res.on('data', d => b += d); res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } });
        });
        req.on('error', reject); req.setTimeout(2000, () => { req.destroy(new Error('timeout')); });
    });
}

async function cdpCookies(port) {
    const targets = await httpJson(`http://127.0.0.1:${port}/json`);
    const t = targets.find(x => x.type === 'page') || targets[0];
    if (!t) throw new Error('no CDP target');
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(t.webSocketDebuggerUrl);
        const timer = setTimeout(() => { ws.close(); reject(new Error('cdp timeout')); }, 8000);
        ws.onopen = () => ws.send(JSON.stringify({ id: 1, method: 'Network.getAllCookies' }));
        ws.onmessage = ev => {
            const m = JSON.parse(ev.data);
            if (m.id === 1) { clearTimeout(timer); ws.close(); m.error ? reject(new Error(m.error.message)) : resolve(m.result.cookies); }
        };
        ws.onerror = e => { clearTimeout(timer); reject(new Error('ws error')); };
    });
}

async function importSocialLogins(ses) {
    if (!fs.existsSync(SOCIAL_PROFILE)) return;
    let cookies = null, headless = null;
    // Chromium writes the live debug port into the profile dir
    const ports = [];
    try { ports.push(parseInt(fs.readFileSync(path.join(SOCIAL_PROFILE, 'DevToolsActivePort'), 'utf8').split('\n')[0])); } catch (_) {}
    ports.push(CDP_PORT, 9555);
    for (const port of ports) { if (cookies) break; try { cookies = await cdpCookies(port); } catch (_) {} }
    if (!cookies && !fs.existsSync(path.join(SOCIAL_PROFILE, 'SingletonLock'))) {
        // Not running: open a headless copy of the same profile just long enough to read cookies
        headless = spawn('chromium', ['--headless=new', '--disable-gpu', `--user-data-dir=${SOCIAL_PROFILE}`,
            `--remote-debugging-port=${CDP_TMP_PORT}`, '--remote-debugging-address=127.0.0.1',
            '--no-first-run', '--password-store=gnome-libsecret', 'about:blank'], { stdio: 'ignore' });
        for (let i = 0; i < 20 && !cookies; i++) {
            await new Promise(r => setTimeout(r, 500));
            try { cookies = await cdpCookies(CDP_TMP_PORT); } catch (_) {}
        }
    }
    if (headless) headless.kill();
    if (!cookies) throw new Error('could not read Omarchy Social cookies');

    let n = 0;
    for (const c of cookies) {
        const host = c.domain.replace(/^\./, '');
        try {
            await ses.cookies.set({
                url: `${c.secure ? 'https' : 'http'}://${host}${c.path}`,
                name: c.name, value: c.value, domain: c.domain, path: c.path,
                secure: c.secure, httpOnly: c.httpOnly,
                expirationDate: c.expires > 0 ? c.expires : undefined,
                sameSite: ({ Strict: 'strict', Lax: 'lax', None: 'no_restriction' })[c.sameSite] || 'unspecified'
            });
            n++;
        } catch (_) {}
    }
    await ses.cookies.flushStore();
    console.log(`imported ${n}/${cookies.length} cookies from Omarchy Social`);
}

app.whenReady().then(async () => {
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

    // Import existing logins from the Omarchy Social browser profile
    try { await importSocialLogins(ses); } catch (e) { console.error('login import failed:', e.message); }

    // Make every page look like plain Chrome (X/Instagram reject the Electron UA)
    ses.setUserAgent(ses.getUserAgent().replace(/ ?Electron\/[\d.]+/, '').replace(/ ?marquee-socials\/[\d.]+/, ''));

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
