const { ipcRenderer } = require('electron');
const VERSION = '1.2.1';
const call = (ch, ...a) => ipcRenderer.invoke(ch, ...a);
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- SVG icons ----------
const I = {
  youtube: '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  discord: '<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  threads: '<svg viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 013.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 00-2.215-.221z"/></svg>',
  bluesky: '<svg viewBox="0 0 24 24"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg>',
  mastodon: '<svg viewBox="0 0 24 24"><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 00.023-.043v-1.809a.052.052 0 00-.02-.041.053.053 0 00-.046-.01 20.282 20.282 0 01-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 01-.319-1.433.053.053 0 01.066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.5l.638 1.06.638-1.06c.66-1 1.65-1.5 2.96-1.5 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>',
  reddit: '<svg viewBox="0 0 24 24"><path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>',
  custom: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>'
};

// ---------- Platforms (research-backed limits + best times) ----------
const BUILTIN = {
  youtube:   { name: 'YouTube Studio', url: 'https://studio.youtube.com', home: 'https://studio.youtube.com', color: '#ff0000', desc: 'Videos, Shorts, analytics, comments', limit: 5000, titleLimit: 100, tags: 15, best: { days: ['Thu', 'Fri', 'Sat'], hours: [14, 15, 16] } },
  tiktok:    { name: 'TikTok Studio', url: 'https://www.tiktok.com/tiktokstudio/content', home: 'https://www.tiktok.com/tiktokstudio', color: '#111', desc: 'Upload, manage, inbox', limit: 4000, tags: 5, best: { days: ['Tue', 'Thu', 'Fri'], hours: [7, 10, 19] } },
  instagram: { name: 'Instagram', url: 'https://www.instagram.com', home: 'https://www.instagram.com', color: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', desc: 'Reels, posts, stories, DMs', limit: 2200, tags: 30, best: { days: ['Mon', 'Wed', 'Fri'], hours: [11, 13, 19] } },
  twitter:   { name: 'X', url: 'https://x.com/home', home: 'https://x.com/home', color: '#111', desc: 'Posts, replies, DMs', limit: 280, tags: 2, best: { days: ['Tue', 'Wed', 'Thu'], hours: [9, 12, 15] } },
  threads:   { name: 'Threads', url: 'https://www.threads.net', home: 'https://www.threads.net', color: '#111', desc: 'Text posts from Meta', limit: 500, tags: 1, best: { days: ['Tue', 'Wed', 'Thu'], hours: [8, 12, 18] } },
  bluesky:   { name: 'Bluesky', url: 'https://bsky.app', home: 'https://bsky.app', color: '#0085ff', desc: 'Open social network', limit: 300, tags: 3, best: { days: ['Mon', 'Wed', 'Fri'], hours: [9, 13, 20] } },
  mastodon:  { name: 'Mastodon', url: 'https://mastodon.social/home', home: 'https://mastodon.social/home', color: '#6364ff', desc: 'Fediverse', limit: 500, tags: 5, best: { days: ['Tue', 'Thu'], hours: [10, 14, 19] } },
  reddit:    { name: 'Reddit', url: 'https://www.reddit.com', home: 'https://www.reddit.com', color: '#ff4500', desc: 'Communities (r/unixporn, r/linux)', limit: 40000, titleLimit: 300, tags: 0, best: { days: ['Sat', 'Sun', 'Mon'], hours: [6, 8, 9] } },
  facebook:  { name: 'Facebook', url: 'https://www.facebook.com', home: 'https://www.facebook.com', color: '#1877f2', desc: 'Pages & groups', limit: 63206, tags: 3, best: { days: ['Tue', 'Wed', 'Thu'], hours: [9, 13, 15] } },
  linkedin:  { name: 'LinkedIn', url: 'https://www.linkedin.com/feed/', home: 'https://www.linkedin.com/feed/', color: '#0a66c2', desc: 'Professional network', limit: 3000, tags: 5, best: { days: ['Tue', 'Wed', 'Thu'], hours: [8, 10, 12] } },
  pinterest: { name: 'Pinterest', url: 'https://www.pinterest.com', home: 'https://www.pinterest.com', color: '#e60023', desc: 'Pins & boards', limit: 500, titleLimit: 100, tags: 10, best: { days: ['Fri', 'Sat', 'Sun'], hours: [14, 20, 21] } },
  discord:   { name: 'Discord', url: 'https://discord.com/app', home: 'https://discord.com/app', color: '#5865f2', desc: 'Community server', limit: 2000, tags: 0, best: { days: ['Fri', 'Sat', 'Sun'], hours: [18, 20, 21] } },
  telegram:  { name: 'Telegram', url: 'https://web.telegram.org', home: 'https://web.telegram.org', color: '#0088cc', desc: 'Channel & groups', limit: 4096, tags: 0, best: { days: ['Mon', 'Wed', 'Fri'], hours: [9, 13, 19] } }
};
const DEFAULT_ENABLED = ['youtube', 'tiktok', 'instagram', 'twitter', 'discord', 'telegram', 'threads', 'bluesky', 'mastodon', 'reddit'];

// ---------- state ----------
let S = { settings: { notify: true, remind: true, lead: 10, hibernate: true, dnd: false, enabled: DEFAULT_ENABLED, muted: [], order: [], workspace: 'default', workspaces: [{ id: 'default', name: 'Omarchy Store' }], custom: [], pinned: [] },
  drafts: [], queue: [], log: [], templates: [], hashtags: [{ name: 'Omarchy', tags: '#omarchy #linux #archlinux #hyprland #ricing #unixporn #opensource #linuxdesktop' }, { name: 'Store', tags: '#omarchystore #linuxapps #appstore' }], mediaSel: [] };
let openTabs = {}, activeTab = 'dashboard', ctxTarget = null, cal = { date: new Date(), mode: 'month' }, zoom = {}, lastUsed = {};
let CHROME_UA = '';

async function load() {
  for (const k of ['settings', 'drafts', 'queue', 'log', 'templates', 'hashtags']) { const v = await call('data-load', k); if (v) S[k] = k === 'settings' ? { ...S.settings, ...v } : v; }
  CHROME_UA = await call('user-agent');
  await call('workspace-prepare', partition());
}
const save = k => call('data-save', k, S[k]);
function partition() { return S.settings.workspace === 'default' ? 'persist:marquee-socials' : 'persist:ws-' + S.settings.workspace; }
function platforms() {
  const all = { ...BUILTIN }; for (const c of S.settings.custom) all[c.id] = { ...c, limit: 5000, tags: 0, color: '#444', custom: true, home: c.url, icon: 'custom', best: { days: [], hours: [9, 12, 18] } };
  const ids = [...S.settings.order.filter(i => all[i]), ...Object.keys(all).filter(i => !S.settings.order.includes(i))];
  return ids.filter(i => S.settings.enabled.includes(i) || all[i].custom).map(i => ({ id: i, ...all[i] }));
}
const plat = id => LINKS[id] || platforms().find(p => p.id === id) || (BUILTIN[id] ? { id, ...BUILTIN[id] } : { id, name: id, url: '', home: '', color: '#444', limit: 5000, tags: 0, best: { days: [], hours: [] } });
const ico = p => I[p.icon || p.id] || I.custom;

// ---------- window ----------
function win(a) { ipcRenderer.send('window-' + a); }
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('visible'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('visible'), 2600); }
function modal(html) { $('#modal-box').innerHTML = html; $('#modal').classList.add('visible'); }
function closeModal() { $('#modal').classList.remove('visible'); }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

// ---------- views & tabs ----------
function showView(v) {
  activeTab = v;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === v));
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v || b.dataset.platform === v));
  document.querySelectorAll('.view').forEach(x => x.classList.toggle('active', x.id === 'view-' + v));
  document.querySelectorAll('.webview-wrapper').forEach(w => w.classList.toggle('active', w.id === 'wv-' + v));
  for (const [id, t] of Object.entries(openTabs)) { try { t.webview.setAudioMuted(id !== v); } catch (_) {} }
  $('#nav-bar').classList.toggle('show', !!openTabs[v]);
  if (openTabs[v]) { lastUsed[v] = Date.now(); clearBadge(v); updateNav(v); if (openTabs[v].hibernated) wake(v); }
  if (v === 'dashboard') renderDashboard(); if (v === 'compose') renderCompose(); if (v === 'calendar') renderCalendar(); if (v === 'media') renderMedia(); if (v === 'settings') renderSettings();
}
function tabIds() { return ['dashboard', ...Object.keys(openTabs)]; }

function openPlatform(id, url) {
  const p = plat(id); if (!p || !p.name) return;
  if (openTabs[id]) { showView(id); if (url) openTabs[id].webview.loadURL(url); return; }
  const tab = document.createElement('div'); tab.className = 'tab'; tab.dataset.tab = id;
  tab.innerHTML = `<span class="tab-ico" style="background:${p.color}"></span><span class="tab-title">${esc(p.name)}</span><button class="tab-close" title="Close (Ctrl+W)">×</button>`;
  tab.onclick = () => showView(id); tab.querySelector('.tab-close').onclick = e => { e.stopPropagation(); closeTab(id); };
  tab.oncontextmenu = e => ctxMenu(e, id, true);
  $('#tab-bar').insertBefore(tab, $('.tab-add'));
  const wrap = document.createElement('div'); wrap.className = 'webview-wrapper'; wrap.id = 'wv-' + id;
  wrap.innerHTML = `<div class="loading"><div class="spinner"></div><div>Loading ${esc(p.name)}…</div></div>`;
  wrap.insertAdjacentHTML('beforeend', `<webview partition="${partition()}" useragent="${esc(CHROME_UA)}" preload="file://${__dirname}/preload-guest.js" webpreferences="sandbox=no,contextIsolation=no" src="${esc(url || p.url)}"></webview>`);
  const wv = wrap.querySelector('webview'); $('.webview-container').appendChild(wrap);
  const loading = wrap.querySelector('.loading');
  wv.addEventListener('did-finish-load', () => { loading.style.display = 'none'; updateNav(id); });
  wv.addEventListener('did-navigate', () => updateNav(id)); wv.addEventListener('did-navigate-in-page', () => updateNav(id));
  wv.addEventListener('did-fail-load', e => { if (e.errorCode === -3) return; loading.innerHTML = `<div>Couldn't load ${esc(p.name)}</div><button class="btn" onclick="openTabs['${id}'].webview.reload()">Retry</button>`; });
  wv.addEventListener('page-title-updated', e => onTitle(id, e.title));
  wv.addEventListener('ipc-message', e => { if (e.channel === 'open-link') openLink(e.args[0], id); });
  openTabs[id] = { tab, wrap, webview: wv, hibernated: false, unread: 0 }; lastUsed[id] = Date.now();
  showView(id);
}
let linkN = 0;
function openLink(url, fromId) {
  const parent = plat(fromId); const id = 'link' + (++linkN);
  const p = { id, name: parent.name ? parent.name.split(' ')[0] : 'Link', url, home: url, color: parent.color || '#444', limit: 5000, tags: 0, best: { days: [], hours: [] } };
  LINKS[id] = p; openPlatform(id, url);
  // follow the page title
  openTabs[id].webview.addEventListener('page-title-updated', e => { const t = openTabs[id]; if (t) t.tab.querySelector('.tab-title').textContent = e.title.slice(0, 28); });
  // pause autoplay media on link tabs (TikTok/IG public pages autoplay)
  openTabs[id].webview.addEventListener('did-finish-load', () => { try { openTabs[id].webview.executeJavaScript("document.querySelectorAll('video').forEach(v=>{v.pause();v.muted=true;})"); } catch (_) {} });
}
const LINKS = {};
function closeTab(id) { if (!openTabs[id]) return; openTabs[id].tab.remove(); openTabs[id].wrap.remove(); delete openTabs[id]; if (activeTab === id) showView('dashboard'); }
function openAllPlatforms() { platforms().forEach((p, i) => setTimeout(() => { const keep = activeTab; openPlatform(p.id); if (i) showView(keep); }, i * 250)); }
function navAct(a) {
  const t = openTabs[activeTab]; if (!t) return; const w = t.webview;
  if (a === 'back' && w.canGoBack()) w.goBack(); if (a === 'fwd' && w.canGoForward()) w.goForward(); if (a === 'reload') w.reload();
  if (a === 'home') w.loadURL(plat(activeTab).home); if (a === 'external') call('open-external', w.getURL());
  if (a === 'zoomin' || a === 'zoomout') { zoom[activeTab] = Math.min(2, Math.max(.5, (zoom[activeTab] || 1) + (a === 'zoomin' ? .1 : -.1))); w.setZoomFactor(zoom[activeTab]); updateNav(activeTab); }
}
function updateNav(id) { const t = openTabs[id]; if (!t || id !== activeTab) return; try { $('#nav-url').textContent = t.webview.getURL(); } catch (_) {} $('#nav-zoom').textContent = Math.round((zoom[id] || 1) * 100) + '%'; }

// ---------- unread badges / notifications ----------
function onTitle(id, title) {
  const m = title.match(/^\((\d+)\)|^\[(\d+)\]|^(\d+) new|•/); const n = m ? parseInt(m[1] || m[2] || m[3] || '1') : 0;
  const t = openTabs[id]; if (!t) return;
  if (n > 0 && id !== activeTab) { if (n > t.unread) notifyUnread(id, n); t.unread = n; } else t.unread = 0;
  paintBadges();
}
function clearBadge(id) { if (openTabs[id]) openTabs[id].unread = 0; paintBadges(); }
function paintBadges() {
  let total = 0;
  for (const [id, t] of Object.entries(openTabs)) {
    const b = document.querySelector(`.sidebar-btn[data-platform="${id}"] .badge`); const d = t.tab.querySelector('.dot');
    const muted = S.settings.muted.includes(id); const n = muted ? 0 : t.unread; total += n;
    if (b) b.style.display = n ? 'flex' : 'none', b.textContent = n > 99 ? '99+' : n;
    if (n && !d) { const s = document.createElement('span'); s.className = 'dot'; t.tab.appendChild(s); } else if (!n && d) d.remove();
  }
  call('badge', total);
}
function notifyUnread(id, n) { if (!S.settings.notify || S.settings.dnd || S.settings.muted.includes(id)) return; call('notify', { title: plat(id).name, body: `${n} new notification${n > 1 ? 's' : ''}`, platform: id }); }
function toggleDnd() { S.settings.dnd = !S.settings.dnd; $('#dnd-btn').classList.toggle('dnd', S.settings.dnd); $('#dnd-btn').textContent = S.settings.dnd ? '🔕' : '🔔'; save('settings'); toast(S.settings.dnd ? 'Do Not Disturb on' : 'Notifications on'); }
function toggleMute(id) { const m = S.settings.muted; m.includes(id) ? m.splice(m.indexOf(id), 1) : m.push(id); save('settings'); renderSidebar(); paintBadges(); }

// hibernate unused tabs
function hibernate(id) { const t = openTabs[id]; if (!t || t.hibernated || id === activeTab) return; t.lastUrl = t.webview.getURL(); t.webview.src = 'about:blank'; t.hibernated = true; t.tab.style.opacity = .5; }
function wake(id) { const t = openTabs[id]; if (!t || !t.hibernated) return; t.webview.src = t.lastUrl || plat(id).url; t.hibernated = false; t.tab.style.opacity = 1; }
setInterval(() => { if (!S.settings.hibernate) return; for (const id in openTabs) if (Date.now() - (lastUsed[id] || 0) > 30 * 60e3) hibernate(id); }, 60e3);

// ---------- sidebar / dashboard ----------
function renderSidebar() {
  $('#sidebar-platforms').innerHTML = platforms().map(p => `<button class="sidebar-btn ${S.settings.muted.includes(p.id) ? 'muted-svc' : ''}" data-platform="${p.id}" title="${esc(p.name)}${S.settings.muted.includes(p.id) ? ' (muted)' : ''}">${ico(p)}<span class="badge" style="display:none"></span></button>`).join('');
  document.querySelectorAll('#sidebar-platforms .sidebar-btn').forEach(b => { b.onclick = () => openPlatform(b.dataset.platform); b.oncontextmenu = e => ctxMenu(e, b.dataset.platform, !!openTabs[b.dataset.platform]); });
  $('#tb-ws').textContent = (S.settings.workspaces.find(w => w.id === S.settings.workspace) || {}).name || '';
}
function renderDashboard() {
  const q = ($('#dash-search').value || '').toLowerCase();
  $('#platform-grid').innerHTML = platforms().filter(p => !q || p.name.toLowerCase().includes(q)).map(p => `
    <div class="platform-card" data-id="${p.id}">
      <div class="platform-card-header"><div class="platform-icon" style="background:${p.color}">${ico(p)}</div><div><div class="platform-name">${esc(p.name)}</div><div class="platform-desc">${esc(p.desc || p.url)}</div></div></div>
      <div class="platform-card-footer"><span><span class="status-dot"></span>${openTabs[p.id] ? 'Open' : 'Ready'}${S.settings.muted.includes(p.id) ? ' · muted' : ''}</span>
      <span class="acts"><button class="pin-btn ${S.settings.pinned.includes(p.id) ? 'on' : ''}" data-pin="${p.id}">${S.settings.pinned.includes(p.id) ? '📌 Pinned' : 'Pin to dock'}</button></span></div></div>`).join('');
  document.querySelectorAll('.platform-card').forEach(c => { c.onclick = () => openPlatform(c.dataset.id); c.oncontextmenu = e => ctxMenu(e, c.dataset.id, !!openTabs[c.dataset.id]); });
  document.querySelectorAll('[data-pin]').forEach(b => b.onclick = e => { e.stopPropagation(); togglePin(b.dataset.pin); });
  const up = S.queue.filter(x => !x.done).sort((a, b) => a.at - b.at).slice(0, 5);
  $('#upcoming').innerHTML = up.map(x => `<div class="up-card" onclick="showView('calendar')"><b>${fmt(x.at)} · ${x.platforms.map(i => plat(i).name).join(', ')}</b><span>${esc(x.master.slice(0, 80))}</span></div>`).join('');
}
async function togglePin(id) { const p = plat(id); const on = S.settings.pinned.includes(id); if (on) { S.settings.pinned.splice(S.settings.pinned.indexOf(id), 1); await call('unpin-from-dock', id); toast(`${p.name} removed from dock`); } else { S.settings.pinned.push(id); await call('pin-to-dock', { id, name: p.name }); toast(`${p.name} pinned — it's now in your app launcher/dock`); } save('settings'); renderDashboard(); }

// ---------- context menu ----------
function ctxMenu(e, id, isOpen) {
  e.preventDefault(); ctxTarget = id; const p = plat(id); const m = $('#context-menu');
  m.innerHTML = `<div onclick="openPlatform('${id}')">Open${isOpen ? ' (switch)' : ''}</div>${isOpen ? `<div onclick="navAct('reload')">Reload</div><div onclick="closeTab('${id}')">Close tab</div><div onclick="hibernate('${id}')">Hibernate tab</div>` : ''}<hr>
    <div onclick="togglePin('${id}')">${S.settings.pinned.includes(id) ? 'Unpin from dock' : 'Pin to dock'}</div><div onclick="toggleMute('${id}')">${S.settings.muted.includes(id) ? 'Unmute' : 'Mute notifications'}</div>
    <div onclick="composeFor('${id}')">Compose for ${esc(p.name)}</div><div onclick="call('open-external','${p.url}')">Open in system browser</div>`;
  m.style.left = Math.min(e.clientX, innerWidth - 200) + 'px'; m.style.top = Math.min(e.clientY, innerHeight - 260) + 'px'; m.classList.add('visible');
}
document.addEventListener('click', () => $('#context-menu').classList.remove('visible'));

// ---------- COMPOSER ----------
let compose = { platforms: [], variants: {}, custom: {} };
function composeFor(id) { showView('compose'); if (!compose.platforms.includes(id)) compose.platforms.push(id); renderCompose(); }
function renderCompose() {
  if (!compose.platforms.length) compose.platforms = platforms().slice(0, 6).map(p => p.id);
  $('#compose-platforms').innerHTML = platforms().map(p => `<span class="chip ${compose.platforms.includes(p.id) ? 'on' : ''}" onclick="toggleComposePlat('${p.id}')">${esc(p.name)}</span>`).join('');
  $('#hashtag-groups').innerHTML = S.hashtags.map((h, i) => `<span class="chip" onclick="insertHashtags(${i})" title="${esc(h.tags)}">#${esc(h.name)} <span class="x" onclick="event.stopPropagation();delHashtags(${i})">×</span></span>`).join('');
  $('#compose-media').innerHTML = S.mediaSel.map((m, i) => `<span class="chip on">${esc(m.name)} <span class="x" onclick="S.mediaSel.splice(${i},1);renderCompose()">×</span></span>`).join('') || '<span class="muted">none attached</span>';
  $('#tpl-select').innerHTML = '<option value="">Templates…</option>' + S.templates.map((t, i) => `<option value="${i}">${esc(t.name)}</option>`).join('');
  syncVariants(); renderDrafts();
}
function toggleComposePlat(id) { const i = compose.platforms.indexOf(id); i < 0 ? compose.platforms.push(id) : compose.platforms.splice(i, 1); renderCompose(); }
function insertHashtags(i) { const t = $('#master'); t.value = (t.value.trimEnd() + '\n\n' + S.hashtags[i].tags).trim(); syncVariants(); }
function delHashtags(i) { if (confirm('Delete hashtag group?')) { S.hashtags.splice(i, 1); save('hashtags'); renderCompose(); } }
function newHashtagGroup() { const name = prompt('Group name'); if (!name) return; const tags = prompt('Hashtags (space separated)'); if (!tags) return; S.hashtags.push({ name, tags }); save('hashtags'); renderCompose(); }
function fillVars(s) { return s.replace(/\{\{date\}\}/g, new Date().toLocaleDateString()).replace(/\{\{link\}\}/g, 'omarchystore.com'); }
function syncVariants() {
  const master = $('#master').value;
  $('#variants').innerHTML = compose.platforms.map(id => {
    const p = plat(id); const v = compose.custom[id] ? compose.variants[id] : fitTo(master, p); compose.variants[id] = v;
    const over = v.length > p.limit; const tags = (v.match(/#\w+/g) || []).length;
    return `<div class="variant"><div class="variant-head"><span class="ico" style="background:${p.color}">${ico(p)}</span>${esc(p.name)}${compose.custom[id] ? ' <span class="muted">(custom)</span>' : ''}<span class="cnt ${over ? 'over' : ''}">${v.length}/${p.limit}${p.tags ? ` · ${tags}/${p.tags} tags` : ''}</span></div>
      <textarea data-v="${id}" oninput="compose.custom['${id}']=true;compose.variants['${id}']=this.value;previewOne('${id}')">${esc(v)}</textarea>
      <div class="vacts"><button class="btn sm" onclick="copyVariant('${id}')">Copy</button><button class="btn sm" onclick="copyVariant('${id}');openPlatform('${id}')">Copy & open</button><button class="btn sm" onclick="delete compose.custom['${id}'];syncVariants()">Reset to master</button></div>
      <div class="preview" id="pv-${id}">${preview(v, p)}</div></div>`;
  }).join('');
}
function previewOne(id) { const p = plat(id); const v = compose.variants[id]; $(`#pv-${id}`).innerHTML = preview(v, p); const c = document.querySelector(`.variant textarea[data-v="${id}"]`).closest('.variant').querySelector('.cnt'); c.textContent = `${v.length}/${p.limit}`; c.classList.toggle('over', v.length > p.limit); }
function fitTo(text, p) {
  let t = fillVars(text);
  if (p.id === 'twitter' || p.id === 'bluesky' || p.id === 'threads') { const tags = (t.match(/#\w+/g) || []).slice(0, p.tags); const body = t.replace(/#\w+/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim(); t = (body + (tags.length ? '\n' + tags.join(' ') : '')); if (t.length > p.limit) t = t.slice(0, p.limit - 1) + '…'; }
  else if (t.length > p.limit) t = t.slice(0, p.limit - 1) + '…';
  return t;
}
function preview(v, p) { const cut = p.id === 'instagram' ? 125 : p.id === 'youtube' ? 100 : p.id === 'linkedin' ? 140 : 0; let h = esc(v).replace(/(#\w+)/g, '<b>$1</b>').replace(/(@\w+)/g, '<b>$1</b>'); if (cut && v.length > cut) { const a = esc(v.slice(0, cut)).replace(/(#\w+)/g, '<b>$1</b>'); h = a + '<span class="more">… more</span>'; } return h || '<span class="muted">preview</span>'; }
async function copyVariant(id) { await call('copy', compose.variants[id] || ''); toast(`${plat(id).name} caption copied — paste it in the composer`); }
function currentPost() { return { id: Date.now(), master: $('#master').value, platforms: [...compose.platforms], variants: { ...compose.variants }, media: S.mediaSel.map(m => m.path), at: $('#sched-at').value ? new Date($('#sched-at').value).getTime() : null, created: Date.now() }; }
function saveDraft() { const d = currentPost(); if (!d.master.trim()) return toast('Nothing to save'); S.drafts.unshift(d); save('drafts'); toast('Draft saved'); renderDrafts(); }
function loadDraft(i) { const d = S.drafts[i]; $('#master').value = d.master; compose.platforms = [...d.platforms]; compose.custom = {}; compose.variants = { ...d.variants }; if (d.at) $('#sched-at').value = toLocal(d.at); renderCompose(); }
function delDraft(i) { S.drafts.splice(i, 1); save('drafts'); renderDrafts(); }
function renderDrafts() { $('#drafts').innerHTML = S.drafts.map((d, i) => `<div class="item"><span class="plats">${d.platforms.map(p => `<span style="background:${plat(p).color}">${ico(plat(p))}</span>`).join('')}</span><span class="txt">${esc(d.master)}</span><span class="meta">${fmt(d.created)}</span><span class="acts"><button class="btn sm" onclick="loadDraft(${i})">Load</button><button class="btn sm danger" onclick="delDraft(${i})">Delete</button></span></div>`).join(''); }
function saveTemplate() { const name = prompt('Template name'); if (!name) return; S.templates.push({ name, master: $('#master').value, platforms: [...compose.platforms] }); save('templates'); renderCompose(); toast('Template saved'); }
function applyTemplate(i) { if (i === '') return; const t = S.templates[i]; $('#master').value = t.master; compose.platforms = [...t.platforms]; compose.custom = {}; renderCompose(); }
function schedulePost() {
  const p = currentPost(); if (!p.master.trim()) return toast('Write something first'); if (!p.at) return toast('Pick a date & time'); if (!p.platforms.length) return toast('Pick at least one platform');
  S.queue.push(p); save('queue'); toast(`Scheduled for ${fmt(p.at)} — you'll get a reminder`); $('#master').value = ''; compose.custom = {}; compose.variants = {}; S.mediaSel = []; renderCompose();
}
async function postNow(item) {
  const p = item || currentPost(); if (!p.platforms.length) return toast('Pick a platform');
  const first = p.platforms[0]; await call('copy', p.variants[first] || p.master);
  if (p.media && p.media.length) toast(`Caption copied. Media: ${p.media.map(m => m.split('/').pop()).join(', ')} (in Media Library)`);
  p.platforms.forEach((id, i) => setTimeout(() => openPlatform(id, plat(id).home), i * 300));
  setTimeout(() => showView(first), p.platforms.length * 300 + 100);
  if (!item) { S.log.unshift({ ...p, posted: Date.now() }); save('log'); }
}
function suggestTime() {
  const ids = compose.platforms.length ? compose.platforms : ['instagram']; const b = plat(ids[0]).best; const now = new Date();
  for (let d = 0; d < 8; d++) { const day = new Date(now); day.setDate(now.getDate() + d); const dn = day.toLocaleDateString('en', { weekday: 'short' }); if (!b.days.includes(dn)) continue; for (const h of b.hours) { day.setHours(h, 0, 0, 0); if (day > now) { $('#sched-at').value = toLocal(day.getTime()); $('#sched-hint').textContent = `best for ${plat(ids[0]).name}: ${b.days.join('/')} at ${b.hours.map(x => x + ':00').join(', ')}`; return; } } }
}

// ---------- CALENDAR + QUEUE ----------
const fmt = t => new Date(t).toLocaleString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const toLocal = t => { const d = new Date(t); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
function calMove(n) { cal.mode === 'month' ? cal.date.setMonth(cal.date.getMonth() + n) : cal.date.setDate(cal.date.getDate() + 7 * n); renderCalendar(); }
function calToday() { cal.date = new Date(); renderCalendar(); }
function calToggleMode() { cal.mode = cal.mode === 'month' ? 'week' : 'month'; $('#cal-mode-btn').textContent = cal.mode === 'month' ? 'Week view' : 'Month view'; renderCalendar(); }
function renderCalendar() {
  const d = cal.date, today = new Date().toDateString(); let start;
  if (cal.mode === 'month') { start = new Date(d.getFullYear(), d.getMonth(), 1); start.setDate(start.getDate() - start.getDay()); $('#cal-title').textContent = d.toLocaleDateString('en', { month: 'long', year: 'numeric' }); }
  else { start = new Date(d); start.setDate(d.getDate() - d.getDay()); $('#cal-title').textContent = 'Week of ' + start.toLocaleDateString('en', { month: 'short', day: 'numeric' }); }
  const days = cal.mode === 'month' ? 42 : 7; let cells = '';
  for (let i = 0; i < days; i++) {
    const day = new Date(start); day.setDate(start.getDate() + i); const dn = day.toLocaleDateString('en', { weekday: 'short' });
    const evs = [...S.queue.map(x => ({ ...x, done: false })), ...S.log.map(x => ({ ...x, done: true, at: x.posted }))].filter(x => new Date(x.at).toDateString() === day.toDateString()).sort((a, b) => a.at - b.at);
    const best = platforms().filter(p => p.best.days.includes(dn)).slice(0, 3).map(p => p.name.split(' ')[0]).join(', ');
    cells += `<div class="cal-day ${day.getMonth() !== d.getMonth() && cal.mode === 'month' ? 'other' : ''} ${day.toDateString() === today ? 'today' : ''}" onclick="calPick(${day.getTime()})"><span class="dn">${day.getDate()}</span>
      ${evs.map(x => `<div class="ev ${x.done ? 'done' : ''}" title="${esc(x.master)}">${new Date(x.at).getHours()}:${String(new Date(x.at).getMinutes()).padStart(2, '0')} ${esc(x.master.slice(0, 30))}</div>`).join('')}${best && cal.mode === 'week' ? `<div class="best">★ ${best}</div>` : ''}</div>`;
  }
  $('#calendar').className = cal.mode === 'week' ? 'cal-week' : ''; $('#calendar').innerHTML = `<div class="cal-head">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(x => `<div>${x}</div>`).join('')}</div><div class="cal-grid">${cells}</div>`;
  $('#queue').innerHTML = S.queue.sort((a, b) => a.at - b.at).map((x, i) => `<div class="item"><span class="plats">${x.platforms.map(p => `<span style="background:${plat(p).color}">${ico(plat(p))}</span>`).join('')}</span><span class="txt">${esc(x.master)}</span><span class="meta">${fmt(x.at)}</span><span class="acts"><button class="btn sm primary" onclick="postQueued(${i})">Post now</button><button class="btn sm" onclick="editQueued(${i})">Edit</button><button class="btn sm danger" onclick="S.queue.splice(${i},1);save('queue');renderCalendar()">Remove</button></span></div>`).join('');
  $('#postlog').innerHTML = S.log.slice(0, 30).map((x, i) => `<div class="item"><span class="plats">${x.platforms.map(p => `<span style="background:${plat(p).color}">${ico(plat(p))}</span>`).join('')}</span><span class="txt">${esc(x.master)}</span><span class="meta">${fmt(x.posted)}</span><span class="acts"><button class="btn sm" onclick="recycle(${i})">Recycle</button></span></div>`).join('');
}
function calPick(t) { showView('compose'); const d = new Date(t); d.setHours(12, 0); $('#sched-at').value = toLocal(d.getTime()); }
function postQueued(i) { const x = S.queue.splice(i, 1)[0]; S.log.unshift({ ...x, posted: Date.now() }); save('queue'); save('log'); postNow(x); renderCalendar(); }
function editQueued(i) { const x = S.queue.splice(i, 1)[0]; save('queue'); $('#master').value = x.master; compose.platforms = x.platforms; compose.variants = x.variants; compose.custom = {}; $('#sched-at').value = toLocal(x.at); showView('compose'); }
function recycle(i) { const x = S.log[i]; $('#master').value = x.master; compose.platforms = [...x.platforms]; compose.custom = {}; showView('compose'); toast('Loaded into composer — reschedule it'); }
function showBestTimes() { modal(`<h2>Best times to post</h2><p class="muted">Aggregated from Buffer, Hootsuite, Sprout and Metricool research (local time). Your own analytics beat averages — check each platform's insights.</p><table class="bt-table"><tr><th>Platform</th><th>Best days</th><th>Best hours</th></tr>${platforms().map(p => `<tr><td>${esc(p.name)}</td><td>${p.best.days.join(', ')}</td><td>${p.best.hours.map(h => h + ':00').join(', ')}</td></tr>`).join('')}</table><div class="row"><button class="btn" onclick="closeModal()">Close</button></div>`); }
// reminders
const reminded = new Set();
setInterval(() => {
  if (!S.settings.remind) return; const now = Date.now(); const lead = (S.settings.lead || 0) * 60e3;
  for (const x of S.queue) { if (!reminded.has(x.id) && x.at - now <= lead && x.at - now > -3600e3) { reminded.add(x.id); call('notify', { title: 'Time to post', body: `${x.platforms.map(i => plat(i).name).join(', ')}: ${x.master.slice(0, 80)}`, platform: x.platforms[0] }); toast(`Due: ${x.master.slice(0, 60)} — open Calendar → Post now`); } }
}, 30e3);

// ---------- MEDIA ----------
async function renderMedia() {
  const list = await call('media-list');
  $('#media-grid').innerHTML = list.map(m => { const v = /\.(mp4|mov|webm|mkv)$/i.test(m.name); return `<div class="media"><div class="th">${v ? `<video src="file://${m.path}" muted></video>` : `<img src="file://${m.path}">`}</div><div class="mi" title="${esc(m.name)}">${esc(m.name)} · ${(m.size / 1048576).toFixed(1)} MB</div><div class="ma"><button class="btn sm" onclick="attachMedia('${m.path.replace(/'/g, "\\'")}','${esc(m.name)}')">Attach</button><button class="btn sm" onclick="call('media-reveal','${m.path.replace(/'/g, "\\'")}')">Show</button><button class="btn sm" onclick="call('media-copy-path','${m.path.replace(/'/g, "\\'")}');toast('Path copied — paste in the upload dialog')">Path</button><button class="btn sm danger" onclick="call('media-remove','${m.path.replace(/'/g, "\\'")}').then(renderMedia)">✕</button></div></div>`; }).join('') || '<p class="muted">Add images and videos here, then attach them to posts. Upload dialogs can be pointed at the path with one click.</p>';
}
async function mediaAdd() { const added = await call('media-add'); if (added.length) toast(`${added.length} file(s) added`); renderMedia(); }
function attachMedia(path, name) { if (!S.mediaSel.find(m => m.path === path)) S.mediaSel.push({ path, name }); toast(`${name} attached`); showView('compose'); }

// ---------- SETTINGS ----------
function renderSettings() {
  $('#about-ver').textContent = VERSION; $('#set-notify').checked = S.settings.notify; $('#set-remind').checked = S.settings.remind; $('#set-lead').value = S.settings.lead; $('#set-hibernate').checked = S.settings.hibernate;
  $('#ws-list').innerHTML = S.settings.workspaces.map(w => `<div class="toggle-row"><input type="radio" name="ws" ${w.id === S.settings.workspace ? 'checked' : ''} onchange="switchWorkspace('${w.id}')"><span>${esc(w.name)}</span><span class="sp"></span>${w.id !== 'default' ? `<button class="btn sm danger" onclick="delWorkspace('${w.id}')">Delete</button>` : ''}</div>`).join('');
  const all = { ...BUILTIN }; S.settings.custom.forEach(c => all[c.id] = c);
  $('#plat-toggles').innerHTML = Object.entries(all).map(([id, p]) => `<div class="toggle-row"><input type="checkbox" ${S.settings.enabled.includes(id) || p.custom ? 'checked' : ''} ${p.custom ? 'disabled' : ''} onchange="togglePlat('${id}',this.checked)"><span>${esc(p.name)}</span><span class="sp"></span><button class="btn sm" onclick="movePlat('${id}',-1)">↑</button><button class="btn sm" onclick="movePlat('${id}',1)">↓</button>${p.custom ? `<button class="btn sm danger" onclick="delCustom('${id}')">Delete</button>` : ''}</div>`).join('');
}
function saveSettings() { S.settings.notify = $('#set-notify').checked; S.settings.remind = $('#set-remind').checked; S.settings.lead = +$('#set-lead').value; S.settings.hibernate = $('#set-hibernate').checked; save('settings'); }
function togglePlat(id, on) { const e = S.settings.enabled; on ? (e.includes(id) || e.push(id)) : e.splice(e.indexOf(id), 1); save('settings'); renderSidebar(); }
function movePlat(id, dir) { const o = S.settings.order.length ? S.settings.order : Object.keys(BUILTIN).concat(S.settings.custom.map(c => c.id)); const i = o.indexOf(id); if (i < 0) return; const j = i + dir; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; S.settings.order = o; save('settings'); renderSidebar(); renderSettings(); }
function addCustom() { const name = $('#custom-name').value.trim(), url = $('#custom-url').value.trim(); if (!name || !/^https?:\/\//.test(url)) return toast('Name and a full https:// URL please'); const id = 'c_' + name.toLowerCase().replace(/\W+/g, '_'); S.settings.custom.push({ id, name, url, desc: url, custom: true }); save('settings'); $('#custom-name').value = $('#custom-url').value = ''; renderSidebar(); renderSettings(); toast(`${name} added`); }
function delCustom(id) { S.settings.custom = S.settings.custom.filter(c => c.id !== id); save('settings'); renderSidebar(); renderSettings(); }
function addWorkspace() { const name = $('#ws-new').value.trim(); if (!name) return; const id = 'w' + Date.now(); S.settings.workspaces.push({ id, name }); $('#ws-new').value = ''; save('settings'); renderSettings(); toast(`Workspace "${name}" created — switch to it and log in to your other accounts`); }
async function switchWorkspace(id) { S.settings.workspace = id; await call('workspace-prepare', partition()); Object.keys(openTabs).forEach(closeTab); save('settings'); renderSidebar(); showView('dashboard'); toast(`Switched to ${(S.settings.workspaces.find(w => w.id === id) || {}).name}`); }
function delWorkspace(id) { if (!confirm('Delete this workspace? Its logins will be removed.')) return; call('clear-session', 'persist:ws-' + id); S.settings.workspaces = S.settings.workspaces.filter(w => w.id !== id); if (S.settings.workspace === id) switchWorkspace('default'); save('settings'); renderSettings(); }
async function importLogins() { toast('Importing…'); const n = await call('import-logins', partition()); toast(n >= 0 ? `Imported ${n} cookies — reload your tabs` : 'Could not read the Omarchy Social browser'); }
async function clearWorkspace() { if (!confirm('Sign out of every site in this workspace?')) return; await call('clear-session', partition()); Object.keys(openTabs).forEach(closeTab); toast('Signed out'); }

// ---------- quick switcher ----------
let quickSel = 0;
function quickOpen() { $('#quick').classList.add('visible'); $('#quick-input').value = ''; quickRender(); $('#quick-input').focus(); }
function quickClose() { $('#quick').classList.remove('visible'); }
function quickItems() { const q = $('#quick-input').value.toLowerCase(); const views = [['compose', 'Compose', 'Ctrl+N'], ['calendar', 'Calendar', ''], ['media', 'Media Library', ''], ['dashboard', 'Dashboard', 'Ctrl+T'], ['settings', 'Settings', '']]; const items = [...platforms().map(p => ({ id: p.id, label: p.name, k: openTabs[p.id] ? 'open' : '' })), ...views.map(v => ({ id: v[0], label: v[1], k: v[2] }))]; return items.filter(x => x.label.toLowerCase().includes(q)); }
function quickRender() { quickSel = 0; $('#quick-list').innerHTML = quickItems().slice(0, 10).map((x, i) => `<div class="${i === 0 ? 'sel' : ''}" onclick="quickGo(${i})">${esc(x.label)}<span class="k">${x.k}</span></div>`).join(''); }
function quickGo(i) { const x = quickItems()[i]; if (!x) return; quickClose(); BUILTIN[x.id] || S.settings.custom.find(c => c.id === x.id) ? openPlatform(x.id) : showView(x.id); }
function quickKey(e) { const n = Math.min(10, quickItems().length); if (e.key === 'ArrowDown') quickSel = (quickSel + 1) % n; else if (e.key === 'ArrowUp') quickSel = (quickSel - 1 + n) % n; else if (e.key === 'Enter') return quickGo(quickSel); else if (e.key === 'Escape') return quickClose(); else return; document.querySelectorAll('#quick-list div').forEach((d, i) => d.classList.toggle('sel', i === quickSel)); }

// ---------- keyboard ----------
document.addEventListener('keydown', e => {
  const c = e.ctrlKey || e.metaKey; const ids = tabIds();
  if (c && e.key === 'k') { e.preventDefault(); quickOpen(); } else if (c && e.key === 'n') { e.preventDefault(); showView('compose'); } else if (c && e.key === 't') { e.preventDefault(); showView('dashboard'); }
  else if (c && e.key === 'w') { e.preventDefault(); closeTab(activeTab); } else if (c && e.key === 'r') { e.preventDefault(); navAct('reload'); } else if (c && e.key === 'b') { e.preventDefault(); $('#sidebar').classList.toggle('hidden'); }
  else if (c && e.shiftKey && e.key === 'D') { e.preventDefault(); toggleDnd(); } else if (c && (e.key === '=' || e.key === '+')) { navAct('zoomin'); } else if (c && e.key === '-') { navAct('zoomout'); }
  else if (c && e.key === 'Tab') { e.preventDefault(); const i = ids.indexOf(activeTab); showView(ids[(i + (e.shiftKey ? -1 : 1) + ids.length) % ids.length]); }
  else if (c && /^[1-9]$/.test(e.key)) { e.preventDefault(); const t = ids[+e.key - 1]; if (t) showView(t); }
  else if (e.altKey && e.key === 'ArrowLeft') navAct('back'); else if (e.altKey && e.key === 'ArrowRight') navAct('fwd'); else if (e.key === 'Escape') { closeModal(); quickClose(); }
});
document.querySelectorAll('.sidebar-btn[data-view]').forEach(b => b.onclick = () => showView(b.dataset.view));
ipcRenderer.on('open-platform', (_e, id) => openPlatform(id));
ipcRenderer.on('open-link', (_e, { url, guestId }) => { const from = Object.entries(openTabs).find(([, t]) => { try { return t.webview.getWebContentsId() === guestId; } catch (_) { return false; } }); openLink(url, from ? from[0] : activeTab); });
ipcRenderer.on('win-state', () => {});

// ---------- boot ----------
load().then(() => { $('#dnd-btn').textContent = S.settings.dnd ? '🔕' : '🔔'; $('#dnd-btn').classList.toggle('dnd', S.settings.dnd); renderSidebar(); renderDashboard(); });
