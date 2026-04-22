/* global React */
// ====================================================================
// SHARED — Tokens, tweak state, Nav, Footer, common blocks
// Used by both HomeInstitutional and HomeTech.
// ====================================================================
const { useState, useEffect, createContext, useContext } = React;

// --- Tweak state via context ---
const TweakCtx = createContext(null);

function TweakProvider({ children }) {
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "greenIntensity": "primary",
    "signalPresence": "ponctuel",
    "darkMode": false,
    "displayFont": "grotesk"
  }/*EDITMODE-END*/;

  const [tweaks, setTweaks] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('md-tweaks') || '{}') }; }
    catch { return DEFAULTS; }
  });
  const [editVisible, setEditVisible] = useState(false);

  useEffect(() => { localStorage.setItem('md-tweaks', JSON.stringify(tweaks)); }, [tweaks]);

  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === '__activate_edit_mode')   setEditVisible(true);
      if (d.type === '__deactivate_edit_mode') setEditVisible(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const set = (patch) => {
    setTweaks(prev => ({ ...prev, ...patch }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  return (
    <TweakCtx.Provider value={{ tweaks, set, editVisible }}>
      {children}
      <TweaksPanel tweaks={tweaks} set={set}/>
    </TweakCtx.Provider>
  );
}

function useTweaks() { return useContext(TweakCtx); }

// Display font candidates for the public website (distinct from the web app's Space Mono).
const DISPLAY_FONTS = {
  archivo:    { stack: "'Archivo', system-ui, sans-serif",         label: 'Archivo',         vibe: 'Industriel · confiant',     weight: 800, tracking: '-0.03em' },
  grotesk:    { stack: "'Space Grotesk', system-ui, sans-serif",  label: 'Space Grotesk',   vibe: 'Géométrique · moderne',    weight: 700, tracking: '-0.025em' },
  host:       { stack: "'Host Grotesk', system-ui, sans-serif",    label: 'Host Grotesk',    vibe: 'Neutre · éditorial',       weight: 700, tracking: '-0.025em' },
  instrument: { stack: "'Instrument Serif', Georgia, serif",       label: 'Instrument Serif',vibe: 'Serif · premium',          weight: 400, tracking: '-0.015em' },
};

// Derive a runtime palette from tweaks ─ everything reads from `tokens()`.
function tokens(tw) {
  const dark = !!tw.darkMode;
  const gSubtle  = tw.greenIntensity === 'subtil';
  const sEverywhere = tw.signalPresence === 'partout';


  const base = {
    bg: '#FFFFFF', bgSubtle: '#FAFAF7', bgCard: '#FFFFFF',
    text: '#1A190F', textMuted: '#5F5E5A', border: '#D3D1C7', borderStrong: '#B4B2A9',
    primary: gSubtle ? '#3E7F2C' : '#2C6126',
    primaryBg: gSubtle ? '#FAFAF7' : '#F1F7EC',
    primaryHover: gSubtle ? '#2C6126' : '#255420',
    accent: '#E4E13C',
    accentBg: sEverywhere ? '#FDFCE8' : 'transparent',
    brandOnDark: '#E4E13C',
    logoBg: '#2C6126', logoTxt: '#E4E13C',
  };
  const out = dark ? {
    bg: '#1A190F', bgSubtle: '#2C2C2A', bgCard: '#2C2C2A',
    text: '#FAFAF7', textMuted: '#B4B2A9', border: '#444441', borderStrong: '#5F5E5A',
    primary: gSubtle ? '#3E7F2C' : '#64A142',
    primaryBg: '#1F4A1D',
    primaryHover: '#8FBE6A',
    accent: '#E4E13C',
    accentBg: sEverywhere ? '#5C5A11' : 'transparent',
    brandOnDark: '#E4E13C',
    logoBg: '#2C6126', logoTxt: '#E4E13C',
  } : base;

  // Attach the chosen display font so components can read t.display.*
  const font = DISPLAY_FONTS[tw.displayFont] || DISPLAY_FONTS.archivo;
  out.display = font;
  return out;
}

// --- Tweaks Panel (floating, bottom-right, self-contained with its own open/close) ---
function TweaksPanel({ tweaks, set }) {
  const [open, setOpen] = useState(true);
  const row = { display:'flex', flexDirection:'column', gap:6, marginBottom:14 };
  const lbl = { fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:"'DM Sans', sans-serif" };
  const seg = { display:'flex', border:'1px solid #D3D1C7', borderRadius:6, overflow:'hidden', background:'#FAFAF7' };
  const btn = (active) => ({
    flex:1, padding:'7px 10px', border:'none', cursor:'pointer',
    fontSize:11, fontWeight:700, fontFamily:"'DM Sans', sans-serif",
    background: active ? '#2C6126' : 'transparent', color: active ? '#fff' : '#5F5E5A',
  });

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position:'fixed', bottom:20, right:20, zIndex:9999,
        padding:'12px 16px', borderRadius:999, border:'none', cursor:'pointer',
        background:'#1A190F', color:'#E4E13C', fontFamily:"'DM Sans', sans-serif",
        fontSize:12, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
        boxShadow:'0 10px 30px rgba(26,25,15,0.25)', display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'#E4E13C' }}/>
        Tweaks
      </button>
    );
  }

  return (
    <div style={{
      position:'fixed', bottom:20, right:20, width:240, zIndex:9999,
      background:'#fff', border:'1px solid #D3D1C7', borderRadius:10,
      boxShadow:'0 10px 40px rgba(26,25,15,0.15)', padding:16,
      fontFamily:"'DM Sans', sans-serif",
    }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#1A190F', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#2C6126' }}/>
          Tweaks
        </span>
        <button onClick={() => setOpen(false)} style={{
          background:'none', border:'none', cursor:'pointer', color:'#888780',
          fontSize:16, padding:0, lineHeight:1,
        }} aria-label="Fermer">×</button>
      </div>

      <div style={row}>
        <label style={lbl}>Intensité du vert</label>
        <div style={seg}>
          <button style={btn(tweaks.greenIntensity === 'primary')} onClick={() => set({ greenIntensity:'primary' })}>Primaire</button>
          <button style={btn(tweaks.greenIntensity === 'subtil')}  onClick={() => set({ greenIntensity:'subtil' })}>Subtil</button>
        </div>
      </div>

      <div style={row}>
        <label style={lbl}>Présence du jaune</label>
        <div style={seg}>
          <button style={btn(tweaks.signalPresence === 'ponctuel')}  onClick={() => set({ signalPresence:'ponctuel' })}>Ponctuel</button>
          <button style={btn(tweaks.signalPresence === 'partout')} onClick={() => set({ signalPresence:'partout' })}>Partout</button>
        </div>
      </div>

      <div style={row}>
        <label style={lbl}>Thème</label>
        <div style={seg}>
          <button style={btn(!tweaks.darkMode)} onClick={() => set({ darkMode:false })}>Clair</button>
          <button style={btn(tweaks.darkMode)}  onClick={() => set({ darkMode:true })}>Sombre</button>
        </div>
      </div>

      <div style={row}>
        <label style={lbl}>Police display</label>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {Object.entries(DISPLAY_FONTS).map(([key, f]) => {
            const active = tweaks.displayFont === key;
            return (
              <button key={key} onClick={() => set({ displayFont:key })} style={{
                display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8,
                padding:'9px 12px', borderRadius:6, cursor:'pointer',
                background: active ? '#F1F7EC' : '#FAFAF7',
                border:`1px solid ${active ? '#2C6126' : '#D3D1C7'}`,
                textAlign:'left', transition:'all .15s',
              }}>
                <span style={{ fontFamily:f.stack, fontWeight:f.weight, fontSize:18, color:'#1A190F', letterSpacing:f.tracking, lineHeight:1 }}>{f.label}</span>
                <span style={{ fontSize:9, color:'#888780', textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:700, fontFamily:"'DM Sans', sans-serif" }}>{f.vibe}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Logo mark ---
function LogoMark({ size=40, display }) {
  const font = display || DISPLAY_FONTS.archivo;
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background:'#2C6126',
      border:'1.5px solid #1A190F',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      color:'#E4E13C', fontFamily:font.stack, fontWeight:font.weight,
      flexShrink:0,
    }}>
      <span style={{ fontSize:size*0.3, lineHeight:1, letterSpacing:font.tracking }}>MD</span>
      <span style={{ fontSize:size*0.11, letterSpacing:'0.1em', marginTop:2, opacity:0.9, fontFamily:"'DM Sans', sans-serif", fontWeight:700 }}>DÉPANNAGE</span>
    </div>
  );
}

// --- Top Nav (used by both variations, styled slightly differently via prop) ---
function TopNav({ variant='institutional', t }) {
  const isTech = variant === 'tech';
  const navBg = isTech ? (t.bg === '#1A190F' ? 'rgba(26,25,15,0.85)' : 'rgba(255,255,255,0.88)') : t.bg;
  const linkColor = t.text;
  const links = ['Services', 'Flotte', 'Zones', 'Actualités', 'Contact'];

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:50,
      background:navBg, borderBottom:`1px solid ${t.border}`,
      backdropFilter: isTech ? 'blur(10px)' : 'none',
      padding:'14px 40px', display:'flex', alignItems:'center', justifyContent:'space-between',
      fontFamily:"'DM Sans', sans-serif",
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <LogoMark size={40} display={t.display}/>
        <div>
          <div style={{ fontSize:15, fontWeight:t.display.weight, color:t.text, fontFamily:t.display.stack, letterSpacing:t.display.tracking, lineHeight:1.15 }}>
            Montpellier Dépannage
          </div>
          <div style={{ fontSize:10, color:t.textMuted, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700 }}>
            Remorquage · 24/7 · Depuis 1956
          </div>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:28 }}>
        {links.map(l => (
          <a key={l} href="#" style={{ fontSize:13, color:linkColor, textDecoration:'none', fontWeight:500 }}>{l}</a>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <a href="tel:0467421431" style={{
          padding:'10px 16px', borderRadius:8,
          background:'transparent', color:t.primary, border:`1px solid ${t.primary}`,
          fontSize:13, fontWeight:700, textDecoration:'none',
          fontFamily:"'JetBrains Mono', monospace",
        }}>04 67 42 14 31</a>
        <a href="#devis" style={{
          padding:'10px 16px', borderRadius:8,
          background:t.primary, color:'#fff',
          fontSize:13, fontWeight:700, textDecoration:'none',
          boxShadow:`0 4px 14px ${t.primary === '#2C6126' ? 'rgba(44,97,38,0.30)' : 'rgba(62,127,44,0.25)'}`,
        }}>Demande de devis</a>
      </div>
    </nav>
  );
}

// --- Footer ---
function Footer({ t }) {
  const cols = [
    { title:'Services', links:['Remorquage VL','Remorquage PL','Autoroute A9','Transport international','Rapatriement','Mécanique · GPL · Clim'] },
    { title:'Entreprise', links:['À propos','Certifications NF','Équipe','Flotte','Partenaires','Actualités'] },
    { title:'Informations', links:['Demande de devis','Paiement en ligne','Zone d\u2019intervention','Tarifs','CGV','Mentions légales'] },
  ];
  return (
    <footer style={{ background:'#1A190F', color:'#FAFAF7', padding:'60px 40px 24px', fontFamily:"'DM Sans', sans-serif" }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:40, marginBottom:40 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <LogoMark size={44} display={t.display}/>
              <div>
                <div style={{ fontSize:16, fontWeight:t.display.weight, fontFamily:t.display.stack, letterSpacing:t.display.tracking }}>Montpellier Dépannage</div>
                <div style={{ fontSize:10, color:'#B4B2A9', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700 }}>Remorquage · 24/7</div>
              </div>
            </div>
            <div style={{ fontSize:13, color:'#B4B2A9', lineHeight:1.7 }}>
              2501 Av de Maurin<br/>34070 Montpellier<br/>
              <a href="tel:0467421431" style={{ color:'#E4E13C', textDecoration:'none', fontFamily:"'JetBrains Mono', monospace", fontWeight:700 }}>04 67 42 14 31</a><br/>
              <a href="mailto:contact@montpellierdepannage.com" style={{ color:'#FAFAF7', textDecoration:'none' }}>contact@montpellierdepannage.com</a>
            </div>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#888780', marginBottom:14 }}>{c.title}</div>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
                {c.links.map(l => <li key={l}><a href="#" style={{ color:'#D3D1C7', fontSize:13, textDecoration:'none' }}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid #444441', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:'#888780' }}>
          <span>© {new Date().getFullYear()} Montpellier Dépannage · Agréé autoroutes · Certifié NF Service</span>
          <span style={{ fontFamily:"'JetBrains Mono', monospace" }}>24 / 7 — Intervention garantie</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { TweakProvider, useTweaks, tokens, LogoMark, TopNav, Footer });
