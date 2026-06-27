/**
 * THEME SYSTEM — v3 style restored (Orbitron display font, indigo accent)
 * Content/data remains FoxFury-specific; visual identity matches v3.
 */
export const THEMES = {
  dark: {
    name: "dark",
    colors: {
      bg: "#0a0a0f", bgSecondary: "#0f0f1a", bgCard: "#111120", bgCardHover: "#161628",
      surface: "#1a1a2e", surfaceHover: "#1f1f38",
      border: "rgba(255,255,255,0.07)", borderHover: "rgba(99,102,241,0.4)",
      text: "#f0f0ff", textMuted: "#6b7280", textSubtle: "#9ca3af",
      accent: "#4f46e5", accentBright: "#6366f1", accentGlow: "rgba(79,70,229,0.3)",
      accentSecondary: "#0ea5e9", accentTertiary: "#8b5cf6",
      danger: "#ef4444", success: "#10b981", warning: "#f59e0b",
      gradientHero: "linear-gradient(135deg, #0a0a0f 0%, #0f0f2e 50%, #0a0a0f 100%)",
      navBg: "rgba(10,10,15,0.85)", scanline: "rgba(255,255,255,0.015)",
      annBar: "#4f46e5", annBarText: "#ffffff",
    },
    fonts: { display: "'Orbitron','Rajdhani',monospace", body: "'Exo 2','Jost',sans-serif", mono: "'JetBrains Mono',monospace" },
  },
  black: {
    name: "black",
    colors: {
      bg: "#000000", bgSecondary: "#050505", bgCard: "#0a0a0a", bgCardHover: "#111111",
      surface: "#121212", surfaceHover: "#191919",
      border: "rgba(255,255,255,0.06)", borderHover: "rgba(99,102,241,0.45)",
      text: "#ffffff", textMuted: "#6b7280", textSubtle: "#9ca3af",
      accent: "#4f46e5", accentBright: "#6366f1", accentGlow: "rgba(79,70,229,0.3)",
      accentSecondary: "#0ea5e9", accentTertiary: "#8b5cf6",
      danger: "#ef4444", success: "#10b981", warning: "#f59e0b",
      gradientHero: "linear-gradient(135deg, #000000 0%, #0a0a14 55%, #000000 100%)",
      navBg: "rgba(0,0,0,0.92)", scanline: "rgba(255,255,255,0.008)",
      annBar: "#4f46e5", annBarText: "#ffffff",
    },
    fonts: { display: "'Orbitron','Rajdhani',monospace", body: "'Exo 2','Jost',sans-serif", mono: "'JetBrains Mono',monospace" },
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
      gradientHero: "linear-gradient(135deg, #050510 0%, #001020 50%, #050510 100%)",
      navBg: "rgba(5,5,16,0.9)", scanline: "rgba(0,255,200,0.02)",
      annBar: "#00ffc8", annBarText: "#000000",
    },
    fonts: { display: "'Share Tech Mono',monospace", body: "'Rajdhani',sans-serif", mono: "'Share Tech Mono',monospace" },
  },
  light: {
    name: "light",
    colors: {
      bg: "#f8f8ff", bgSecondary: "#f0f0fa", bgCard: "#ffffff", bgCardHover: "#f8f8ff",
      surface: "#eeeeff", surfaceHover: "#e8e8ff",
      border: "rgba(0,0,0,0.08)", borderHover: "rgba(79,70,229,0.4)",
      text: "#0a0a1f", textMuted: "#6b7280", textSubtle: "#9ca3af",
      accent: "#4f46e5", accentBright: "#6366f1", accentGlow: "rgba(79,70,229,0.15)",
      accentSecondary: "#0ea5e9", accentTertiary: "#8b5cf6",
      danger: "#ef4444", success: "#10b981", warning: "#f59e0b",
      gradientHero: "linear-gradient(135deg, #f8f8ff 0%, #ededff 50%, #f8f8ff 100%)",
      navBg: "rgba(248,248,255,0.9)", scanline: "rgba(0,0,0,0.01)",
      annBar: "#4f46e5", annBarText: "#ffffff",
    },
    fonts: { display: "'Orbitron',monospace", body: "'Exo 2',sans-serif", mono: "'JetBrains Mono',monospace" },
  },
};

export const ACTIVE_THEME = "dark"; // ← change to "cyber" or "light"

export function injectStyles(themeName) {
  const t = THEMES[themeName] || THEMES.dark;
  const id = "fs-theme";
  const el = document.getElementById(id);
  if (el) el.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:ital,wght@0,300;0,400;0,500;0,600&family=JetBrains+Mono:wght@400;500&family=Rajdhani:wght@400;600&family=Share+Tech+Mono&display=swap');
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
    .fs-spin{animation:spin .9s linear infinite;display:inline-block}
  `;
  document.head.appendChild(style);
}
