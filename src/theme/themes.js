/**
 * THEME SYSTEM — FoxFury Edition
 * dark (default) | foxfury-yellow | cyber | light
 */
export const THEMES = {
  dark: {
    name: "dark",
    colors: {
      bg: "#08080f", bgSecondary: "#0d0d1a", bgCard: "#0f0f1e", bgCardHover: "#141428",
      surface: "#161625", surfaceHover: "#1c1c30",
      border: "rgba(255,255,255,0.07)", borderHover: "rgba(245,197,24,0.5)",
      text: "#f0f0ff", textMuted: "#6b7280", textSubtle: "#9ca3af",
      accent: "#f5c518", accentBright: "#ffd740", accentGlow: "rgba(245,197,24,0.25)",
      accentSecondary: "#e53e3e", accentTertiary: "#3182ce",
      danger: "#ef4444", success: "#10b981", warning: "#f59e0b",
      gradientHero: "linear-gradient(135deg, #08080f 0%, #0f0f28 60%, #08080f 100%)",
      navBg: "rgba(8,8,15,0.95)", scanline: "rgba(255,255,255,0.012)",
      annBar: "#f5c518", annBarText: "#000000",
    },
    fonts: { display: "'Rajdhani','Orbitron',sans-serif", body: "'Exo 2','Inter',sans-serif", mono: "'JetBrains Mono',monospace" },
  },
  foxfury: {
    name: "foxfury",
    colors: {
      bg: "#0a0800", bgSecondary: "#120f00", bgCard: "#181200", bgCardHover: "#1e1700",
      surface: "#231c00", surfaceHover: "#2a2100",
      border: "rgba(245,197,24,0.12)", borderHover: "rgba(245,197,24,0.5)",
      text: "#fffde7", textMuted: "#8a7a30", textSubtle: "#b5a050",
      accent: "#f5c518", accentBright: "#ffd740", accentGlow: "rgba(245,197,24,0.3)",
      accentSecondary: "#e53e3e", accentTertiary: "#48bb78",
      danger: "#ef4444", success: "#10b981", warning: "#f59e0b",
      gradientHero: "linear-gradient(135deg, #0a0800 0%, #1a1200 60%, #0a0800 100%)",
      navBg: "rgba(10,8,0,0.96)", scanline: "rgba(245,197,24,0.01)",
      annBar: "#f5c518", annBarText: "#000000",
    },
    fonts: { display: "'Rajdhani','Orbitron',sans-serif", body: "'Exo 2','Inter',sans-serif", mono: "'JetBrains Mono',monospace" },
  },
  cyber: {
    name: "cyber",
    colors: {
      bg: "#050510", bgSecondary: "#080820", bgCard: "#0a0a1f", bgCardHover: "#0f0f2a",
      surface: "#0d0d25", surfaceHover: "#111135",
      border: "rgba(0,255,200,0.1)", borderHover: "rgba(0,255,200,0.4)",
      text: "#e0fff8", textMuted: "#4a7a6a", textSubtle: "#7ab8a8",
      accent: "#00ffc8", accentBright: "#00ffe0", accentGlow: "rgba(0,255,200,0.25)",
      accentSecondary: "#ff0080", accentTertiary: "#8000ff",
      danger: "#ff0044", success: "#00ff88", warning: "#ffcc00",
      gradientHero: "linear-gradient(135deg, #050510 0%, #001020 60%, #050510 100%)",
      navBg: "rgba(5,5,16,0.95)", scanline: "rgba(0,255,200,0.015)",
      annBar: "#00ffc8", annBarText: "#000000",
    },
    fonts: { display: "'Share Tech Mono',monospace", body: "'Rajdhani',sans-serif", mono: "'Share Tech Mono',monospace" },
  },
  light: {
    name: "light",
    colors: {
      bg: "#ffffff", bgSecondary: "#f5f5f5", bgCard: "#ffffff", bgCardHover: "#fafafa",
      surface: "#f0f0f0", surfaceHover: "#e8e8e8",
      border: "rgba(0,0,0,0.1)", borderHover: "rgba(245,197,24,0.6)",
      text: "#111111", textMuted: "#6b7280", textSubtle: "#9ca3af",
      accent: "#d4a017", accentBright: "#f5c518", accentGlow: "rgba(245,197,24,0.2)",
      accentSecondary: "#c53030", accentTertiary: "#2b6cb0",
      danger: "#e53e3e", success: "#38a169", warning: "#d69e2e",
      gradientHero: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
      navBg: "rgba(255,255,255,0.97)", scanline: "transparent",
      annBar: "#1a1a2e", annBarText: "#f5c518",
    },
    fonts: { display: "'Rajdhani','Orbitron',sans-serif", body: "'Exo 2','Inter',sans-serif", mono: "'JetBrains Mono',monospace" },
  },
};

export const ACTIVE_THEME = "dark";

export function injectStyles(themeName) {
  const t = THEMES[themeName] || THEMES.dark;
  const id = "fs-theme";
  const el = document.getElementById(id);
  if (el) el.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;600;700;900&family=Exo+2:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;500&family=Share+Tech+Mono&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:${t.colors.bg};--bg2:${t.colors.bgSecondary};--bgCard:${t.colors.bgCard};--bgCardH:${t.colors.bgCardHover};
      --surface:${t.colors.surface};--surfaceH:${t.colors.surfaceHover};
      --border:${t.colors.border};--borderH:${t.colors.borderHover};
      --text:${t.colors.text};--muted:${t.colors.textMuted};--subtle:${t.colors.textSubtle};
      --accent:${t.colors.accent};--accentB:${t.colors.accentBright};--glow:${t.colors.accentGlow};
      --accent2:${t.colors.accentSecondary};--accent3:${t.colors.accentTertiary};
      --danger:${t.colors.danger};--success:${t.colors.success};--warning:${t.colors.warning};
      --navBg:${t.colors.navBg};--scanline:${t.colors.scanline};
      --annBar:${t.colors.annBar};--annBarText:${t.colors.annBarText};
      --fontDisplay:${t.fonts.display};--fontBody:${t.fonts.body};--fontMono:${t.fonts.mono};
    }
    html{scroll-behavior:smooth}
    body{background:var(--bg);color:var(--text);font-family:var(--fontBody);min-height:100vh;overflow-x:hidden}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--accent);border-radius:2px}
    ::selection{background:var(--glow);color:var(--accentB)}
    body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,var(--scanline) 0,transparent 1px,transparent 3px);pointer-events:none;z-index:0}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastIn{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}
    @keyframes pulse{0%,100%{box-shadow:0 0 4px var(--accent)}50%{box-shadow:0 0 14px var(--accent),0 0 28px var(--glow)}}
    @keyframes heroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes ticker{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
    .fs-spin{animation:spin .9s linear infinite;display:inline-block}
  `;
  document.head.appendChild(style);
}
