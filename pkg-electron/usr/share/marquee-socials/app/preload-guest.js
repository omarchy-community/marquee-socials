// Runs inside every embedded site. Turns target=_blank / window.open into in-app tabs.
const { ipcRenderer } = require('electron');
const send = url => { try { ipcRenderer.sendToHost('open-link', url); } catch (_) {} };
document.addEventListener('click', e => {
    const a = e.composedPath().find(n => n.tagName === 'A');
    if (!a || !a.href || !/^https?:/.test(a.href)) return;
    if (a.target === '_blank' || e.ctrlKey || e.metaKey || e.button === 1) { e.preventDefault(); e.stopImmediatePropagation(); send(a.href); }
}, true);
document.addEventListener('auxclick', e => { const a = e.composedPath().find(n => n.tagName === 'A'); if (a && a.href && e.button === 1) { e.preventDefault(); send(a.href); } }, true);
const _open = window.open;
window.open = function (url) { if (url && /^https?:/.test(String(url))) { send(String(url)); return null; } return _open.apply(this, arguments); };

// Autoplay guard: on public video pages (TikTok/IG/YouTube watch) keep video paused until the user clicks it.
if (/tiktok\.com\/@[^/]+\/video\/|instagram\.com\/(reel|p)\/|youtube\.com\/(watch|shorts)/.test(location.href)) {
    let userWants = false;
    document.addEventListener('pointerdown', () => { userWants = true; }, true);
    document.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'k') userWants = true; }, true);
    document.addEventListener('play', e => { if (!userWants && e.target.tagName === 'VIDEO') { e.target.pause(); } }, true);
}
