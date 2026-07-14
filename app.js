import {
  loadState,
  saveState,
  sanitizeText,
  sanitizeUrl,
  fileToDataURL,
  validateImageFile,
  makeImage
} from "./utilities.js";
import { enhancePageMotion, installMobileAnimationBudget, prefersReducedMotion } from "./animations.js";
import { enhanceMusicAccessibility } from "./music.js";

enhancePageMotion();
installMobileAnimationBudget();
enhanceMusicAccessibility();

const CONFIG = {
  footerNote: "made with care, for someone worth celebrating.",
  candleCount: 5,
  memoryYears: ["2021", "2022", "2023", "2024", "2025"],
  relationMemories: {
    partner: [
      { emoji: "💕", title: "Our first date", caption: "The nervous excitement, the endless conversation — it's still one of my favorite days." },
      { emoji: "🌧️", title: "Through the hard days", caption: "The moment we chose each other, even when things weren't easy." },
      { emoji: "✈️", title: "Our first trip together", caption: "New places, same us. Still can't stop talking about it." },
      { emoji: "🏠", title: "Building our world", caption: "Little routines, inside jokes, a life that's ours." },
      { emoji: "💍", title: "Right here, right now", caption: "And somehow, I fall for you more every single day." }
    ],
    bestfriend: [
      { emoji: "✨", title: "How we became friends", caption: "The first hello — replace with your own story of how it started." },
      { emoji: "🌧️", title: "A tough year, together", caption: "The moment that made this friendship unbreakable." },
      { emoji: "🎈", title: "That one crazy trip", caption: "Still can't stop laughing about this." },
      { emoji: "🎓", title: "A big milestone", caption: "So proud of everything you've achieved." },
      { emoji: "🥳", title: "Right before today", caption: "And here we are, still going strong." }
    ],
    family: [
      { emoji: "👶", title: "The early years", caption: "So many memories from when it all began." },
      { emoji: "🏡", title: "Home, always", caption: "The place that always feels warm because you're in it." },
      { emoji: "🎓", title: "Every milestone", caption: "Cheering you on through every step." },
      { emoji: "🍲", title: "Sunday dinners", caption: "The little traditions that mean everything." },
      { emoji: "🥳", title: "Right up to today", caption: "Still the heart of this family." }
    ],
    crush: [
      { emoji: "👀", title: "The first time we talked", caption: "I still remember exactly how that conversation went." },
      { emoji: "😊", title: "That one moment", caption: "The one that made me smile for the rest of the day." },
      { emoji: "💬", title: "Our little inside jokes", caption: "The ones only we'd understand." },
      { emoji: "🌤️", title: "Getting to know you", caption: "Every conversation makes me like you a little more." },
      { emoji: "🙈", title: "Right now", caption: "Still working up the courage to say more." }
    ],
    colleague: [
      { emoji: "👋", title: "The first project together", caption: "The one that kicked things off." },
      { emoji: "💡", title: "That late-night deadline", caption: "Stressful then, a great story now." },
      { emoji: "🎉", title: "A win worth celebrating", caption: "One of the best team moments." },
      { emoji: "☕", title: "The coffee-break chats", caption: "The ones that make the workday better." },
      { emoji: "🥳", title: "Right up to today", caption: "Great to have you on the team." }
    ]
  },
  letterTemplates: {
    partner: "My dearest {name},\n\nEvery year I fall for you a little more, and today is proof of that. You are my favorite person to laugh with, to dream with, and to grow with.\n\nHere's to another year of us — messy, magical, and completely ours.\n\nHappy Birthday, my love. I'm so lucky to call you mine.\n\nForever yours 💗",
    bestfriend: "Hey {name},\n\nHonestly, life is just better with you in it. You're the friend who shows up, who gets the jokes no one else does, and who makes the ordinary days feel like an adventure.\n\nHere's to more chaos, more inside jokes, and many more birthdays together.\n\nHappy Birthday, legend. Don't ever change 🤝",
    family: "Dearest {name},\n\nWords can't fully capture how much you mean to this family. Your love, your strength, and your presence have shaped so much of who we are.\n\nOn this special day, we celebrate not just another year of your life, but every memory, every lesson, and every moment of warmth you've given us.\n\nHappy Birthday. We love you more than words can say 🏡",
    crush: "Hi {name},\n\nOkay, I'll admit it — I've been wanting an excuse to say something nice to you, and your birthday is the perfect one.\n\nYou make ordinary moments feel a little brighter, and I hope this year brings you everything you're hoping for (and maybe a little surprise too 👀).\n\nHappy Birthday. Hope it's as wonderful as you are 🙈",
    colleague: "Hey {name}!\n\nJust a quick note to say — working alongside you makes even the busiest days better. Your energy, your humor, and your dedication don't go unnoticed.\n\nHope your birthday is filled with cake, laughter, and zero notifications.\n\nHappy Birthday! Here's to another great year ahead 🎉"
  },
  wishTemplates: {
    partner: "May this year be full of quiet mornings, loud laughter, and every little adventure we haven't had yet, {name}. I love you more than any birthday message could ever say. Happy Birthday, my love. 💗",
    bestfriend: "Here's to another year of terrible decisions, great memories, and a friendship that never gets old, {name}. You deserve every good thing coming your way. Happy Birthday! 🤝",
    family: "May you always be surrounded by the love and warmth you give so freely, {name}. This family is better because you're in it. Happy Birthday, with all our love. 🏡",
    crush: "Wishing you a birthday as bright and lovely as your smile, {name}. Hope this year brings you exactly what you've been hoping for. 🙈",
    colleague: "Wishing you a year of big wins, good coffee, and well-deserved breaks, {name}. Happy Birthday — enjoy the day off from the inbox! 🎉"
  }
};

// ---- Starry background ----
const starsBg = document.getElementById('starsBg');
for (let i = 0; i < 70; i++){
  const s = document.createElement('div');
  s.className = 'star';
  s.style.left = Math.random()*100 + '%';
  s.style.top = Math.random()*100 + '%';
  s.style.animationDelay = (Math.random()*2.6) + 's';
  starsBg.appendChild(s);
}

// ---- Theme toggle (Cycles through 5 themes) ----
const themesList = ['sakura', 'sakura-dark', 'gold', 'ocean', 'cyberpunk'];
const themeEmojis = { sakura: '🌸', 'sakura-dark': '🌌', gold: '👑', ocean: '🌊', cyberpunk: '⚡' };
let currentThemeIdx = 0;

function setTheme(themeName) {
  document.body.dataset.theme = themeName === 'sakura' ? '' : themeName;
  document.getElementById('themeToggleBtn').textContent = themeEmojis[themeName] || '🌸';
  // Update wizard grid active pill if it exists
  document.querySelectorAll('#themeGrid .theme-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeVal === themeName);
  });
}

document.getElementById('themeToggleBtn').addEventListener('click', () => {
  currentThemeIdx = (currentThemeIdx + 1) % themesList.length;
  setTheme(themesList[currentThemeIdx]);
});

// Setup themeGrid buttons inside wizard
document.querySelectorAll('#themeGrid .theme-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#themeGrid .theme-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const themeVal = btn.dataset.themeVal;
    currentThemeIdx = themesList.indexOf(themeVal);
    setTheme(themeVal);
    
    // Sync live preview phone screen to show selected theme
    const previewScreen = document.getElementById('previewScreen');
    if (previewScreen) previewScreen.setAttribute('data-theme', themeVal);
  });
});

// ---- Music Player Widget ----
const bgMusic = document.getElementById('bgMusic');
const musicPlayerWrap = document.getElementById('musicPlayer');
const musicToggleDisc = document.getElementById('musicToggleDisc');
const playerPlayBtn = document.getElementById('playerPlayBtn');
const playerVolume = document.getElementById('playerVolume');
const playerTitle = document.getElementById('playerTitle');
let musicPlaying = false;

// Expand/Collapse player panel
musicToggleDisc.addEventListener('click', (e) => {
  e.stopPropagation();
  musicPlayerWrap.classList.toggle('expanded');
});
document.addEventListener('click', (e) => {
  if (!musicPlayerWrap.contains(e.target)) {
    musicPlayerWrap.classList.remove('expanded');
  }
});

let visualizerTimeoutId = null;

function togglePlay() {
  if (!bgMusic.src) return;
  if (musicPlaying) {
    bgMusic.pause();
    playerPlayBtn.textContent = '▶';
    musicToggleDisc.classList.remove('playing');
    if (visualizerTimeoutId) {
      clearTimeout(visualizerTimeoutId);
      visualizerTimeoutId = null;
    }
  } else {
    bgMusic.play().catch(() => {});
    playerPlayBtn.textContent = '⏸';
    musicToggleDisc.classList.add('playing');
    initVisualizer();
  }
  musicPlaying = !musicPlaying;
}

playerPlayBtn.addEventListener('click', togglePlay);
musicToggleDisc.addEventListener('dblclick', togglePlay);

playerVolume.addEventListener('input', (e) => {
  bgMusic.volume = e.target.value;
});

// ---- Web Audio visualizer ----
let audioCtx, analyser, visualizerCanvas, visualizerCtx;
function initVisualizer() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(bgMusic);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 32;
    
    visualizerCanvas = document.getElementById('visualizerCanvas');
    visualizerCtx = visualizerCanvas.getContext('2d');
    drawVisualizer();
  } catch (err) {
    console.log("AudioContext blocked or visualizer failed", err);
    // Draw dummy CSS visualizer animation fallback if Web Audio fails
    simulateVisualizer();
  }
}

function drawVisualizer() {
  if (!visualizerCtx) return;
  requestAnimationFrame(drawVisualizer);
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
  const barWidth = (visualizerCanvas.width / bufferLength) * 1.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / 255) * visualizerCanvas.height;
    visualizerCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary').trim();
    visualizerCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth - 2, barHeight);
    x += barWidth;
  }
}

function simulateVisualizer() {
  if (audioCtx) return; // Web audio works
  if (!musicPlaying) {
    if (visualizerTimeoutId) {
      clearTimeout(visualizerTimeoutId);
      visualizerTimeoutId = null;
    }
    return;
  }
  
  visualizerCanvas = document.getElementById('visualizerCanvas');
  if (!visualizerCanvas) return;
  visualizerCtx = visualizerCanvas.getContext('2d');
  visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
  
  for (let i = 0; i < 8; i++) {
    const barHeight = Math.random() * visualizerCanvas.height;
    visualizerCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary').trim();
    visualizerCtx.fillRect(i * 10, visualizerCanvas.height - barHeight, 8, barHeight);
  }
  
  if (visualizerTimeoutId) clearTimeout(visualizerTimeoutId);
  visualizerTimeoutId = setTimeout(simulateVisualizer, 100);
}

// ---- Click Particle Spawner ----
const clickEmojis = ['💖', '✨', '⭐', '🎈', '🌸', '🎉'];
window.addEventListener('click', (e) => {
  if (e.target.closest('button, input, textarea, a, .envelope, .cake, #scratchCanvas')) return;
  const count = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'click-particle';
    p.textContent = clickEmojis[Math.floor(Math.random() * clickEmojis.length)];
    p.style.left = e.clientX + 'px';
    p.style.top = e.clientY + 'px';
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    p.style.setProperty('--vx', (Math.cos(angle) * speed * 40) + 'px');
    p.style.setProperty('--vy', (Math.sin(angle) * speed * 40 - 80) + 'px');
    p.style.setProperty('--rot', (Math.random() * 360) + 'deg');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
});

// ---- Download as image ----
document.getElementById('downloadBtn').addEventListener('click', () => {
  if (typeof html2canvas === 'undefined'){
    alert('Image export needs an internet connection to load — please check your connection and try again.');
    return;
  }
  // Temporarily tag images inside .hero with crossOrigin for canvas capture, restore after.
  // Only .hero is passed to html2canvas, so .memory-card images do NOT need touching.
  const imgs = document.querySelectorAll('.hero img[src]');
  const prevCors = [];
  imgs.forEach(img => {
    prevCors.push(img.getAttribute('crossorigin'));
    if (!img.getAttribute('crossorigin')) {
      img.setAttribute('crossorigin', 'anonymous');
      // Force reload so browser applies CORS — swap src via trick
      const s = img.src; img.src = ''; img.src = s;
    }
  });
  // Give browser a moment to reload, then capture
  setTimeout(() => {
    html2canvas(document.querySelector('.hero'), { backgroundColor: null, useCORS: true, allowTaint: false }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'birthday-surprise.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(() => {
      alert('Could not capture the image — some photos may have restricted access. Try with a different photo URL.');
    }).finally(() => {
      // Restore original crossOrigin state
      imgs.forEach((img, idx) => {
        const was = prevCors[idx];
        if (was === null) img.removeAttribute('crossorigin');
        else img.setAttribute('crossorigin', was);
      });
    });
  }, 250);
});

// ---- Scroll-triggered reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

// ---- Timeline rendering (supports optional uploaded photos + custom captions) ----
const timelineEl = document.getElementById('timelineScroll');
const thumbColors = ['var(--primary)','var(--secondary)','var(--accent)'];
function renderTimeline(memoriesData, photoUrls){
  timelineEl.innerHTML = '';
  const data = memoriesData || [];
  data.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'memory-card reveal';
    card.style.setProperty('--stagger', (i * 120) + 'ms');
    const photo = photoUrls && photoUrls[i];
      // --- Build card DOM safely (no innerHTML for user text) ---
      const thumb = document.createElement('div');
      thumb.className = 'memory-thumb';
      if (!photo) thumb.style.background = thumbColors[i % thumbColors.length];

      if (photo) {
        const img = document.createElement('img');
        img.className = 'anime-photo';
        img.alt = m.title || '';           // safe: alt goes via property not innerHTML
        img.src = photo;                   // crossOrigin set only when downloading (see #downloadBtn)
        thumb.appendChild(img);
      } else {
        thumb.textContent = m.emoji || '✨';
      }

      const body = document.createElement('div');
      body.className = 'memory-body';
      const yearEl = document.createElement('div');
      yearEl.className = 'memory-year';
      yearEl.textContent = m.year || '';
      const titleEl = document.createElement('div');
      titleEl.className = 'memory-title';
      titleEl.textContent = m.title || '';
      const captionEl = document.createElement('div');
      captionEl.className = 'memory-caption';
      captionEl.textContent = m.caption || '';
      body.append(yearEl, titleEl, captionEl);
      card.append(thumb, body);
      // ---
    card.addEventListener('click', () => openLightbox(i, memoriesData, photoUrls));
    timelineEl.appendChild(card);
  });
  document.querySelectorAll('.memory-card.reveal').forEach(el => revealObserver.observe(el));
}
renderTimeline(CONFIG.relationMemories.bestfriend.map((m,i) => ({ ...m, year: CONFIG.memoryYears[i] })), []);
document.getElementById('footerNote').textContent = CONFIG.footerNote;

// Observe initial reveal elements
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Step 4: memory caption edit fields ----
function renderMemoryEditFields(){
  const list = document.getElementById('memoryEditList');
  const defaults = CONFIG.relationMemories[personRelation] || CONFIG.relationMemories.bestfriend;

  // Rebuild whenever the selected relationship has changed since last build.
  // This ensures switching Partner → Crush → Best Friend always shows the
  // correct defaults, rather than stale text from the previously-built relation.
  // Trade-off: any custom edits the user typed before switching relation are
  // discarded — that's intentional since we can't reliably distinguish
  // "user's custom text" from "old relation's default text" once filled in.
  const needsRebuild = list.dataset.builtFor !== personRelation;

  if (needsRebuild) {
    list.innerHTML = defaults.map((d, i) => `
      <div class="memory-edit-item">
        <div class="me-label">${CONFIG.memoryYears[i]}</div>
        <input type="text" id="memTitle${i}" placeholder="Memory title">
        <input type="text" id="memCaption${i}" placeholder="Short caption">
      </div>`).join('');
    list.dataset.builtFor = personRelation;   // track which relation was used
  }

  // Fill inputs with defaults only if they are empty (preserves user edits
  // within the same relation visit).
  defaults.forEach((d, i) => {
    const titleEl = document.getElementById('memTitle' + i);
    const capEl   = document.getElementById('memCaption' + i);
    if (!titleEl.value) titleEl.value = d.title;
    if (!capEl.value)   capEl.value   = d.caption;
  });
}

// ---- Ambient floating hearts in hero ----
const ambientHearts = document.getElementById('ambientHearts');
const heartEmojis = ['♥','💗','✨'];
function spawnHeart(){
  const h = document.createElement('span');
  h.className = 'ambient-heart';
  h.textContent = heartEmojis[Math.floor(Math.random()*heartEmojis.length)];
  h.style.left = (Math.random()*100) + '%';
  const duration = 7 + Math.random()*6;
  h.style.setProperty('--drift', (Math.random()*80 - 40) + 'px');
  h.style.animationDuration = duration + 's';
  h.style.fontSize = (14 + Math.random()*14) + 'px';
  ambientHearts.appendChild(h);
  setTimeout(() => h.remove(), duration*1000 + 200);
}
for (let i=0;i<5;i++){ setTimeout(spawnHeart, i*900); }
setInterval(spawnHeart, 1400);

// ---- Ripple effect on buttons ----
function attachRipple(btn){
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
}
document.querySelectorAll('.wizard-btn, .blow-btn').forEach(attachRipple);

// ---- Hero entrance sequence ----
function playHeroEntrance(hasPhoto){
  const order = hasPhoto
    ? ['photoFrame','animEyebrow','animH1','animTagline','countdown','animHint']
    : ['animEyebrow','animH1','animTagline','countdown','animHint'];
  order.forEach((id, i) => {
    setTimeout(() => { document.getElementById(id).classList.add('show'); }, 220 + i * 220);
  });
}

// ---- Animated name reveal + surprise burst ----
function buildAnimatedName(name){
  const span = document.getElementById('heroNameSpan');
  span.innerHTML = '';
  name.split('').forEach((ch, i) => {
    const letter = document.createElement('span');
    letter.className = 'name-letter';
    letter.style.animationDelay = (i * 0.09) + 's';
    letter.textContent = ch === ' ' ? '\u00A0' : ch;
    span.appendChild(letter);
  });
  const totalDelay = name.length * 90 + 750;
  setTimeout(() => {
    span.classList.add('name-shimmer');
    surpriseBurst(span);
  }, totalDelay);
}

function surpriseBurst(anchorEl){
  const ring = document.createElement('div');
  ring.className = 'name-glow-ring';
  anchorEl.appendChild(ring);
  setTimeout(() => ring.remove(), 1500);

  const sparkles = ['✨','💖','⭐','🎉'];
  const rect = anchorEl.getBoundingClientRect();
  for (let i = 0; i < 10; i++){
    const s = document.createElement('span');
    s.className = 'name-sparkle';
    s.textContent = sparkles[Math.floor(Math.random()*sparkles.length)];
    const angle = (Math.PI * 2 * i) / 10 + Math.random()*0.4;
    const dist = 70 + Math.random()*60;
    s.style.setProperty('--sx', (Math.cos(angle)*dist) + 'px');
    s.style.setProperty('--sy', (Math.sin(angle)*dist) + 'px');
    s.style.left = '50%'; s.style.top = '50%';
    s.style.animationDelay = (Math.random()*0.15) + 's';
    anchorEl.appendChild(s);
    setTimeout(() => s.remove(), 1400);
  }
  fireworkBurst(rect.left + rect.width/2, rect.top + rect.height/2, 45);
}

// ---- XSS Safety: escape all user-supplied text before innerHTML use ----
// Kept as a utility for any future innerHTML insertions that may need escaping.
// Current render paths use textContent/createElement; this is here for safety.
function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let personName = "You";

let personDob = null;
let personRelation = "bestfriend";
let countdownTarget = null;

// ---- Relationship pill selection ----
document.querySelectorAll('.relation-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.relation-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    personRelation = pill.dataset.rel;
    
    // Update live preview badge
    const badge = document.getElementById('previewBadge');
    if (badge) badge.textContent = pill.textContent.trim();
  });
});

// ---- Wizard navigation ----
function showStep(n){
  document.querySelectorAll('.wizard-step').forEach(el => el.classList.toggle('current', parseInt(el.dataset.step) === n));
  document.querySelectorAll('.wizard-progress .dot').forEach(d => d.classList.toggle('active', parseInt(d.dataset.step) <= n));
}
document.getElementById('toStep2').addEventListener('click', () => {
  const name = document.getElementById('inputName').value;
  const dob = document.getElementById('inputDob').value;
  const err = document.getElementById('error1');
  if (!name.trim() || !dob){ err.textContent = 'Please fill in both fields.'; err.style.display = 'block'; return; }
  err.style.display = 'none';
  showStep(2);
});
document.getElementById('toStep1').addEventListener('click', () => showStep(1));
document.getElementById('toStep3').addEventListener('click', () => {
  const err = document.getElementById('error2');
  if (!document.querySelector('.relation-pill.active')){ err.textContent = 'Please choose who this is for.'; err.style.display = 'block'; return; }
  err.style.display = 'none';
  showStep(3);
});
document.getElementById('toStep2b').addEventListener('click', () => showStep(2));
document.getElementById('toStep4').addEventListener('click', () => {
  renderMemoryEditFields();
  showStep(4);
});
document.getElementById('toStep3b').addEventListener('click', () => showStep(3));

// ---- Toggle Quiz config inputs ----
document.getElementById('enableQuiz').addEventListener('change', (e) => {
  document.getElementById('quizFields').style.display = e.target.checked ? 'block' : 'none';
});

// ---- Lightbox Modal ----
function openLightbox(idx, memories, photoUrls) {
  const modal = document.getElementById('lightboxModal');
  const mediaWrap = document.getElementById('lightboxMediaWrap');
  const title = document.getElementById('lightboxTitle');
  const caption = document.getElementById('lightboxCaption');
  
  const m = (memories && memories[idx]) || { title: "", caption: "", emoji: "✨" };
  title.textContent = m.title || "";
  caption.textContent = m.caption || "";
  
  const photo = photoUrls && photoUrls[idx];
  mediaWrap.innerHTML = '';
  if (photo) {
    const img = document.createElement('img');
    img.className = 'lightbox-img';
    // crossOrigin only needed for canvas download — set lazily on #downloadBtn click
    img.src = photo;
    img.alt = m.title || '';
    mediaWrap.appendChild(img);
  } else {
    const emoji = document.createElement('div');
    emoji.className = 'lightbox-emoji';
    emoji.textContent = m.emoji || '✨';
    mediaWrap.appendChild(emoji);
  }
  
  modal.classList.add('show');
}

document.getElementById('lightboxCloseBtn').addEventListener('click', () => {
  document.getElementById('lightboxModal').classList.remove('show');
});
document.getElementById('lightboxModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightboxModal')) {
    document.getElementById('lightboxModal').classList.remove('show');
  }
});

document.getElementById('lightboxHeartBtn').addEventListener('click', () => {
  // Spawn hearts
  for (let i = 0; i < 20; i++) {
    setTimeout(spawnHeart, i * 60);
  }
});

// ---- Memory Quiz Lock Logic ----
let quizConfig = null;
let currentQuizIdx = 0;
let quizQuestions = [];

function setupQuiz(config) {
  quizConfig = config;
  quizQuestions = config.questions || [];
  currentQuizIdx = 0;
  
  if (quizQuestions.length > 0) {
    document.getElementById('quizSection').style.display = 'block';
    document.getElementById('cake').style.display = 'none'; // Lock cake
    loadQuizQuestion();
  }
}

function loadQuizQuestion() {
  const qObj = quizQuestions[currentQuizIdx];
  document.getElementById('quizProgressText').textContent = `Question ${currentQuizIdx + 1} of ${quizQuestions.length}`;
  document.getElementById('quizQuestionText').textContent = qObj.q;
  
  const container = document.getElementById('quizOptionsContainer');
  container.innerHTML = '';
  
  // Shuffle options
  const opts = [...qObj.options];
  opts.sort(() => Math.random() - 0.5);
  
  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleQuizAnswer(opt, qObj.a, btn));
    container.appendChild(btn);
  });
}

function handleQuizAnswer(selected, correct, btn) {
  const buttons = document.querySelectorAll('#quizOptionsContainer .quiz-opt-btn');
  buttons.forEach(b => b.disabled = true);
  
  if (selected === correct) {
    btn.classList.add('correct');
    burstConfetti(15);
    setTimeout(() => {
      currentQuizIdx++;
      if (currentQuizIdx < quizQuestions.length) {
        loadQuizQuestion();
      } else {
        // Unlock
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('cake').style.display = 'block';
        document.getElementById('cake').scrollIntoView({ behavior: 'smooth' });
        burstConfetti(40);
      }
    }, 1000);
  } else {
    btn.classList.add('wrong');
    setTimeout(() => {
      buttons.forEach(b => {
        b.disabled = false;
        b.classList.remove('wrong');
      });
    }, 1000);
  }
}

// ---- Scratch Card Logic ----
let scratchConfig = { text: "" };
let scratchCanvas, scratchCtx, isScratching = false;

function setupScratchCard(giftText) {
  scratchConfig.text = giftText;
  if (!giftText) {
    document.getElementById('scratchSection').style.display = 'none';
    return;
  }
  
  document.getElementById('scratchGiftVal').textContent = giftText;
  document.getElementById('scratchSection').style.display = 'block';
  
  scratchCanvas = document.getElementById('scratchCanvas');
  scratchCtx = scratchCanvas.getContext('2d');
  
  // Fill silver overlay
  scratchCtx.fillStyle = '#CCCCCC';
  scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
  
  // Shimmer texture lines
  scratchCtx.fillStyle = '#E5E5E5';
  for (let i = 0; i < 20; i++) {
    scratchCtx.fillRect(Math.random() * scratchCanvas.width, 0, Math.random() * 8, scratchCanvas.height);
  }
  
  // Text instructions
  scratchCtx.fillStyle = '#666666';
  scratchCtx.font = 'bold 16px "Quicksand", sans-serif';
  scratchCtx.textAlign = 'center';
  scratchCtx.textBaseline = 'middle';
  scratchCtx.fillText('Scratch to reveal your gift! 🎁', scratchCanvas.width / 2, scratchCanvas.height / 2);
  
  // Pointer down/move/up events
  scratchCanvas.addEventListener('mousedown', startScratch);
  scratchCanvas.addEventListener('mousemove', scratch);
  scratchCanvas.addEventListener('mouseup', endScratch);
  scratchCanvas.addEventListener('mouseleave', endScratch);
  
  scratchCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = scratchCanvas.getBoundingClientRect();
    isScratching = true;
    scratch(e, touch.clientX - rect.left, touch.clientY - rect.top);
  });
  scratchCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = scratchCanvas.getBoundingClientRect();
    scratch(e, touch.clientX - rect.left, touch.clientY - rect.top);
  });
  scratchCanvas.addEventListener('touchend', endScratch);

  // Accessibility: show the "Reveal without scratching" button
  const revealBtn = document.getElementById('revealScratchBtn');
  if (revealBtn) {
    revealBtn.style.display = 'inline-block';
    // Remove any previous listener before adding a new one (in case called twice)
    revealBtn.replaceWith(revealBtn.cloneNode(true));
    document.getElementById('revealScratchBtn').addEventListener('click', revealScratchCard);
  }
}

// Shared reveal logic used by both endScratch (auto at 55%) and the button
function revealScratchCard() {
  if (!scratchCanvas) return;
  scratchCanvas.style.transition = 'opacity 0.5s ease';
  scratchCanvas.style.opacity = '0';
  const btn = document.getElementById('revealScratchBtn');
  if (btn) btn.style.display = 'none';
  setTimeout(() => {
    scratchCanvas.style.display = 'none';
    burstConfetti(25);
  }, 500);
}

function startScratch(e) {
  isScratching = true;
  const rect = scratchCanvas.getBoundingClientRect();
  scratch(e, e.clientX - rect.left, e.clientY - rect.top);
}

function scratch(e, x, y) {
  if (!isScratching) return;
  
  const rect = scratchCanvas.getBoundingClientRect();
  const scaleX = scratchCanvas.width / rect.width;
  const scaleY = scratchCanvas.height / rect.height;

  let targetX = (x === undefined) ? (e.clientX - rect.left) : x;
  let targetY = (y === undefined) ? (e.clientY - rect.top) : y;
  
  // Scale client coordinates to match backing canvas dimensions
  targetX *= scaleX;
  targetY *= scaleY;
  
  scratchCtx.globalCompositeOperation = 'destination-out';
  scratchCtx.beginPath();
  scratchCtx.arc(targetX, targetY, 24, 0, Math.PI * 2);
  scratchCtx.fill();
}

function endScratch() {
  if (!isScratching) return;
  isScratching = false;

  // Check clear percentage
  const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
  const pixels = imgData.data;
  let transparentCount = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) transparentCount++;
  }
  const clearedPercent = (transparentCount / (pixels.length / 4)) * 100;
  if (clearedPercent > 55) {
    revealScratchCard();   // shared path — same as accessibility button
  }
}

// ---- Shareable URL Compression / Bypassing ----
function getShareableConfig() {
  const photoUrl = document.getElementById('inputPhotoUrl').value.trim();
  const memUrlsRaw = document.getElementById('inputMemoryPhotosUrls').value.trim();
  const musicUrl = document.getElementById('inputMusicUrl').value.trim();
  const scratchGift = document.getElementById('scratchGiftText').value.trim();
  const enableQuiz = document.getElementById('enableQuiz').checked;
  
  let quizObj = null;
  if (enableQuiz) {
    quizObj = {
      q: document.getElementById('quizQuestion').value.trim() || "What is my favorite food?",
      a: document.getElementById('quizCorrect').value.trim() || "Pizza",
      w1: document.getElementById('quizWrong1').value.trim() || "Pasta",
      w2: document.getElementById('quizWrong2').value.trim() || "Burger"
    };
  }
  
  // Collect memories captions from step 4 list
  const defaults = CONFIG.relationMemories[personRelation] || CONFIG.relationMemories.bestfriend;
  const finalMemories = defaults.map((d, i) => {
    const titleEl = document.getElementById('memTitle' + i);
    const capEl = document.getElementById('memCaption' + i);
    return {
      year: CONFIG.memoryYears[i],
      emoji: d.emoji,
      title: (titleEl && titleEl.value.trim()) || d.title,
      caption: (capEl && capEl.value.trim()) || d.caption
    };
  });
  
  return {
    name: document.getElementById('inputName').value.trim(),
    dob: document.getElementById('inputDob').value,
    relation: personRelation,
    togetherSince: document.getElementById('inputTogetherSince').value,
    theme: themesList[currentThemeIdx],
    photoUrl,
    memPhotoUrls: memUrlsRaw ? memUrlsRaw.split(',').map(u => u.trim()) : [],
    musicUrl,
    scratchGift,
    quiz: quizObj,
    memories: finalMemories,
    wishes: document.getElementById('guestWishes').value.trim()
  };
}

// Custom safe base64 URL safe converter
function encodeConfig(obj) {
  const jsonStr = JSON.stringify(obj);
  // UTF-8 base64
  return btoa(unescape(encodeURIComponent(jsonStr)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function decodeConfig(str) {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to decode config", e);
    return null;
  }
}

document.getElementById('btnShareableLink').addEventListener('click', () => {
  const config = getShareableConfig();
  if (!config.name || !config.dob) {
    alert("Please fill in Name and DOB in Step 1 before generating a link.");
    return;
  }
  const encoded = encodeConfig(config);
  const shareUrl = window.location.origin + window.location.pathname + '#data=' + encoded;
  
  navigator.clipboard.writeText(shareUrl).then(() => {
    alert("Shareable Link copied to clipboard! 🔗\n\nWhen your friend opens this link, the site will bypass the wizard and load directly.");
  }).catch(() => {
    alert("Could not auto-copy. Here is the link:\n\n" + shareUrl);
  });
});

function loadFromUrlHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#data=')) {
    const encoded = hash.substring(6);
    const config = decodeConfig(encoded);
    if (config) {
      // Set globals
      personRelation = config.relation || 'bestfriend';
      currentThemeIdx = themesList.indexOf(config.theme || 'sakura');
      if (currentThemeIdx === -1) currentThemeIdx = 0;
      setTheme(themesList[currentThemeIdx]);
      
      // Setup Quiz if enabled
      if (config.quiz) {
        setupQuiz({
          questions: [{
            q: config.quiz.q,
            a: config.quiz.a,
            options: [config.quiz.a, config.quiz.w1, config.quiz.w2]
          }]
        });
      }
      
      // Setup Scratch card if enabled
      if (config.scratchGift) {
        setupScratchCard(config.scratchGift);
      }
      
      // Reveal gift box wrapper
      document.getElementById('giftBoxOverlay').style.display = 'flex';
      
      applySetup(
        config.name,
        config.dob,
        config.photoUrl,
        config.memPhotoUrls,
        config.musicUrl,
        config.togetherSince,
        config.memories,
        config.wishes,
        config.scratchGift,
        config.quiz,
        true // delayEntrance = true
      );
    }
  }
}

// Run load check on page load
window.addEventListener('DOMContentLoaded', loadFromUrlHash);

// Gift Wrap unwrapping trigger
document.getElementById('giftBoxContainer').addEventListener('click', function() {
  const container = this;
  if (container.classList.contains('unwrap')) return; // Avoid multi clicks
  
  container.classList.add('unwrap');
  burstConfetti(50);
  
  setTimeout(() => {
    const overlay = document.getElementById('giftBoxOverlay');
    overlay.classList.add('hide');
    
    // Play music once present is opened (CORS bypass / autoplay policies)
    if (bgMusic.src) {
      bgMusic.volume = 0.5;
      bgMusic.play().catch(() => {});
      musicPlaying = true;
      const playBtn = document.getElementById('playerPlayBtn');
      if (playBtn) playBtn.textContent = '⏸';
      const disc = document.getElementById('musicToggleDisc');
      if (disc) disc.classList.add('playing');
      initVisualizer();
    }
    
    // Trigger the page entrance animations!
    if (window.pendingEntrance) {
      const ent = window.pendingEntrance;
      playHeroEntrance(ent.hasPhoto);
      const nameDelay = ent.hasPhoto ? 660 : 440;
      setTimeout(() => buildAnimatedName(ent.personName), nameDelay);
      setTimeout(() => burstConfetti(30), nameDelay + 60);
      if (ent.togetherSinceValue){
        setTimeout(() => document.getElementById('loveMeter').classList.add('show'), nameDelay + 200);
      }
    }
    
    // Clean up DOM after transition finishes
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 800);
  }, 500);
});

// ---- Wizard Real-Time Live Preview Sync ----
document.getElementById('inputName').addEventListener('input', (e) => {
  const name = e.target.value.trim();
  document.getElementById('previewName').textContent = name || 'You';
});

document.getElementById('inputDob').addEventListener('change', (e) => {
  if (e.target.value) {
    const dob = new Date(e.target.value + "T00:00:00");
    const next = computeNextBirthday(dob);
    const age = turningAge(dob, next);
    document.getElementById('previewTagline').textContent = `Turning ${age} today. Every year with you is a story worth telling.`;
  }
});

document.getElementById('inputPhoto').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const url = await readFileAsDataURL(file);
  const frame = document.getElementById('previewPhotoFrame');
  if (frame && url) {
    frame.innerHTML = `<img src="${url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
  }
});

document.getElementById('inputPhotoUrl').addEventListener('input', (e) => {
  const url = e.target.value.trim();
  const frame = document.getElementById('previewPhotoFrame');
  if (frame) {
    if (url) {
      frame.innerHTML = `<img src="${url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else {
      frame.innerHTML = '🎂';
    }
  }
});

function computeNextBirthday(dobDate){
  const today = new Date();
  today.setHours(0,0,0,0);
  let next = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate());
  if (next < today){ next = new Date(today.getFullYear()+1, dobDate.getMonth(), dobDate.getDate()); }
  return next;
}
function turningAge(dobDate, nextBdayDate){ return nextBdayDate.getFullYear() - dobDate.getFullYear(); }

function readFileAsDataURL(file){
  return new Promise((resolve) => {
    if (!file){ resolve(null); return; }
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => resolve(null);
    r.readAsDataURL(file);
  });
}

function applySetup(name, dobValue, heroPhotoUrl, memPhotoUrls, musicUrl, togetherSinceValue, finalMemories, guestWishesRaw, scratchGift, quizObj, delayEntrance = false){
  personName = name.trim() || "You";
  personDob = new Date(dobValue + "T00:00:00");

  const nextBday = computeNextBirthday(personDob);
  countdownTarget = nextBday.getTime();
  const age = turningAge(personDob, nextBday);

  document.getElementById('animTagline').textContent =
    `Turning ${age} today. Every year with you is a story worth telling.`;

  const hasPhoto = !!heroPhotoUrl;
  if (hasPhoto){
    const heroPhotoEl = document.getElementById('heroPhoto');
    // crossOrigin set lazily only when #downloadBtn is clicked (canvas capture needs it)
    // Setting it unconditionally breaks images from hosts without CORS headers
    heroPhotoEl.removeAttribute('crossorigin');
    heroPhotoEl.src = heroPhotoUrl;
    heroPhotoEl.alt = personName + "'s photo";
    document.getElementById('photoFrame').style.display = 'block';
  }

  renderTimeline(finalMemories, memPhotoUrls || []);

  // ---- Love meter ----
  if (togetherSinceValue){
    const since = new Date(togetherSinceValue + "T00:00:00");
    const daysCount = Math.floor((Date.now() - since.getTime()) / 86400000);
    if (daysCount >= 0){
      const lm = document.getElementById('loveMeter');
      // Safe DOM build — daysCount is a number but keep consistent pattern
      lm.textContent = '';
      lm.appendChild(document.createTextNode('💞 '));
      const numSpan = document.createElement('span');
      numSpan.className = 'lm-num';
      numSpan.textContent = daysCount;
      lm.appendChild(numSpan);
      lm.appendChild(document.createTextNode(' days together'));
      lm.style.display = 'inline-flex';
    }
  }

  // ---- Guest wishes wall ----
  if (guestWishesRaw && guestWishesRaw.trim()){
    const lines = guestWishesRaw.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length){
      const grid = document.getElementById('wishesGrid');
      grid.innerHTML = '';                          // clear safely
      lines.forEach(line => {
        const card = document.createElement('div');
        card.className = 'wish-card reveal';
        card.textContent = line;                    // ← textContent, not innerHTML
        grid.appendChild(card);
      });
      document.getElementById('wishesWall').style.display = 'block';
      document.querySelectorAll('#wishesGrid .wish-card').forEach(el => revealObserver.observe(el));
    }
  }

  // ---- Music Player ----
  if (musicUrl){
    bgMusic.src = musicUrl;
    bgMusic.volume = 0.5;
    document.getElementById('musicPlayer').style.display = 'flex';
    document.getElementById('playerTitle').textContent = personName + "'s Song";
  }

  const letterEl = document.getElementById('letterPaper');
  letterEl.innerHTML = '';
  const letterTemplate = CONFIG.letterTemplates[personRelation] || CONFIG.letterTemplates.bestfriend;
  letterTemplate.replace(/{name}/g, personName).split('\n').forEach((line, i) => {
    const span = document.createElement('span');
    span.className = 'line';
    span.style.animationDelay = (i * 0.12) + 's';
    span.textContent = line === '' ? '\u00A0' : line;
    letterEl.appendChild(span);
  });

  // ---- Quiz Lock ----
  if (quizObj) {
    setupQuiz(quizObj);
  }

  // ---- Scratch Card Lock ----
  if (scratchGift) {
    setupScratchCard(scratchGift);
  }

  document.title = "Happy Birthday " + personName;
  document.getElementById('setupOverlay').classList.add('hide');

  // Skip revealFlash when gift box intro is pending (it runs hidden under the overlay)
  if (!delayEntrance) {
    const flash = document.getElementById('revealFlash');
    flash.classList.add('active');
    setTimeout(() => { flash.classList.remove('active'); flash.style.display = 'none'; }, 1100);
  }

  updateCountdown();
  if (delayEntrance) {
    window.pendingEntrance = {
      hasPhoto,
      togetherSinceValue,
      personName
    };
  } else {
    playHeroEntrance(hasPhoto);
    const nameDelay = hasPhoto ? 660 : 440;
    setTimeout(() => buildAnimatedName(personName), nameDelay);
    setTimeout(() => burstConfetti(30), nameDelay + 60);
    if (togetherSinceValue){
      setTimeout(() => document.getElementById('loveMeter').classList.add('show'), nameDelay + 200);
    }
  }
}

document.getElementById('setupSubmit').addEventListener('click', async () => {
  const name = document.getElementById('inputName').value;
  const dob = document.getElementById('inputDob').value;
  const togetherSince = document.getElementById('inputTogetherSince').value;
  const guestWishesRaw = document.getElementById('guestWishes').value;
  const err = document.getElementById('error4');
  err.style.display = 'none';

  if (!name.trim() || !dob) {
    err.textContent = 'Please enter Name and DOB in Step 1.';
    err.style.display = 'block';
    return;
  }

  const submitBtn = document.getElementById('setupSubmit');
  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = 'Creating your surprise… ⏳';

  // Read files
  const heroFile = document.getElementById('inputPhoto').files[0];
  const memFiles = Array.from(document.getElementById('inputMemoryPhotos').files).slice(0, 5);
  const musicFile = document.getElementById('inputMusic').files[0];

  // Read online URLs
  const onlineHeroUrl = document.getElementById('inputPhotoUrl').value.trim();
  const onlineMemUrls = document.getElementById('inputMemoryPhotosUrls').value.trim();
  const onlineMusicUrl = document.getElementById('inputMusicUrl').value.trim();

  // Combine
  const heroPhotoUrl = onlineHeroUrl || await readFileAsDataURL(heroFile);
  const memPhotoUrls = onlineMemUrls ? onlineMemUrls.split(',').map(u => u.trim()) : await Promise.all(memFiles.map(readFileAsDataURL));
  const musicUrl = onlineMusicUrl || (musicFile ? URL.createObjectURL(musicFile) : null);

  const defaults = CONFIG.relationMemories[personRelation] || CONFIG.relationMemories.bestfriend;
  const finalMemories = defaults.map((d, i) => {
    const titleEl = document.getElementById('memTitle' + i);
    const capEl = document.getElementById('memCaption' + i);
    return {
      year: CONFIG.memoryYears[i],
      emoji: d.emoji,
      title: (titleEl && titleEl.value.trim()) || d.title,
      caption: (capEl && capEl.value.trim()) || d.caption
    };
  });

  // Quiz setup parameters
  const enableQuiz = document.getElementById('enableQuiz').checked;
  let quizObj = null;
  if (enableQuiz) {
    const q = document.getElementById('quizQuestion').value.trim() || "What is my favorite food?";
    const a = document.getElementById('quizCorrect').value.trim() || "Pizza";
    const w1 = document.getElementById('quizWrong1').value.trim() || "Pasta";
    const w2 = document.getElementById('quizWrong2').value.trim() || "Burger";
    quizObj = {
      questions: [{ q, a, options: [a, w1, w2] }]
    };
  }

  const scratchGift = document.getElementById('scratchGiftText').value.trim();

  // Set theme chosen in wizard
  setTheme(themesList[currentThemeIdx]);

  applySetup(
    name,
    dob,
    heroPhotoUrl,
    memPhotoUrls,
    musicUrl,
    togetherSince,
    finalMemories,
    guestWishesRaw,
    scratchGift,
    quizObj
  );

  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;
});

function setNumWithPulse(id, value){
  const el = document.getElementById(id);
  if (el.textContent !== String(value)){
    el.textContent = value;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  }
}
function updateCountdown(){
  if (!countdownTarget) return;
  const now = Date.now();
  let diff = countdownTarget - now;
  if (diff <= 0){
    document.getElementById('cd-days').textContent = '🎉';
    document.getElementById('cd-hours').textContent = '🎂';
    document.getElementById('cd-mins').textContent = '🎈';
    document.getElementById('cd-secs').textContent = '✨';
    return;
  }
  const d = Math.floor(diff / 86400000); diff -= d*86400000;
  const h = Math.floor(diff / 3600000); diff -= h*3600000;
  const m = Math.floor(diff / 60000); diff -= m*60000;
  const s = Math.floor(diff / 1000);
  setNumWithPulse('cd-days', d);
  setNumWithPulse('cd-hours', String(h).padStart(2,'0'));
  setNumWithPulse('cd-mins', String(m).padStart(2,'0'));
  setNumWithPulse('cd-secs', String(s).padStart(2,'0'));
}
setInterval(updateCountdown, 1000);

// ---- Envelope / letter reveal ----
const envelope = document.getElementById('envelope');
const letterPaper = document.getElementById('letterPaper');
function openEnvelope(){
  envelope.classList.add('open');
  setTimeout(() => { letterPaper.classList.add('show'); burstConfetti(60); }, 400);
}
envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') openEnvelope(); });

// ---- Cake: candles ----
const candleRow = document.getElementById('candleRow');
for (let i = 0; i < CONFIG.candleCount; i++){
  const c = document.createElement('div');
  c.className = 'candle';
  c.innerHTML = '<div class="flame"></div>';
  candleRow.appendChild(c);
}

// ---- Cake: ambient balloons ----
const cakeBalloons = document.getElementById('cakeBalloons');
const balloonEmojis = ['🎈','🎈','🎈'];
const balloonSpots = [8, 26, 74, 92];
balloonSpots.forEach((left, i) => {
  const b = document.createElement('span');
  b.className = 'balloon';
  b.textContent = balloonEmojis[i % balloonEmojis.length];
  b.style.left = left + '%';
  b.style.animationDuration = (3 + i*0.4) + 's';
  b.style.animationDelay = (i * 0.3) + 's';
  b.style.fontSize = (28 + (i%2)*10) + 'px';
  cakeBalloons.appendChild(b);
});

// ---- Cake: blow out candles ----
let candlesBlown = false;
function blowCandles(){
  if (candlesBlown) return;
  candlesBlown = true;
  const candles = candleRow.querySelectorAll('.candle');
  candles.forEach((c, i) => {
    setTimeout(() => {
      c.classList.add('out');
      const smoke = document.createElement('div');
      smoke.className = 'smoke';
      c.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1000);
    }, i * 160);
  });
  const totalDelay = candles.length * 160 + 500;
  setTimeout(() => {
    document.getElementById('cakeHint').style.display = 'none';
    document.getElementById('blowBtn').disabled = true;
    document.getElementById('blowBtn').textContent = 'Wish made ✨';
    revealWish();
    const cakeRect = document.getElementById('cakeEl').getBoundingClientRect();
    fireworkBurst(cakeRect.left + cakeRect.width/2, cakeRect.top + cakeRect.height/3, 40);
    burstConfetti(35);
    fadeInMusic();
  }, totalDelay);
}
function fadeInMusic(){
  if (!bgMusic.src || musicPlaying) return;
  bgMusic.volume = 0;
  bgMusic.play().catch(() => {});
  musicPlaying = true;
  playerPlayBtn.textContent = '⏸';
  musicToggleDisc.classList.add('playing');
  initVisualizer();
  let vol = 0;
  const step = setInterval(() => {
    vol += 0.08;
    if (vol >= 0.5){ vol = 0.5; clearInterval(step); } // Cap at 0.5 for comfortable background level
    bgMusic.volume = vol;
  }, 100);
}
document.getElementById('blowBtn').addEventListener('click', blowCandles);
document.getElementById('cakeEl').addEventListener('click', blowCandles);
document.getElementById('cakeEl').addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blowCandles(); } });

function revealWish(){
  const box = document.getElementById('wishBox');
  const textEl = document.getElementById('wishText');
  box.classList.add('show', 'revealed');
  const wishTemplate = CONFIG.wishTemplates[personRelation] || CONFIG.wishTemplates.bestfriend;
  const wishStr = wishTemplate.replace(/{name}/g, personName || 'you');
  textEl.innerHTML = '';
  wishStr.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'wchar';
    span.style.animationDelay = (i * 0.014) + 's';
    span.textContent = ch;
    textEl.appendChild(span);
  });
}

// ---- Confetti / firework particle engine ----
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particles = [];
function burstConfetti(count){
  const colors = getComputedStyle(document.body);
  const palette = [colors.getPropertyValue('--primary').trim(), colors.getPropertyValue('--secondary').trim(), colors.getPropertyValue('--accent').trim()];
  for (let i = 0; i < count; i++){
    particles.push({
      x: Math.random() * canvas.width, y: -20,
      r: 4 + Math.random()*5, c: palette[Math.floor(Math.random()*palette.length)],
      vy: 2 + Math.random()*3, vx: -1.5 + Math.random()*3,
      rot: Math.random()*360, vr: -6 + Math.random()*12, life: 0, kind: 'confetti'
    });
  }
}
function fireworkBurst(x, y, count){
  const colors = getComputedStyle(document.body);
  const palette = [colors.getPropertyValue('--primary').trim(), colors.getPropertyValue('--secondary').trim(), colors.getPropertyValue('--accent').trim(), '#FFFFFF'];
  for (let i = 0; i < count; i++){
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random()*4.5;
    particles.push({
      x: x, y: y, r: 2.5 + Math.random()*3,
      c: palette[Math.floor(Math.random()*palette.length)],
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      rot: Math.random()*360, vr: -8 + Math.random()*16, life: 0, kind: 'firework'
    });
  }
}
function animateConfetti(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  particles.forEach(p => {
    if (p.kind === 'firework'){
      p.vx *= 0.965; p.vy *= 0.965; p.vy += 0.06;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      const alpha = Math.max(0, 1 - p.life/70);
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI*2); ctx.fill(); ctx.restore();
    } else {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.c; ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.6); ctx.restore();
    }
  });
  particles = particles.filter(p => p.kind === 'firework' ? p.life < 70 : (p.y < canvas.height + 30 && p.life < 400));
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// ---- Production enhancements: persistence, accessibility, PWA, sharing ----
function setLazyImageDefaults(root = document) {
  root.querySelectorAll('img').forEach((img) => {
    img.loading = img.loading || 'lazy';
    img.decoding = img.decoding || 'async';
    if (!img.alt && img.id !== 'heroPhoto') img.alt = 'Birthday memory photo';
  });
}

function getSelectedThemeName() {
  return themesList[currentThemeIdx] || document.body.dataset.theme || 'sakura';
}

async function capturePersistentSetup() {
  const heroFile = document.getElementById('inputPhoto')?.files?.[0];
  const memoryFiles = Array.from(document.getElementById('inputMemoryPhotos')?.files || []).slice(0, 5);
  const heroFromFile = await fileToDataURL(heroFile);
  const memoryFromFiles = await Promise.all(memoryFiles.map(fileToDataURL));
  const memoryUrlText = sanitizeText(document.getElementById('inputMemoryPhotosUrls')?.value, 2400);

  return {
    name: sanitizeText(document.getElementById('inputName')?.value, 40),
    birthdayDate: sanitizeText(document.getElementById('inputDob')?.value, 20),
    relationship: personRelation,
    selectedTheme: getSelectedThemeName(),
    togetherSince: sanitizeText(document.getElementById('inputTogetherSince')?.value, 20),
    heroPhoto: sanitizeUrl(document.getElementById('inputPhotoUrl')?.value) || heroFromFile,
    uploadedPhotos: memoryUrlText
      ? memoryUrlText.split(',').map(sanitizeUrl).filter(Boolean).slice(0, 5)
      : memoryFromFiles.filter(Boolean),
    guestWishes: sanitizeText(document.getElementById('guestWishes')?.value, 1600),
    scratchGift: sanitizeText(document.getElementById('scratchGiftText')?.value, 180),
    quiz: document.getElementById('enableQuiz')?.checked ? {
      questions: [{
        q: sanitizeText(document.getElementById('quizQuestion')?.value, 180) || 'What is my favorite food?',
        a: sanitizeText(document.getElementById('quizCorrect')?.value, 80) || 'Pizza',
        options: [
          sanitizeText(document.getElementById('quizCorrect')?.value, 80) || 'Pizza',
          sanitizeText(document.getElementById('quizWrong1')?.value, 80) || 'Pasta',
          sanitizeText(document.getElementById('quizWrong2')?.value, 80) || 'Burger'
        ]
      }]
    } : null
  };
}

function restorePersistentSetup() {
  if (location.hash.startsWith('#data=')) return;
  const saved = loadState();
  if (!saved?.name || !saved?.birthdayDate) return;

  personRelation = saved.relationship || 'bestfriend';
  currentThemeIdx = Math.max(0, themesList.indexOf(saved.selectedTheme || 'sakura'));
  setTheme(getSelectedThemeName());

  const defaults = CONFIG.relationMemories[personRelation] || CONFIG.relationMemories.bestfriend;
  const finalMemories = defaults.map((item, index) => ({
    ...item,
    year: CONFIG.memoryYears[index]
  }));

  applySetup(
    saved.name,
    saved.birthdayDate,
    saved.heroPhoto || '',
    saved.uploadedPhotos || [],
    null,
    saved.togetherSince || '',
    finalMemories,
    saved.guestWishes || '',
    saved.scratchGift || '',
    saved.quiz || null,
    false
  );
}

function installPersistence() {
  document.getElementById('setupSubmit')?.addEventListener('click', async () => {
    const state = await capturePersistentSetup();
    if (state.name && state.birthdayDate) saveState(state);
  });

  document.querySelectorAll('input[type="text"], textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      field.value = sanitizeText(field.value, field.tagName === 'TEXTAREA' ? 1600 : 240);
    });
  });

  setTimeout(restorePersistentSetup, 120);
}

function installUploadValidation() {
  const bind = (id) => {
    const input = document.getElementById(id);
    input?.addEventListener('change', async () => {
      const files = Array.from(input.files || []);
      for (const file of files) {
        const result = await validateImageFile(file);
        if (!result.ok) {
          alert(result.message);
          input.value = '';
          break;
        }
      }
    });
  };
  bind('inputPhoto');
  bind('inputMemoryPhotos');
}

function installPreviewImageSafety() {
  const frame = document.getElementById('previewPhotoFrame');
  document.getElementById('inputPhoto')?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    const result = await validateImageFile(file);
    if (!result.ok || !frame) return;
    const url = await fileToDataURL(file);
    frame.replaceChildren(makeImage(url, 'Preview birthday photo'));
  });
  document.getElementById('inputPhotoUrl')?.addEventListener('input', (event) => {
    const url = sanitizeUrl(event.target.value);
    if (!frame) return;
    if (url) frame.replaceChildren(makeImage(url, 'Preview birthday photo'));
  });
}

function installShareSupport() {
  const shareBtn = document.getElementById('shareBtn');
  shareBtn?.addEventListener('click', async () => {
    const shareData = {
      title: document.title,
      text: `A birthday surprise for ${personName || 'someone special'}`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fall back to clipboard below.
      }
    }
    await navigator.clipboard?.writeText(window.location.href);
    shareBtn.textContent = '✓';
    setTimeout(() => { shareBtn.textContent = '↗'; }, 1200);
  });
}

function installKeyboardPolish() {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.getElementById('lightboxCloseBtn')?.click();
    document.getElementById('playerPanel')?.classList.remove('open');
  });

  document.querySelectorAll('.envelope, .cake, .memory-card').forEach((el) => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
  });
}

function installPwa() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

const lazyObserver = new MutationObserver((records) => {
  records.forEach((record) => {
    record.addedNodes.forEach((node) => {
      if (node.nodeType === 1) setLazyImageDefaults(node);
    });
  });
});

setLazyImageDefaults();
lazyObserver.observe(document.body, { childList: true, subtree: true });
installPersistence();
installUploadValidation();
installPreviewImageSafety();
installShareSupport();
installKeyboardPolish();
installPwa();

if (prefersReducedMotion()) {
  particles = [];
}
