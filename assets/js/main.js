// Helpers de storage com fallback para ambientes restritos.
const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }
};

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

// ── SCROLL PROGRESS
const scrollBar = document.getElementById('scroll-progress');
if (scrollBar) {
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    scrollBar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
}

// ── INTRO ANIMATION (só na primeira visita)
(function() {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  function dismiss() {
    document.body.style.overflow = '';
    overlay.style.transition = 'opacity .7s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.classList.add('done'), 750);
  }

  // Segurança: nunca ficar preso — máximo 5s
  const safetyTimer = setTimeout(dismiss, 5000);

  if (storage.get('lv_visited')) {
    clearTimeout(safetyTimer);
    overlay.classList.add('done');
    return;
  }
  storage.set('lv_visited', '1');

  const textEl  = document.getElementById('intro-text');
  const curEl   = document.getElementById('intro-cur');
  const tagEl   = document.getElementById('intro-tag');
  if (!textEl || !curEl || !tagEl) { clearTimeout(safetyTimer); dismiss(); return; }

  const fullName = 'Lucas Vizeu';
  let i = 0;
  document.body.style.overflow = 'hidden';

  const type = setInterval(() => {
    textEl.textContent = fullName.slice(0, ++i);
    if (i >= fullName.length) {
      clearInterval(type);
      tagEl.style.opacity = '1';
      setTimeout(() => {
        curEl.style.display = 'none';
        clearTimeout(safetyTimer);
        dismiss();
      }, 850);
    }
  }, 90);
})();

// ── SPOTLIGHT
const spot = document.getElementById('spot');
if (spot) {
  document.addEventListener('mousemove', e => {
    spot.style.setProperty('--mx', e.clientX + 'px');
    spot.style.setProperty('--my', e.clientY + 'px');
    spot.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => spot.style.opacity = '0');
}

// ── THEME
const root = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
if (storage.get('theme') === 'light') root.classList.add('light');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('light');
    storage.set('theme', root.classList.contains('light') ? 'light' : 'dark');
    setTimeout(initPreviews, 60);
  });
}

// ── TYPEWRITER (declarado antes de applyLang que o usa)
const STRINGS = {
  pt: {
    h1: 'Do banco de dados<br>à tela — <span class="grad">com precisão.</span>',
    bio: 'Desenvolvo produtos digitais completos — APIs funcionais, interfaces que as pessoas gostam de usar e código que não vira problema no futuro. Tenho experiência real em produção e gosto de ir fundo nos problemas.',
    phrases: [
      'construo do banco de dados à tela',
      'código limpo não é opcional',
      'APIs que outras APIs respeitam',
      'de Porto Alegre pro mundo',
      'entrego. não só começo.'
    ]
  },
  en: {
    h1: 'From database<br>to screen — <span class="grad">with precision.</span>',
    bio: "I build complete digital products — functional APIs, interfaces people enjoy using, and code that won't become a problem down the road. I have real production experience and love going deep on hard problems.",
    phrases: [
      'building from database to screen',
      'clean code is not optional',
      'APIs that other APIs respect',
      'from Porto Alegre to the world',
      'I ship. not just start.'
    ]
  },
  es: {
    h1: 'De la base de datos<br>a la pantalla — <span class="grad">con precisión.</span>',
    bio: 'Desarrollo productos digitales completos — APIs funcionales, interfaces que la gente disfruta usar y código que no se convierte en problema. Tengo experiencia real en producción y me gusta ir a fondo en los problemas.',
    phrases: [
      'construyo de la base de datos a la pantalla',
      'el código limpio no es opcional',
      'APIs que otras APIs respetan',
      'desde Porto Alegre al mundo',
      'entrego. no solo empiezo.'
    ]
  }
};

const twEl = document.getElementById('tw');
let twPhrases = STRINGS.pt.phrases;
let twPi = 0, twCi = 0, twDel = false, twPause = 0;

setInterval(() => {
  if (twPause > 0) { twPause--; return; }
  const p = twPhrases[twPi];
  if (!twDel) {
    twCi++;
    twEl.textContent = p.slice(0, twCi);
    if (twCi === p.length) { twDel = true; twPause = 18; }
  } else {
    twCi--;
    twEl.textContent = p.slice(0, twCi);
    if (twCi === 0) { twDel = false; twPi = (twPi + 1) % twPhrases.length; twPause = 4; }
  }
}, 90);

// ── LANGUAGE
const LANGS = ['pt', 'en', 'es'];
const FLAG_LABELS = { pt: '🇧🇷 PT', en: '🇺🇸 EN', es: '🇪🇸 ES' };
let currentLang = 'pt';
const langSelector = document.getElementById('lang-selector');
const langBtn      = document.getElementById('lang-btn');
const langLabel    = document.getElementById('lang-label');

function applyLang(lang) {
  if (!STRINGS[lang] || !langLabel || !langSelector || !twEl) return;
  currentLang = lang;
  root.setAttribute('data-lang', lang);
  langLabel.innerHTML = '<span class="flag">' + FLAG_LABELS[lang].split(' ')[0] + '</span> ' + FLAG_LABELS[lang].split(' ')[1];

  // highlight opção ativa
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.querySelector('h1').innerHTML = STRINGS[lang].h1;
  document.getElementById('hero-bio').textContent = STRINGS[lang].bio;

  document.querySelectorAll('[data-pt]').forEach(el => {
    const val = el.getAttribute('data-' + lang) || el.getAttribute('data-pt');
    if (!val) return;
    if (el.classList.contains('contact-hed')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  twPhrases = STRINGS[lang].phrases;
  twPi = 0; twCi = 0; twDel = false; twPause = 0;
  twEl.textContent = '';
  storage.set('lang', lang);
  // fechar dropdown
  langSelector.classList.remove('open');
}

// toggle dropdown
if (langBtn && langSelector) {
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langSelector.classList.toggle('open');
  });
  // clique fora fecha
  document.addEventListener('click', () => langSelector.classList.remove('open'));
  langSelector.addEventListener('click', e => e.stopPropagation());
}

// opções
document.querySelectorAll('.lang-option').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

const savedLang = storage.get('lang');
if (savedLang && LANGS.includes(savedLang)) applyLang(savedLang);

// ── ACTIVE NAV
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const navIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === e.target.id));
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => navIO.observe(s));

// ── REVEAL
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 90);
      io.unobserve(e.target);
    }
  });
}, { threshold: .07 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── COUNT-UP
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.t, dur = 900, start = performance.now();
    const step = ts => {
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      p < 1 ? requestAnimationFrame(step) : (el.textContent = target);
    };
    requestAnimationFrame(step);
    cio.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('.ct').forEach(el => cio.observe(el));

// ── PROJECT PREVIEWS
function drawPreview(canvas, type) {
  const w = canvas.width  = canvas.offsetWidth  || 250;
  const h = canvas.height = canvas.offsetHeight || 140;
  const ctx = canvas.getContext('2d');
  const dark = !root.classList.contains('light');
  const bg  = dark ? '#0e0e0d' : '#f0efeb';
  const s1  = dark ? '#1a1a18' : '#e4e3df';
  const s2  = dark ? '#252523' : '#d4d2cc';
  const txt = dark ? '#3a3835' : '#b8b5ae';
  const acc = { 'ai-saas':'#3ecf8e','saas-b2b':'#f59e0b','collab':'#095084','api-gw':'#f87171','cli':'#a78bfa' }[type] || '#3ecf8e';

  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = s1; ctx.fillRect(0, 0, w, 20);
  ctx.fillStyle = acc + '44'; ctx.fillRect(0, 0, 3, 20);
  [[12,'#f87171'],[21,'#f59e0b'],[30,'#3ecf8e']].forEach(([x, c]) => {
    ctx.beginPath(); ctx.arc(x, 10, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = c + '77'; ctx.fill();
  });
  ctx.fillStyle = txt; ctx.font = 'bold 6px monospace';
  ctx.fillText(type.replace(/-/g, ' ').toUpperCase(), 44, 13);

  if (type === 'cli') {
    ctx.fillStyle = dark ? '#080807' : '#1a1a18'; ctx.fillRect(0, 20, w, h - 20);
    [['$ node server.js','#3ecf8e'],['  listening on :3000','#9e9b92'],['  GET /api/chat 200','#9e9b92'],['  POST /api/doc  200','#9e9b92'],['  > ai response ok','#f59e0b']].forEach(([t, c], i) => {
      ctx.fillStyle = c; ctx.font = (i === 0 ? 'bold ' : '') + '6.5px monospace';
      ctx.fillText(t, 10, 34 + i * 13);
    });
  } else if (type === 'api-gw') {
    [['CLIENT', w*.07],['GATEWAY', w*.37],['AI SVC', w*.67]].forEach(([l, x]) => {
      ctx.fillStyle = s1; ctx.fillRect(x, 32, 48, 20);
      ctx.strokeStyle = acc + '55'; ctx.lineWidth = 1; ctx.strokeRect(x, 32, 48, 20);
      ctx.fillStyle = acc; ctx.font = 'bold 5.5px monospace'; ctx.fillText(l, x + 4, 45);
    });
    ctx.strokeStyle = acc + '55'; ctx.lineWidth = 1;
    [[w*.07+48,42,w*.37,42],[w*.37+48,42,w*.67,42]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x2-5,y2-3); ctx.lineTo(x2,y2); ctx.lineTo(x2-5,y2+3); ctx.stroke();
    });
    ctx.fillStyle = acc; ctx.font = '5.5px monospace'; ctx.fillText('● healthy', w - 50, h - 10);
  } else if (type === 'collab') {
    ctx.fillStyle = s1; ctx.fillRect(6, 26, w - 12, h - 32);
    [.75,.5,.85,.4,.65].forEach((len, i) => {
      ctx.fillStyle = s2; ctx.fillRect(14, 33 + i * 12, (w - 28) * len, 5);
    });
    [[acc, 55, 38],['#f59e0b', w * .55, 58]].forEach(([c, cx, cy]) => {
      ctx.fillStyle = c; ctx.fillRect(cx, cy, 2, 9);
      ctx.fillStyle = c + '44'; ctx.fillRect(cx, cy - 9, 28, 9);
      ctx.fillStyle = c; ctx.font = 'bold 5px sans-serif'; ctx.fillText('Lucas', cx + 2, cy - 2);
    });
  } else {
    const cols = type === 'ai-saas' ? 2 : 3;
    const pad = 7, cw2 = (w - pad * (cols + 1)) / cols, ch2 = 26;
    for (let i = 0; i < cols; i++) {
      ctx.fillStyle = s1; ctx.fillRect(pad + i * (cw2 + pad), 26, cw2, ch2);
      ctx.fillStyle = acc + '33'; ctx.fillRect(pad + i * (cw2 + pad), 26, 2, ch2);
      ctx.fillStyle = acc; ctx.font = 'bold 7px sans-serif';
      ctx.fillText(['82%','64%','91%'][i] || '', pad + i * (cw2 + pad) + 6, 43);
    }
    const bx = 7, by = 60, bw2 = w - 14, bh = h - 68;
    ctx.fillStyle = s1; ctx.fillRect(bx, by, bw2, bh);
    [.4,.7,.5,.85,.6,.75,.9,.55].forEach((v, i) => {
      const bW = (bw2 - 12) / 10, bX = bx + 6 + i * (bW + 2), bH = v * (bh - 8);
      ctx.fillStyle = acc + (i % 2 === 0 ? 'cc' : '66');
      ctx.fillRect(bX, by + bh - bH - 4, bW, bH);
    });
  }
}

function initPreviews() {
  document.querySelectorAll('canvas[data-preview]').forEach(c => drawPreview(c, c.dataset.preview));
}
requestAnimationFrame(() => setTimeout(initPreviews, 80));

// Preview show/hide on project hover
document.querySelectorAll('.project').forEach(proj => {
  const preview = proj.querySelector('.p-preview');
  if (!preview) return;
  preview.style.cssText += 'transition:opacity .22s ease,max-height .22s ease;opacity:0;max-height:0;overflow:hidden;';
  proj.addEventListener('mouseenter', () => {
    preview.style.display = 'block';
    requestAnimationFrame(() => {
      preview.style.opacity = '1';
      preview.style.maxHeight = '200px';
    });
    drawPreview(preview.querySelector('canvas'), preview.querySelector('canvas').dataset.preview);
  });
  proj.addEventListener('mouseleave', () => {
    preview.style.opacity = '0';
    preview.style.maxHeight = '0';
    setTimeout(() => { if (preview.style.opacity === '0') preview.style.display = 'none'; }, 230);
  });
});

// ── CONSTELLATION HERO
(function() {
  const canvas = document.getElementById('constellation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CONSTELLATIONS = [
    {
      name: 'Leão',
      stars: [
        {x:.18,y:.55,r:2.4}, // Regulus — estrela principal
        {x:.26,y:.40,r:1.7},
        {x:.34,y:.28,r:1.5},
        {x:.46,y:.22,r:1.6}, // cabeça do leão
        {x:.56,y:.30,r:1.4},
        {x:.62,y:.46,r:1.8}, // garupa
        {x:.54,y:.60,r:1.5},
        {x:.38,y:.65,r:1.3},
        {x:.22,y:.68,r:1.2},
        {x:.70,y:.55,r:1.3}, // cauda
        {x:.78,y:.48,r:1.2},
      ],
      lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,0],[1,7],[5,9],[9,10]]
    },
    {
      name: 'Pegasus',
      stars: [
        {x:.22,y:.28,r:2.1}, // Markab
        {x:.48,y:.22,r:1.9}, // Scheat
        {x:.50,y:.52,r:2.0}, // Algenib
        {x:.24,y:.55,r:2.2}, // Alpheratz
        {x:.65,y:.36,r:1.5}, // asa direita
        {x:.76,y:.26,r:1.3},
        {x:.78,y:.48,r:1.3},
        {x:.36,y:.70,r:1.2}, // pernas
        {x:.52,y:.72,r:1.2},
      ],
      lines: [[0,1],[1,2],[2,3],[3,0],[1,4],[4,5],[5,6],[4,6],[2,7],[2,8],[7,8]]
    },
    {
      name: 'Draco',
      stars: [
        {x:.15,y:.30,r:1.6}, // cabeça
        {x:.24,y:.24,r:1.4},
        {x:.34,y:.20,r:1.5}, // chifre
        {x:.28,y:.36,r:1.3},
        {x:.38,y:.42,r:2.0}, // coração — Thuban
        {x:.50,y:.38,r:1.5},
        {x:.60,y:.32,r:1.4},
        {x:.70,y:.40,r:1.3},
        {x:.75,y:.54,r:1.4}, // corpo
        {x:.68,y:.66,r:1.3},
        {x:.58,y:.72,r:1.2},
        {x:.48,y:.68,r:1.3}, // cauda
        {x:.38,y:.76,r:1.2},
      ],
      lines: [[0,1],[1,2],[0,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[4,3],[1,3]]
    },
    {
      name: 'Cygnus',
      stars: [
        {x:.50,y:.15,r:2.2}, // Deneb — cauda
        {x:.50,y:.30,r:1.5},
        {x:.50,y:.45,r:1.6},
        {x:.50,y:.60,r:1.8}, // Albireo — bico
        {x:.28,y:.38,r:1.4}, // asa esquerda
        {x:.16,y:.36,r:1.3},
        {x:.72,y:.38,r:1.4}, // asa direita
        {x:.84,y:.36,r:1.3},
        {x:.38,y:.52,r:1.2},
        {x:.62,y:.52,r:1.2},
      ],
      lines: [[0,1],[1,2],[2,3],[1,4],[4,5],[1,6],[6,7],[2,8],[2,9],[8,3],[9,3]]
    },
    {
      name: 'Andromeda',
      stars: [
        {x:.50,y:.18,r:2.0}, // Alpheratz
        {x:.38,y:.28,r:1.6},
        {x:.28,y:.38,r:1.5},
        {x:.20,y:.50,r:1.4},
        {x:.62,y:.28,r:1.5},
        {x:.72,y:.38,r:1.4},
        {x:.80,y:.50,r:1.3},
        {x:.50,y:.40,r:1.8}, // Mirach
        {x:.50,y:.60,r:1.6}, // Almach
        {x:.36,y:.68,r:1.2},
        {x:.64,y:.68,r:1.2},
      ],
      lines: [[0,1],[1,2],[2,3],[0,4],[4,5],[5,6],[0,7],[7,8],[8,9],[8,10],[1,7],[4,7]]
    },
    {
      name: 'Phoenix',
      stars: [
        {x:.50,y:.15,r:2.3}, // cabeça da fênix
        {x:.40,y:.26,r:1.6},
        {x:.60,y:.26,r:1.6},
        {x:.30,y:.38,r:1.5}, // asa esquerda expandida
        {x:.20,y:.30,r:1.4},
        {x:.12,y:.42,r:1.3},
        {x:.70,y:.38,r:1.5}, // asa direita expandida
        {x:.80,y:.30,r:1.4},
        {x:.88,y:.42,r:1.3},
        {x:.46,y:.50,r:1.8}, // corpo
        {x:.54,y:.50,r:1.8},
        {x:.42,y:.65,r:1.5}, // cauda de fogo
        {x:.50,y:.72,r:1.4},
        {x:.58,y:.65,r:1.5},
      ],
      lines: [[0,1],[0,2],[1,3],[3,4],[4,5],[2,6],[6,7],[7,8],[1,9],[2,10],[9,10],[9,11],[10,13],[11,12],[12,13]]
    },
    {
      name: 'Scorpius',
      stars: [
        {x:.50,y:.12,r:1.6},
        {x:.44,y:.20,r:1.5},
        {x:.38,y:.30,r:2.3}, // Antares — estrela do coração
        {x:.32,y:.40,r:1.5},
        {x:.28,y:.50,r:1.4},
        {x:.30,y:.60,r:1.5},
        {x:.36,y:.68,r:1.4},
        {x:.44,y:.74,r:1.6},
        {x:.54,y:.74,r:1.5},
        {x:.62,y:.68,r:1.4}, // ferrão
        {x:.68,y:.60,r:1.5},
        {x:.72,y:.50,r:1.4},
      ],
      lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11]]
    },
    {
      name: 'Virgo',
      stars: [
        {x:.50,y:.12,r:1.6}, // cabeça
        {x:.42,y:.22,r:1.5},
        {x:.34,y:.32,r:1.4},
        {x:.28,y:.44,r:2.1}, // Spica — mão esquerda
        {x:.58,y:.22,r:1.5},
        {x:.66,y:.32,r:1.4},
        {x:.72,y:.44,r:1.6},
        {x:.50,y:.36,r:1.8}, // corpo
        {x:.50,y:.52,r:1.6},
        {x:.40,y:.64,r:1.3},
        {x:.60,y:.64,r:1.3},
        {x:.44,y:.76,r:1.2},
        {x:.56,y:.76,r:1.2},
      ],
      lines: [[0,1],[1,2],[2,3],[0,4],[4,5],[5,6],[1,7],[4,7],[7,8],[8,9],[8,10],[9,11],[10,12]]
    }
    ,
    {
      name: 'Orion',
      stars: [
        {x:.38,y:.16,r:2.1}, // Betelgeuse
        {x:.64,y:.20,r:2.2}, // Rigel
        {x:.44,y:.30,r:1.5}, // Bellatrix
        {x:.60,y:.34,r:1.4}, // Saiph
        {x:.44,y:.46,r:2.0}, // Alnitak — cinturão
        {x:.50,y:.47,r:2.1}, // Alnilam
        {x:.56,y:.46,r:2.0}, // Mintaka
        {x:.36,y:.62,r:1.4},
        {x:.64,y:.64,r:1.5},
        {x:.50,y:.76,r:1.3},
      ],
      lines: [[0,2],[1,3],[2,4],[3,6],[4,5],[5,6],[0,4],[1,6],[4,7],[6,8],[7,9],[8,9]]
    },
    {
      name: 'Ursa Major',
      stars: [
        {x:.14,y:.42,r:1.8}, // Dubhe
        {x:.26,y:.36,r:1.6}, // Merak
        {x:.38,y:.38,r:1.5}, // Phecda
        {x:.48,y:.46,r:1.6}, // Megrez
        {x:.60,y:.38,r:1.7}, // Alioth
        {x:.70,y:.30,r:1.6}, // Mizar
        {x:.82,y:.24,r:1.5}, // Alkaid
        {x:.18,y:.58,r:1.3},
        {x:.28,y:.62,r:1.2},
        {x:.38,y:.58,r:1.3},
      ],
      lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[0,7],[7,8],[8,9],[9,1],[2,9]]
    },
    {
      name: 'Crux',
      stars: [
        {x:.50,y:.15,r:2.2}, // Acrux — topo
        {x:.50,y:.82,r:2.0}, // Gacrux — base
        {x:.22,y:.50,r:1.8}, // delta Crucis — esquerda
        {x:.78,y:.50,r:2.1}, // beta Crucis — direita
        {x:.62,y:.30,r:1.3}, // estrela menor
        {x:.38,y:.30,r:1.2},
      ],
      lines: [[0,1],[2,3],[0,5],[0,4],[1,2],[1,3]]
    }
  ];

  let W, H;

  // Estado
  let constIdx      = 0;  // constelação atual
  let nextIdx       = 0;  // próxima (durante morph)
  let shownIdx      = 0;  // índice do nome visível (só troca no meio do morph)
  let stars         = [];
  let targetStars   = [];
  let lines         = [];
  let targetLines   = [];

  // Máquina de estados simples
  // 'hold' → 'morph' → 'hold' → ...
  let phase      = 'hold';
  let holdTimer  = 0;
  let morphT     = 0;

  const HOLD   = 360;  // ~6s
  const MORPH  = 180;  // ~3s — suave

  // Garante loop único mesmo se requestAnimationFrame disparar extras
  let running = false;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width;
    H = canvas.height = rect.height;
  }

  function makeStars(c) {
    return c.stars.map(s => ({
      x: s.x * W, y: s.y * H, r: s.r,
      tw: Math.random() * Math.PI * 2
    }));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < .5 ? 2*t*t : -1 + (4 - 2*t) * t; }

  // Smooth step — sem oscilação nas bordas
  function smoothstep(t) { return t * t * (3 - 2 * t); }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const dark      = !document.documentElement.classList.contains('light');
    const starRGB   = dark ? '255,255,255' : '30,30,40';
    const lineRGB   = dark ? '34,183,147'  : '20,140,110';
    const now       = performance.now() * 0.001;

    // ── Calcular estrelas interpoladas
    let dispStars;
    let lineAlphaOld = 0;
    let lineAlphaNew = 0;

    if (phase === 'hold') {
      dispStars    = stars;
      lineAlphaOld = 0.30;
    } else {
      const raw = Math.min(morphT / MORPH, 1);
      const t   = ease(raw);

      // Interpolar estrelas — clamp index para evitar saltos
      const len = Math.max(stars.length, targetStars.length);
      dispStars = [];
      for (let i = 0; i < len; i++) {
        const a = stars[Math.min(i, stars.length - 1)];
        const b = targetStars[Math.min(i, targetStars.length - 1)];
        dispStars.push({
          x:  lerp(a.x,  b.x,  t),
          y:  lerp(a.y,  b.y,  t),
          r:  lerp(a.r,  b.r,  t),
          tw: lerp(a.tw, b.tw, t)
        });
      }

      // Linhas antigas: fade out na 1ª metade
      lineAlphaOld = raw < 0.5 ? smoothstep(1 - raw * 2) * 0.30 : 0;
      // Linhas novas: fade in na 2ª metade
      lineAlphaNew = raw > 0.5 ? smoothstep((raw - 0.5) * 2) * 0.30 : 0;

      // Nome troca exatamente no meio
      if (raw >= 0.5 && shownIdx !== nextIdx) shownIdx = nextIdx;
    }

    // ── Desenhar linhas antigas
    if (lineAlphaOld > 0.01) {
      ctx.strokeStyle = `rgba(${lineRGB},${lineAlphaOld})`;
      ctx.lineWidth = 0.7;
      lines.forEach(([a, b]) => {
        const sa = dispStars[Math.min(a, dispStars.length-1)];
        const sb = dispStars[Math.min(b, dispStars.length-1)];
        ctx.beginPath(); ctx.moveTo(sa.x, sa.y); ctx.lineTo(sb.x, sb.y); ctx.stroke();
      });
    }

    // ── Desenhar linhas novas
    if (lineAlphaNew > 0.01) {
      ctx.strokeStyle = `rgba(${lineRGB},${lineAlphaNew})`;
      ctx.lineWidth = 0.7;
      targetLines.forEach(([a, b]) => {
        const sa = dispStars[Math.min(a, dispStars.length-1)];
        const sb = dispStars[Math.min(b, dispStars.length-1)];
        ctx.beginPath(); ctx.moveTo(sa.x, sa.y); ctx.lineTo(sb.x, sb.y); ctx.stroke();
      });
    }

    // ── Desenhar estrelas
    dispStars.forEach(s => {
      const twinkle = 0.75 + 0.25 * Math.sin(now * 1.2 + s.tw);
      const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.2);
      grd.addColorStop(0,   `rgba(${starRGB},${0.9  * twinkle})`);
      grd.addColorStop(0.4, `rgba(${starRGB},${0.35 * twinkle})`);
      grd.addColorStop(1,   `rgba(${starRGB},0)`);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
      // núcleo
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${starRGB},${twinkle})`; ctx.fill();
    });

  }

  function tick() {
    if (phase === 'hold') {
      holdTimer++;
      if (holdTimer >= HOLD) {
        nextIdx     = (constIdx + 1) % CONSTELLATIONS.length;
        targetStars = makeStars(CONSTELLATIONS[nextIdx]);
        targetLines = CONSTELLATIONS[nextIdx].lines;
        morphT      = 0;
        phase       = 'morph';
      }
    } else {
      morphT++;
      if (morphT >= MORPH) {
        constIdx  = nextIdx;
        shownIdx  = constIdx;
        stars     = targetStars.map(s => ({...s}));
        lines     = [...targetLines];
        holdTimer = 0;
        phase     = 'hold';
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  function init() {
    resize();
    constIdx  = 0;
    shownIdx  = 0;
    stars     = makeStars(CONSTELLATIONS[0]);
    lines     = CONSTELLATIONS[0].lines;
    holdTimer = 0;
    phase     = 'hold';
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  window.addEventListener('resize', () => { resize(); });
  init();
})();

// ── CONSOLE EASTER EGG
const _g = 'color:#22b793;font-weight:bold;';
const _d = 'color:#888;';
const _a = 'color:#ffca0c;font-weight:bold;';
const _b = 'color:#095084;font-weight:bold;';
console.log('%c╔══════════════════════════════════════╗', _g);
console.log('%c  👋  Olá, dev curioso!                 ', _g);
console.log('%c╚══════════════════════════════════════╝', _g);
console.log(' ');
console.log('%cObrigado por inspecionar o portfólio do Lucas!', _d);
console.log('%cIsso diz muito sobre você — devs bons sempre olham o código.', _d);
console.log(' ');
console.log('%c📬  lucasvizeulgv@gmail.com', _a);
console.log('%c🐙  github.com/lucasss45', _a);
console.log(' ');
console.log('%c🌟  DESAFIO SECRETO  🌟', _b);
console.log('%cDigite  cosmo  ou  pegasus  ou  constelacao', _d);
console.log('%cem qualquer lugar da página e veja o que acontece...', _d);
console.log(' ');
console.log('%c✨ Feito com Node.js · TypeScript · React · e muito café ☕', _d);

// ── EASTER EGG TECLADO — cosmo / pegasus / constelacao
(function() {
  let typed = '';
  const triggers = ['cosmo', 'pegasus', 'constelacao', 'constellation'];
  document.addEventListener('keydown', e => {
    typed += e.key.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    typed = typed.slice(-14); // guardar só os últimos 14 chars
    const hit = triggers.find(t => typed.endsWith(t));
    if (!hit) return;
    typed = '';
    // COSMO BURST — todas as estrelas pulsam em dourado
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let frame = 0;
    const TOTAL = 220; // ~3.6 segundos a 60fps — bem mais lento
    // capturar posições atuais das estrelas do canvas pra animar
    const burst = () => {
      frame++;
      const t = frame / TOTAL;
      const pulse = Math.abs(Math.sin(t * Math.PI * 6)); // pulsa 3x
      const fadeIn  = Math.min(1, frame / 25);
      const fadeOut = Math.max(0, 1 - (frame - TOTAL * .7) / (TOTAL * .3));
      const alpha   = fadeIn * fadeOut;

      ctx.save();

      // ── camada 1: glow radial dourado pulsante
      const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * .8);
      grd.addColorStop(0,   `rgba(255,202,12,${pulse * alpha * .22})`);
      grd.addColorStop(.35, `rgba(34,183,147,${pulse * alpha * .14})`);
      grd.addColorStop(.7,  `rgba(9,80,132,${alpha * .08})`);
      grd.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // ── camada 2: texto principal com fade in/out suave
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';

      // título grande
      const fontSize = Math.min(W * .045, 22);
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.letterSpacing = '4px';
      ctx.fillStyle = '#ffca0c';
      // sombra dourada
      ctx.shadowColor = '#ffca0c';
      ctx.shadowBlur = 18 * pulse;
      ctx.fillText('✦  COSMO  ATIVADO  ✦', W/2, H/2 - 18);

      // subtítulo
      ctx.shadowBlur = 8 * pulse;
      ctx.font = `${Math.min(W * .025, 12)}px monospace`;
      ctx.letterSpacing = '2px';
      ctx.fillStyle = '#22b793';
      ctx.fillText('os cavaleiros do zodíaco agradecem', W/2, H/2 + 8);

      // dica de console
      if (frame > 40) {
        ctx.globalAlpha = alpha * Math.min(1, (frame - 40) / 20);
        ctx.font = `${Math.min(W * .018, 9)}px monospace`;
        ctx.letterSpacing = '1px';
        ctx.fillStyle = '#888';
        ctx.shadowBlur = 0;
        ctx.fillText('veja o console para mais segredos...', W/2, H/2 + 28);
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
      ctx.letterSpacing = '0px';
      ctx.restore();

      if (frame < TOTAL) requestAnimationFrame(burst);
    };
    requestAnimationFrame(burst);
    console.log('%c🔥 COSMO ATIVADO! Você encontrou o easter egg!', 'color:#ffca0c;font-size:14px;font-weight:bold;');
    console.log('%cOs cavaleiros do zodíaco aprovam sua curiosidade ⭐', 'color:#22b793;');
  });
})();
