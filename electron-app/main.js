const { app, BrowserWindow, ipcMain, session, Notification, dialog, shell, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;

// Single instance: a second launch just focuses the existing window
if (!app.requestSingleInstanceLock()) { app.quit(); }
app.on('second-instance', (_e, argv) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show(); mainWindow.focus();
        const p = (argv.find(a => a.startsWith('--platform=')) || '').split('=')[1];
        if (p) mainWindow.webContents.send('open-platform', p);
    }
});

const DATA_DIR = path.join(app.getPath('userData'), 'marquee');
fs.mkdirSync(DATA_DIR, { recursive: true });
const MEDIA_DIR = path.join(DATA_DIR, 'media');
fs.mkdirSync(MEDIA_DIR, { recursive: true });

function cleanUA(ua) { return ua.replace(/ ?Electron\/[\d.]+/, '').replace(/ ?marquee-socials\/[\d.]+/, ''); }

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1500, height: 940, minWidth: 1000, minHeight: 680,
        icon: path.join(__dirname, 'icons', '256x256.png'),
        webPreferences: { nodeIntegration: true, contextIsolation: false, webviewTag: true },
        frame: false, backgroundColor: '#0d0d12', title: 'Marquee Socials'
    });
    mainWindow.loadFile('index.html');

    // Webview guests: never spawn separate windows; navigate in-place instead
    const { webContents } = require('electron');
    const bindGuest = guest => {
        if (guest._marqueeBound) return; guest._marqueeBound = true;
        guest.setWindowOpenHandler(({ url }) => { console.log('guest window-open', url); mainWindow.webContents.send('open-link', { url, guestId: guest.id }); return { action: 'deny' }; });
    };
    mainWindow.webContents.on('did-attach-webview', (_e, guest) => bindGuest(guest));
    app.on('web-contents-created', (_e, wc) => { if (wc.getType() === 'webview') bindGuest(wc); });
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    mainWindow.on('maximize', () => mainWindow.webContents.send('win-state', true));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('win-state', false));
    mainWindow.on('closed', () => { mainWindow = null; });
}

// ---- window controls ----
ipcMain.on('window-minimize', () => mainWindow && mainWindow.minimize());
ipcMain.on('window-maximize', () => mainWindow && (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()));
ipcMain.on('window-close', () => mainWindow && mainWindow.close());

// ---- clipboard / shell ----
ipcMain.handle('copy', (_e, text) => { clipboard.writeText(String(text)); return true; });
ipcMain.handle('open-external', (_e, url) => shell.openExternal(url));
ipcMain.handle('badge', (_e, n) => { try { app.setBadgeCount(n || 0); } catch (_) {} return true; });

// ---- notifications ----
ipcMain.handle('notify', (_e, { title, body, platform }) => {
    if (!Notification.isSupported()) return false;
    const n = new Notification({ title, body, icon: path.join(__dirname, 'icons', '128x128.png') });
    n.on('click', () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); if (platform) mainWindow.webContents.send('open-platform', platform); } });
    n.show();
    return true;
});

// ---- persistent app data (drafts, schedule, templates, settings) ----
const dataFile = name => path.join(DATA_DIR, name + '.json');
ipcMain.handle('data-load', (_e, name) => { try { return JSON.parse(fs.readFileSync(dataFile(name), 'utf8')); } catch (_) { return null; } });
ipcMain.handle('data-save', (_e, name, value) => { fs.writeFileSync(dataFile(name), JSON.stringify(value, null, 2)); return true; });

// ---- media library ----
ipcMain.handle('media-add', async () => {
    const r = await dialog.showOpenDialog(mainWindow, { properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Media', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'webm', 'mkv'] }] });
    if (r.canceled) return [];
    const out = [];
    for (const src of r.filePaths) {
        const dest = path.join(MEDIA_DIR, Date.now() + '-' + path.basename(src));
        fs.copyFileSync(src, dest);
        out.push({ path: dest, name: path.basename(src), size: fs.statSync(dest).size, added: Date.now() });
    }
    return out;
});
ipcMain.handle('media-list', () => fs.readdirSync(MEDIA_DIR).map(f => { const p = path.join(MEDIA_DIR, f); const s = fs.statSync(p); return { path: p, name: f.replace(/^\d+-/, ''), size: s.size, added: s.mtimeMs }; }).sort((a, b) => b.added - a.added));
ipcMain.handle('media-remove', (_e, p) => { if (p.startsWith(MEDIA_DIR)) fs.rmSync(p, { force: true }); return true; });
ipcMain.handle('media-reveal', (_e, p) => { shell.showItemInFolder(p); return true; });
ipcMain.handle('media-copy-path', (_e, p) => { clipboard.writeText(p); return true; });

// ---- pin a platform to the dock (desktop entry) ----
ipcMain.handle('pin-to-dock', (_e, { id, name }) => {
    const launcher = app.isPackaged || fs.existsSync('/usr/share/marquee-socials/app') ? 'marquee-socials' : `electron43 ${__dirname}`;
    const entry = `[Desktop Entry]\nVersion=1.0\nType=Application\nName=${name}\nComment=${name} in Marquee Socials\nExec=${launcher} --platform=${id}\nIcon=marquee-socials\nTerminal=false\nCategories=Network;Social;\nStartupNotify=true\nStartupWMClass=marquee-socials\n`;
    const dir = path.join(process.env.HOME, '.local', 'share', 'applications');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `marquee-${id}.desktop`), entry);
    try { spawn('update-desktop-database', [dir], { stdio: 'ignore' }); } catch (_) {}
    return true;
});
ipcMain.handle('unpin-from-dock', (_e, id) => { fs.rmSync(path.join(process.env.HOME, '.local', 'share', 'applications', `marquee-${id}.desktop`), { force: true }); return true; });

// ---- Import logins from the Omarchy Social Chromium profile (cookies over CDP) ----
const SOCIAL_PROFILE = path.join(process.env.HOME, 'omarchy-social', 'browser-profile');
const CDP_PORT = 9333;
const CDP_TMP_PORT = 9334;

function httpJson(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, res => { let b = ''; res.on('data', d => b += d); res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } }); });
        req.on('error', reject); req.setTimeout(2000, () => req.destroy(new Error('timeout')));
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
        ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id === 1) { clearTimeout(timer); ws.close(); m.error ? reject(new Error(m.error.message)) : resolve(m.result.cookies); } };
        ws.onerror = () => { clearTimeout(timer); reject(new Error('ws error')); };
    });
}
async function importSocialLogins(ses) {
    if (!fs.existsSync(SOCIAL_PROFILE)) return 0;
    let cookies = null, headless = null;
    const ports = [];
    try { ports.push(parseInt(fs.readFileSync(path.join(SOCIAL_PROFILE, 'DevToolsActivePort'), 'utf8').split('\n')[0])); } catch (_) {}
    ports.push(CDP_PORT);
    for (const port of ports) { if (cookies) break; try { cookies = await cdpCookies(port); } catch (_) {} }
    if (!cookies && !fs.existsSync(path.join(SOCIAL_PROFILE, 'SingletonLock'))) {
        headless = spawn('chromium', ['--headless=new', '--disable-gpu', `--user-data-dir=${SOCIAL_PROFILE}`, `--remote-debugging-port=${CDP_TMP_PORT}`,
            '--remote-debugging-address=127.0.0.1', '--no-first-run', '--password-store=gnome-libsecret', 'about:blank'], { stdio: 'ignore' });
        for (let i = 0; i < 20 && !cookies; i++) { await new Promise(r => setTimeout(r, 500)); try { cookies = await cdpCookies(CDP_TMP_PORT); } catch (_) {} }
    }
    if (headless) headless.kill();
    if (!cookies) throw new Error('could not read Omarchy Social cookies');
    let n = 0;
    for (const c of cookies) {
        const host = c.domain.replace(/^\./, '');
        try {
            await ses.cookies.set({ url: `${c.secure ? 'https' : 'http'}://${host}${c.path}`, name: c.name, value: c.value, domain: c.domain, path: c.path,
                secure: c.secure, httpOnly: c.httpOnly, expirationDate: c.expires > 0 ? c.expires : undefined,
                sameSite: ({ Strict: 'strict', Lax: 'lax', None: 'no_restriction' })[c.sameSite] || 'unspecified' });
            n++;
        } catch (_) {}
    }
    await ses.cookies.flushStore();
    console.log(`imported ${n}/${cookies.length} cookies from Omarchy Social`);
    return n;
}

function prepSession(partition) {
    const ses = session.fromPartition(partition);
    ses.setUserAgent(cleanUA(ses.getUserAgent()));
    ses.webRequest.onHeadersReceived((details, callback) => {
        callback({ responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [''] } });
    });
    return ses;
}
const prepped = new Set();
ipcMain.handle('workspace-prepare', (_e, partition) => { if (!prepped.has(partition)) { prepSession(partition); prepped.add(partition); } return true; });
ipcMain.handle('import-logins', async (_e, partition) => { try { return await importSocialLogins(session.fromPartition(partition)); } catch (e) { return -1; } });
ipcMain.handle('clear-session', async (_e, partition) => { await session.fromPartition(partition).clearStorageData(); return true; });
ipcMain.handle('user-agent', () => cleanUA(session.defaultSession.getUserAgent()));

app.whenReady().then(async () => {
    const ses = prepSession('persist:marquee-socials'); prepped.add('persist:marquee-socials');
    try { await importSocialLogins(ses); } catch (e) { console.error('login import failed:', e.message); }
    createWindow();
    const p = (process.argv.find(a => a.startsWith('--platform=')) || '').split('=')[1];
    if (p) mainWindow.webContents.once('did-finish-load', () => mainWindow.webContents.send('open-platform', p));
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
