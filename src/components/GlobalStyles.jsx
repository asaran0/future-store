let injected = false;
let adminInjected = false;

const CSS = `
  /* ── ANN BAR ─────────────────────────────────────────────── */
  .ff-ann-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1001;
    background: var(--annBar); color: var(--annBarText);
    height: 36px; display: flex; align-items: center; justify-content: center;
    font-family: var(--fontDisplay); font-size: .7rem; font-weight: 600;
    letter-spacing: .08em; gap: .5rem;
  }
  .ff-ann-link { cursor: pointer; text-decoration: underline; transition: opacity .2s; }
  .ff-ann-link:hover { opacity: .7; }

  /* ── NAV ─────────────────────────────────────────────────── */
  .ff-nav {
    position: fixed; top: 36px; left: 0; right: 0; z-index: 1000;
    background: var(--navBg); backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem; height: 68px;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  }
  .ff-logo {
    display: flex; align-items: center; gap: .5rem; cursor: pointer;
    text-decoration: none; flex-shrink: 0;
  }
  .ff-logo-icon { font-size: 1.5rem; color: var(--accent); line-height: 1; }
  .ff-logo-diamond { animation: pulse 3s infinite; display: block; }
  .ff-logo-text { font-family: var(--fontDisplay); font-size: 1.35rem; font-weight: 700; letter-spacing: .1em; line-height: 1; }
  .ff-logo-fox   { color: var(--text); }
  .ff-logo-fury  { color: var(--accent); }

  .ff-nav-links { display: flex; align-items: center; gap: .25rem; flex: 1; justify-content: center; }
  .ff-nav-item-wrap { position: relative; }
  .ff-nav-link {
    font-family: var(--fontDisplay); font-size: .68rem; font-weight: 600;
    letter-spacing: .1em; color: var(--muted); text-transform: uppercase;
    background: none; border: none; cursor: pointer; padding: .5rem .75rem;
    transition: color .2s; position: relative; display: flex; align-items: center; gap: .3rem;
    white-space: nowrap;
  }
  .ff-nav-link::after { content:''; position:absolute; bottom:-1px; left:.75rem; right:.75rem; height:2px; background:var(--accent); transform:scaleX(0); transition:transform .25s; }
  .ff-nav-link:hover { color: var(--text); }
  .ff-nav-link:hover::after, .ff-nav-link.active::after { transform: scaleX(1); }
  .ff-nav-link.active { color: var(--accentB); }
  .ff-nav-caret { font-size: .5rem; opacity: .6; }
  .ff-nav-link.open { color: var(--accentB); }

  /* Dropdown */
  .ff-dropdown {
    position: absolute; top: calc(100% + 4px); left: 50%; transform: translateX(-50%);
    background: var(--bgCard); border: 1px solid var(--border); border-radius: 10px;
    padding: .5rem; min-width: 240px; z-index: 2000;
    box-shadow: 0 20px 60px rgba(0,0,0,.5), 0 0 30px var(--glow);
    animation: slideDown .2s ease;
  }
  .ff-dropdown-item {
    display: flex; align-items: center; gap: .75rem;
    padding: .6rem .85rem; border-radius: 7px; border: none;
    background: transparent; color: var(--text); cursor: pointer;
    width: 100%; text-align: left; transition: background .15s;
  }
  .ff-dropdown-item:hover { background: var(--surface); }
  .ff-dropdown-icon  { font-size: 1.1rem; flex-shrink: 0; width: 24px; text-align: center; }
  .ff-dropdown-label { font-family: var(--fontDisplay); font-size: .75rem; font-weight: 600; letter-spacing: .04em; }
  .ff-dropdown-desc  { font-size: .65rem; color: var(--muted); margin-top: 1px; }

  .ff-nav-actions { display: flex; align-items: center; gap: .5rem; flex-shrink: 0; }
  .ff-icon-btn {
    width: 38px; height: 38px; border-radius: 8px;
    background: transparent; border: 1px solid var(--border);
    color: var(--subtle); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: .95rem; transition: all .2s; position: relative;
  }
  .ff-icon-btn:hover, .ff-icon-btn.active { border-color: var(--borderH); color: var(--text); background: var(--surface); box-shadow: 0 0 10px var(--glow); }
  .ff-nav-badge {
    position: absolute; top: -5px; right: -5px;
    background: var(--accent); color: #000;
    font-size: .5rem; font-family: var(--fontMono); font-weight: 700;
    width: 15px; height: 15px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .ff-theme-selector { display: flex; gap: 3px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 4px; }
  .ff-theme-dot { width: 14px; height: 14px; border-radius: 3px; cursor: pointer; transition: transform .2s; border: 2px solid rgba(255,255,255,0.15); box-sizing: border-box; }
  .ff-theme-dot:hover { transform: scale(1.25); }
  .ff-theme-dot.active { border-color: var(--text); }
  .ff-user-chip {
    display: flex; align-items: center; gap: .45rem;
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 0 .75rem; height: 38px; cursor: pointer; transition: all .2s;
    font-family: var(--fontDisplay); font-size: .62rem; letter-spacing: .06em; color: var(--subtle);
  }
  .ff-user-chip:hover { border-color: var(--borderH); color: var(--text); }

  /* ── BUTTONS ─────────────────────────────────────────────── */
  .ff-btn-yellow {
    font-family: var(--fontDisplay); font-size: .68rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; padding: 0 1.5rem; height: 40px;
    background: var(--accent); color: #000; border: none; border-radius: 5px;
    cursor: pointer; transition: all .2s; white-space: nowrap;
  }
  .ff-btn-yellow:hover { background: var(--accentB); transform: translateY(-1px); box-shadow: 0 6px 20px var(--glow); }
  .ff-btn-yellow-lg {
    font-family: var(--fontDisplay); font-size: .78rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; padding: 0 2.5rem; height: 52px;
    background: var(--accent); color: #000; border: none; border-radius: 6px;
    cursor: pointer; transition: all .25s; position: relative; overflow: hidden;
  }
  .ff-btn-yellow-lg::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent); transform:translateX(-100%); transition:transform .5s; }
  .ff-btn-yellow-lg:hover { background: var(--accentB); box-shadow: 0 8px 30px var(--glow); transform: translateY(-2px); }
  .ff-btn-yellow-lg:hover::before { transform: translateX(100%); }
  .ff-btn-outline-lg {
    font-family: var(--fontDisplay); font-size: .72rem; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; padding: 0 2.5rem; height: 52px;
    background: transparent; color: var(--text); border: 1px solid rgba(255,255,255,.25);
    border-radius: 6px; cursor: pointer; transition: all .25s;
  }
  .ff-btn-outline-lg:hover { border-color: var(--borderH); background: rgba(255,255,255,.05); }
  .ff-btn-outline-sm {
    font-family: var(--fontDisplay); font-size: .62rem; letter-spacing: .1em; text-transform: uppercase;
    padding: 0 1rem; height: 36px; background: transparent; color: var(--text);
    border: 1px solid var(--border); border-radius: 4px; cursor: pointer; transition: all .2s;
  }
  .ff-btn-outline-sm:hover { border-color: var(--borderH); }
  .ff-btn-ghost-sm {
    font-family: var(--fontDisplay); font-size: .62rem; letter-spacing: .1em; text-transform: uppercase;
    padding: 0 .85rem; height: 36px; background: transparent; color: var(--muted);
    border: 1px solid var(--border); border-radius: 4px; cursor: pointer; transition: all .2s;
  }
  .ff-btn-ghost-sm:hover { color: var(--text); border-color: var(--borderH); }

  /* ── PAGE SHELL ──────────────────────────────────────────── */
  .ff-page { min-height: 100vh; padding-top: 104px; }

  /* ── HERO ────────────────────────────────────────────────── */
  .ff-hero {
    min-height: calc(100vh - 104px); display: flex; align-items: center;
    position: relative; overflow: hidden; transition: background 1s;
  }
  .ff-hero-grid {
    position:absolute; inset:0; opacity:.04;
    background-image: linear-gradient(var(--accent) 1px,transparent 1px), linear-gradient(90deg,var(--accent) 1px,transparent 1px);
    background-size: 70px 70px;
  }
  .ff-hero-glow {
    position:absolute; width:700px; height:700px; border-radius:50%;
    background:var(--glow); filter:blur(120px);
    right:5%; top:50%; transform:translateY(-50%); opacity:.6;
    animation: heroFloat 6s ease-in-out infinite;
  }
  .ff-hero-content { position:relative; z-index:1; padding:4rem; max-width:720px; animation: slideUp .6s ease; }
  .ff-hero-eyebrow {
    font-family:var(--fontDisplay); font-size:.65rem; font-weight:600; letter-spacing:.25em;
    color:var(--accent); text-transform:uppercase; margin-bottom:1.25rem;
    display:flex; align-items:center; gap:.65rem;
  }
  .ff-hero-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite; }
  .ff-hero-title {
    font-family:var(--fontDisplay); font-size:clamp(2.2rem,5.5vw,4.5rem);
    font-weight:700; line-height:1.05; color:var(--text); margin-bottom:.25rem;
  }
  .ff-hero-accent { color:var(--accentB); display:block; text-shadow:0 0 40px var(--glow),0 0 80px var(--glow); }
  .ff-hero-sub { font-size:.95rem; color:var(--subtle); line-height:1.7; margin:1.5rem 0 2.5rem; max-width:540px; font-weight:300; }
  .ff-hero-actions { display:flex; gap:1rem; flex-wrap:wrap; }
  .ff-hero-stats { display:flex; gap:2.5rem; margin-top:3rem; }
  .ff-stat-val { font-family:var(--fontDisplay); font-size:1.5rem; font-weight:700; color:var(--accentB); }
  .ff-stat-lbl { font-size:.65rem; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; margin-top:2px; }
  .ff-hero-dots { position:absolute; bottom:2rem; left:4rem; display:flex; gap:.5rem; }
  .ff-hero-dot { width:8px; height:8px; border-radius:50%; border:1px solid rgba(255,255,255,.3); background:transparent; cursor:pointer; transition:all .2s; padding:0; }
  .ff-hero-dot.active { background:var(--accent); border-color:var(--accent); width:24px; border-radius:4px; }
  .ff-scroll-hint { position:absolute; bottom:1.5rem; right:4rem; color:var(--muted); font-size:.75rem; animation:heroFloat 2s ease-in-out infinite; }

  /* ── SECTIONS ────────────────────────────────────────────── */
  .ff-section { padding: 5rem 4rem; }
  .ff-section-dark { background: var(--bg2); }
  .ff-section-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:2.5rem; flex-wrap:wrap; gap:1rem; }
  .ff-section-eyebrow { font-family:var(--fontDisplay); font-size:.58rem; letter-spacing:.2em; color:var(--accent); text-transform:uppercase; margin-bottom:.4rem; }
  .ff-section-heading { font-family:var(--fontDisplay); font-size:1.5rem; font-weight:700; color:var(--text); letter-spacing:.04em; }
  .ff-see-all { font-family:var(--fontDisplay); font-size:.65rem; color:var(--accent); cursor:pointer; letter-spacing:.1em; text-transform:uppercase; background:none; border:none; transition:color .2s; }
  .ff-see-all:hover { color:var(--accentB); }

  /* ── INDUSTRY GRID ───────────────────────────────────────── */
  .ff-industry-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1rem; }
  .ff-industry-card {
    background:var(--bgCard); border:1px solid var(--border); border-radius:10px;
    padding:1.5rem; cursor:pointer; transition:all .3s; text-align:left;
    display:flex; flex-direction:column; gap:.6rem;
  }
  .ff-industry-card:hover { border-color:var(--borderH); transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,.4),0 0 16px var(--glow); }
  .ff-industry-icon { font-size:2rem; }
  .ff-industry-label { font-family:var(--fontDisplay); font-size:.9rem; font-weight:700; color:var(--text); letter-spacing:.04em; }
  .ff-industry-desc { font-size:.72rem; color:var(--muted); line-height:1.5; flex:1; }
  .ff-industry-features { display:flex; flex-wrap:wrap; gap:.3rem; }
  .ff-ind-tag { font-family:var(--fontMono); font-size:.55rem; color:var(--subtle); background:var(--surface); border:1px solid var(--border); border-radius:3px; padding:2px 7px; }
  .ff-industry-cta { font-family:var(--fontDisplay); font-size:.6rem; letter-spacing:.12em; color:var(--accent); margin-top:.4rem; }
  .ff-ind-tags-row { display:flex; flex-wrap:wrap; gap:.4rem; margin-top:.5rem; }

  /* ── FEATURES STRIP ──────────────────────────────────────── */
  .ff-features-strip { padding:2.5rem 4rem; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--bg2); display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:2rem; }
  .ff-feature { display:flex; align-items:flex-start; gap:.85rem; }
  .ff-feature-icon { font-size:1.4rem; width:40px; height:40px; border-radius:8px; background:var(--surface); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ff-feature-title { font-family:var(--fontDisplay); font-size:.72rem; font-weight:600; color:var(--text); margin-bottom:.2rem; }
  .ff-feature-desc { font-size:.68rem; color:var(--muted); line-height:1.5; }

  /* ── BANNER ──────────────────────────────────────────────── */
  .ff-banner { padding:5rem 4rem; background:var(--bg); position:relative; overflow:hidden; display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; border-top:1px solid var(--border); }
  .ff-banner-glow { position:absolute; right:0; top:50%; transform:translateY(-50%); width:500px; height:500px; border-radius:50%; background:var(--glow); filter:blur(80px); opacity:.4; }
  .ff-banner-content { position:relative; z-index:1; }
  .ff-banner-eyebrow { font-family:var(--fontDisplay); font-size:.58rem; letter-spacing:.25em; color:var(--accent); text-transform:uppercase; margin-bottom:.75rem; }
  .ff-banner-title { font-family:var(--fontDisplay); font-size:clamp(1.5rem,3vw,2.5rem); font-weight:700; color:var(--text); margin-bottom:1rem; }
  .ff-banner-sub { font-size:.85rem; color:var(--subtle); line-height:1.7; margin-bottom:1.5rem; max-width:460px; }
  .ff-banner-specs { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:2rem; }
  .ff-banner-spec { font-family:var(--fontMono); font-size:.65rem; color:var(--accentB); background:rgba(245,197,24,.08); border:1px solid rgba(245,197,24,.2); border-radius:3px; padding:3px 10px; }
  .ff-banner-visual { position:relative; display:flex; align-items:center; justify-content:center; height:300px; }
  .ff-banner-emoji { font-size:6rem; z-index:1; animation:heroFloat 3s ease-in-out infinite; filter:drop-shadow(0 0 30px var(--accent)); }
  .ff-banner-ring { position:absolute; border-radius:50%; border:1px solid var(--borderH); animation:pulse 3s ease-in-out infinite; }
  .ff-banner-ring-1 { width:160px; height:160px; animation-delay:0s; }
  .ff-banner-ring-2 { width:240px; height:240px; animation-delay:.5s; }
  .ff-banner-ring-3 { width:320px; height:320px; animation-delay:1s; }

  /* ── TESTIMONIALS ────────────────────────────────────────── */
  .ff-testimonial-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.25rem; }
  .ff-testimonial-card { background:var(--bgCard); border:1px solid var(--border); border-radius:10px; padding:1.5rem; transition:border-color .2s; }
  .ff-testimonial-card:hover { border-color:var(--borderH); }
  .ff-testimonial-stars { color:var(--accent); font-size:1rem; margin-bottom:.75rem; letter-spacing:.1em; }
  .ff-testimonial-text { font-size:.8rem; color:var(--subtle); line-height:1.7; font-style:italic; margin-bottom:1.25rem; flex:1; }
  .ff-testimonial-footer { display:flex; align-items:center; gap:.75rem; }
  .ff-testimonial-avatar { width:36px; height:36px; border-radius:50%; background:var(--accent); color:#000; font-family:var(--fontDisplay); font-weight:700; font-size:.85rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ff-testimonial-role { font-family:var(--fontDisplay); font-size:.72rem; font-weight:600; color:var(--text); }
  .ff-testimonial-dept { font-size:.65rem; color:var(--muted); margin-top:1px; }
  .ff-testimonial-product { font-family:var(--fontMono); font-size:.58rem; color:var(--accent); margin-top:3px; }

  /* ── SHOP PAGE ───────────────────────────────────────────── */
  .ff-shop-hero { padding:3.5rem 4rem 2.5rem; background:var(--bg2); border-bottom:1px solid var(--border); }
  .ff-shop-title { font-family:var(--fontDisplay); font-size:2rem; font-weight:700; color:var(--text); margin-top:.4rem; }
  .ff-shop-sub { font-size:.85rem; color:var(--muted); margin-top:.5rem; max-width:500px; line-height:1.6; }
  .ff-shop-body { display:grid; grid-template-columns:220px 1fr; min-height:calc(100vh - 200px); }
  .ff-shop-sidebar { background:var(--bgCard); border-right:1px solid var(--border); padding:1.5rem 1rem; position:sticky; top:104px; height:calc(100vh - 104px); overflow-y:auto; }
  .ff-sidebar-section { margin-bottom:2rem; }
  .ff-sidebar-title { font-family:var(--fontDisplay); font-size:.58rem; letter-spacing:.18em; color:var(--accent); text-transform:uppercase; margin-bottom:.75rem; padding:0 .25rem; }
  .ff-sidebar-item {
    display:flex; align-items:center; gap:.5rem; width:100%; padding:.5rem .6rem;
    background:none; border:none; border-radius:5px; cursor:pointer;
    font-family:var(--fontDisplay); font-size:.66rem; letter-spacing:.06em;
    color:var(--muted); text-align:left; transition:all .15s; text-transform:uppercase;
  }
  .ff-sidebar-item:hover { color:var(--text); background:var(--surface); }
  .ff-sidebar-item.active { color:var(--accentB); background:rgba(245,197,24,.08); border-left:2px solid var(--accent); }
  .ff-shop-main { padding:1.75rem 2.5rem; }
  .ff-filter-bar { display:flex; align-items:center; gap:.75rem; margin-bottom:1.75rem; flex-wrap:wrap; }
  .ff-search-bar { display:flex; align-items:center; gap:.5rem; background:var(--bgCard); border:1px solid var(--border); border-radius:5px; padding:0 .85rem; flex:1; min-width:200px; max-width:340px; height:40px; }
  .ff-search-bar:focus-within { border-color:var(--borderH); box-shadow:0 0 8px var(--glow); }
  .ff-search-input { background:none; border:none; color:var(--text); font-family:var(--fontBody); font-size:.82rem; outline:none; flex:1; }
  .ff-search-input::placeholder { color:var(--muted); }
  .ff-search-clear { color:var(--muted); cursor:pointer; font-size:.75rem; }
  .ff-search-clear:hover { color:var(--text); }
  .ff-filter-select { font-family:var(--fontDisplay); font-size:.62rem; letter-spacing:.08em; padding:0 .9rem; height:40px; border-radius:5px; border:1px solid var(--border); background:var(--bgCard); color:var(--subtle); cursor:pointer; text-transform:uppercase; outline:none; }
  .ff-filter-select:focus { border-color:var(--borderH); }
  .ff-result-count { font-family:var(--fontMono); font-size:.65rem; color:var(--muted); margin-left:auto; }
  .ff-error-state { text-align:center; padding:4rem; color:var(--danger); }
  .ff-fallback-notice {
    display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;
    padding:.75rem 1.1rem; margin-bottom:1.5rem;
    background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.3); border-radius:6px;
    font-family:var(--fontMono); font-size:.72rem; color:var(--warning);
  }
  .ff-error-title { font-family:var(--fontDisplay); font-size:.8rem; letter-spacing:.08em; margin-bottom:1rem; }
  .ff-empty-grid { grid-column:1/-1; text-align:center; padding:4rem 2rem; color:var(--muted); }
  .ff-empty-title { font-family:var(--fontDisplay); font-size:.9rem; letter-spacing:.1em; color:var(--subtle); margin-bottom:.5rem; }
  .ff-empty-sub { font-size:.75rem; }

  /* ── PRODUCT GRID ────────────────────────────────────────── */
  .ff-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.25rem; }
  .ff-card { background:var(--bgCard); border:1px solid var(--border); border-radius:10px; overflow:hidden; transition:all .3s; display:flex; flex-direction:column; }
  .ff-card:hover { border-color:var(--borderH); transform:translateY(-4px); box-shadow:0 18px 40px rgba(0,0,0,.4),0 0 16px var(--glow); }
  .ff-card-img { height:180px; display:flex; align-items:center; justify-content:center; background:var(--surface); position:relative; overflow:hidden; }
  .ff-card-img.has-url img { width:100%; height:100%; object-fit:cover; }
  .ff-card-img::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,transparent 55%,var(--bgCard)); pointer-events:none; }
  .ff-card-emoji { font-size:4.5rem; position:relative; z-index:1; }
  .ff-card-badge { position:absolute; top:10px; left:10px; z-index:2; font-family:var(--fontMono); font-size:.56rem; letter-spacing:.08em; padding:3px 8px; border-radius:3px; font-weight:700; }
  .ff-card-badge.bestseller { background:var(--accent); color:#000; }
  .ff-card-badge.hot  { background:#E53E3E; color:#fff; }
  .ff-card-badge.new  { background:#3182CE; color:#fff; }
  .ff-card-badge.sale { background:#38A169; color:#fff; }
  .ff-card-badge.pro  { background:#805AD5; color:#fff; }
  .ff-card-badge.forensics { background:#6B46C1; color:#fff; }
  .ff-card-wish { position:absolute; top:8px; right:8px; z-index:3; width:30px; height:30px; border-radius:6px; border:1px solid var(--border); background:var(--bgCard); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; font-size:.85rem; }
  .ff-card-wish:hover, .ff-card-wish.active { border-color:#E53E3E; background:rgba(229,62,62,.12); }
  .ff-card-body { padding:1.1rem; flex:1; display:flex; flex-direction:column; }
  .ff-card-brand { font-family:var(--fontMono); font-size:.58rem; color:var(--accent); letter-spacing:.12em; text-transform:uppercase; margin-bottom:.3rem; }
  .ff-card-name { font-family:var(--fontDisplay); font-size:.9rem; font-weight:600; color:var(--text); line-height:1.3; margin-bottom:.4rem; }
  .ff-card-desc { font-size:.72rem; color:var(--muted); line-height:1.5; margin-bottom:.65rem; flex:1; }
  .ff-card-specs { display:flex; flex-wrap:wrap; gap:.3rem; margin-bottom:.85rem; }
  .ff-spec-tag { font-family:var(--fontMono); font-size:.55rem; color:var(--subtle); background:var(--surface); border:1px solid var(--border); border-radius:2px; padding:2px 6px; }
  .ff-card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:auto; gap:.5rem; }
  .ff-card-price { font-family:var(--fontDisplay); font-size:1.05rem; font-weight:700; color:var(--text); }
  .ff-card-price-na { font-size:.72rem; color:var(--muted); font-family:var(--fontDisplay); }
  .ff-card-rating { font-size:.65rem; color:var(--accent); display:flex; align-items:center; gap:3px; margin-top:1px; }
  .ff-add-btn { font-family:var(--fontDisplay); font-size:.6rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:.45rem .9rem; border-radius:4px; background:var(--accent); color:#000; border:none; cursor:pointer; transition:all .2s; white-space:nowrap; }
  .ff-add-btn:hover { background:var(--accentB); box-shadow:0 0 12px var(--glow); transform:scale(1.05); }

  /* Skeleton */
  .ff-skeleton { background:linear-gradient(90deg,var(--surface) 25%,var(--surfaceH) 50%,var(--surface) 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; border-radius:4px; }
  .ff-skeleton-card { background:var(--bgCard); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .ff-skeleton-body { padding:1.1rem; display:flex; flex-direction:column; gap:.6rem; }

  /* ── CART DRAWER ─────────────────────────────────────────── */
  .ff-overlay { position:fixed; inset:0; background:rgba(0,0,0,.65); z-index:1100; backdrop-filter:blur(4px); animation:fadeIn .2s; }
  .ff-drawer { position:fixed; top:0; right:0; bottom:0; width:420px; z-index:1200; background:var(--bg2); border-left:1px solid var(--border); display:flex; flex-direction:column; animation:slideIn .3s ease; }
  .ff-drawer-header { padding:1.4rem 1.5rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .ff-drawer-title { font-family:var(--fontDisplay); font-size:.78rem; letter-spacing:.15em; text-transform:uppercase; color:var(--text); }
  .ff-drawer-sub { font-size:.65rem; color:var(--muted); margin-top:2px; }
  .ff-drawer-close { font-size:1.1rem; cursor:pointer; color:var(--muted); background:none; border:none; transition:color .2s; }
  .ff-drawer-close:hover { color:var(--text); }
  .ff-drawer-body { flex:1; overflow-y:auto; padding:1.1rem; display:flex; flex-direction:column; gap:.65rem; }
  .ff-cart-item { display:flex; gap:.85rem; align-items:center; background:var(--bgCard); border:1px solid var(--border); border-radius:8px; padding:.7rem; }
  .ff-cart-thumb { font-size:1.8rem; width:44px; text-align:center; flex-shrink:0; }
  .ff-cart-thumb img { width:44px; height:44px; object-fit:cover; border-radius:4px; }
  .ff-cart-info { flex:1; min-width:0; }
  .ff-cart-name { font-size:.76rem; font-weight:600; color:var(--text); font-family:var(--fontDisplay); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ff-cart-variant { font-size:.62rem; color:var(--muted); margin-top:1px; font-family:var(--fontMono); }
  .ff-cart-price { font-size:.82rem; color:var(--accent); font-family:var(--fontMono); margin-top:2px; }
  .ff-cart-controls { display:flex; align-items:center; gap:.4rem; flex-shrink:0; }
  .ff-qty-btn { width:24px; height:24px; border-radius:4px; border:1px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; font-size:.85rem; display:flex; align-items:center; justify-content:center; transition:all .15s; }
  .ff-qty-btn:hover { border-color:var(--accent); }
  .ff-qty-val { font-family:var(--fontMono); font-size:.75rem; min-width:18px; text-align:center; }
  .ff-cart-remove { background:none; border:none; color:var(--muted); cursor:pointer; font-size:.8rem; transition:color .2s; padding:0; }
  .ff-cart-remove:hover { color:var(--danger); }
  .ff-drawer-footer { padding:1.1rem 1.5rem; border-top:1px solid var(--border); }
  .ff-cart-summary { display:flex; flex-direction:column; gap:.4rem; margin-bottom:1rem; }
  .ff-cart-summary-row { display:flex; justify-content:space-between; }
  .ff-cart-summary-lbl { font-size:.68rem; color:var(--muted); font-family:var(--fontDisplay); }
  .ff-cart-summary-val { font-size:.75rem; color:var(--subtle); font-family:var(--fontMono); }
  .ff-cart-total-row { display:flex; justify-content:space-between; padding-top:.75rem; border-top:1px solid var(--border); }
  .ff-cart-total-lbl { font-family:var(--fontDisplay); font-size:.68rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
  .ff-cart-total-val { font-family:var(--fontDisplay); font-size:1.2rem; font-weight:700; color:var(--text); }
  .ff-checkout-btn { width:100%; margin-top:.85rem; padding:.85rem; background:var(--accent); color:#000; border:none; border-radius:5px; font-family:var(--fontDisplay); font-size:.7rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; cursor:pointer; transition:all .25s; }
  .ff-checkout-btn:hover { background:var(--accentB); box-shadow:0 0 20px var(--glow); }
  .ff-empty-state { text-align:center; padding:3.5rem 1rem; color:var(--muted); }
  .ff-empty-icon { font-size:3rem; margin-bottom:1rem; opacity:.6; }
  .ff-empty-title { font-family:var(--fontDisplay); font-size:.75rem; letter-spacing:.1em; margin-bottom:.4rem; color:var(--subtle); }
  .ff-empty-sub { font-size:.7rem; }

  /* ── TOAST ───────────────────────────────────────────────── */
  .ff-toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); z-index:2000; padding:.7rem 1.4rem; border-radius:6px; font-family:var(--fontDisplay); font-size:.65rem; letter-spacing:.08em; display:flex; align-items:center; gap:.65rem; animation:toastIn .3s ease; border:1px solid; backdrop-filter:blur(14px); white-space:nowrap; }
  .ff-toast.success { background:rgba(16,185,129,.12); border-color:var(--success); color:var(--success); }
  .ff-toast.error   { background:rgba(239,68,68,.12);  border-color:var(--danger);  color:var(--danger);  }

  /* ── AUTH MODAL ──────────────────────────────────────────── */
  .fs-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); z-index:1500; display:flex; align-items:center; justify-content:center; padding:1rem; backdrop-filter:blur(6px); animation:fadeIn .2s; }
  .fs-modal { width:100%; max-width:460px; background:var(--bgCard); border:1px solid var(--border); border-radius:12px; overflow:hidden; animation:slideUp .3s ease; position:relative; }
  .fs-modal-header { padding:1.75rem 2rem 1.25rem; border-bottom:1px solid var(--border); display:flex; align-items:flex-start; justify-content:space-between; }
  .fs-modal-icon { font-size:2rem; margin-bottom:.5rem; }
  .fs-modal-title { font-family:var(--fontDisplay); font-size:1.1rem; font-weight:700; letter-spacing:.04em; color:var(--text); }
  .fs-modal-sub { font-size:.75rem; color:var(--muted); margin-top:.3rem; }
  .fs-modal-close { background:none; border:none; color:var(--muted); cursor:pointer; font-size:1.1rem; line-height:1; transition:color .2s; padding:0; }
  .fs-modal-close:hover { color:var(--text); }
  .fs-modal-tabs { display:flex; border-bottom:1px solid var(--border); }
  .fs-modal-tab { flex:1; padding:.85rem; font-family:var(--fontDisplay); font-size:.62rem; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; color:var(--muted); background:none; border:none; transition:all .2s; position:relative; }
  .fs-modal-tab::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--accent); transform:scaleX(0); transition:transform .25s; }
  .fs-modal-tab.active { color:var(--text); }
  .fs-modal-tab.active::after { transform:scaleX(1); }
  .fs-modal-body { padding:1.75rem 2rem; display:flex; flex-direction:column; gap:1rem; }
  .fs-modal-footer { padding:0 2rem 1.75rem; text-align:center; }
  .fs-modal-footer-text { font-size:.72rem; color:var(--muted); }
  .fs-modal-footer-link { color:var(--accent); cursor:pointer; transition:color .2s; }
  .fs-modal-footer-link:hover { color:var(--accentB); }

  /* ── FORM ELEMENTS ───────────────────────────────────────── */
  .fs-field { display:flex; flex-direction:column; gap:.35rem; }
  .fs-field-row { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
  .fs-label { font-family:var(--fontMono); font-size:.58rem; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); }
  .fs-input { width:100%; padding:.7rem .9rem; background:var(--surface); border:1px solid var(--border); border-radius:6px; color:var(--text); font-family:var(--fontBody); font-size:.84rem; outline:none; transition:border-color .2s,box-shadow .2s; }
  .fs-input:focus { border-color:var(--borderH); box-shadow:0 0 8px var(--glow); }
  .fs-input.error { border-color:var(--danger); }
  .fs-input::placeholder { color:var(--muted); }
  .fs-input-error { font-size:.62rem; color:var(--danger); font-family:var(--fontMono); }
  .fs-select { width:100%; padding:.7rem .9rem; background:var(--surface); border:1px solid var(--border); border-radius:6px; color:var(--text); font-family:var(--fontBody); font-size:.84rem; outline:none; transition:border-color .2s; cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right .9rem center; padding-right:2.5rem; }
  .fs-select:focus { border-color:var(--borderH); }
  .fs-form-error { padding:.65rem .9rem; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); border-radius:6px; font-size:.72rem; color:var(--danger); font-family:var(--fontMono); display:flex; align-items:center; gap:.5rem; }
  .fs-btn-primary { font-family:var(--fontDisplay); font-size:.7rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; padding:0 1.75rem; height:48px; background:var(--accent); color:#000; border:none; border-radius:5px; cursor:pointer; transition:all .25s; position:relative; overflow:hidden; width:100%; }
  .fs-btn-primary:hover { background:var(--accentB); box-shadow:0 0 20px var(--glow); }
  .fs-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .fs-divider { display:flex; align-items:center; gap:.75rem; color:var(--muted); font-size:.62rem; font-family:var(--fontMono); letter-spacing:.1em; }
  .fs-divider::before,.fs-divider::after { content:''; flex:1; height:1px; background:var(--border); }

  /* ── WISHLIST / ORDERS ───────────────────────────────────── */
  .ff-page-header { padding:3.5rem 4rem 1.75rem; background:var(--bg2); border-bottom:1px solid var(--border); }
  .ff-page-title { font-family:var(--fontDisplay); font-size:1.8rem; font-weight:700; letter-spacing:.04em; }
  .ff-page-sub { font-size:.8rem; color:var(--muted); margin-top:.4rem; }
  .ff-order-card { background:var(--bgCard); border:1px solid var(--border); border-radius:8px; padding:1.4rem; margin-bottom:.85rem; transition:border-color .2s; }
  .ff-order-card:hover { border-color:var(--borderH); }
  .ff-order-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:.5rem; }
  .ff-order-id { font-family:var(--fontMono); font-size:.72rem; color:var(--accent); letter-spacing:.08em; }
  .ff-order-date { font-size:.65rem; color:var(--muted); margin-top:2px; }
  .ff-order-meta { display:flex; align-items:center; gap:.85rem; }
  .ff-status-badge { font-family:var(--fontDisplay); font-size:.58rem; letter-spacing:.1em; padding:4px 10px; border-radius:3px; text-transform:uppercase; }
  .ff-status-badge.processing { background:rgba(16,185,129,.12); color:var(--success); border:1px solid rgba(16,185,129,.3); }
  .ff-order-total { font-family:var(--fontDisplay); font-size:1.1rem; font-weight:700; }
  .ff-order-items { display:flex; gap:.4rem; flex-wrap:wrap; }
  .ff-order-item-tag { font-family:var(--fontMono); font-size:.6rem; color:var(--subtle); background:var(--surface); border:1px solid var(--border); border-radius:3px; padding:3px 9px; }

  /* ── FOOTER ──────────────────────────────────────────────── */
  .ff-footer { padding:4rem; border-top:1px solid var(--border); background:var(--bg2); }
  .ff-footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:3rem; margin-bottom:3rem; }
  .ff-footer-logo { font-family:var(--fontDisplay); font-size:1.25rem; font-weight:700; letter-spacing:.1em; margin-bottom:.75rem; }
  .ff-footer-tagline { font-size:.72rem; color:var(--muted); line-height:1.7; max-width:260px; }
  .ff-footer-col-title { font-family:var(--fontDisplay); font-size:.58rem; letter-spacing:.2em; text-transform:uppercase; color:var(--accent); margin-bottom:.85rem; }
  .ff-footer-link { display:block; font-size:.74rem; color:var(--muted); margin-bottom:.45rem; cursor:pointer; transition:color .2s; background:none; border:none; text-align:left; }
  .ff-footer-link:hover { color:var(--text); }
  .ff-footer-bottom { display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border); padding-top:2rem; flex-wrap:wrap; gap:1rem; }
  .ff-footer-copy { font-family:var(--fontMono); font-size:.6rem; color:var(--muted); }
  .ff-footer-socials { display:flex; gap:.6rem; }
  .ff-social { width:30px; height:30px; border-radius:6px; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:.7rem; color:var(--muted); transition:all .2s; }
  .ff-social:hover { border-color:var(--borderH); color:var(--text); background:var(--surface); }

  /* ── RESPONSIVE ──────────────────────────────────────────── */
  @media (max-width: 1024px) { .ff-footer-grid { grid-template-columns:1fr 1fr; } }
  @media (max-width: 900px) {
    .ff-shop-body { grid-template-columns:1fr; }
    .ff-shop-sidebar { display:none; }
    .ff-banner { grid-template-columns:1fr; }
    .ff-banner-visual { display:none; }
  }
  @media (max-width: 768px) {
    .ff-nav-links { display:none; }
    .ff-hero-content { padding:2rem 1.5rem; }
    .ff-section { padding:3rem 1.5rem; }
    .ff-features-strip { padding:2rem 1.5rem; }
    .ff-footer { padding:2.5rem 1.5rem; }
    .ff-footer-grid { grid-template-columns:1fr; }
    .ff-drawer { width:100%; }
    .ff-hero-stats { gap:1.5rem; }
    .ff-page-header { padding:2rem 1.5rem 1rem; }
    .ff-shop-hero { padding:2rem 1.5rem 1.5rem; }
    .ff-shop-main { padding:1rem 1.5rem; }
    .ff-fs-field-row { grid-template-columns:1fr; }
  }
`;

export default function GlobalStyles() {
  if (!injected) {
    const el = document.createElement("style");
    el.id = "fs-component-styles";
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
  return null;
}

// ── Admin CSS ─────────────────────────────────────────────────
const ADMIN_CSS = `
  .adm-shell { display:flex; min-height:100vh; padding-top:104px; background:var(--bg); }
  .adm-sidebar { width:220px; flex-shrink:0; background:var(--bgCard); border-right:1px solid var(--border); display:flex; flex-direction:column; position:fixed; top:104px; left:0; bottom:0; z-index:100; overflow-y:auto; }
  .adm-sidebar-brand { padding:1.5rem 1.25rem 1rem; border-bottom:1px solid var(--border); }
  .adm-sidebar-logo { font-family:var(--fontDisplay); font-size:.85rem; font-weight:700; letter-spacing:.2em; color:var(--text); }
  .adm-sidebar-tag { font-family:var(--fontMono); font-size:.55rem; letter-spacing:.15em; color:var(--accent); text-transform:uppercase; margin-top:.2rem; }
  .adm-nav { padding:.75rem 0; flex:1; }
  .adm-nav-item { display:flex; align-items:center; gap:.65rem; width:100%; padding:.65rem 1.25rem; background:none; border:none; cursor:pointer; font-family:var(--fontDisplay); font-size:.65rem; letter-spacing:.08em; color:var(--muted); text-transform:uppercase; transition:all .2s; position:relative; text-align:left; }
  .adm-nav-item:hover { color:var(--text); background:var(--surface); }
  .adm-nav-item.active { color:var(--accentB); background:rgba(245,197,24,.06); border-right:2px solid var(--accent); }
  .adm-nav-icon { font-size:.9rem; width:18px; text-align:center; }
  .adm-sidebar-footer { padding:1rem 1.25rem; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:.5rem; }
  .adm-user-info { display:flex; align-items:center; gap:.6rem; min-width:0; }
  .adm-user-avatar { width:28px; height:28px; border-radius:6px; background:var(--accent); color:#000; display:flex; align-items:center; justify-content:center; font-family:var(--fontDisplay); font-size:.7rem; font-weight:700; flex-shrink:0; }
  .adm-user-name { font-size:.7rem; color:var(--text); font-family:var(--fontDisplay); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .adm-user-role { font-size:.58rem; color:var(--muted); font-family:var(--fontMono); letter-spacing:.08em; }
  .adm-logout-btn { background:none; border:1px solid var(--border); border-radius:6px; color:var(--muted); cursor:pointer; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:.85rem; transition:all .2s; flex-shrink:0; }
  .adm-logout-btn:hover { border-color:var(--danger); color:var(--danger); }
  .adm-main { flex:1; margin-left:220px; min-height:calc(100vh - 104px); background:var(--bg2); }
  .adm-page { padding:2rem; max-width:1300px; }
  .adm-page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
  .adm-page-title { font-family:var(--fontDisplay); font-size:1.5rem; font-weight:700; color:var(--text); }
  .adm-page-sub { font-size:.78rem; color:var(--muted); margin-top:.3rem; }
  .adm-stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1rem; margin-bottom:1.5rem; }
  .adm-stat-card { background:var(--bgCard); border:1px solid var(--border); border-radius:8px; padding:1.25rem; transition:border-color .2s; }
  .adm-stat-card:hover { border-color:var(--borderH); }
  .adm-stat-icon { font-size:1.4rem; margin-bottom:.65rem; }
  .adm-stat-value { font-family:var(--fontDisplay); font-size:1.75rem; font-weight:700; color:var(--text); }
  .adm-stat-label { font-size:.65rem; color:var(--muted); letter-spacing:.08em; text-transform:uppercase; margin-top:.2rem; }
  .adm-stat-sub { font-size:.62rem; color:var(--subtle); margin-top:.2rem; font-family:var(--fontMono); }
  .adm-card { background:var(--bgCard); border:1px solid var(--border); border-radius:8px; margin-bottom:1.5rem; overflow:hidden; }
  .adm-card-header { display:flex; align-items:center; justify-content:space-between; padding:1.1rem 1.4rem; border-bottom:1px solid var(--border); flex-wrap:wrap; gap:.5rem; }
  .adm-card-title { font-family:var(--fontDisplay); font-size:.85rem; font-weight:600; color:var(--text); letter-spacing:.04em; }
  .adm-card-sub { font-size:.68rem; color:var(--muted); margin-top:.2rem; }
  .adm-card-body { padding:1.4rem; }
  .adm-two-col { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
  .adm-cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:.85rem; }
  .adm-cat-card { background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:.85rem; transition:border-color .2s; }
  .adm-cat-card:hover { border-color:var(--borderH); }
  .adm-cat-card-name { font-family:var(--fontDisplay); font-size:.8rem; font-weight:600; color:var(--text); margin-bottom:.2rem; }
  .adm-cat-card-slug { font-size:.62rem; color:var(--muted); margin-bottom:.5rem; }
  .adm-cat-subs { display:flex; flex-wrap:wrap; gap:.3rem; }
  .adm-btn-primary { font-family:var(--fontDisplay); font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; padding:0 1.25rem; height:38px; background:var(--accent); color:#000; border:none; border-radius:5px; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:.4rem; font-weight:700; }
  .adm-btn-primary:hover { background:var(--accentB); box-shadow:0 0 14px var(--glow); transform:translateY(-1px); }
  .adm-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
  .adm-btn-outline { font-family:var(--fontDisplay); font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; padding:0 1.25rem; height:38px; background:transparent; color:var(--text); border:1px solid var(--border); border-radius:5px; cursor:pointer; transition:all .2s; }
  .adm-btn-outline:hover { border-color:var(--borderH); background:var(--surface); }
  .adm-btn-ghost { font-family:var(--fontDisplay); font-size:.62rem; letter-spacing:.08em; background:none; border:none; color:var(--accent); cursor:pointer; transition:color .2s; padding:0; text-transform:uppercase; }
  .adm-btn-ghost:hover { color:var(--accentB); }
  .adm-form-stack { display:flex; flex-direction:column; gap:.85rem; }
  .adm-form-row { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
  .adm-field { display:flex; flex-direction:column; gap:.3rem; }
  .adm-field-row { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
  .adm-label { font-family:var(--fontMono); font-size:.58rem; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
  .adm-required { color:var(--danger); }
  .adm-hint { font-size:.6rem; color:var(--subtle); font-family:var(--fontMono); }
  .adm-field-error { font-size:.62rem; color:var(--danger); font-family:var(--fontMono); }
  .adm-input { width:100%; padding:.6rem .85rem; background:var(--surface); border:1px solid var(--border); border-radius:5px; color:var(--text); font-family:var(--fontBody); font-size:.82rem; outline:none; transition:border-color .2s,box-shadow .2s; }
  .adm-input:focus { border-color:var(--borderH); box-shadow:0 0 8px var(--glow); }
  .adm-input.error { border-color:var(--danger); }
  .adm-input::placeholder { color:var(--muted); }
  .adm-textarea { resize:vertical; min-height:80px; }
  .adm-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right .85rem center; padding-right:2.2rem; cursor:pointer; }
  .adm-toggle { width:40px; height:22px; border-radius:11px; border:none; cursor:pointer; position:relative; flex-shrink:0; transition:background .25s; }
  .adm-toggle.on { background:var(--accent); }
  .adm-toggle.off { background:var(--surface); border:1px solid var(--border); }
  .adm-toggle-knob { position:absolute; top:2px; width:18px; height:18px; border-radius:50%; background:#fff; transition:left .25s; box-shadow:0 1px 3px rgba(0,0,0,.3); }
  .adm-toggle.on .adm-toggle-knob { left:20px; }
  .adm-toggle.off .adm-toggle-knob { left:2px; }
  .adm-api-error { padding:.6rem .9rem; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); border-radius:5px; font-size:.72rem; color:var(--danger); font-family:var(--fontMono); display:flex; align-items:center; justify-content:space-between; gap:.5rem; }
  .adm-api-error-close { background:none; border:none; color:var(--danger); cursor:pointer; font-size:.85rem; }
  .adm-api-success { padding:.6rem .9rem; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.3); border-radius:5px; font-size:.72rem; color:var(--success); font-family:var(--fontMono); }
  .adm-search-bar { display:flex; align-items:center; gap:.5rem; background:var(--surface); border:1px solid var(--border); border-radius:5px; padding:0 .75rem; height:34px; min-width:220px; }
  .adm-search-bar:focus-within { border-color:var(--borderH); }
  .adm-search-input { background:none; border:none; color:var(--text); font-family:var(--fontBody); font-size:.78rem; outline:none; flex:1; }
  .adm-search-input::placeholder { color:var(--muted); }
  .adm-search-clear { color:var(--muted); cursor:pointer; font-size:.75rem; }
  .adm-table-wrap { overflow-x:auto; }
  .adm-table { width:100%; border-collapse:collapse; font-size:.76rem; }
  .adm-table th { font-family:var(--fontMono); font-size:.58rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); padding:.65rem 1rem; text-align:left; border-bottom:1px solid var(--border); white-space:nowrap; }
  .adm-table td { padding:.75rem 1rem; border-bottom:1px solid var(--border); color:var(--subtle); vertical-align:middle; }
  .adm-table tr:last-child td { border-bottom:none; }
  .adm-table tr:hover td { background:var(--surface); }
  .adm-table-name { font-family:var(--fontDisplay); font-size:.78rem; color:var(--text); font-weight:500; }
  .adm-table-sub { font-family:var(--fontMono); font-size:.6rem; color:var(--muted); margin-top:2px; }
  .adm-badge { font-family:var(--fontMono); font-size:.58rem; letter-spacing:.08em; padding:3px 8px; border-radius:3px; text-transform:uppercase; display:inline-block; }
  .adm-badge.success { background:rgba(16,185,129,.12); color:var(--success); border:1px solid rgba(16,185,129,.25); }
  .adm-badge.accent { background:rgba(245,197,24,.1); color:var(--accentB); border:1px solid rgba(245,197,24,.25); }
  .adm-badge.neutral { background:var(--surface); color:var(--subtle); border:1px solid var(--border); }
  .adm-badge-neutral { font-family:var(--fontMono); font-size:.58rem; padding:2px 7px; border-radius:3px; background:var(--surface); color:var(--subtle); border:1px solid var(--border); display:inline-block; }
  .adm-mono { font-family:var(--fontMono); font-size:.72rem; }
  .adm-muted { color:var(--muted); }
  .adm-price { font-family:var(--fontDisplay); font-size:.82rem; color:var(--text); font-weight:600; }
  .adm-link { color:var(--accent); cursor:pointer; }
  .adm-link:hover { color:var(--accentB); text-decoration:underline; }
  .adm-empty-inline { display:flex; align-items:center; gap:.65rem; color:var(--muted); font-size:.78rem; padding:1.5rem 0; }
  .adm-skeleton { background:linear-gradient(90deg,var(--surface) 25%,var(--surfaceH) 50%,var(--surface) 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; }
  .adm-skeleton-list { display:flex; flex-direction:column; gap:.6rem; }
  .adm-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:.6rem; }
  .adm-info-row { display:flex; flex-direction:column; gap:.2rem; background:var(--surface); border-radius:5px; padding:.6rem .85rem; }
  .adm-info-key { font-family:var(--fontMono); font-size:.58rem; color:var(--muted); letter-spacing:.08em; text-transform:uppercase; }
  .adm-info-val { font-size:.78rem; color:var(--text); word-break:break-all; }
  .adm-media-grid { display:flex; flex-direction:column; gap:.65rem; }
  .adm-media-card { display:flex; gap:.85rem; align-items:flex-start; background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:.75rem; }
  .adm-media-thumb { width:60px; height:60px; border-radius:5px; overflow:hidden; background:var(--bgCard); flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .adm-media-thumb img { width:100%; height:100%; object-fit:cover; }
  .adm-media-info { flex:1; min-width:0; }
  .adm-media-url { font-family:var(--fontMono); font-size:.62rem; color:var(--accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .adm-img-preview { position:relative; border-radius:6px; overflow:hidden; border:1px solid var(--border); max-height:140px; }
  .adm-img-preview img { width:100%; height:140px; object-fit:cover; display:block; }
  .adm-img-preview-lbl { position:absolute; top:6px; left:6px; background:rgba(0,0,0,.6); color:#fff; font-family:var(--fontMono); font-size:.58rem; padding:2px 7px; border-radius:3px; }
  @media (max-width:900px) { .adm-sidebar{display:none} .adm-main{margin-left:0} .adm-two-col{grid-template-columns:1fr} .adm-form-row{grid-template-columns:1fr} .adm-info-grid{grid-template-columns:1fr} }
`;

export function AdminGlobalStyles() {
  if (!adminInjected) {
    const el = document.createElement("style");
    el.id = "fs-admin-styles";
    el.textContent = ADMIN_CSS;
    document.head.appendChild(el);
    adminInjected = true;
  }
  return null;
}
