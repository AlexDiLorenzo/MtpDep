/* global React, useTweaks, tokens, TopNav, Footer, LogoMark */
// ====================================================================
// VARIATION A — INSTITUTIONNEL
// Photo-first, NF-forward, reassuring. Photoreportage hero.
// ====================================================================

const MDP_PHOTO_HERO = 'https://montpellierdepannage.com/wp-content/uploads/2021/04/a9-avril21-4-1.jpg';
const MDP_PHOTO_ACCIDENT = 'https://montpellierdepannage.com/wp-content/uploads/2022/02/accident2.jpg';
const MDP_PHOTO_A9 = 'https://montpellierdepannage.com/wp-content/uploads/2020/04/Resized_21-1.jpg';
const MDP_PHOTO_EV = 'https://montpellierdepannage.com/wp-content/uploads/2021/08/evbox-montpellier-1.jpg';
const MDP_NF = 'https://montpellierdepannage.com/wp-content/uploads/2024/05/NFS_Depannage-vehicules-legers-et-poids-lourds.webp';
const MDP_ENVOL = 'https://montpellierdepannage.com/wp-content/uploads/2024/05/signature-titulaires-envol.webp';
const MDP_OLEO = 'https://montpellierdepannage.com/wp-content/uploads/elementor/thumbs/Visuel-RS-Oleo100-2023-MONTPELLIER-DEPANNAGE-800-qol3tq547eb1wu82do3kdqa9hmbloo01u3hvtw8qrg.png';

function HomeInstitutional() {
  const { tweaks } = useTweaks();
  const t = tokens(tweaks);

  return (
    <div style={{ background:t.bg, color:t.text, fontFamily:"'DM Sans', sans-serif", minHeight:'100%' }}>
      <TopNav variant="institutional" t={t}/>

      {/* HERO — full-bleed photo, overlay, title + dual CTA */}
      <section style={{
        position:'relative', minHeight:560,
        backgroundImage:`linear-gradient(180deg, rgba(26,25,15,0.55) 0%, rgba(26,25,15,0.75) 100%), url('${MDP_PHOTO_HERO}')`,
        backgroundSize:'cover', backgroundPosition:'center',
        color:'#fff', padding:'80px 40px 56px', display:'flex', flexDirection:'column', justifyContent:'space-between',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', width:'100%' }}>
          {/* Status strip */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'8px 14px', background:'rgba(228,225,60,0.95)', borderRadius:999, color:'#1A190F', marginBottom:28, fontSize:12, fontWeight:700, letterSpacing:'0.05em' }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#2C6126', boxShadow:'0 0 0 3px rgba(44,97,38,0.25)' }}/>
            INTERVENTION 24H/24 · 7J/7
          </div>

          <h1 style={{
            fontFamily:"'Space Mono', monospace", fontSize:72, lineHeight:1.02,
            fontWeight:700, letterSpacing:'-0.03em', margin:'0 0 20px', maxWidth:900,
          }}>
            Remorquage et dépannage,<br/>
            <span style={{ color:'#E4E13C' }}>24 heures sur 24.</span>
          </h1>
          <p style={{ fontSize:18, lineHeight:1.55, maxWidth:620, color:'rgba(255,255,255,0.88)', margin:'0 0 36px' }}>
            Plus de 10 plateaux, véhicules 4×4, agréés autoroutes A9. Intervention en France, Belgique, Italie et Espagne — voitures, poids lourds, véhicules de luxe.
          </p>

          <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:48 }}>
            <a href="tel:0467421431" style={{
              padding:'16px 24px', background:'#E4E13C', color:'#1A190F',
              borderRadius:10, textDecoration:'none', fontSize:15, fontWeight:700,
              display:'flex', alignItems:'center', gap:12, boxShadow:'0 4px 14px rgba(0,0,0,0.25)',
            }}>
              <span style={{ fontSize:22 }}>☎</span>
              <span>
                <span style={{ display:'block', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', opacity:0.7, fontWeight:700 }}>Urgence</span>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:17, letterSpacing:'-0.01em' }}>04 67 42 14 31</span>
              </span>
            </a>
            <a href="#devis" style={{
              padding:'16px 24px', background:t.primary, color:'#fff',
              borderRadius:10, textDecoration:'none', fontSize:15, fontWeight:700,
              display:'flex', alignItems:'center', gap:10,
              boxShadow:'0 4px 14px rgba(44,97,38,0.45)', border:'1px solid rgba(228,225,60,0.3)',
            }}>
              Demande de devis en ligne
              <span style={{ opacity:0.7 }}>→</span>
            </a>
          </div>
        </div>

        {/* Trust row */}
        <div style={{ maxWidth:1200, margin:'0 auto', width:'100%',
          borderTop:'1px solid rgba(255,255,255,0.2)', paddingTop:24,
          display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
          <Stat t={t} label="Années d'expérience" value="68" kicker="Depuis 1956"/>
          <Stat t={t} label="Plateaux de remorquage" value="10+" kicker="Dont 4×4 et rabaissés"/>
          <Stat t={t} label="Pays couverts" value="4" kicker="FR · BE · IT · ES"/>
          <Stat t={t} label="Agréé autoroutes" value="A9" kicker="Vinci partenaire"/>
        </div>
      </section>

      {/* CERTIFICATIONS BAND */}
      <section style={{ background:t.bgSubtle, borderBottom:`1px solid ${t.border}`, padding:'32px 40px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:40 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:t.textMuted }}>
            Labels et certifications
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:40, flex:1, justifyContent:'flex-end' }}>
            <img src={MDP_NF} alt="NF Service" style={{ height:58, opacity:tweaks.darkMode?0.9:1 }}/>
            <img src={MDP_ENVOL} alt="Envol" style={{ height:48, opacity:tweaks.darkMode?0.9:1 }}/>
            <img src={MDP_OLEO} alt="Oleo 100" style={{ height:54, opacity:tweaks.darkMode?0.9:1 }}/>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding:'80px 40px', background:t.bg }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:20 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:t.primary, marginBottom:10 }}>Nos activités</div>
              <h2 style={{ fontFamily:"'Space Mono', monospace", fontSize:40, margin:0, color:t.text, letterSpacing:'-0.02em', lineHeight:1.1 }}>
                Un savoir-faire à votre service<br/>pour chaque situation.
              </h2>
            </div>
            <a href="#" style={{ fontSize:13, color:t.primary, fontWeight:700, textDecoration:'none', border:`1px solid ${t.border}`, padding:'10px 16px', borderRadius:8 }}>
              Voir tous les services →
            </a>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
            <ServiceCard t={t} tag="01" title="Remorquage VL" desc="Voitures en panne ou accidentées, accès sous-sols, plateaux adaptés véhicules de luxe rabaissés." image={MDP_PHOTO_A9}/>
            <ServiceCard t={t} tag="02" title="Remorquage poids lourds" desc="Flotte 4×4 avec bras, plateaux PL. Interventions jour et nuit, tout gabarit." image={MDP_PHOTO_ACCIDENT}/>
            <ServiceCard t={t} tag="03" title="Autoroute A9" desc="Agréés autoroutes, partenaires Vinci. Intervention rapide sur le réseau Hérault." image={MDP_PHOTO_HERO}/>
            <ServiceCard t={t} tag="04" title="Transport international" desc="France, Belgique, Italie, Espagne. Rapatriement de véhicules accidentés." image={MDP_PHOTO_EV}/>
            <ServiceCard t={t} tag="05" title="Mécanique · GPL · Clim" desc="Entretien véhicules, installation systèmes GPL, révision climatisation." image={MDP_PHOTO_A9}/>
            <ServiceCard t={t} tag="06" title="Location 24/7" desc="Service de location disponible en continu, véhicules de remplacement." image={MDP_PHOTO_ACCIDENT}/>
          </div>
        </div>
      </section>

      {/* COVERAGE MAP BAND */}
      <section style={{ padding:'0', background:t.bgSubtle, borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
          <div style={{ padding:'72px 48px 72px 40px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:t.primary, marginBottom:10 }}>Zone d'intervention</div>
            <h2 style={{ fontFamily:"'Space Mono', monospace", fontSize:36, margin:'0 0 18px', color:t.text, letterSpacing:'-0.02em', lineHeight:1.1 }}>
              Montpellier et grand Hérault,<br/>en moins de 30 minutes.
            </h2>
            <p style={{ fontSize:15, lineHeight:1.65, color:t.textMuted, margin:'0 0 28px', maxWidth:480 }}>
              Nos équipes sont basées à Montpellier (MTP) et Villeneuve-lès-Maguelone (VLT). Interventions sur toute l'agglomération, l'A9 et la sortie d'autoroute.
            </p>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {['Montpellier','Lattes','Castelnau','Juvignac','Villeneuve-lès-Maguelone','Pérols','Mauguio','A9 sortie 30-31'].map(v => (
                <li key={v} style={{ fontSize:13, color:t.text, display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:t.primary }}/>{v}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ minHeight:480, background:`linear-gradient(135deg, ${t.primary} 0%, #1F4A1D 100%)`, position:'relative', overflow:'hidden' }}>
            {/* Abstract topographic pattern (pure CSS, evokes a map without claiming to be one) */}
            <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, opacity:0.3 }}>
              <defs><pattern id="gridL" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E4E13C" strokeWidth="0.5" opacity="0.4"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#gridL)"/>
              {/* Concentric ranges */}
              <circle cx="400" cy="300" r="80"  fill="none" stroke="#E4E13C" strokeWidth="1.2" opacity="0.8"/>
              <circle cx="400" cy="300" r="160" fill="none" stroke="#E4E13C" strokeWidth="1"   opacity="0.55"/>
              <circle cx="400" cy="300" r="240" fill="none" stroke="#E4E13C" strokeWidth="0.8" opacity="0.35"/>
              <circle cx="400" cy="300" r="320" fill="none" stroke="#E4E13C" strokeWidth="0.6" opacity="0.2"/>
              {/* Pins */}
              {[[400,300,'MTP'],[320,240,'VLT'],[500,220,''],[310,370,''],[480,360,'']].map(([x,y,lbl],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={lbl?12:5} fill="#E4E13C"/>
                  {lbl && <text x={x} y={y+4} fontFamily="Space Mono, monospace" fontSize="10" fontWeight="700" fill="#1A190F" textAnchor="middle">{lbl}</text>}
                </g>
              ))}
            </svg>
            <div style={{ position:'absolute', top:20, left:20, padding:'6px 12px', background:'rgba(26,25,15,0.7)', borderRadius:999, color:'#E4E13C', fontSize:10, fontFamily:"'JetBrains Mono', monospace", fontWeight:700, letterSpacing:'0.08em' }}>
              ⚡ 2 SITES · 16 DÉPANNEURS
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE / DEVIS CTA */}
      <section id="devis" style={{ padding:'80px 40px', background:t.bg }}>
        <div style={{ maxWidth:1000, margin:'0 auto', background:t.primary, borderRadius:16, padding:'56px 56px', color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-60, top:-60, width:240, height:240, borderRadius:'50%', background:'#E4E13C', opacity:tweaks.signalPresence==='partout'?0.35:0.15 }}/>
          <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:48, alignItems:'center' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#E4E13C', marginBottom:10 }}>Obtenez votre devis</div>
              <h2 style={{ fontFamily:"'Space Mono', monospace", fontSize:36, margin:'0 0 18px', letterSpacing:'-0.02em', lineHeight:1.1 }}>Un besoin de remorquage&nbsp;? Répondez en 3 étapes.</h2>
              <p style={{ fontSize:15, lineHeight:1.65, opacity:0.88, margin:'0 0 28px', maxWidth:440 }}>
                Type de véhicule, lieu d'enlèvement, destination. Devis détaillé sous 15 minutes aux heures ouvrées, ou appelez directement notre standard.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <a href="#" style={{ padding:'14px 22px', background:'#E4E13C', color:'#1A190F', borderRadius:10, textDecoration:'none', fontSize:14, fontWeight:700 }}>Commencer le devis →</a>
                <a href="tel:0467421431" style={{ padding:'14px 22px', background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,0.4)', borderRadius:10, textDecoration:'none', fontSize:14, fontWeight:700, fontFamily:"'JetBrains Mono', monospace" }}>☎ 04 67 42 14 31</a>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                ['1','Type de véhicule','Voiture, PL, véhicule de luxe'],
                ['2','Lieu & destination','Adresse départ & arrivée'],
                ['3','Urgence','Immédiat ou planifié'],
              ].map(([n,title,desc]) => (
                <div key={n} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, padding:'14px 16px', display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'#E4E13C', color:'#1A190F', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Mono', monospace", fontWeight:700, fontSize:14, flexShrink:0 }}>{n}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{title}</div>
                    <div style={{ fontSize:12, opacity:0.75 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section style={{ padding:'72px 40px 80px', background:t.bgSubtle }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:t.primary, marginBottom:10 }}>Dernières actualités</div>
              <h2 style={{ fontFamily:"'Space Mono', monospace", fontSize:32, margin:0, color:t.text, letterSpacing:'-0.02em' }}>Interventions et vie de l'entreprise</h2>
            </div>
            <a href="#" style={{ fontSize:13, color:t.primary, fontWeight:700, textDecoration:'none' }}>Toutes les actualités →</a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
            <NewsCard t={t} date="25 / 02 / 2022" tag="Intervention" title="Accident de poids lourd sur l'autoroute A9" img={MDP_PHOTO_ACCIDENT}/>
            <NewsCard t={t} date="27 / 08 / 2021" tag="Équipement" title="Borne de recharge pour véhicules électriques" img={MDP_PHOTO_EV}/>
            <NewsCard t={t} date="12 / 04 / 2021" tag="Intervention" title="Accident et relevage PL sur A9" img={MDP_PHOTO_A9}/>
          </div>
        </div>
      </section>

      <Footer t={t}/>
    </div>
  );
}

// --- Atoms used only here ---
function Stat({ label, value, kicker }) {
  return (
    <div>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:38, fontWeight:700, color:'#E4E13C', letterSpacing:'-0.02em', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', marginTop:6, fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:2, letterSpacing:'0.05em', textTransform:'uppercase', fontWeight:700 }}>{kicker}</div>
    </div>
  );
}

function ServiceCard({ t, tag, title, desc, image }) {
  return (
    <article style={{
      background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:12,
      overflow:'hidden', display:'flex', flexDirection:'column',
      boxShadow:'0 1px 3px rgba(26,25,15,0.06)', transition:'all .15s',
    }}>
      <div style={{ height:160, backgroundImage:`linear-gradient(180deg, rgba(26,25,15,0) 40%, rgba(26,25,15,0.7) 100%), url('${image}')`, backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
        <span style={{ position:'absolute', top:12, left:12, padding:'4px 8px', background:'#E4E13C', color:'#1A190F', borderRadius:4, fontSize:10, fontFamily:"'JetBrains Mono', monospace", fontWeight:700, letterSpacing:'0.05em' }}>{tag}</span>
      </div>
      <div style={{ padding:'20px 22px 22px' }}>
        <h3 style={{ fontSize:17, fontWeight:700, color:t.text, margin:'0 0 8px', fontFamily:"'DM Sans', sans-serif" }}>{title}</h3>
        <p style={{ fontSize:13, color:t.textMuted, margin:0, lineHeight:1.55 }}>{desc}</p>
        <div style={{ marginTop:16, fontSize:12, color:t.primary, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>En savoir plus <span style={{ fontSize:14 }}>→</span></div>
      </div>
    </article>
  );
}

function NewsCard({ t, date, tag, title, img }) {
  return (
    <article style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:10, overflow:'hidden' }}>
      <div style={{ height:160, backgroundImage:`url('${img}')`, backgroundSize:'cover', backgroundPosition:'center' }}/>
      <div style={{ padding:'18px 20px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:t.textMuted }}>
          <span style={{ fontFamily:"'JetBrains Mono', monospace" }}>{date}</span>
          <span style={{ width:2, height:2, background:t.textMuted, borderRadius:'50%' }}/>
          <span style={{ color:t.primary }}>{tag}</span>
        </div>
        <h3 style={{ fontSize:16, fontWeight:700, color:t.text, margin:'0 0 10px', lineHeight:1.35 }}>{title}</h3>
        <a href="#" style={{ fontSize:12, color:t.primary, fontWeight:700, textDecoration:'none' }}>Lire la suite →</a>
      </div>
    </article>
  );
}

window.HomeInstitutional = HomeInstitutional;
