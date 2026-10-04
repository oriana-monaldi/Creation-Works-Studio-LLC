import type { Language } from '../data/content'

// Vector scenes stay sharp at both card and detail sizes.
export function ProjectVisual({ kind, large = false, language }: { kind: string; large?: boolean; language: Language }) {
  const es = language === 'es'
  const gold = '#d8bc78'
  const text = { fill: '#f4eddf', fontFamily: 'Inter, sans-serif' }
  return (
    <div className={`project-visual illustrated-project ${kind} ${large ? 'large' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 720 480" preserveAspectRatio={large ? 'xMidYMid meet' : 'xMidYMid slice'}>
        <defs>
          <linearGradient id={`background-${kind}`} x2="1" y2="1"><stop stopColor="#393329" /><stop offset="1" stopColor="#141511" /></linearGradient>
          <linearGradient id={`gold-${kind}`} x2="1" y2="1"><stop stopColor="#f5e5b6" /><stop offset="1" stopColor="#947438" /></linearGradient>
        </defs>
        <rect width="720" height="480" fill={`url(#background-${kind})`} />
        <circle cx="610" cy="70" r="220" fill="none" stroke="#d8bc78" opacity=".08" />
        <circle cx="610" cy="70" r="170" fill="none" stroke="#d8bc78" opacity=".08" />
        {kind === 'orbit' && <>
          <rect x="64" y="60" width="544" height="342" rx="14" fill="#ede7da" />
          <path d="M64 105H608" stroke="#d2c9b7" />
          <text x="88" y="89" fontSize="18" fill="#25251f" fontFamily="sans-serif" fontWeight="700">cw.shop</text>
          <text x="478" y="88" fontSize="11" fill="#615a4a">{es ? 'TIENDA ONLINE' : 'ONLINE STORE'}</text>
          <text x="91" y="164" fontSize="10" fill="#7b6b48">{es ? 'OBJETOS CON IDENTIDAD' : 'OBJECTS WITH CHARACTER'}</text>
          <text x="90" y="205" fontSize="29" fill="#25251f" fontFamily="sans-serif">{es ? 'Diseño cotidiano.' : 'Everyday design.'}</text>
          <rect x="90" y="233" width="125" height="30" rx="15" fill="#25251f" />
          <text x="108" y="253" fontSize="10" fill="#eee7d7">{es ? 'Ver colección' : 'Shop collection'} →</text>
          <ellipse cx="453" cy="271" rx="97" ry="18" fill="#cfc5af" />
          <path d="M401 242L412 158Q450 139 489 158L502 242Q455 277 401 242" fill={`url(#gold-${kind})`} />
          <ellipse cx="451" cy="158" rx="39" ry="11" fill="#66583b" />
          {[0,1,2].map(i => <g key={i}><rect x={90+i*160} y="297" width="144" height="77" rx="6" fill="#ded6c6" /><circle cx={123+i*160} cy="332" r="19" fill={i === 1 ? '#74775f' : '#b29b70'} /><path d={`M${157+i*160} 325h55m-55 12h38`} stroke="#82765e" strokeWidth="3" /></g>)}
          <rect x="520" y="294" width="140" height="107" rx="12" fill="#23251f" stroke="#a88c52" />
          <circle cx="545" cy="320" r="10" fill={gold} /><path d="m540 320 4 4 6-7" fill="none" stroke="#25251f" strokeWidth="2" />
          <text x="535" y="355" {...text} fontSize="12">{es ? 'Compra confirmada' : 'Order confirmed'}</text>
          <text x="535" y="377" fill={gold} fontSize="10">{es ? 'Stock sincronizado' : 'Inventory synced'}</text>
        </>}
        {kind === 'nexus' && <>
          <text x="64" y="86" {...text} fontSize="22">{es ? 'Cada paso, conectado.' : 'Every step, connected.'}</text>
          <text x="64" y="113" fill={gold} fontSize="11">{es ? 'CONSULTAS → IA → EQUIPO → CRM' : 'INQUIRIES → AI → TEAM → CRM'}</text>
          <path d="M184 238H277M405 238H529M341 282V342H526" fill="none" stroke={gold} strokeWidth="3" strokeDasharray="7 7" />
          <rect x="60" y="181" width="138" height="112" rx="15" fill="#25271f" stroke="#76643d" />
          <path d="M91 208h72v35h-45l-15 12v-12H91z" fill="none" stroke={gold} strokeWidth="2" />
          <text x="80" y="277" {...text} fontSize="13">{es ? 'Nueva consulta' : 'New inquiry'}</text>
          <rect x="277" y="169" width="128" height="128" rx="24" fill={gold} />
          <path d="m341 193 9 23 23 9-23 9-9 23-9-23-23-9 23-9z" fill="#25251f" />
          <text x="309" y="279" fill="#25251f" fontSize="13">{es ? 'Agente IA' : 'AI agent'}</text>
          <rect x="525" y="174" width="137" height="112" rx="15" fill="#25271f" stroke="#76643d" />
          <circle cx="594" cy="208" r="13" fill="none" stroke={gold} strokeWidth="2" /><path d="M568 242q0-23 26-23t26 23" fill="none" stroke={gold} strokeWidth="2" />
          <text x="553" y="269" {...text} fontSize="13">{es ? 'Tu equipo' : 'Your team'}</text>
          <rect x="526" y="315" width="136" height="76" rx="12" fill="#25271f" stroke="#76643d" />
          <text x="548" y="345" {...text} fontSize="16">CRM ✓</text><text x="548" y="371" fill={gold} fontSize="11">{es ? 'Todo actualizado' : 'All up to date'}</text>
          <text x="64" y="421" fill="#b9af95" fontSize="11">{es ? 'Automatización con supervisión humana' : 'Automation with human oversight'}</text>
        </>}
        {kind === 'forma' && <>
          <text x="60" y="65" {...text} fontSize="22">{es ? 'Tu marca, en cada pantalla.' : 'Your brand, on every screen.'}</text>
          <rect x="60" y="91" width="470" height="279" rx="12" fill="#ede7da" />
          <path d="M60 125H530" stroke="#c7bcaa" />
          {[76,87,98].map(x => <circle key={x} cx={x} cy="108" r="3" fill="#a99a7e" />)}
          <text x="231" y="112" fill="#82765e" fontSize="10">aura.studio</text>
          <text x="85" y="158" fill="#302b21" fontSize="19" fontFamily="sans-serif" fontWeight="700">aura.</text>
          <text x="340" y="155" fill="#615a4a" fontSize="10">{es ? 'Estudio   Servicios   Contacto' : 'Studio   Services   Contact'}</text>
          <text x="85" y="211" fill="#302b21" fontSize="27" fontFamily="sans-serif">{es ? 'Espacios para' : 'Spaces for'}</text>
          <text x="85" y="244" fill="#302b21" fontSize="27" fontFamily="sans-serif">{es ? 'vivir mejor.' : 'better living.'}</text>
          <path d="M86 267h159m-159 11h126" stroke="#ad9d7c" strokeWidth="3" />
          <rect x="85" y="299" width="132" height="28" rx="14" fill="#302b21" />
          <text x="100" y="317" fill="#ede7da" fontSize="10">{es ? 'Ver proyectos' : 'View projects'} →</text>
          <rect x="334" y="181" width="169" height="154" rx="3" fill="#d5c7ad" />
          <path d="M355 316V230l58-33 69 33v86z" fill="#b39a6a" /><path d="M413 197v119h69v-86z" fill="#8e7953" />
          <path d="M374 316v-60h28v60m29-81h31v37h-31z" fill="#ede7da" />
          <rect x="548" y="159" width="113" height="236" rx="19" fill="#161813" stroke="#a18a56" strokeWidth="2" />
          <rect x="556" y="170" width="97" height="211" rx="12" fill="#ede7da" />
          <rect x="586" y="175" width="38" height="5" rx="3" fill="#302b21" />
          <text x="568" y="206" fill="#302b21" fontSize="16" fontFamily="sans-serif" fontWeight="700">aura.</text>
          <text x="567" y="239" fill="#302b21" fontSize="12">{es ? 'Espacios para' : 'Spaces for'}</text>
          <text x="567" y="255" fill="#302b21" fontSize="12">{es ? 'vivir mejor.' : 'better living.'}</text>
          <rect x="567" y="270" width="74" height="65" fill="#d5c7ad" />
          <path d="M577 330v-35l26-15 28 15v35z" fill="#b39a6a" /><path d="M590 330v-23h12v23" fill="#ede7da" />
          <rect x="567" y="347" width="74" height="17" rx="8" fill="#302b21" />
          <text x="576" y="359" fill="#ede7da" fontSize="7">{es ? 'Ver proyectos' : 'View projects'} →</text>
          <rect x="91" y="342" width="195" height="91" rx="5" fill={gold} stroke="#ead7a8" transform="rotate(-6 188 387)" />
          <text x="111" y="386" fill="#302b21" fontSize="30" fontFamily="sans-serif" fontWeight="700">aura.</text>
          <text x="113" y="409" fill="#302b21" fontSize="10">{es ? 'ARQUITECTURA & INTERIORES' : 'ARCHITECTURE & INTERIORS'}</text>
          <text x="324" y="425" fill="#b9af95" fontSize="11">{es ? 'Logo · Identidad visual · Web adaptable' : 'Logo · Visual identity · Responsive web'}</text>
        </>}
      </svg>
    </div>
  )
}
