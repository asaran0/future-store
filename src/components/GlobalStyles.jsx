let injected = false;

const CSS = `
  /* ── NAV ─────────────────────────────────────────────────── */
  .fs-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: var(--navBg); backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .fs-logo {
    font-family: var(--fontDisplay); font-size: 1rem; font-weight: 700;
    letter-spacing: .15em; color: var(--text);
    display: flex; align-items: center; gap: .5rem; cursor: pointer; user-select: none;
  }
  .fs-logo-dot {
    width: 8px; height: 8px; background: var(--accent);
    border-radius: 50%; animation: pulse 2s infinite;
  }
  .fs-nav-links { display: flex; align-items: center; gap: 2rem; }
  .fs-nav-link {
    font-family: var(--fontDisplay); font-size: .62rem; letter-spacing: .15em;
    color: var(--muted); text-transform: uppercase; cursor: pointer;
    transition: color .2s; position: relative; padding: 4px 0;
  }
  .fs-nav-link::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 1px; background: var(--accent); transition: width .3s;
  }
  .fs-nav-link:hover { color: var(--text); }
  .fs-nav-link:hover::after, .fs-nav-link.active::after { width: 100%; }
  .fs-nav-link.active { color: var(--accentB); }
  .fs-nav-actions { display: flex; align-items: center; gap: .6rem; }
  .fs-icon-btn {
    width: 38px; height: 38px; border-radius: 8px;
    background: transparent; border: 1px solid var(--border);
    color: var(--subtle); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: .95rem; transition: all .2s; position: relative;
  }
  .fs-icon-btn:hover { border-color: var(--borderH); color: var(--text); background: var(--surface); box-shadow: 0 0 12px var(--glow); }
  .fs-nav-badge {
    position: absolute; top: -5px; right: -5px;
    background: var(--accent); color: #fff;
    font-size: .5rem; font-family: var(--fontMono);
    width: 15px; height: 15px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .fs-theme-selector {
    display: flex; gap: 4px; align-items: center;
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 4px;
  }
  .fs-theme-dot {
    width: 15px; height: 15px; border-radius: 3px;
    cursor: pointer; transition: transform .2s; border: 2px solid transparent;
  }
  .fs-theme-dot:hover { transform: scale(1.25); }
  .fs-theme-dot.active { border-color: var(--text); }
  .fs-user-chip {
    display: flex; align-items: center; gap: .5rem;
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 0 .75rem; height: 38px; cursor: pointer; transition: all .2s;
    font-family: var(--fontDisplay); font-size: .6rem; letter-spacing: .1em; color: var(--subtle);
  }
  .fs-user-chip:hover { border-color: var(--borderH); color: var(--text); }

  /* ── BUTTONS ─────────────────────────────────────────────── */
  .fs-btn-primary {
    font-family: var(--fontDisplay); font-size: .68rem; letter-spacing: .15em;
    text-transform: uppercase; padding: 0 1.75rem; height: 46px;
    background: var(--accent); color: #fff; border: none; border-radius: 4px;
    cursor: pointer; transition: all .25s; position: relative; overflow: hidden;
  }
  .fs-btn-primary::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
    transform: translateX(-100%); transition: transform .5s;
  }
  .fs-btn-primary:hover { box-shadow: 0 0 22px var(--glow),0 0 44px var(--glow); transform: translateY(-2px); }
  .fs-btn-primary:hover::before { transform: translateX(100%); }
  .fs-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }
  .fs-btn-outline {
    font-family: var(--fontDisplay); font-size: .68rem; letter-spacing: .15em;
    text-transform: uppercase; padding: 0 1.75rem; height: 46px;
    background: transparent; color: var(--text); border: 1px solid var(--border);
    border-radius: 4px; cursor: pointer; transition: all .25s;
  }
  .fs-btn-outline:hover { border-color: var(--borderH); background: var(--surface); }
  .fs-btn-ghost {
    font-family: var(--fontDisplay); font-size: .6rem; letter-spacing: .1em;
    text-transform: uppercase; padding: 0 1rem; height: 34px;
    background: transparent; color: var(--accent); border: none;
    cursor: pointer; transition: color .2s;
  }
  .fs-btn-ghost:hover { color: var(--accentB); }

  /* ── HERO ────────────────────────────────────────────────── */
  .fs-hero {
    min-height: 100vh; padding-top: 64px;
    background: var(--gradientHero);
    display: flex; align-items: center;
    position: relative; overflow: hidden;
  }
  .fs-hero-grid {
    position: absolute; inset: 0; opacity: .04;
    background-image:
      linear-gradient(var(--accent) 1px, transparent 1px),
      linear-gradient(90deg, var(--accent) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .fs-hero-glow {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: var(--glow); filter: blur(100px);
    right: 10%; top: 50%; transform: translateY(-50%);
    animation: breathe 4s ease-in-out infinite;
  }
  .fs-hero-content { position: relative; z-index: 1; padding: 4rem; max-width: 680px; }
  .fs-hero-eyebrow {
    font-family: var(--fontDisplay); font-size: .62rem; letter-spacing: .25em;
    color: var(--accent); text-transform: uppercase; margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: .75rem;
  }
  .fs-hero-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: var(--accent); }
  .fs-hero-title {
    font-family: var(--fontDisplay); font-size: clamp(2.5rem,6vw,5rem);
    font-weight: 900; line-height: 1.0; letter-spacing: -.02em;
    color: var(--text); margin-bottom: .25rem;
  }
  .fs-hero-title .accent-word {
    display: block; color: var(--accentB);
    text-shadow: 0 0 40px var(--glow),0 0 80px var(--glow);
  }
  .fs-hero-sub {
    font-size: .95rem; color: var(--subtle); line-height: 1.75;
    margin: 1.5rem 0 2.5rem; max-width: 460px; font-weight: 300;
  }
  .fs-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .fs-hero-stats { display: flex; gap: 3rem; margin-top: 3rem; }
  .fs-stat-val { font-family: var(--fontDisplay); font-size: 1.6rem; font-weight: 700; color: var(--accentB); }
  .fs-stat-lbl { font-size: .65rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; margin-top: 2px; }

  /* ── SECTIONS ────────────────────────────────────────────── */
  .fs-section { padding: 5rem 4rem; }
  .fs-section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 2.5rem; }
  .fs-section-eyebrow { font-family: var(--fontDisplay); font-size: .58rem; letter-spacing: .2em; color: var(--muted); text-transform: uppercase; margin-bottom: .4rem; }
  .fs-section-heading { font-family: var(--fontDisplay); font-size: 1.4rem; font-weight: 700; color: var(--text); letter-spacing: .04em; }
  .fs-see-all { font-size: .65rem; color: var(--accent); cursor: pointer; letter-spacing: .1em; font-family: var(--fontDisplay); transition: color .2s; }
  .fs-see-all:hover { color: var(--accentB); }

  /* ── FEATURES STRIP ──────────────────────────────────────── */
  .fs-features { padding: 3rem 4rem; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .fs-features-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 2rem; }
  .fs-feature { display: flex; align-items: flex-start; gap: 1rem; }
  .fs-feature-icon { font-size: 1.4rem; width: 42px; height: 42px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .fs-feature-title { font-family: var(--fontDisplay); font-size: .72rem; letter-spacing: .04em; color: var(--text); margin-bottom: .2rem; }
  .fs-feature-desc { font-size: .7rem; color: var(--muted); line-height: 1.5; }

  /* ── CATEGORY PILLS ──────────────────────────────────────── */
  .fs-cats { display: flex; gap: .65rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .fs-cat-pill {
    font-family: var(--fontDisplay); font-size: .6rem; letter-spacing: .1em;
    padding: .45rem 1.1rem; border-radius: 4px;
    border: 1px solid var(--border); background: transparent;
    color: var(--subtle); cursor: pointer; transition: all .2s; text-transform: uppercase;
    display: flex; align-items: center; gap: .4rem;
  }
  .fs-cat-pill:hover { border-color: var(--borderH); color: var(--text); background: var(--surface); }
  .fs-cat-pill.active { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: 0 0 14px var(--glow); }

  /* ── FILTER BAR ──────────────────────────────────────────── */
  .fs-filter-bar { display: flex; align-items: center; gap: .75rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .fs-search-bar {
    display: flex; align-items: center; gap: .6rem;
    background: var(--bgCard); border: 1px solid var(--border); border-radius: 4px;
    padding: 0 1rem; flex: 1; min-width: 200px; max-width: 300px; height: 38px;
  }
  .fs-search-bar:focus-within { border-color: var(--borderH); box-shadow: 0 0 10px var(--glow); }
  .fs-search-input { background: transparent; border: none; color: var(--text); font-family: var(--fontBody); font-size: .82rem; outline: none; flex: 1; }
  .fs-search-input::placeholder { color: var(--muted); }
  .fs-filter-select {
    font-family: var(--fontDisplay); font-size: .6rem; letter-spacing: .08em;
    padding: 0 .9rem; height: 38px; border-radius: 4px;
    border: 1px solid var(--border); background: var(--bgCard); color: var(--subtle);
    cursor: pointer; text-transform: uppercase; outline: none;
  }
  .fs-filter-select:focus { border-color: var(--borderH); color: var(--text); }

  /* ── PRODUCT GRID ────────────────────────────────────────── */
  .fs-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(270px,1fr)); gap: 1.25rem; }
  .fs-card {
    background: var(--bgCard); border: 1px solid var(--border); border-radius: 8px;
    overflow: hidden; cursor: pointer; transition: all .3s;
    position: relative; display: flex; flex-direction: column;
  }
  .fs-card:hover { border-color: var(--borderH); background: var(--bgCardH); transform: translateY(-4px); box-shadow: 0 18px 40px rgba(0,0,0,.4),0 0 18px var(--glow); }
  .fs-card-img {
    height: 170px; display: flex; align-items: center; justify-content: center;
    font-size: 4.5rem; background: var(--surface); position: relative; overflow: hidden;
  }
  .fs-card-img.has-url { background: var(--surface); }
  .fs-card-img.has-url img { width: 100%; height: 100%; object-fit: cover; }
  .fs-card-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg,transparent 55%,var(--bgCard)); pointer-events: none; }
  .fs-card-badge {
    position: absolute; top: 10px; left: 10px; z-index: 1;
    font-family: var(--fontMono); font-size: .55rem; letter-spacing: .08em;
    padding: 3px 7px; border-radius: 2px;
  }
  .fs-card-badge.NEW     { background: var(--accent); color: #fff; }
  .fs-card-badge.HOT     { background: var(--danger);  color: #fff; }
  .fs-card-badge.LIMITED { background: var(--warning); color: #000; }
  .fs-card-badge.SALE    { background: var(--success); color: #fff; }
  .fs-card-wish {
    position: absolute; top: 8px; right: 8px; z-index: 2;
    width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border);
    background: var(--bgCard); display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; font-size: .85rem;
  }
  .fs-card-wish:hover, .fs-card-wish.active { border-color: var(--danger); background: rgba(239,68,68,.12); }
  .fs-card-body { padding: 1.1rem; flex: 1; display: flex; flex-direction: column; }
  .fs-card-cat { font-family: var(--fontMono); font-size: .56rem; color: var(--accent); letter-spacing: .15em; text-transform: uppercase; margin-bottom: .35rem; }
  .fs-card-name { font-family: var(--fontDisplay); font-size: .9rem; font-weight: 600; color: var(--text); letter-spacing: .02em; margin-bottom: .4rem; line-height: 1.3; }
  .fs-card-desc { font-size: .74rem; color: var(--muted); line-height: 1.5; margin-bottom: .65rem; flex: 1; }
  .fs-card-specs { display: flex; gap: .35rem; flex-wrap: wrap; margin-bottom: .85rem; }
  .fs-spec-tag { font-family: var(--fontMono); font-size: .55rem; letter-spacing: .04em; color: var(--subtle); background: var(--surface); border: 1px solid var(--border); border-radius: 2px; padding: 2px 6px; }
  .fs-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; gap: .5rem; }
  .fs-card-price { font-family: var(--fontDisplay); font-size: 1.05rem; font-weight: 700; color: var(--text); }
  .fs-card-price-sub { font-size: .62rem; color: var(--muted); margin-top: 1px; }
  .fs-card-rating { font-size: .65rem; color: var(--warning); display: flex; align-items: center; gap: 3px; }
  .fs-add-btn {
    font-family: var(--fontDisplay); font-size: .58rem; letter-spacing: .08em;
    padding: .45rem .9rem; border-radius: 4px;
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    transition: all .2s; text-transform: uppercase; white-space: nowrap;
  }
  .fs-add-btn:hover { box-shadow: 0 0 14px var(--glow); transform: scale(1.04); }

  /* ── SKELETON LOADER ─────────────────────────────────────── */
  .fs-skeleton {
    background: linear-gradient(90deg, var(--surface) 25%, var(--surfaceH) 50%, var(--surface) 75%);
    background-size: 400px 100%; animation: shimmer 1.4s infinite;
    border-radius: 4px;
  }
  .fs-skeleton-card { background: var(--bgCard); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .fs-skeleton-img { height: 170px; }
  .fs-skeleton-body { padding: 1.1rem; display: flex; flex-direction: column; gap: .6rem; }

  /* ── CART DRAWER ─────────────────────────────────────────── */
  .fs-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 1100; backdrop-filter: blur(4px); animation: fadeIn .2s; }
  .fs-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: 420px; z-index: 1200;
    background: var(--bg2); border-left: 1px solid var(--border);
    display: flex; flex-direction: column; animation: slideIn .3s ease;
  }
  .fs-drawer-header { padding: 1.4rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .fs-drawer-title { font-family: var(--fontDisplay); font-size: .75rem; letter-spacing: .15em; text-transform: uppercase; color: var(--text); }
  .fs-drawer-sub { font-size: .65rem; color: var(--muted); margin-top: 2px; }
  .fs-drawer-close { font-size: 1.1rem; cursor: pointer; color: var(--muted); background: none; border: none; transition: color .2s; line-height: 1; }
  .fs-drawer-close:hover { color: var(--text); }
  .fs-drawer-body { flex: 1; overflow-y: auto; padding: 1.1rem; display: flex; flex-direction: column; gap: .65rem; }
  .fs-cart-item { display: flex; gap: .85rem; align-items: center; background: var(--bgCard); border: 1px solid var(--border); border-radius: 8px; padding: .7rem; }
  .fs-cart-thumb { font-size: 1.8rem; width: 44px; text-align: center; flex-shrink: 0; }
  .fs-cart-thumb img { width: 44px; height: 44px; object-fit: cover; border-radius: 4px; }
  .fs-cart-info { flex: 1; min-width: 0; }
  .fs-cart-name { font-size: .76rem; font-weight: 600; color: var(--text); font-family: var(--fontDisplay); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fs-cart-variant { font-size: .62rem; color: var(--muted); margin-top: 1px; font-family: var(--fontMono); }
  .fs-cart-price { font-size: .82rem; color: var(--accent); font-family: var(--fontMono); margin-top: 2px; }
  .fs-cart-controls { display: flex; align-items: center; gap: .4rem; flex-shrink: 0; }
  .fs-qty-btn { width: 24px; height: 24px; border-radius: 4px; border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer; font-size: .85rem; display: flex; align-items: center; justify-content: center; transition: all .15s; }
  .fs-qty-btn:hover { border-color: var(--accent); }
  .fs-qty-val { font-family: var(--fontMono); font-size: .75rem; min-width: 18px; text-align: center; }
  .fs-cart-remove { background: none; border: none; color: var(--muted); cursor: pointer; font-size: .8rem; transition: color .2s; padding: 0; }
  .fs-cart-remove:hover { color: var(--danger); }
  .fs-drawer-footer { padding: 1.1rem 1.5rem; border-top: 1px solid var(--border); }
  .fs-cart-summary { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1rem; }
  .fs-cart-summary-row { display: flex; justify-content: space-between; align-items: center; }
  .fs-cart-summary-lbl { font-size: .68rem; color: var(--muted); font-family: var(--fontDisplay); letter-spacing: .05em; }
  .fs-cart-summary-val { font-size: .78rem; color: var(--subtle); font-family: var(--fontMono); }
  .fs-cart-total-row { display: flex; justify-content: space-between; align-items: center; margin-top: .5rem; padding-top: .75rem; border-top: 1px solid var(--border); }
  .fs-cart-total-lbl { font-family: var(--fontDisplay); font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .fs-cart-total-val { font-family: var(--fontDisplay); font-size: 1.2rem; font-weight: 700; color: var(--text); }
  .fs-checkout-btn { width: 100%; padding: .85rem; background: var(--accent); color: #fff; border: none; border-radius: 4px; font-family: var(--fontDisplay); font-size: .68rem; letter-spacing: .15em; text-transform: uppercase; cursor: pointer; transition: all .25s; margin-top: .85rem; }
  .fs-checkout-btn:hover { box-shadow: 0 0 22px var(--glow); transform: translateY(-2px); }
  .fs-empty-state { text-align: center; padding: 3.5rem 1rem; color: var(--muted); }
  .fs-empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: .7; }
  .fs-empty-title { font-family: var(--fontDisplay); font-size: .75rem; letter-spacing: .1em; color: var(--subtle); margin-bottom: .4rem; }
  .fs-empty-sub { font-size: .7rem; color: var(--muted); }

  /* ── TOAST ───────────────────────────────────────────────── */
  .fs-toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 2000;
    padding: .7rem 1.4rem; border-radius: 6px;
    font-family: var(--fontDisplay); font-size: .65rem; letter-spacing: .08em;
    display: flex; align-items: center; gap: .65rem; animation: toastIn .3s ease;
    border: 1px solid; backdrop-filter: blur(14px); white-space: nowrap;
  }
  .fs-toast.success { background: rgba(16,185,129,.12); border-color: var(--success); color: var(--success); }
  .fs-toast.error   { background: rgba(239,68,68,.12);  border-color: var(--danger);  color: var(--danger);  }

  /* ── AUTH MODAL ──────────────────────────────────────────── */
  .fs-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.72); z-index: 1500;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    backdrop-filter: blur(6px); animation: fadeIn .2s;
  }
  .fs-modal {
    width: 100%; max-width: 460px; background: var(--bgCard);
    border: 1px solid var(--border); border-radius: 12px;
    overflow: hidden; animation: slideUp .3s ease;
    position: relative;
  }
  .fs-modal-header {
    padding: 1.75rem 2rem 1.25rem; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .fs-modal-icon { font-size: 2rem; margin-bottom: .5rem; }
  .fs-modal-title { font-family: var(--fontDisplay); font-size: 1.1rem; font-weight: 700; letter-spacing: .04em; color: var(--text); }
  .fs-modal-sub { font-size: .75rem; color: var(--muted); margin-top: .3rem; }
  .fs-modal-close { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 1.1rem; line-height: 1; transition: color .2s; padding: 0; }
  .fs-modal-close:hover { color: var(--text); }
  .fs-modal-tabs { display: flex; border-bottom: 1px solid var(--border); }
  .fs-modal-tab {
    flex: 1; padding: .85rem; font-family: var(--fontDisplay); font-size: .62rem;
    letter-spacing: .12em; text-transform: uppercase; cursor: pointer;
    color: var(--muted); background: none; border: none; transition: all .2s;
    position: relative;
  }
  .fs-modal-tab::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--accent); transform: scaleX(0); transition: transform .25s; }
  .fs-modal-tab.active { color: var(--text); }
  .fs-modal-tab.active::after { transform: scaleX(1); }
  .fs-modal-body { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
  .fs-modal-footer { padding: 0 2rem 1.75rem; text-align: center; }
  .fs-modal-footer-text { font-size: .72rem; color: var(--muted); }
  .fs-modal-footer-link { color: var(--accent); cursor: pointer; transition: color .2s; }
  .fs-modal-footer-link:hover { color: var(--accentB); }

  /* ── FORM ELEMENTS ───────────────────────────────────────── */
  .fs-field { display: flex; flex-direction: column; gap: .35rem; }
  .fs-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .fs-label { font-family: var(--fontMono); font-size: .58rem; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); }
  .fs-input {
    width: 100%; padding: .7rem .9rem; background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; color: var(--text); font-family: var(--fontBody); font-size: .84rem; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .fs-input:focus { border-color: var(--borderH); box-shadow: 0 0 10px var(--glow); }
  .fs-input.error { border-color: var(--danger); }
  .fs-input::placeholder { color: var(--muted); }
  .fs-input-error { font-size: .62rem; color: var(--danger); font-family: var(--fontMono); }
  .fs-select {
    width: 100%; padding: .7rem .9rem; background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; color: var(--text); font-family: var(--fontBody); font-size: .84rem; outline: none;
    transition: border-color .2s; cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right .9rem center;
    padding-right: 2.5rem;
  }
  .fs-select:focus { border-color: var(--borderH); }
  .fs-form-error {
    padding: .65rem .9rem; background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3);
    border-radius: 6px; font-size: .72rem; color: var(--danger); font-family: var(--fontMono);
    display: flex; align-items: center; gap: .5rem;
  }
  .fs-form-success {
    padding: .65rem .9rem; background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.3);
    border-radius: 6px; font-size: .72rem; color: var(--success); font-family: var(--fontMono);
    display: flex; align-items: center; gap: .5rem;
  }
  .fs-divider {
    display: flex; align-items: center; gap: .75rem; color: var(--muted);
    font-size: .62rem; font-family: var(--fontMono); letter-spacing: .1em;
  }
  .fs-divider::before, .fs-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ── PAGE SHELL ──────────────────────────────────────────── */
  .fs-page { min-height: 100vh; padding-top: 64px; }
  .fs-page-header { padding: 3.5rem 4rem 1.75rem; }
  .fs-page-title { font-family: var(--fontDisplay); font-size: 1.8rem; font-weight: 700; letter-spacing: .04em; }
  .fs-page-sub { font-size: .8rem; color: var(--muted); margin-top: .4rem; }

  /* ── ORDERS PAGE ─────────────────────────────────────────── */
  .fs-order-card { background: var(--bgCard); border: 1px solid var(--border); border-radius: 8px; padding: 1.4rem; margin-bottom: .85rem; transition: border-color .2s; }
  .fs-order-card:hover { border-color: var(--borderH); }
  .fs-order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: .5rem; }
  .fs-order-id { font-family: var(--fontMono); font-size: .72rem; color: var(--accent); letter-spacing: .08em; }
  .fs-order-date { font-size: .65rem; color: var(--muted); margin-top: 2px; }
  .fs-order-meta { display: flex; align-items: center; gap: .85rem; }
  .fs-status-badge { font-family: var(--fontDisplay); font-size: .58rem; letter-spacing: .1em; padding: 4px 10px; border-radius: 3px; text-transform: uppercase; }
  .fs-status-badge.processing { background: rgba(16,185,129,.12); color: var(--success); border: 1px solid rgba(16,185,129,.3); }
  .fs-status-badge.shipped    { background: rgba(14,165,233,.12); color: var(--accent2); border: 1px solid rgba(14,165,233,.3); }
  .fs-status-badge.delivered  { background: rgba(79,70,229,.12);  color: var(--accentB); border: 1px solid rgba(79,70,229,.3); }
  .fs-order-total { font-family: var(--fontDisplay); font-size: 1.1rem; font-weight: 700; color: var(--text); }
  .fs-order-items { display: flex; gap: .4rem; flex-wrap: wrap; }
  .fs-order-item-tag { font-family: var(--fontMono); font-size: .6rem; color: var(--subtle); background: var(--surface); border: 1px solid var(--border); border-radius: 3px; padding: 3px 9px; }

  /* ── FOOTER ──────────────────────────────────────────────── */
  .fs-footer { padding: 4rem; border-top: 1px solid var(--border); }
  .fs-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
  .fs-footer-logo { font-family: var(--fontDisplay); font-size: .95rem; font-weight: 700; letter-spacing: .15em; color: var(--text); margin-bottom: .65rem; }
  .fs-footer-tagline { font-size: .74rem; color: var(--muted); line-height: 1.65; max-width: 240px; }
  .fs-footer-col-title { font-family: var(--fontDisplay); font-size: .56rem; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: .85rem; }
  .fs-footer-link { display: block; font-size: .74rem; color: var(--muted); margin-bottom: .45rem; cursor: pointer; transition: color .2s; text-decoration: none; }
  .fs-footer-link:hover { color: var(--text); }
  .fs-footer-bottom { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 2rem; flex-wrap: wrap; gap: 1rem; }
  .fs-footer-copy { font-family: var(--fontMono); font-size: .6rem; color: var(--muted); letter-spacing: .04em; }
  .fs-footer-socials { display: flex; gap: .6rem; }
  .fs-social { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: .7rem; color: var(--muted); transition: all .2s; }
  .fs-social:hover { border-color: var(--borderH); color: var(--text); background: var(--surface); }

  /* ── RESPONSIVE ──────────────────────────────────────────── */
  @media (max-width: 900px) {
    .fs-footer-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .fs-nav-links { display: none; }
    .fs-hero-content { padding: 2rem 1.5rem; }
    .fs-section { padding: 3rem 1.5rem; }
    .fs-features { padding: 2rem 1.5rem; }
    .fs-footer { padding: 2.5rem 1.5rem; }
    .fs-footer-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .fs-drawer { width: 100%; }
    .fs-hero-stats { gap: 1.5rem; }
    .fs-page-header { padding: 2rem 1.5rem 1rem; }
    .fs-modal { max-width: 100%; margin: 0; border-radius: 12px 12px 0 0; align-self: flex-end; }
    .fs-modal-overlay { align-items: flex-end; }
    .fs-field-row { grid-template-columns: 1fr; }
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

// ── ADMIN CSS ─────────────────────────────────────────────────────────────────
const ADMIN_CSS = `
  /* Shell */
  .adm-shell {
    display: flex; min-height: 100vh; padding-top: 64px;
    background: var(--bg);
  }

  /* Sidebar */
  .adm-sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--bgCard); border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: fixed; top: 64px; left: 0; bottom: 0;
    z-index: 100; overflow-y: auto;
  }
  .adm-sidebar-brand {
    padding: 1.5rem 1.25rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .adm-sidebar-logo {
    font-family: var(--fontDisplay); font-size: .85rem; font-weight: 700;
    letter-spacing: .2em; color: var(--text);
  }
  .adm-sidebar-tag {
    font-family: var(--fontMono); font-size: .55rem; letter-spacing: .15em;
    color: var(--accent); text-transform: uppercase; margin-top: .2rem;
  }
  .adm-nav { padding: .75rem 0; flex: 1; }
  .adm-nav-item {
    display: flex; align-items: center; gap: .65rem;
    width: 100%; padding: .65rem 1.25rem;
    background: none; border: none; cursor: pointer;
    font-family: var(--fontDisplay); font-size: .65rem; letter-spacing: .08em;
    color: var(--muted); text-transform: uppercase;
    transition: all .2s; position: relative; text-align: left;
  }
  .adm-nav-item:hover { color: var(--text); background: var(--surface); }
  .adm-nav-item.active {
    color: var(--accentB); background: rgba(79,70,229,.08);
    border-right: 2px solid var(--accent);
  }
  .adm-nav-icon { font-size: .9rem; width: 18px; text-align: center; }
  .adm-sidebar-footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; gap: .5rem;
  }
  .adm-user-info { display: flex; align-items: center; gap: .6rem; min-width: 0; }
  .adm-user-avatar {
    width: 28px; height: 28px; border-radius: 6px;
    background: var(--accent); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--fontDisplay); font-size: .7rem; font-weight: 700; flex-shrink: 0;
  }
  .adm-user-name { font-size: .7rem; color: var(--text); font-family: var(--fontDisplay); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .adm-user-role { font-size: .58rem; color: var(--muted); font-family: var(--fontMono); letter-spacing: .08em; }
  .adm-logout-btn {
    background: none; border: 1px solid var(--border); border-radius: 6px;
    color: var(--muted); cursor: pointer; width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    font-size: .85rem; transition: all .2s; flex-shrink: 0;
  }
  .adm-logout-btn:hover { border-color: var(--danger); color: var(--danger); }

  /* Main content */
  .adm-main {
    flex: 1; margin-left: 220px; min-height: calc(100vh - 64px);
    background: var(--bg2);
  }

  /* Page container */
  .adm-page { padding: 2rem; max-width: 1300px; }
  .adm-page-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
  }
  .adm-page-title { font-family: var(--fontDisplay); font-size: 1.5rem; font-weight: 700; color: var(--text); }
  .adm-page-sub   { font-size: .78rem; color: var(--muted); margin-top: .3rem; }

  /* Stat grid */
  .adm-stats-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr));
    gap: 1rem; margin-bottom: 1.5rem;
  }
  .adm-stat-card {
    background: var(--bgCard); border: 1px solid var(--border); border-radius: 8px;
    padding: 1.25rem; transition: border-color .2s;
  }
  .adm-stat-card:hover { border-color: var(--borderH); }
  .adm-stat-icon  { font-size: 1.4rem; margin-bottom: .65rem; }
  .adm-stat-value { font-family: var(--fontDisplay); font-size: 1.75rem; font-weight: 700; color: var(--text); }
  .adm-stat-label { font-size: .65rem; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; margin-top: .2rem; }
  .adm-stat-sub   { font-size: .62rem; color: var(--subtle); margin-top: .2rem; font-family: var(--fontMono); }

  /* Cards */
  .adm-card {
    background: var(--bgCard); border: 1px solid var(--border); border-radius: 8px;
    margin-bottom: 1.5rem; overflow: hidden;
  }
  .adm-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 1.4rem; border-bottom: 1px solid var(--border);
    flex-wrap: wrap; gap: .5rem;
  }
  .adm-card-title { font-family: var(--fontDisplay); font-size: .85rem; font-weight: 600; color: var(--text); letter-spacing: .04em; }
  .adm-card-sub   { font-size: .68rem; color: var(--muted); margin-top: .2rem; }
  .adm-card-body  { padding: 1.4rem; }

  /* Two-column layout */
  .adm-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }

  /* Category overview grid */
  .adm-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: .85rem; }
  .adm-cat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 6px;
    padding: .85rem; transition: border-color .2s;
  }
  .adm-cat-card:hover { border-color: var(--borderH); }
  .adm-cat-card-name { font-family: var(--fontDisplay); font-size: .8rem; font-weight: 600; color: var(--text); margin-bottom: .2rem; }
  .adm-cat-card-slug { font-size: .62rem; color: var(--muted); margin-bottom: .5rem; }
  .adm-cat-subs { display: flex; flex-wrap: wrap; gap: .3rem; }

  /* Buttons */
  .adm-btn-primary {
    font-family: var(--fontDisplay); font-size: .65rem; letter-spacing: .1em;
    text-transform: uppercase; padding: 0 1.25rem; height: 38px;
    background: var(--accent); color: #fff; border: none; border-radius: 5px;
    cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: .4rem;
  }
  .adm-btn-primary:hover   { box-shadow: 0 0 16px var(--glow); transform: translateY(-1px); }
  .adm-btn-primary:disabled{ opacity: .5; cursor: not-allowed; transform: none; }
  .adm-btn-outline {
    font-family: var(--fontDisplay); font-size: .65rem; letter-spacing: .1em;
    text-transform: uppercase; padding: 0 1.25rem; height: 38px;
    background: transparent; color: var(--text); border: 1px solid var(--border);
    border-radius: 5px; cursor: pointer; transition: all .2s;
  }
  .adm-btn-outline:hover { border-color: var(--borderH); background: var(--surface); }
  .adm-btn-ghost {
    font-family: var(--fontDisplay); font-size: .62rem; letter-spacing: .08em;
    background: none; border: none; color: var(--accent); cursor: pointer;
    transition: color .2s; padding: 0; text-transform: uppercase;
  }
  .adm-btn-ghost:hover { color: var(--accentB); }
  .adm-btn-danger {
    font-family: var(--fontDisplay); font-size: .62rem; letter-spacing: .08em;
    padding: 0 .85rem; height: 32px; background: rgba(239,68,68,.1);
    border: 1px solid rgba(239,68,68,.3); color: var(--danger);
    border-radius: 4px; cursor: pointer; transition: all .2s;
  }
  .adm-btn-danger:hover { background: rgba(239,68,68,.2); }

  /* Forms */
  .adm-form-stack  { display: flex; flex-direction: column; gap: .85rem; }
  .adm-form-row    { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .adm-field       { display: flex; flex-direction: column; gap: .3rem; }
  .adm-field-row   { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .adm-label       { font-family: var(--fontMono); font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .adm-required    { color: var(--danger); }
  .adm-hint        { font-size: .6rem; color: var(--subtle); font-family: var(--fontMono); }
  .adm-field-error { font-size: .62rem; color: var(--danger); font-family: var(--fontMono); }
  .adm-input {
    width: 100%; padding: .6rem .85rem; background: var(--surface);
    border: 1px solid var(--border); border-radius: 5px;
    color: var(--text); font-family: var(--fontBody); font-size: .82rem; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .adm-input:focus { border-color: var(--borderH); box-shadow: 0 0 8px var(--glow); }
  .adm-input.error { border-color: var(--danger); }
  .adm-input::placeholder { color: var(--muted); }
  .adm-textarea { resize: vertical; min-height: 80px; }
  .adm-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right .85rem center;
    padding-right: 2.2rem; cursor: pointer;
  }

  /* Toggle switch */
  .adm-toggle {
    width: 40px; height: 22px; border-radius: 11px;
    border: none; cursor: pointer; position: relative; flex-shrink: 0;
    transition: background .25s;
  }
  .adm-toggle.on  { background: var(--accent); }
  .adm-toggle.off { background: var(--surface); border: 1px solid var(--border); }
  .adm-toggle-knob {
    position: absolute; top: 2px; width: 18px; height: 18px;
    border-radius: 50%; background: #fff; transition: left .25s;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  .adm-toggle.on  .adm-toggle-knob { left: 20px; }
  .adm-toggle.off .adm-toggle-knob { left: 2px; }

  /* API banners */
  .adm-api-error {
    padding: .6rem .9rem; background: rgba(239,68,68,.1);
    border: 1px solid rgba(239,68,68,.3); border-radius: 5px;
    font-size: .72rem; color: var(--danger); font-family: var(--fontMono);
    display: flex; align-items: center; justify-content: space-between; gap: .5rem;
  }
  .adm-api-error-close { background: none; border: none; color: var(--danger); cursor: pointer; font-size: .85rem; }
  .adm-api-success {
    padding: .6rem .9rem; background: rgba(16,185,129,.1);
    border: 1px solid rgba(16,185,129,.3); border-radius: 5px;
    font-size: .72rem; color: var(--success); font-family: var(--fontMono);
  }

  /* Search bar */
  .adm-search-bar {
    display: flex; align-items: center; gap: .5rem;
    background: var(--surface); border: 1px solid var(--border); border-radius: 5px;
    padding: 0 .75rem; height: 34px; min-width: 220px;
  }
  .adm-search-bar:focus-within { border-color: var(--borderH); }
  .adm-search-input { background: none; border: none; color: var(--text); font-family: var(--fontBody); font-size: .78rem; outline: none; flex: 1; }
  .adm-search-input::placeholder { color: var(--muted); }
  .adm-search-clear { color: var(--muted); cursor: pointer; font-size: .75rem; }
  .adm-search-clear:hover { color: var(--text); }

  /* Table */
  .adm-table-wrap { overflow-x: auto; }
  .adm-table { width: 100%; border-collapse: collapse; font-size: .76rem; }
  .adm-table th {
    font-family: var(--fontMono); font-size: .58rem; letter-spacing: .1em;
    text-transform: uppercase; color: var(--muted);
    padding: .65rem 1rem; text-align: left;
    border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  .adm-table td {
    padding: .75rem 1rem; border-bottom: 1px solid var(--border);
    color: var(--subtle); vertical-align: middle;
  }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: var(--surface); }
  .adm-table-name { font-family: var(--fontDisplay); font-size: .78rem; color: var(--text); font-weight: 500; }
  .adm-table-sub  { font-family: var(--fontMono); font-size: .6rem; color: var(--muted); margin-top: 2px; }

  /* Badges */
  .adm-badge        { font-family: var(--fontMono); font-size: .58rem; letter-spacing: .08em; padding: 3px 8px; border-radius: 3px; text-transform: uppercase; display: inline-block; }
  .adm-badge.success{ background: rgba(16,185,129,.12); color: var(--success); border: 1px solid rgba(16,185,129,.25); }
  .adm-badge.accent { background: rgba(79,70,229,.12);  color: var(--accentB); border: 1px solid rgba(79,70,229,.25); }
  .adm-badge.neutral{ background: var(--surface); color: var(--subtle); border: 1px solid var(--border); }
  .adm-badge-neutral{ font-family: var(--fontMono); font-size: .58rem; padding: 2px 7px; border-radius: 3px; background: var(--surface); color: var(--subtle); border: 1px solid var(--border); display: inline-block; }

  /* Utilities */
  .adm-mono   { font-family: var(--fontMono); font-size: .72rem; }
  .adm-muted  { color: var(--muted); }
  .adm-price  { font-family: var(--fontDisplay); font-size: .82rem; color: var(--text); font-weight: 600; }
  .adm-link   { color: var(--accent); cursor: pointer; }
  .adm-link:hover { color: var(--accentB); text-decoration: underline; }
  .adm-empty-inline { display: flex; align-items: center; gap: .65rem; color: var(--muted); font-size: .78rem; padding: 1.5rem 0; }

  /* Skeleton */
  .adm-skeleton { background: linear-gradient(90deg,var(--surface) 25%,var(--surfaceH) 50%,var(--surface) 75%); background-size: 400px 100%; animation: shimmer 1.4s infinite; }
  .adm-skeleton-list { display: flex; flex-direction: column; gap: .6rem; }

  /* Product info grid */
  .adm-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
  .adm-info-row  { display: flex; flex-direction: column; gap: .2rem; background: var(--surface); border-radius: 5px; padding: .6rem .85rem; }
  .adm-info-key  { font-family: var(--fontMono); font-size: .58rem; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; }
  .adm-info-val  { font-size: .78rem; color: var(--text); word-break: break-all; }

  /* Media grid */
  .adm-media-grid { display: flex; flex-direction: column; gap: .65rem; }
  .adm-media-card { display: flex; gap: .85rem; align-items: flex-start; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: .75rem; }
  .adm-media-thumb { width: 60px; height: 60px; border-radius: 5px; overflow: hidden; background: var(--bgCard); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .adm-media-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .adm-media-info { flex: 1; min-width: 0; }
  .adm-media-url  { font-family: var(--fontMono); font-size: .62rem; color: var(--accent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* Image preview in media form */
  .adm-img-preview { position: relative; border-radius: 6px; overflow: hidden; border: 1px solid var(--border); max-height: 140px; }
  .adm-img-preview img { width: 100%; height: 140px; object-fit: cover; display: block; }
  .adm-img-preview-lbl { position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,.6); color: #fff; font-family: var(--fontMono); font-size: .58rem; padding: 2px 7px; border-radius: 3px; }

  /* Responsive */
  @media (max-width: 900px) {
    .adm-sidebar  { display: none; }
    .adm-main     { margin-left: 0; }
    .adm-two-col  { grid-template-columns: 1fr; }
    .adm-form-row { grid-template-columns: 1fr; }
    .adm-info-grid{ grid-template-columns: 1fr; }
  }
`;

let adminInjected = false;

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
