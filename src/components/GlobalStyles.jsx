let injected = false;
let adminInjected = false;

const CSS = `
  /* ── ANN BAR ─────────────────────────────────────────────── */
  .ff-ann-bar{position:fixed;top:0;left:0;right:0;z-index:1001;background:var(--annBar);color:var(--annBarText);height:30px;display:flex;align-items:center;justify-content:center;font-family:var(--fontDisplay);font-size:.58rem;font-weight:600;letter-spacing:.14em}
  .ff-ann-link{cursor:pointer;text-decoration:underline;margin-left:.5rem;opacity:.85}
  .ff-ann-link:hover{opacity:1}

  /* ── NAV — transparent, minimal, exactly like reference ──── */
  .ff-nav{position:fixed;top:30px;left:0;right:0;z-index:1000;background:transparent;padding:0 3rem;height:62px;display:flex;align-items:center;justify-content:space-between;gap:1.5rem}
  /* Thin bottom line only on scroll — done via JS-free approach */
  .ff-logo{display:flex;align-items:center;gap:0;cursor:pointer;flex-shrink:0}
  .ff-logo-fox{font-family:var(--fontDisplay);font-size:.92rem;font-weight:300;letter-spacing:.22em;color:var(--text);text-transform:uppercase}
  .ff-logo-fury{font-family:var(--fontDisplay);font-size:.92rem;font-weight:700;letter-spacing:.22em;color:var(--text);text-transform:uppercase}

  .ff-nav-links{display:flex;align-items:center;gap:0;flex:1;justify-content:center}
  .ff-nav-item-wrap{position:relative}
  /* Nav links: thin Rajdhani, very wide spacing, muted — exactly like reference */
  .ff-nav-link{font-family:var(--fontDisplay);font-size:.62rem;font-weight:400;letter-spacing:.18em;color:rgba(255,255,255,0.45);text-transform:uppercase;background:none;border:none;cursor:pointer;padding:.5rem 1.1rem;transition:color .2s;position:relative;display:flex;align-items:center;gap:.3rem;white-space:nowrap}
  .ff-nav-link::after{content:'';position:absolute;bottom:-1px;left:1.1rem;right:1.1rem;height:1px;background:var(--accent);transform:scaleX(0);transition:transform .25s;transform-origin:left}
  .ff-nav-link:hover{color:rgba(255,255,255,0.9)}
  .ff-nav-link:hover::after,.ff-nav-link.active::after{transform:scaleX(1)}
  .ff-nav-link.active{color:rgba(255,255,255,0.95)}
  .ff-nav-caret{font-size:.42rem;opacity:.4}

  /* Active nav indicator dot — blue pixel like reference */
  .ff-nav-link.active{position:relative}
  .ff-nav-link.active::before{content:'';position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:3px;height:3px;border-radius:50%;background:var(--accent)}

  .ff-dropdown{position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);background:rgba(11,11,20,.96);border:1px solid var(--border);border-radius:4px;padding:.35rem;min-width:230px;z-index:2000;box-shadow:0 24px 60px rgba(0,0,0,.8);animation:slideDown .18s ease;backdrop-filter:blur(20px)}
  .ff-dropdown-item{display:flex;align-items:center;gap:.65rem;padding:.5rem .75rem;border-radius:3px;border:none;background:transparent;color:rgba(255,255,255,.7);cursor:pointer;width:100%;text-align:left;transition:all .15s}
  .ff-dropdown-item:hover{background:rgba(255,255,255,.05);color:#fff}
  .ff-dropdown-icon{font-size:.95rem;flex-shrink:0;width:20px;text-align:center}
  .ff-dropdown-label{font-family:var(--fontDisplay);font-size:.68rem;font-weight:600;letter-spacing:.06em}
  .ff-dropdown-desc{font-size:.58rem;color:rgba(255,255,255,.35);margin-top:1px}

  .ff-nav-actions{display:flex;align-items:center;gap:.5rem;flex-shrink:0}
  .ff-icon-btn{width:34px;height:34px;border-radius:4px;background:transparent;border:1px solid var(--border);color:rgba(255,255,255,.4);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;transition:all .2s;position:relative}
  .ff-icon-btn:hover,.ff-icon-btn.active{border-color:var(--borderH);color:#fff;background:rgba(255,255,255,.05)}
  .ff-nav-badge{position:absolute;top:-5px;right:-5px;background:var(--accent);color:#fff;font-size:.46rem;font-family:var(--fontMono);width:13px;height:13px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700}
  .ff-theme-selector{display:flex;gap:3px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:4px;padding:4px}
  .ff-theme-dot{width:13px;height:13px;border-radius:2px;cursor:pointer;transition:transform .2s;border:2px solid rgba(255,255,255,.12)}
  .ff-theme-dot:hover{transform:scale(1.3)}
  .ff-theme-dot.active{border-color:rgba(255,255,255,.8)}
  .ff-user-chip{display:flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:4px;padding:0 .7rem;height:34px;cursor:pointer;transition:all .2s;font-family:var(--fontDisplay);font-size:.56rem;letter-spacing:.08em;color:rgba(255,255,255,.5)}
  .ff-user-chip:hover{border-color:var(--borderH);color:#fff}
  .ff-btn-ghost-nav{font-family:var(--fontDisplay);font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;background:none;border:none;color:rgba(255,255,255,.45);cursor:pointer;padding:.4rem .7rem;transition:color .2s}
  .ff-btn-ghost-nav:hover{color:#fff}
  .ff-btn-outline-nav{font-family:var(--fontDisplay);font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;background:none;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.7);cursor:pointer;padding:.4rem .9rem;height:32px;border-radius:2px;transition:all .2s}
  .ff-btn-outline-nav:hover{border-color:rgba(255,255,255,.6);color:#fff}

  /* ── PAGE SHELL ──────────────────────────────────────────── */
  .ff-page{min-height:100vh;padding-top:92px}

  /* ════════════════════════════════════════════════════════════
     HERO — Exact match to reference image
     Full-height, split layout, vertical grid lines, robot area
     ════════════════════════════════════════════════════════════ */
  .njey-hero{
    position:relative;width:100%;height:calc(100vh - 92px);min-height:600px;
    background:var(--gradientHero);overflow:hidden;
    display:flex;align-items:center;
  }

  /* Vertical grid lines — the signature design element */
  .njey-grid-lines{position:absolute;inset:0;display:flex;pointer-events:none;z-index:1}
  .njey-vline{flex:1;border-right:1px solid rgba(255,255,255,0.032)}
  .njey-vline:last-child{border-right:none}

  /* Right robot area — atmospheric glow, takes ~50% right */
  .njey-robot-area{
    position:absolute;right:0;top:0;bottom:0;width:52%;
    pointer-events:none;z-index:2;
    /* Dark vignette on left edge so content stays readable */
    background:linear-gradient(90deg,var(--bg) 0%,transparent 35%);
  }
  /* Main glow: the warm light behind the robot */
  .njey-robot-glow{
    position:absolute;right:-4%;top:50%;transform:translateY(-50%);
    width:520px;height:520px;border-radius:50%;
    background:radial-gradient(circle,rgba(40,45,80,.9) 0%,rgba(20,22,48,.5) 40%,transparent 70%);
    filter:blur(60px);animation:heroGlow 5s ease-in-out infinite;
  }
  /* Secondary inner glow */
  .njey-robot-glow-2{
    position:absolute;right:15%;top:45%;transform:translateY(-50%);
    width:260px;height:380px;border-radius:50%;
    background:radial-gradient(ellipse,rgba(60,70,120,.4) 0%,transparent 70%);
    filter:blur(40px);
  }
  /* Robot silhouette — CSS-only dark humanoid shape */
  .njey-robot-silhouette{
    position:absolute;right:8%;top:50%;transform:translateY(-50%);
    width:340px;height:460px;
    background:radial-gradient(ellipse at 50% 35%,rgba(25,28,55,.95) 0%,rgba(8,8,18,.98) 65%,transparent 100%);
    border-radius:48% 48% 40% 40% / 55% 55% 45% 45%;
    box-shadow:0 0 80px rgba(30,35,80,.6),inset 0 -40px 80px rgba(0,0,0,.6);
    /* Helmet visor highlight */
    overflow:hidden;
  }
  .njey-robot-silhouette::before{
    content:'';position:absolute;top:18%;left:28%;width:44%;height:28%;
    background:radial-gradient(ellipse,rgba(60,80,160,.3) 0%,transparent 70%);
    border-radius:50%;filter:blur(8px);
  }
  .njey-robot-silhouette::after{
    content:'';position:absolute;top:0;left:0;right:0;bottom:0;
    background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.4) 70%,rgba(0,0,0,.8) 100%);
  }

  /* Floating labels: ARTIFICIAL INTELLIGENCE / NO EMOTION */
  .njey-float-label{
    position:absolute;font-family:var(--fontDisplay);font-size:.48rem;
    letter-spacing:.22em;color:rgba(255,255,255,.3);text-transform:uppercase;
    white-space:nowrap;
  }
  .njey-label-top{top:28%;right:4%}
  .njey-label-bot{bottom:32%;right:20%}

  /* Left 3 vertical dots */
  .njey-ldots{position:absolute;left:1.6rem;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:.45rem;z-index:5}
  .njey-ldot{width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.18)}
  .njey-ldot-active{background:var(--accent);box-shadow:0 0 6px var(--accent)}

  /* Hero content — left panel */
  .njey-hero-content{
    position:relative;z-index:6;padding:0 0 0 4rem;
    max-width:56%;animation:slideUp .5s ease;
  }

  /* Eyebrow: HERE AND NOW with blue accent block */
  .njey-eyebrow{display:flex;align-items:center;gap:0;margin-bottom:.5rem}
  /* The blue square block behind "H" */
  .njey-eyebrow-accent{
    display:inline-block;width:22px;height:22px;
    background:var(--accent);flex-shrink:0;margin-right:.55rem;
  }
  .njey-eyebrow-text{
    font-family:var(--fontDisplay);font-size:.75rem;font-weight:400;
    letter-spacing:.22em;color:rgba(255,255,255,.9);text-transform:uppercase;
  }

  /* Giant FUTURE title */
  .njey-title{
    font-family:var(--fontDisplay);
    font-size:clamp(4rem,9.5vw,8.5rem);
    font-weight:700;line-height:.92;letter-spacing:.04em;
    color:#fff;margin:0;
    display:flex;align-items:baseline;
  }
  /* The first letter gets a blue accent block behind it */
  .njey-title-firstletter{
    position:relative;display:inline-block;
    color:#fff;
  }
  .njey-title-firstletter::before{
    content:'';position:absolute;
    left:0;top:.06em;width:.55em;bottom:.06em;
    background:var(--accent);z-index:-1;
  }
  .njey-title-rest{display:inline-block;letter-spacing:.06em}

  /* Paragraph with left border — exactly like reference */
  .njey-para-wrap{
    display:flex;align-items:flex-start;gap:.8rem;
    margin:1.6rem 0 2.2rem;max-width:360px;
  }
  .njey-para-border{width:2px;min-height:44px;background:var(--accent);flex-shrink:0;margin-top:.1rem}
  .njey-para{font-family:var(--fontBody);font-size:.78rem;color:rgba(255,255,255,.45);line-height:1.75;font-weight:300}

  /* CTA: "LET'S GO" — outlined, no fill, exactly like reference */
  .njey-cta{
    font-family:var(--fontDisplay);font-size:.65rem;font-weight:600;
    letter-spacing:.22em;text-transform:uppercase;
    padding:.75rem 2.2rem;background:transparent;
    border:1px solid rgba(255,255,255,.35);color:rgba(255,255,255,.85);
    cursor:pointer;transition:all .25s;display:inline-block;margin-top:.25rem;
  }
  .njey-cta:hover{border-color:rgba(255,255,255,.85);color:#fff;background:rgba(255,255,255,.04)}

  /* Slide indicator dots */
  .njey-slide-dots{position:absolute;bottom:2rem;left:4rem;display:flex;gap:.5rem;z-index:6}
  .njey-slide-dot{width:5px;height:5px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:transparent;cursor:pointer;padding:0;transition:all .25s}
  .njey-slide-dot.active{background:var(--accent);border-color:var(--accent);width:18px;border-radius:3px}

  /* Social rail — right edge: Vk Tw Fb In Be */
  .njey-socials{
    position:absolute;right:0;top:50%;transform:translateY(-50%);z-index:7;
    display:flex;flex-direction:column;gap:.85rem;
    padding:.7rem .55rem;
    border-left:1px solid rgba(255,255,255,.06);
    background:rgba(11,11,20,.3);
  }
  .njey-social{font-family:var(--fontDisplay);font-size:.55rem;letter-spacing:.08em;color:rgba(255,255,255,.35);cursor:pointer;transition:color .2s;text-align:center;font-weight:400}
  .njey-social:hover{color:rgba(255,255,255,.85)}

  /* Bottom info cards: TECHNOLOGY / INNOVATION — dark glassmorphism */
  .njey-bottom-cards{
    position:absolute;bottom:0;right:2.5rem;display:flex;z-index:6;
  }
  .njey-bottom-card{
    width:215px;padding:1.1rem 1.35rem;
    background:rgba(11,11,20,.82);backdrop-filter:blur(16px);
    border-top:1px solid rgba(255,255,255,.07);
    border-left:1px solid rgba(255,255,255,.05);
  }
  .njey-bottom-card:first-child{border-left:none}
  .njey-bottom-card-title{font-family:var(--fontDisplay);font-size:.72rem;font-weight:700;letter-spacing:.12em;color:#fff;margin-bottom:.45rem;text-transform:uppercase}
  .njey-bottom-card-desc{font-size:.62rem;color:rgba(255,255,255,.35);line-height:1.6}

  /* ── SHARED SECTION STYLES ───────────────────────────────── */
  .ff-section{padding:5rem 4rem}
  .ff-section-dark{background:var(--bg2)}
  .ff-section-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:2.5rem;flex-wrap:wrap;gap:1rem}
  .ff-section-eyebrow{font-family:var(--fontDisplay);font-size:.54rem;letter-spacing:.24em;color:var(--accent);text-transform:uppercase;margin-bottom:.4rem}
  .ff-section-heading{font-family:var(--fontDisplay);font-size:1.4rem;font-weight:700;color:var(--text);letter-spacing:.08em}
  .ff-see-all{font-family:var(--fontDisplay);font-size:.6rem;color:var(--accent);cursor:pointer;letter-spacing:.12em;text-transform:uppercase;background:none;border:none;transition:color .2s}
  .ff-see-all:hover{color:var(--accentB)}

  /* API status banners */
  .ff-api-error-banner{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:3px;padding:.75rem 1.1rem;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-family:var(--fontMono);font-size:.66rem;color:var(--danger)}
  .ff-api-warning-banner{background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.22);border-radius:3px;padding:.7rem 1.1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-family:var(--fontMono);font-size:.66rem;color:var(--warning)}

  /* Buttons */
  .ff-btn-primary{font-family:var(--fontDisplay);font-size:.64rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:0 2rem;height:44px;background:var(--accent);color:#fff;border:none;cursor:pointer;transition:all .25s}
  .ff-btn-primary:hover{opacity:.88;transform:translateY(-1px)}
  .ff-btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
  .ff-btn-outline{font-family:var(--fontDisplay);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;padding:0 1.8rem;height:44px;background:transparent;color:var(--text);border:1px solid rgba(255,255,255,.22);cursor:pointer;transition:all .25s}
  .ff-btn-outline:hover{border-color:rgba(255,255,255,.7);background:rgba(255,255,255,.03)}
  .ff-btn-sm{font-family:var(--fontDisplay);font-size:.56rem;letter-spacing:.1em;text-transform:uppercase;padding:0 .9rem;height:30px;background:transparent;color:var(--text);border:1px solid var(--border);cursor:pointer;transition:all .2s;border-radius:2px}
  .ff-btn-sm:hover{border-color:var(--borderH)}
  .ff-btn-accent-sm{font-family:var(--fontDisplay);font-size:.56rem;letter-spacing:.1em;text-transform:uppercase;padding:0 .9rem;height:30px;background:var(--accent);color:#fff;border:none;cursor:pointer;transition:all .2s;font-weight:700;border-radius:2px}
  .ff-btn-accent-sm:hover{opacity:.85}

  /* ── INDUSTRY GRID ───────────────────────────────────────── */
  .ff-industry-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:1px;background:var(--border)}
  .ff-industry-card{background:var(--bgCard);padding:1.65rem;cursor:pointer;transition:all .22s;text-align:left;display:flex;flex-direction:column;gap:.55rem;border:none}
  .ff-industry-card:hover{background:var(--bgCardH)}
  .ff-industry-icon{font-size:1.65rem;margin-bottom:.2rem}
  .ff-industry-label{font-family:var(--fontDisplay);font-size:.82rem;font-weight:700;color:var(--text);letter-spacing:.07em}
  .ff-industry-desc{font-size:.68rem;color:var(--muted);line-height:1.58;flex:1}
  .ff-industry-cta{font-family:var(--fontDisplay);font-size:.56rem;letter-spacing:.16em;color:var(--accent);margin-top:.4rem}

  /* Features strip */
  .ff-features-strip{padding:2.5rem 4rem;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg2);display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem}
  .ff-feature{display:flex;align-items:flex-start;gap:.85rem}
  .ff-feature-icon{font-size:1.25rem;width:38px;height:38px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .ff-feature-title{font-family:var(--fontDisplay);font-size:.68rem;font-weight:600;color:var(--text);margin-bottom:.18rem;letter-spacing:.05em}
  .ff-feature-desc{font-size:.64rem;color:var(--muted);line-height:1.55}

  /* Banner */
  .ff-banner{padding:5rem 4rem;background:var(--bg);position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;border-top:1px solid var(--border)}
  .ff-banner-glow{position:absolute;right:0;top:50%;transform:translateY(-50%);width:500px;height:500px;border-radius:50%;background:var(--glow);filter:blur(100px);opacity:.35}
  .ff-banner-eyebrow{font-family:var(--fontDisplay);font-size:.54rem;letter-spacing:.26em;color:var(--accent);text-transform:uppercase;margin-bottom:.7rem}
  .ff-banner-title{font-family:var(--fontDisplay);font-size:clamp(1.4rem,2.8vw,2.2rem);font-weight:700;color:var(--text);margin-bottom:1rem;letter-spacing:.06em}
  .ff-banner-sub{font-size:.8rem;color:var(--subtle);line-height:1.72;margin-bottom:1.5rem;max-width:440px}
  .ff-banner-specs{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:2rem}
  .ff-banner-spec{font-family:var(--fontMono);font-size:.6rem;color:var(--accentB);background:rgba(61,90,241,.07);border:1px solid rgba(61,90,241,.18);padding:3px 9px}
  .ff-banner-visual{position:relative;display:flex;align-items:center;justify-content:center;height:280px}
  .ff-banner-emoji{font-size:5.5rem;z-index:1;filter:drop-shadow(0 0 28px var(--accent));animation:heroGlow 3.5s ease-in-out infinite}
  .ff-banner-ring{position:absolute;border-radius:50%;border:1px solid var(--borderH);animation:pulse 3.5s ease-in-out infinite}
  .ff-banner-ring-1{width:150px;height:150px;animation-delay:0s}
  .ff-banner-ring-2{width:230px;height:230px;animation-delay:.6s}
  .ff-banner-ring-3{width:310px;height:310px;animation-delay:1.2s}

  /* Testimonials */
  .ff-testimonial-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(265px,1fr));gap:1px;background:var(--border)}
  .ff-testimonial-card{background:var(--bgCard);padding:1.65rem;display:flex;flex-direction:column}
  .ff-testimonial-card:hover{background:var(--bgCardH)}
  .ff-testimonial-stars{color:var(--accent);font-size:.88rem;margin-bottom:.7rem;letter-spacing:.1em}
  .ff-testimonial-text{font-size:.74rem;color:var(--subtle);line-height:1.78;font-style:italic;margin-bottom:1.2rem;flex:1}
  .ff-testimonial-footer{display:flex;align-items:center;gap:.65rem}
  .ff-testimonial-avatar{width:32px;height:32px;background:var(--accent);color:#fff;font-family:var(--fontDisplay);font-weight:700;font-size:.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .ff-testimonial-role{font-family:var(--fontDisplay);font-size:.66rem;font-weight:600;color:var(--text)}
  .ff-testimonial-dept{font-size:.58rem;color:var(--muted);margin-top:1px}
  .ff-testimonial-product{font-family:var(--fontMono);font-size:.54rem;color:var(--accent);margin-top:3px}

  /* Shop page */
  .ff-shop-hero{padding:3rem 4rem 2rem;background:var(--bg2);border-bottom:1px solid var(--border)}
  .ff-shop-title{font-family:var(--fontDisplay);font-size:1.65rem;font-weight:700;color:var(--text);margin-top:.35rem;letter-spacing:.06em}
  .ff-shop-sub{font-size:.78rem;color:var(--muted);margin-top:.45rem;max-width:500px;line-height:1.6}
  .ff-shop-body{display:grid;grid-template-columns:205px 1fr;min-height:calc(100vh - 200px)}
  .ff-shop-sidebar{background:var(--bgCard);border-right:1px solid var(--border);padding:1.4rem .8rem;position:sticky;top:92px;height:calc(100vh - 92px);overflow-y:auto}
  .ff-sidebar-section{margin-bottom:1.75rem}
  .ff-sidebar-title{font-family:var(--fontDisplay);font-size:.5rem;letter-spacing:.22em;color:var(--accent);text-transform:uppercase;margin-bottom:.6rem;padding:0 .3rem}
  .ff-sidebar-item{display:flex;align-items:center;gap:.45rem;width:100%;padding:.48rem .55rem;background:none;border:none;border-left:2px solid transparent;cursor:pointer;font-family:var(--fontDisplay);font-size:.58rem;letter-spacing:.07em;color:var(--muted);text-align:left;transition:all .15s;text-transform:uppercase}
  .ff-sidebar-item:hover{color:var(--text);background:var(--surface);border-left-color:var(--border)}
  .ff-sidebar-item.active{color:var(--accentB);background:rgba(61,90,241,.07);border-left-color:var(--accent)}
  .ff-shop-main{padding:1.65rem 2.4rem}
  .ff-filter-bar{display:flex;align-items:center;gap:.65rem;margin-bottom:1.65rem;flex-wrap:wrap}
  .ff-search-bar{display:flex;align-items:center;gap:.45rem;background:var(--bgCard);border:1px solid var(--border);padding:0 .82rem;flex:1;min-width:200px;max-width:310px;height:36px}
  .ff-search-bar:focus-within{border-color:var(--borderH)}
  .ff-search-input{background:none;border:none;color:var(--text);font-family:var(--fontBody);font-size:.78rem;outline:none;flex:1}
  .ff-search-input::placeholder{color:var(--muted)}
  .ff-search-clear{color:var(--muted);cursor:pointer;font-size:.72rem}
  .ff-search-clear:hover{color:var(--text)}
  .ff-filter-select{font-family:var(--fontDisplay);font-size:.56rem;letter-spacing:.09em;padding:0 .82rem;height:36px;border:1px solid var(--border);background:var(--bgCard);color:var(--subtle);cursor:pointer;text-transform:uppercase;outline:none}
  .ff-filter-select:focus{border-color:var(--borderH)}
  .ff-result-count{font-family:var(--fontMono);font-size:.6rem;color:var(--muted);margin-left:auto}
  .ff-empty-grid{grid-column:1/-1;text-align:center;padding:5rem 2rem;color:var(--muted)}
  .ff-empty-title{font-family:var(--fontDisplay);font-size:.82rem;letter-spacing:.12em;color:var(--subtle);margin-bottom:.5rem}
  .ff-empty-sub{font-size:.7rem}

  /* Product grid */
  .ff-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:1px;background:var(--border)}
  .ff-card{background:var(--bgCard);overflow:hidden;transition:background .22s;display:flex;flex-direction:column}
  .ff-card:hover{background:var(--bgCardH)}
  .ff-card-img{height:172px;display:flex;align-items:center;justify-content:center;background:var(--surface);position:relative;overflow:hidden}
  .ff-card-img.has-url img{width:100%;height:100%;object-fit:cover}
  .ff-card-img::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,var(--bgCard));pointer-events:none}
  .ff-card-emoji{font-size:3.8rem;position:relative;z-index:1;opacity:.85}
  .ff-card-badge{position:absolute;top:0;left:0;z-index:2;font-family:var(--fontMono);font-size:.5rem;letter-spacing:.09em;padding:4px 9px;font-weight:700;text-transform:uppercase}
  .ff-card-badge.bestseller,.ff-card-badge.new{background:var(--accent);color:#fff}
  .ff-card-badge.hot{background:#E53E3E;color:#fff}
  .ff-card-badge.sale{background:#38A169;color:#fff}
  .ff-card-badge.pro{background:#805AD5;color:#fff}
  .ff-card-wish{position:absolute;top:8px;right:8px;z-index:3;width:27px;height:27px;border:1px solid var(--border);background:rgba(11,11,20,.75);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:.78rem}
  .ff-card-wish:hover,.ff-card-wish.active{border-color:#E53E3E;background:rgba(229,62,62,.14)}
  .ff-card-body{padding:1.05rem;flex:1;display:flex;flex-direction:column}
  .ff-card-brand{font-family:var(--fontMono);font-size:.52rem;color:var(--accent);letter-spacing:.15em;text-transform:uppercase;margin-bottom:.28rem}
  .ff-card-name{font-family:var(--fontDisplay);font-size:.84rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:.38rem;letter-spacing:.03em}
  .ff-card-desc{font-size:.68rem;color:var(--muted);line-height:1.55;margin-bottom:.62rem;flex:1}
  .ff-card-specs{display:flex;flex-wrap:wrap;gap:.28rem;margin-bottom:.82rem}
  .ff-spec-tag{font-family:var(--fontMono);font-size:.5rem;color:var(--subtle);background:var(--surface);border:1px solid var(--border);padding:2px 6px}
  .ff-card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;gap:.5rem}
  .ff-card-price{font-family:var(--fontDisplay);font-size:.98rem;font-weight:700;color:var(--text)}
  .ff-card-price-na{font-size:.66rem;color:var(--muted);font-family:var(--fontDisplay)}
  .ff-card-rating{font-size:.6rem;color:var(--accent);display:flex;align-items:center;gap:3px;margin-top:1px}
  .ff-add-btn{font-family:var(--fontDisplay);font-size:.54rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:.42rem .88rem;background:var(--accent);color:#fff;border:none;cursor:pointer;transition:all .2s;white-space:nowrap}
  .ff-add-btn:hover{opacity:.86;transform:scale(1.04)}

  /* Skeleton */
  .ff-skeleton{background:linear-gradient(90deg,var(--surface) 25%,var(--surfaceH) 50%,var(--surface) 75%);background-size:400px 100%;animation:shimmer 1.4s infinite}
  .ff-skeleton-card{background:var(--bgCard);overflow:hidden}
  .ff-skeleton-body{padding:1.05rem;display:flex;flex-direction:column;gap:.55rem}

  /* Cart drawer */
  .ff-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:1100;backdrop-filter:blur(4px);animation:fadeIn .2s}
  .ff-drawer{position:fixed;top:0;right:0;bottom:0;width:400px;z-index:1200;background:var(--bg2);border-left:1px solid var(--border);display:flex;flex-direction:column;animation:slideIn .28s ease}
  .ff-drawer-header{padding:1.3rem 1.4rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .ff-drawer-title{font-family:var(--fontDisplay);font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text)}
  .ff-drawer-sub{font-size:.6rem;color:var(--muted);margin-top:2px}
  .ff-drawer-close{font-size:.95rem;cursor:pointer;color:var(--muted);background:none;border:none;transition:color .2s}
  .ff-drawer-close:hover{color:var(--text)}
  .ff-drawer-body{flex:1;overflow-y:auto;padding:.95rem;display:flex;flex-direction:column;gap:.55rem}
  .ff-cart-item{display:flex;gap:.78rem;align-items:center;background:var(--bgCard);border:1px solid var(--border);padding:.62rem}
  .ff-cart-thumb{font-size:1.65rem;width:40px;text-align:center;flex-shrink:0}
  .ff-cart-thumb img{width:40px;height:40px;object-fit:cover}
  .ff-cart-info{flex:1;min-width:0}
  .ff-cart-name{font-size:.7rem;font-weight:600;color:var(--text);font-family:var(--fontDisplay);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ff-cart-variant{font-size:.56rem;color:var(--muted);margin-top:1px;font-family:var(--fontMono)}
  .ff-cart-price{font-size:.76rem;color:var(--accent);font-family:var(--fontMono);margin-top:2px}
  .ff-cart-controls{display:flex;align-items:center;gap:.35rem;flex-shrink:0}
  .ff-qty-btn{width:21px;height:21px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;font-size:.78rem;display:flex;align-items:center;justify-content:center;transition:all .15s}
  .ff-qty-btn:hover{border-color:var(--accent)}
  .ff-qty-val{font-family:var(--fontMono);font-size:.7rem;min-width:16px;text-align:center}
  .ff-cart-remove{background:none;border:none;color:var(--muted);cursor:pointer;font-size:.74rem;transition:color .2s;padding:0}
  .ff-cart-remove:hover{color:var(--danger)}
  .ff-drawer-footer{padding:1rem 1.4rem;border-top:1px solid var(--border)}
  .ff-cart-summary{display:flex;flex-direction:column;gap:.32rem;margin-bottom:.82rem}
  .ff-cart-summary-row{display:flex;justify-content:space-between}
  .ff-cart-summary-lbl{font-size:.62rem;color:var(--muted);font-family:var(--fontDisplay)}
  .ff-cart-summary-val{font-size:.7rem;color:var(--subtle);font-family:var(--fontMono)}
  .ff-cart-total-row{display:flex;justify-content:space-between;padding-top:.68rem;border-top:1px solid var(--border)}
  .ff-cart-total-lbl{font-family:var(--fontDisplay);font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
  .ff-cart-total-val{font-family:var(--fontDisplay);font-size:1.12rem;font-weight:700;color:var(--text)}
  .ff-checkout-btn{width:100%;margin-top:.78rem;padding:.78rem;background:var(--accent);color:#fff;border:none;font-family:var(--fontDisplay);font-size:.62rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;transition:all .25s}
  .ff-checkout-btn:hover{opacity:.88}
  .ff-empty-state{text-align:center;padding:3rem 1rem;color:var(--muted)}
  .ff-empty-icon{font-size:2.5rem;margin-bottom:.9rem;opacity:.5}
  .ff-empty-title{font-family:var(--fontDisplay);font-size:.68rem;letter-spacing:.12em;margin-bottom:.35rem;color:var(--subtle)}
  .ff-empty-sub{font-size:.65rem}

  /* Toast */
  .ff-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);z-index:2000;padding:.62rem 1.35rem;font-family:var(--fontDisplay);font-size:.6rem;letter-spacing:.12em;display:flex;align-items:center;gap:.6rem;animation:toastIn .3s ease;border:1px solid;backdrop-filter:blur(14px);white-space:nowrap}
  .ff-toast.success{background:rgba(16,185,129,.09);border-color:var(--success);color:var(--success)}
  .ff-toast.error{background:rgba(239,68,68,.09);border-color:var(--danger);color:var(--danger)}

  /* Auth modal */
  .fs-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:1500;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(6px);animation:fadeIn .2s}
  .fs-modal{width:100%;max-width:430px;background:var(--bgCard);border:1px solid var(--border);overflow:hidden;animation:slideUp .3s ease}
  .fs-modal-header{padding:1.65rem 1.9rem 1.2rem;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between}
  .fs-modal-icon{font-size:1.65rem;margin-bottom:.4rem}
  .fs-modal-title{font-family:var(--fontDisplay);font-size:.95rem;font-weight:700;letter-spacing:.07em;color:var(--text)}
  .fs-modal-sub{font-size:.7rem;color:var(--muted);margin-top:.25rem}
  .fs-modal-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:.95rem;padding:0;transition:color .2s}
  .fs-modal-close:hover{color:var(--text)}
  .fs-modal-tabs{display:flex;border-bottom:1px solid var(--border)}
  .fs-modal-tab{flex:1;padding:.75rem;font-family:var(--fontDisplay);font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;color:var(--muted);background:none;border:none;transition:all .2s;position:relative}
  .fs-modal-tab::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--accent);transform:scaleX(0);transition:transform .25s}
  .fs-modal-tab.active{color:var(--text)}
  .fs-modal-tab.active::after{transform:scaleX(1)}
  .fs-modal-body{padding:1.5rem 1.9rem;display:flex;flex-direction:column;gap:.85rem}
  .fs-modal-footer{padding:0 1.9rem 1.5rem;text-align:center}
  .fs-modal-footer-text{font-size:.66rem;color:var(--muted)}
  .fs-modal-footer-link{color:var(--accent);cursor:pointer}
  .fs-modal-footer-link:hover{color:var(--accentB)}
  .fs-field{display:flex;flex-direction:column;gap:.28rem}
  .fs-field-row{display:grid;grid-template-columns:1fr 1fr;gap:.65rem}
  .fs-label{font-family:var(--fontMono);font-size:.52rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
  .fs-input{width:100%;padding:.62rem .82rem;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:var(--fontBody);font-size:.8rem;outline:none;transition:border-color .2s}
  .fs-input:focus{border-color:var(--borderH)}
  .fs-input.error{border-color:var(--danger)}
  .fs-input::placeholder{color:var(--muted)}
  .fs-input-error{font-size:.56rem;color:var(--danger);font-family:var(--fontMono)}
  .fs-select{width:100%;padding:.62rem .82rem;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:var(--fontBody);font-size:.8rem;outline:none;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .82rem center;padding-right:2.1rem}
  .fs-select:focus{border-color:var(--borderH)}
  .fs-form-error{padding:.58rem .82rem;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.28);font-size:.66rem;color:var(--danger);font-family:var(--fontMono);display:flex;align-items:center;gap:.5rem}
  .fs-btn-primary{font-family:var(--fontDisplay);font-size:.62rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:0 1.65rem;height:44px;background:var(--accent);color:#fff;border:none;cursor:pointer;transition:all .25s;width:100%}
  .fs-btn-primary:hover{opacity:.88}
  .fs-btn-primary:disabled{opacity:.4;cursor:not-allowed}

  /* Wishlist / Orders */
  .ff-page-header{padding:3rem 4rem 1.65rem;background:var(--bg2);border-bottom:1px solid var(--border)}
  .ff-page-title{font-family:var(--fontDisplay);font-size:1.55rem;font-weight:700;letter-spacing:.07em}
  .ff-page-sub{font-size:.74rem;color:var(--muted);margin-top:.32rem}
  .ff-order-card{background:var(--bgCard);border:1px solid var(--border);padding:1.3rem;margin-bottom:1px;transition:border-color .2s}
  .ff-order-card:hover{border-color:var(--borderH)}
  .ff-order-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.9rem;flex-wrap:wrap;gap:.5rem}
  .ff-order-id{font-family:var(--fontMono);font-size:.68rem;color:var(--accent);letter-spacing:.08em}
  .ff-order-date{font-size:.6rem;color:var(--muted);margin-top:2px}
  .ff-order-meta{display:flex;align-items:center;gap:.82rem}
  .ff-status-badge{font-family:var(--fontDisplay);font-size:.53rem;letter-spacing:.1em;padding:3px 10px;text-transform:uppercase}
  .ff-status-badge.processing{background:rgba(16,185,129,.1);color:var(--success);border:1px solid rgba(16,185,129,.22)}
  .ff-order-total{font-family:var(--fontDisplay);font-size:1rem;font-weight:700}
  .ff-order-items{display:flex;gap:.32rem;flex-wrap:wrap}
  .ff-order-item-tag{font-family:var(--fontMono);font-size:.56rem;color:var(--subtle);background:var(--surface);border:1px solid var(--border);padding:3px 8px}

  /* Footer */
  .ff-footer{padding:4rem;border-top:1px solid var(--border);background:var(--bg2)}
  .ff-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:3rem}
  .ff-footer-logo{font-family:var(--fontDisplay);font-size:1.05rem;font-weight:700;letter-spacing:.18em;margin-bottom:.62rem}
  .ff-footer-tagline{font-size:.68rem;color:var(--muted);line-height:1.7;max-width:240px}
  .ff-footer-col-title{font-family:var(--fontDisplay);font-size:.5rem;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);margin-bottom:.82rem}
  .ff-footer-link{display:block;font-size:.68rem;color:var(--muted);margin-bottom:.4rem;cursor:pointer;transition:color .2s;background:none;border:none;text-align:left}
  .ff-footer-link:hover{color:var(--text)}
  .ff-footer-bottom{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);padding-top:1.75rem;flex-wrap:wrap;gap:1rem}
  .ff-footer-copy{font-family:var(--fontMono);font-size:.56rem;color:var(--muted)}
  .ff-footer-socials{display:flex;gap:.5rem}
  .ff-social{width:27px;height:27px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.62rem;color:var(--muted);transition:all .2s}
  .ff-social:hover{border-color:var(--borderH);color:var(--text);background:var(--surface)}

  /* Responsive */
  @media(max-width:1024px){.ff-footer-grid{grid-template-columns:1fr 1fr}}
  @media(max-width:900px){.ff-shop-body{grid-template-columns:1fr}.ff-shop-sidebar{display:none}.ff-banner{grid-template-columns:1fr}.ff-banner-visual{display:none}.njey-bottom-cards{display:none}.njey-socials{display:none}}
  @media(max-width:768px){.ff-nav-links{display:none}.ff-hero-content,.njey-hero-content{padding:2rem 1.5rem;max-width:100%}.ff-section{padding:3rem 1.5rem}.ff-features-strip{padding:2rem 1.5rem}.ff-footer{padding:2.5rem 1.5rem}.ff-footer-grid{grid-template-columns:1fr}.ff-drawer{width:100%}.ff-page-header{padding:2rem 1.5rem 1rem}.ff-shop-hero{padding:2rem 1.5rem 1.5rem}.ff-shop-main{padding:1rem 1.5rem}.njey-robot-area{opacity:.4}}
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

const ADMIN_CSS = `
  .adm-shell{display:flex;min-height:100vh;padding-top:92px;background:var(--bg)}
  .adm-sidebar{width:216px;flex-shrink:0;background:var(--bgCard);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:92px;left:0;bottom:0;z-index:100;overflow-y:auto}
  .adm-sidebar-brand{padding:1.3rem 1.1rem .85rem;border-bottom:1px solid var(--border)}
  .adm-sidebar-logo{font-family:var(--fontDisplay);font-size:.8rem;font-weight:700;letter-spacing:.22em;color:var(--text)}
  .adm-sidebar-tag{font-family:var(--fontMono);font-size:.5rem;letter-spacing:.16em;color:var(--accent);text-transform:uppercase;margin-top:.18rem}
  .adm-nav{padding:.55rem 0;flex:1}
  .adm-nav-item{display:flex;align-items:center;gap:.55rem;width:100%;padding:.58rem 1.1rem;background:none;border:none;border-left:2px solid transparent;cursor:pointer;font-family:var(--fontDisplay);font-size:.58rem;letter-spacing:.09em;color:var(--muted);text-transform:uppercase;transition:all .18s;text-align:left}
  .adm-nav-item:hover{color:var(--text);background:var(--surface)}
  .adm-nav-item.active{color:var(--accentB);background:rgba(61,90,241,.07);border-left-color:var(--accent)}
  .adm-nav-icon{font-size:.82rem;width:16px;text-align:center}
  .adm-sidebar-footer{padding:.82rem 1.1rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:.5rem}
  .adm-user-info{display:flex;align-items:center;gap:.52rem;min-width:0}
  .adm-user-avatar{width:25px;height:25px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--fontDisplay);font-size:.62rem;font-weight:700;flex-shrink:0}
  .adm-user-name{font-size:.63rem;color:var(--text);font-family:var(--fontDisplay);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .adm-user-role{font-size:.52rem;color:var(--muted);font-family:var(--fontMono)}
  .adm-logout-btn{background:none;border:1px solid var(--border);color:var(--muted);cursor:pointer;width:25px;height:25px;display:flex;align-items:center;justify-content:center;font-size:.78rem;transition:all .2s;flex-shrink:0}
  .adm-logout-btn:hover{border-color:var(--danger);color:var(--danger)}
  .adm-main{flex:1;margin-left:216px;min-height:calc(100vh - 92px);background:var(--bg2)}
  .adm-page{padding:1.85rem;max-width:1280px}
  .adm-page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.85rem;flex-wrap:wrap;gap:1rem}
  .adm-page-title{font-family:var(--fontDisplay);font-size:1.35rem;font-weight:700;color:var(--text);letter-spacing:.05em}
  .adm-page-sub{font-size:.7rem;color:var(--muted);margin-top:.28rem}
  .adm-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:1px;background:var(--border);margin-bottom:1.5rem}
  .adm-stat-card{background:var(--bgCard);padding:1.15rem;transition:background .2s}
  .adm-stat-card:hover{background:var(--bgCardH)}
  .adm-stat-icon{font-size:1.25rem;margin-bottom:.55rem}
  .adm-stat-value{font-family:var(--fontDisplay);font-size:1.6rem;font-weight:700;color:var(--text)}
  .adm-stat-label{font-size:.58rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-top:.18rem}
  .adm-stat-sub{font-size:.56rem;color:var(--subtle);margin-top:.14rem;font-family:var(--fontMono)}
  .adm-card{background:var(--bgCard);border:1px solid var(--border);margin-bottom:1.4rem;overflow:hidden}
  .adm-card-header{display:flex;align-items:center;justify-content:space-between;padding:.95rem 1.3rem;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:.5rem}
  .adm-card-title{font-family:var(--fontDisplay);font-size:.78rem;font-weight:600;color:var(--text);letter-spacing:.05em}
  .adm-card-sub{font-size:.62rem;color:var(--muted);margin-top:.18rem}
  .adm-card-body{padding:1.3rem}
  .adm-two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.4rem;margin-bottom:1.4rem}
  .adm-cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:1px;background:var(--border)}
  .adm-cat-card{background:var(--bgCard);padding:.82rem;transition:background .2s}
  .adm-cat-card:hover{background:var(--bgCardH)}
  .adm-cat-card-name{font-family:var(--fontDisplay);font-size:.74rem;font-weight:600;color:var(--text);margin-bottom:.18rem}
  .adm-cat-card-slug{font-size:.58rem;color:var(--muted);margin-bottom:.42rem}
  .adm-cat-subs{display:flex;flex-wrap:wrap;gap:.28rem}
  .adm-btn-primary{font-family:var(--fontDisplay);font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;padding:0 1.15rem;height:34px;background:var(--accent);color:#fff;border:none;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:.38rem;font-weight:700}
  .adm-btn-primary:hover{opacity:.85;transform:translateY(-1px)}
  .adm-btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
  .adm-btn-outline{font-family:var(--fontDisplay);font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;padding:0 1.15rem;height:34px;background:transparent;color:var(--text);border:1px solid var(--border);cursor:pointer;transition:all .2s}
  .adm-btn-outline:hover{border-color:var(--borderH);background:var(--surface)}
  .adm-btn-ghost{font-family:var(--fontDisplay);font-size:.56rem;letter-spacing:.09em;background:none;border:none;color:var(--accent);cursor:pointer;transition:color .2s;padding:0;text-transform:uppercase}
  .adm-btn-ghost:hover{color:var(--accentB)}
  .adm-form-stack{display:flex;flex-direction:column;gap:.75rem}
  .adm-form-row{display:grid;grid-template-columns:1fr 1fr;gap:.65rem}
  .adm-field{display:flex;flex-direction:column;gap:.26rem}
  .adm-field-row{display:flex;align-items:center;justify-content:space-between;gap:1rem}
  .adm-label{font-family:var(--fontMono);font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
  .adm-required{color:var(--danger)}
  .adm-hint{font-size:.56rem;color:var(--subtle);font-family:var(--fontMono)}
  .adm-field-error{font-size:.55rem;color:var(--danger);font-family:var(--fontMono)}
  .adm-input{width:100%;padding:.56rem .78rem;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:var(--fontBody);font-size:.78rem;outline:none;transition:border-color .2s}
  .adm-input:focus{border-color:var(--borderH)}
  .adm-input.error{border-color:var(--danger)}
  .adm-input::placeholder{color:var(--muted)}
  .adm-textarea{resize:vertical;min-height:75px}
  .adm-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .78rem center;padding-right:2rem;cursor:pointer}
  .adm-toggle{width:36px;height:20px;border-radius:10px;border:none;cursor:pointer;position:relative;flex-shrink:0;transition:background .25s}
  .adm-toggle.on{background:var(--accent)}.adm-toggle.off{background:var(--surface);border:1px solid var(--border)}
  .adm-toggle-knob{position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .25s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
  .adm-toggle.on .adm-toggle-knob{left:18px}.adm-toggle.off .adm-toggle-knob{left:2px}
  .adm-api-error{padding:.55rem .82rem;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.26);font-size:.66rem;color:var(--danger);font-family:var(--fontMono);display:flex;align-items:center;justify-content:space-between;gap:.5rem}
  .adm-api-error-close{background:none;border:none;color:var(--danger);cursor:pointer;font-size:.8rem}
  .adm-api-success{padding:.55rem .82rem;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.26);font-size:.66rem;color:var(--success);font-family:var(--fontMono)}
  .adm-search-bar{display:flex;align-items:center;gap:.42rem;background:var(--surface);border:1px solid var(--border);padding:0 .68rem;height:32px;min-width:200px}
  .adm-search-bar:focus-within{border-color:var(--borderH)}
  .adm-search-input{background:none;border:none;color:var(--text);font-family:var(--fontBody);font-size:.74rem;outline:none;flex:1}
  .adm-search-input::placeholder{color:var(--muted)}
  .adm-search-clear{color:var(--muted);cursor:pointer;font-size:.7rem}
  .adm-table-wrap{overflow-x:auto}
  .adm-table{width:100%;border-collapse:collapse;font-size:.72rem}
  .adm-table th{font-family:var(--fontMono);font-size:.53rem;letter-spacing:.11em;text-transform:uppercase;color:var(--muted);padding:.58rem .92rem;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
  .adm-table td{padding:.68rem .92rem;border-bottom:1px solid var(--border);color:var(--subtle);vertical-align:middle}
  .adm-table tr:last-child td{border-bottom:none}
  .adm-table tr:hover td{background:var(--surface)}
  .adm-table-name{font-family:var(--fontDisplay);font-size:.72rem;color:var(--text);font-weight:500}
  .adm-table-sub{font-family:var(--fontMono);font-size:.56rem;color:var(--muted);margin-top:2px}
  .adm-badge{font-family:var(--fontMono);font-size:.53rem;letter-spacing:.09em;padding:3px 7px;text-transform:uppercase;display:inline-block}
  .adm-badge.success{background:rgba(16,185,129,.1);color:var(--success);border:1px solid rgba(16,185,129,.2)}
  .adm-badge.accent{background:rgba(61,90,241,.1);color:var(--accentB);border:1px solid rgba(61,90,241,.2)}
  .adm-badge.neutral{background:var(--surface);color:var(--subtle);border:1px solid var(--border)}
  .adm-badge-neutral{font-family:var(--fontMono);font-size:.53rem;padding:2px 6px;background:var(--surface);color:var(--subtle);border:1px solid var(--border);display:inline-block}
  .adm-mono{font-family:var(--fontMono);font-size:.68rem}
  .adm-muted{color:var(--muted)}
  .adm-price{font-family:var(--fontDisplay);font-size:.76rem;color:var(--text);font-weight:600}
  .adm-link{color:var(--accent);cursor:pointer}
  .adm-link:hover{color:var(--accentB);text-decoration:underline}
  .adm-empty-inline{display:flex;align-items:center;gap:.58rem;color:var(--muted);font-size:.72rem;padding:1.3rem 0}
  .adm-skeleton{background:linear-gradient(90deg,var(--surface) 25%,var(--surfaceH) 50%,var(--surface) 75%);background-size:400px 100%;animation:shimmer 1.4s infinite}
  .adm-skeleton-list{display:flex;flex-direction:column;gap:.52rem}
  .adm-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:.52rem}
  .adm-info-row{display:flex;flex-direction:column;gap:.16rem;background:var(--surface);padding:.55rem .78rem}
  .adm-info-key{font-family:var(--fontMono);font-size:.52rem;color:var(--muted);letter-spacing:.09em;text-transform:uppercase}
  .adm-info-val{font-size:.72rem;color:var(--text);word-break:break-all}
  .adm-media-grid{display:flex;flex-direction:column;gap:.55rem}
  .adm-media-card{display:flex;gap:.75rem;align-items:flex-start;background:var(--surface);border:1px solid var(--border);padding:.65rem}
  .adm-media-thumb{width:55px;height:55px;overflow:hidden;background:var(--bgCard);flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .adm-media-thumb img{width:100%;height:100%;object-fit:cover}
  .adm-media-info{flex:1;min-width:0}
  .adm-media-url{font-family:var(--fontMono);font-size:.58rem;color:var(--accent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .adm-img-preview{position:relative;overflow:hidden;border:1px solid var(--border);max-height:130px}
  .adm-img-preview img{width:100%;height:130px;object-fit:cover;display:block}
  .adm-img-preview-lbl{position:absolute;top:5px;left:5px;background:rgba(0,0,0,.65);color:#fff;font-family:var(--fontMono);font-size:.52rem;padding:2px 6px}
  @media(max-width:900px){.adm-sidebar{display:none}.adm-main{margin-left:0}.adm-two-col{grid-template-columns:1fr}.adm-form-row{grid-template-columns:1fr}.adm-info-grid{grid-template-columns:1fr}}
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
