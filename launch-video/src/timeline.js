/* ============================================================
   DENTOMATE LAUNCH FILM — deterministic motion engine
   Every value is a pure function of t (seconds). No CSS anim.
   ============================================================ */
const S = document.getElementById('stage');
const W = 1920, H = 1080;
const IMG = 'img/';

/* ---------------- easing ---------------- */
const E = {
  lin  : t => t,
  out  : t => 1 - Math.pow(1 - t, 3),
  out4 : t => 1 - Math.pow(1 - t, 4),
  out5 : t => 1 - Math.pow(1 - t, 5),
  out7 : t => 1 - Math.pow(1 - t, 7),
  in3  : t => t * t * t,
  expo : t => (t >= 1 ? 1 : 1 - Math.pow(2, -11 * t)),
  inOut: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutQ:t => (t < .5 ? 8*t*t*t*t : 1 - Math.pow(-2*t+2,4)/2),
  back : t => { const c1=1.34, c3=c1+1; return 1 + c3*Math.pow(t-1,3) + c1*Math.pow(t-1,2); },
  spring:t => (t >= 1 ? 1 : 1 - Math.exp(-7.5*t) * Math.cos(10.5*t)),
  soft : t => (t >= 1 ? 1 : 1 - Math.exp(-6.2*t) * Math.cos(7.2*t)),
};
/* progress of a sub-animation */
function p(t, start, dur, ez){
  let x = dur <= 0 ? 1 : (t - start) / dur;
  x = x < 0 ? 0 : x > 1 ? 1 : x;
  return (ez || E.out4)(x);
}
/* raw 0..1 clamp */
function u(t, start, dur){ let x = (t-start)/dur; return x<0?0:x>1?1:x; }
const lerp = (a,b,q) => a + (b-a)*q;
/* fade in then out */
function inOutFade(t, a, b, fi, fo){
  return Math.min(p(t,a,fi,E.out), 1 - p(t, b-fo, fo, E.lin));
}

/* ---------------- dom ---------------- */
function el(tag, cls, style, html){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (style) Object.assign(e.style, style);
  return e;
}
function add(parent, tag, cls, style, html){
  const e = el(tag, cls, style, html); parent.appendChild(e); return e;
}
/* split text into masked words */
function words(text){
  return text.split(' ').map(w => `<span class="word"><i>${w}</i></span>`).join(' ');
}
/* split into masked characters */
function chars(text){
  return [...text].map(c => `<span class="word"><i>${c === ' ' ? '&nbsp;' : c}</i></span>`).join('');
}
function staggerIn(node, t, start, step, dur, ez, dist){
  const its = node.querySelectorAll('i'); const D = dist == null ? 112 : dist;
  its.forEach((it, i) => {
    const q = p(t, start + i*step, dur, ez || E.out5);
    it.style.transform = `translateY(${((1-q)*D).toFixed(3)}%)`;
  });
}
function staggerOut(node, t, start, step, dur, ez, dist){
  const its = node.querySelectorAll('i'); const D = dist == null ? -112 : dist;
  its.forEach((it, i) => {
    const q = p(t, start + i*step, dur, ez || E.in3);
    it.style.transform = `translateY(${(q*D).toFixed(3)}%)`;
  });
}
/* shorthand transform setter */
function tf(node, o){
  const x=o.x||0, y=o.y||0, s=o.s==null?1:o.s, r=o.r||0;
  node.style.transform = `translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0) scale(${s.toFixed(5)}) rotate(${r.toFixed(3)}deg)`;
  if (o.o != null) node.style.opacity = o.o.toFixed(4);
}

/* ---------------- number formatting ---------------- */
function inr(n){ /* Indian digit grouping */
  n = Math.round(n); const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3); let rest = s.slice(0, -3); const parts = [];
  while (rest.length > 2){ parts.unshift(rest.slice(-2)); rest = rest.slice(0, -2); }
  if (rest) parts.unshift(rest);
  return parts.join(',') + ',' + last3;
}

/* mono separators sit in a full cell; tuck them in so numbers read tight */
function monoNum(str){ return String(str).replace(/([,.])/g, '<span class="sp">$1</span>'); }

/* ---------------- device builders ---------------- */
function browser(parent, o){
  const b = add(parent, 'div', 'browser', {
    left:o.x+'px', top:o.y+'px', width:o.w+'px', height:o.h+'px'
  });
  const ch = add(b, 'div', 'chrome');
  ['#FF5F57','#FEBC2E','#28C840'].forEach(c => add(ch,'div','dot',{background:c}));
  const url = add(ch, 'div', 'url');
  const lock = add(url, 'span', null, {display:'inline-block',width:'11px',height:'11px',
    border:'1.6px solid #9AA3AF',borderRadius:'2.5px',borderBottom:'4px solid #9AA3AF',flex:'none'});
  const utxt = add(url, 'span', null, {overflow:'hidden',whiteSpace:'nowrap',display:'block'}, '');
  const vp = add(b, 'div', 'vp', { height:(o.h-46)+'px' });
  const im = add(vp, 'img'); im.src = IMG + o.img;
  const sc = o.w / 1640;                      /* screenshots are 1640 wide */
  im.style.width = o.w + 'px';
  im.style.height = (o.ih * sc) + 'px';
  b._img = im; b._url = utxt; b._sc = sc; b._vh = o.h - 46; b._ih = o.ih * sc;
  b.scrollTo = function(px){ im.style.transform = `translate3d(0,${(-px).toFixed(2)}px,0)`; };
  b.scrollTo(0);
  return b;
}
function phone(parent, o){
  const ph = add(parent, 'div', 'phone', {
    left:o.x+'px', top:o.y+'px', width:o.w+'px', height:o.h+'px'
  });
  add(ph, 'div', 'notch');
  const sc_ = add(ph, 'div', 'scr', { width:(o.w-22)+'px', height:(o.h-22)+'px' });
  const im = add(sc_, 'img'); im.src = IMG + o.img;
  const sc = (o.w-22) / 786;                  /* mobile shots are 786 wide */
  im.style.width = (o.w-22) + 'px';
  im.style.height = (o.ih * sc) + 'px';
  ph._img = im;
  ph.scrollTo = function(px){ im.style.transform = `translate3d(0,${(-px).toFixed(2)}px,0)`; };
  ph.scrollTo(0);
  return ph;
}

/* ---------------- brand mark (real Dentomate glyph, drawn) ---------------- */
function markSVG(size, color, sw){
  const c = color || '#2170D9', s = sw == null ? 7 : sw;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
    <rect x="17" y="17" width="66" height="34" rx="17" stroke="${c}" stroke-width="${s}" class="mk1"/>
    <circle cx="34" cy="72" r="17" stroke="${c}" stroke-width="${s}" class="mk2"/>
    <circle cx="72" cy="72" r="7"  stroke="${c}" stroke-width="${s}" class="mk3"/>
  </svg>`;
}

/* ---------------- scene registry ---------------- */
const scenes = [];
function scene(name, start, dur, build){
  const root = add(S, 'div', 'scene');
  root.dataset.name = name;
  const api = build(root) || {};
  scenes.push({ name, start, dur, root, update: api.update || function(){}, });
  return root;
}

/* ---------------- shared background pieces ---------------- */
function darkBg(root, o){
  o = o || {};
  const bg = add(root, 'div', null, {position:'absolute',inset:'0',background:o.bg||'#0E1014'});
  const grid = add(root, 'div', 'grid-bg', {opacity:'0'});
  const g1 = add(root, 'div', 'glow', {width:'900px',height:'900px',
    background:'rgba(33,112,217,.34)', left:'-180px', top:'-260px'});
  const g2 = add(root, 'div', 'glow', {width:'760px',height:'760px',
    background:'rgba(26,77,158,.30)', left:'1320px', top:'560px'});
  const vig = add(root, 'div', 'vig', {background:
    'radial-gradient(ellipse 78% 68% at 50% 46%, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 78%, rgba(0,0,0,.82) 100%)'});
  return { bg, grid, g1, g2, vig };
}
function lightBg(root, o){
  o = o || {};
  const bg = add(root, 'div', null, {position:'absolute',inset:'0',
    background:o.bg||'linear-gradient(175deg,#FFFFFF 0%,#F7F9FC 55%,#EEF3FA 100%)'});
  const grid = add(root, 'div', 'grid-bg lt', {opacity:'0'});
  const g1 = add(root, 'div', 'glow', {width:'1000px',height:'1000px',
    background:'rgba(33,112,217,.14)', left:'-240px', top:'-320px'});
  const g2 = add(root, 'div', 'glow', {width:'820px',height:'820px',
    background:'rgba(91,155,232,.16)', left:'1280px', top:'520px'});
  return { bg, grid, g1, g2 };
}
/* drifting glows shared by every scene */
function drift(o, t, amp){
  const a = amp == null ? 1 : amp;
  tf(o.g1, { x: Math.sin(t*0.42)*46*a,  y: Math.cos(t*0.33)*34*a, s: 1 + Math.sin(t*0.5)*0.05 });
  tf(o.g2, { x: Math.cos(t*0.37)*52*a, y: Math.sin(t*0.29)*40*a, s: 1 + Math.cos(t*0.45)*0.05 });
}

/* ============================================================
   SCENE 0 — COLD OPEN  (0.0 → 4.4)
   ============================================================ */
scene('cold', 0.0, 4.4, function(r){
  const bg = darkBg(r);
  const wrap = add(r, 'div', 'lyr', {left:'0px', top:'0px', width:W+'px', height:H+'px',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0px'});

  const kick = add(wrap, 'div', 'kicker', {color:'#5B9BE8', marginBottom:'40px', opacity:'0'},
    words('FOR INDIAN DENTAL CLINICS'));
  const l1 = add(wrap, 'div', 'h1', {color:'#fff', textAlign:'center'},
    `<span class="word"><i><span class="num" id="cd-n" style="color:#fff">₹0</span></i></span> ` + words('a month'));
  const l2 = add(wrap, 'div', 'h1', {color:'rgba(255,255,255,.42)', textAlign:'center', marginTop:'6px'},
    words('for WhatsApp API.'));
  const sub = add(wrap, 'div', 'body', {color:'rgba(255,255,255,.62)', marginTop:'54px', textAlign:'center'},
    words("And you're still doing follow-ups by hand."));
  const num = l1.querySelector('#cd-n');

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.05,0.5,E.out), 1 - p(t,4.05,0.35,E.lin)));
    drift(bg, t);
    bg.grid.style.opacity = String(0.55 * p(t,0.2,1.4,E.out));
    tf(bg.grid, { s: 1 + 0.05*(1-p(t,0.2,3.2,E.out)) });

    staggerIn(kick, t, 0.30, 0.016, 0.7, E.out5);
    kick.style.opacity = String(p(t,0.30,0.5,E.out));

    /* headline lifts up with a slow push-in */
    const push = p(t, 0.5, 3.6, E.out);
    tf(wrap, { s: 1.045 - 0.045*push, y: 10 - 10*push });

    staggerIn(l1, t, 0.62, 0.075, 0.95, E.out5);
    staggerIn(l2, t, 0.80, 0.065, 0.95, E.out5);
    /* the number counts as it lands */
    const q = p(t, 0.80, 1.05, E.out7);
    num.innerHTML = monoNum('₹' + inr(q * 12000));
    num.style.color = `rgba(255,255,255,${(0.75 + 0.25*q).toFixed(3)})`;

    staggerIn(sub, t, 1.95, 0.030, 0.85, E.out5);

    /* exit: everything masks away upward */
    if (t > 3.85){
      staggerOut(l1,  t, 3.88, 0.020, 0.42);
      staggerOut(l2,  t, 3.92, 0.018, 0.42);
      staggerOut(sub, t, 3.86, 0.008, 0.40);
      staggerOut(kick,t, 3.85, 0.005, 0.38);
    }
  }};
});

/* ============================================================
   SCENE 1 — PROBLEM MONTAGE  (4.4 → 9.6)
   ============================================================ */
scene('problem', 4.35, 5.30, function(r){
  const bg = darkBg(r, {bg:'#0B0D11'});
  const beats = [
    { txt:'Paper files.',                   at:0.10 },
    { txt:'Manual follow-ups.',             at:1.70 },
    { txt:'Patients who never come back.',  at:3.30 },
  ];
  const nodes = beats.map((b, i) => {
    const holder = add(r, 'div', 'lyr', {left:'0px', top:'0px', width:W+'px', height:H+'px',
      display:'flex', alignItems:'center', justifyContent:'center'});
    const box = add(holder, 'div', null, {position:'relative', display:'inline-block'});
    const tx = add(box, 'div', 'h2', {color:'#fff', whiteSpace:'nowrap'}, words(b.txt));
    const st = add(box, 'div', 'strike', {left:'-14px', top:'52%', width:'0px'});
    return { holder, box, tx, st, ...b };
  });
  const idx = add(r, 'div', 'kicker', {left:'150px', top:'150px', position:'absolute',
    color:'rgba(255,255,255,.34)'}, '');

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.18,E.lin), 1 - p(t,5.05,0.24,E.lin)));
    drift(bg, t, 0.6);
    bg.grid.style.opacity = '0.4';

    let active = 0;
    nodes.forEach((n, i) => {
      const a = n.at, dur = 1.60;
      const on = t >= a - 0.05 && t < a + dur;
      n.holder.style.display = on ? 'flex' : 'none';
      if (!on) return;
      active = i + 1;
      staggerIn(n.tx, t, a, 0.045, 0.62, E.out5);
      /* red strike sweeps through, then the line dims */
      const sw = p(t, a + 0.52, 0.42, E.out4);
      n.st.style.width = (n.tx.offsetWidth + 28) + 'px';
      n.st.style.transform = `scaleX(${sw.toFixed(4)})`;
      n.st.style.opacity = String(Math.min(1, sw*3) * (1 - p(t, a+1.28, 0.3, E.lin)));
      n.tx.style.color = `rgba(255,255,255,${(1 - 0.55*p(t, a+0.62, 0.45, E.out)).toFixed(3)})`;
      /* drift + exit */
      const g = p(t, a, dur, E.lin);
      const outq = p(t, a + 1.24, 0.34, E.in3);
      tf(n.box, { y: -14*g - 60*outq, s: 1 + 0.018*g - 0.03*outq, o: 1 - outq });
    });
    idx.textContent = active ? ('0' + active + ' / 03') : '';
    idx.style.opacity = String(0.55 * p(t, 0.25, 0.6, E.out) * (1 - p(t, 4.85, 0.3, E.lin)));

    /* camera shake on each cut */
    let sh = 0;
    nodes.forEach(n => { sh += (1 - p(t, n.at, 0.26, E.out4)) * (t > n.at - 0.02 ? 1 : 0); });
    tf(r, { x: Math.sin(t*90)*4.5*sh, y: Math.cos(t*76)*3.2*sh });
  }};
});

/* ============================================================
   SCENE 2 — LOGO REVEAL  (9.55 → 15.0)
   ============================================================ */
scene('logo', 9.55, 5.45, function(r){
  const bg = lightBg(r);
  const flash = add(r, 'div', null, {position:'absolute', inset:'0', background:'#fff'});
  const wrap = add(r, 'div', 'lyr', {left:'0px', top:'0px', width:W+'px', height:H+'px',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'});

  const mk = add(wrap, 'div', null, {marginBottom:'46px'}, markSVG(132, '#2170D9', 7));
  const paths = mk.querySelectorAll('rect, circle');
  paths.forEach(pn => {
    const L = pn.getTotalLength ? 0 : 0;
    pn.style.strokeDasharray = '400'; pn.style.strokeDashoffset = '400';
  });
  const name = add(wrap, 'div', null, {font:'700 116px/1 var(--font)', color:'#14171C',
    letterSpacing:'-.045em'}, chars('Dentomate'));
  const tag  = add(wrap, 'div', 'body', {color:'#6B7280', marginTop:'30px', fontSize:'34px'},
    words('Dental clinic software, built for Indian practice.'));
  const pill = add(wrap, 'div', 'tag', {marginTop:'46px', opacity:'0'}, 'app.dentomate.in');
  const line = add(wrap, 'div', 'rule', {position:'absolute', left:'50%', bottom:'188px',
    width:'380px', marginLeft:'-190px', height:'2px'});

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.10,E.lin), 1 - p(t,5.10,0.35,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.5 * p(t,0.35,1.2,E.out));
    /* white flash on the dark→light flip */
    flash.style.opacity = String(1 - p(t, 0.02, 0.40, E.out4));

    /* mark strokes draw on, then the whole lockup settles */
    paths.forEach((pn, i) => {
      const q = p(t, 0.30 + i*0.11, 0.85, E.out5);
      pn.style.strokeDashoffset = String(400 - 400*q);
    });
    const pop = p(t, 0.34, 1.25, E.spring);
    tf(mk, { s: 0.68 + 0.32*pop, y: 24 - 24*pop });

    staggerIn(name, t, 0.86, 0.033, 0.85, E.out5);
    /* letter-spacing settles in */
    const ls = p(t, 0.86, 1.6, E.out5);
    name.style.letterSpacing = (0.03 - 0.075*ls).toFixed(4) + 'em';

    staggerIn(tag, t, 1.42, 0.028, 0.8, E.out5);

    const pq = p(t, 1.95, 0.8, E.soft);
    tf(pill, { y: 26 - 26*pq, s: 0.92 + 0.08*pq, o: pq });

    const lq = p(t, 2.20, 1.0, E.out4);
    line.style.transform = `scaleX(${lq.toFixed(4)})`;
    line.style.opacity = String(0.55 * lq);

    /* slow push-in for the whole lockup */
    const push = p(t, 0.2, 5.0, E.lin);
    tf(wrap, { s: 1 + 0.028*push, y: -6*push });

    if (t > 4.75){
      staggerOut(name, t, 4.78, 0.012, 0.42);
      staggerOut(tag,  t, 4.76, 0.008, 0.40);
      const o = 1 - p(t, 4.76, 0.42, E.in3);
      tf(mk,   { s: 1 - 0.12*(1-o), y: -30*(1-o), o });
      tf(pill, { o, y: -20*(1-o) });
      line.style.opacity = String(0.55*o);
    }
  }};
});

/* URL typing effect */
function typeUrl(node, text, t, start, dur){
  const n = Math.round(p(t, start, dur, E.lin) * text.length);
  const caret = (n < text.length && Math.floor((t - start) * 3) % 2 === 0) ? '▌' : '';
  node.textContent = text.slice(0, n) + caret;
}
/* numbered section label */
function sectionLabel(parent, num, txt, x, y, dark){
  const h = add(parent, 'div', 'lyr', {left:x+'px', top:y+'px', display:'flex',
    alignItems:'center', gap:'18px'});
  const n = add(h, 'div', null, {font:'700 21px/1 var(--mono)', letterSpacing:'.12em',
    color: dark ? '#5B9BE8' : '#2170D9'}, num);
  const bar = add(h, 'div', null, {width:'56px', height:'2px',
    background: dark ? 'rgba(91,155,232,.5)' : 'rgba(33,112,217,.4)', transformOrigin:'left center'});
  const l = add(h, 'div', 'kicker', {color: dark ? 'rgba(255,255,255,.62)' : '#6B7280',
    fontSize:'19px'}, txt);
  h._bar = bar;
  return h;
}
function labelIn(h, t, a){
  const q = p(t, a, 0.7, E.out5);
  tf(h, { x: -26 + 26*q, o: q });
  h._bar.style.transform = `scaleX(${p(t, a+0.15, 0.6, E.out4).toFixed(4)})`;
}

/* ============================================================
   SCENE 3 — HERO PRODUCT  (14.95 → 23.0)
   ============================================================ */
scene('hero', 14.95, 8.10, function(r){
  const bg = lightBg(r);
  const lab = sectionLabel(r, '01', 'THE DASHBOARD', 760, 92);
  const h = add(r, 'div', 'h2', {position:'absolute', left:'0px', top:'146px', width:W+'px',
    textAlign:'center', color:'#14171C'}, words('Your whole practice. One screen.'));
  const sub = add(r, 'div', 'body', {position:'absolute', left:'460px', top:'266px', width:'1000px',
    textAlign:'center', color:'#6B7280'},
    words('Patients, visits, billing and analytics — live, and in one place.'));

  const bw = browser(r, { x:340, y:352, w:1240, h:700, img:'dashboard-tablet.png', ih:2160 });
  const chips = [
    { t:'Register a patient in seconds', x:112,  y:470, d:0.0, dot:'#00C853' },
    { t:'Secure staff logins',           x:64,   y:744, d:0.14, dot:'#2170D9' },
    { t:'No paperwork',                  x:1560, y:436, d:0.24, dot:'#00C853' },
    { t:'Live revenue, live patients',   x:1470, y:722, d:0.36, dot:'#2170D9' },
  ].map(c => {
    const n = add(r, 'div', 'chip', { left:c.x+'px', top:c.y+'px' },
      `<span class="d" style="background:${c.dot}"></span>${c.t}`);
    n._d = c.d; return n;
  });

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.30,E.out), 1 - p(t,7.72,0.34,E.lin)));
    drift(bg, t, 0.55);
    bg.grid.style.opacity = String(0.45 * p(t,0.1,1.2,E.out));

    labelIn(lab, t, 0.18);
    staggerIn(h,   t, 0.32, 0.055, 0.85, E.out5);
    staggerIn(sub, t, 0.62, 0.022, 0.80, E.out5);

    /* browser pushes in and keeps a slow drift for life */
    const rise = p(t, 0.55, 1.35, E.soft);
    const push = p(t, 0.55, 7.0, E.out);
    tf(bw, { y: 96 - 96*rise + Math.sin(t*0.7)*5, s: (0.90 + 0.10*rise) * (1 + 0.035*push), o: rise });

    /* the page scrolls gently through the patient list */
    bw.scrollTo(lerp(0, 430, p(t, 1.25, 6.2, E.inOut)));
    typeUrl(bw._url, 'app.dentomate.in/dashboard', t, 0.75, 1.25);

    chips.forEach(c => {
      const q = p(t, 1.35 + c._d, 0.85, E.soft);
      tf(c, { y: 30 - 30*q + Math.sin(t*0.9 + c._d*9)*6, s: 0.86 + 0.14*q, o: q });
    });

    if (t > 7.35){
      const o = 1 - p(t, 7.38, 0.42, E.in3);
      staggerOut(h, t, 7.38, 0.012, 0.42);
      staggerOut(sub, t, 7.36, 0.006, 0.40);
      tf(bw, { y: -46*(1-o), s: 1.035 + 0.05*(1-o), o });
      chips.forEach(c => tf(c, { o: o*o, s: 1 - 0.1*(1-o) }));
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 4 — WHATSAPP AUTO-SEND  (22.95 → 31.5)
   ============================================================ */
scene('whatsapp', 22.95, 8.60, function(r){
  const bg = lightBg(r, {bg:'linear-gradient(170deg,#FFFFFF 0%,#F6FAF7 60%,#EDF6F1 100%)'});
  const lab = sectionLabel(r, '02', 'WHATSAPP AUTOMATION', 140, 188);
  const h = add(r, 'div', 'h3', {position:'absolute', left:'140px', top:'246px', width:'660px',
    color:'#14171C'}, words('The moment a patient leaves your chair.'));
  const sub = add(r, 'div', 'body', {position:'absolute', left:'140px', top:'482px', width:'600px',
    color:'#6B7280', fontSize:'27px'},
    words('A branded prescription and post-care message lands on their phone. Your clinic name, your logo, your signature — every time.'));
  const feats = ['Auto-sent on patient exit','Clinic logo + doctor signature','Delivered on WhatsApp, no API bill']
    .map((f, i) => {
      const n = add(r, 'div', 'lyr', {left:'140px', top:(672 + i*62)+'px', display:'flex',
        alignItems:'center', gap:'16px', font:'500 25px/1 var(--font)', color:'#14171C'});
      add(n, 'div', null, {width:'26px',height:'26px',borderRadius:'50%',background:'rgba(0,200,83,.14)',
        display:'flex',alignItems:'center',justifyContent:'center',flex:'none'},
        `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.4l3 3 6-6.6" stroke="#00A844" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
      add(n, 'span', null, null, f);
      return n;
    });

  const bw = browser(r, { x:830, y:170, w:830, h:700, img:'inbox-tablet.png', ih:2160 });
  const ph = phone(r, { x:1382, y:250, w:376, h:748, img:'inbox-mobile.png', ih:1688 });

  /* delivery badge that flies from app → phone */
  const badge = add(r, 'div', 'chip', {left:'1246px', top:'236px', padding:'15px 26px',
    fontSize:'22px', boxShadow:'0 16px 40px -10px rgba(0,168,68,.42)'},
    `<span class="d"></span>Prescription sent`);
  const ticks = add(r, 'div', 'chip', {left:'1214px', top:'856px', padding:'14px 24px',
    fontSize:'21px', color:'#2170D9', gap:'12px'},
    `<svg width="27" height="15" viewBox="0 0 26 14" fill="none" style="flex:none">
       <path d="M1.5 7.6l4 4 8-9" stroke="#2170D9" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M11 7.6l4 4 8-9"  stroke="#2170D9" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
     </svg><span>Delivered &amp; read</span>`);

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.28,E.out), 1 - p(t,8.24,0.34,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.30 * p(t,0.1,1.0,E.out));

    labelIn(lab, t, 0.14);
    staggerIn(h,   t, 0.26, 0.048, 0.85, E.out5);
    staggerIn(sub, t, 0.62, 0.014, 0.78, E.out5);
    feats.forEach((f, i) => {
      const q = p(t, 1.30 + i*0.16, 0.75, E.out5);
      tf(f, { x: -26 + 26*q, o: q });
    });

    /* browser slides in from the right, phone rises over it */
    const bq = p(t, 0.42, 1.30, E.soft);
    tf(bw, { x: 74 - 74*bq, y: Math.sin(t*0.62)*6, s: 0.94 + 0.06*bq, o: bq });
    bw.scrollTo(lerp(0, 150, p(t, 1.4, 6.2, E.inOut)));
    typeUrl(bw._url, 'app.dentomate.in/whatsapp', t, 0.7, 1.1);

    const pq = p(t, 1.05, 1.45, E.soft);
    tf(ph, { y: 120 - 120*pq + Math.cos(t*0.74)*7, x: 30 - 30*pq, s: 0.92 + 0.08*pq, o: pq });
    /* the conversation scrolls so the newest bubble lands in view */
    ph.scrollTo(lerp(0, 74, p(t, 2.0, 2.6, E.inOut)));

    /* badge flies from the app across to the phone */
    const fq = p(t, 2.35, 1.15, E.inOutQ);
    const pop = p(t, 2.30, 0.55, E.soft);
    tf(badge, { x: 196*fq, y: 402*fq - Math.sin(fq*Math.PI)*124, s: (0.7 + 0.3*pop) * (1 - 0.20*fq),
      o: Math.min(pop, 1 - p(t, 3.34, 0.28, E.lin)) });

    const tq = p(t, 3.62, 0.6, E.soft);
    tf(ticks, { y: 16 - 16*tq, s: 0.8 + 0.2*tq, o: tq });

    if (t > 7.86){
      const o = 1 - p(t, 7.88, 0.40, E.in3);
      staggerOut(h, t, 7.88, 0.010, 0.40);
      staggerOut(sub, t, 7.86, 0.005, 0.38);
      feats.forEach(f => tf(f, { o, x: -18*(1-o) }));
      tf(bw, { x: -40*(1-o), s: 1 - 0.04*(1-o), o });
      tf(ph, { x: -30*(1-o), y: -24*(1-o), s: 1 - 0.05*(1-o), o });
      tf(ticks, { o }); tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 5 — PATIENT RECORDS  (31.45 → 38.6)
   ============================================================ */
scene('records', 31.45, 7.15, function(r){
  const bg = lightBg(r);
  const lab = sectionLabel(r, '03', 'PATIENT RECORDS', 1130, 196);
  const h = add(r, 'div', 'h3', {position:'absolute', left:'1130px', top:'254px', width:'660px',
    color:'#14171C'}, words('Every record in one place. Zero chaos.'));
  const sub = add(r, 'div', 'body', {position:'absolute', left:'1130px', top:'468px', width:'600px',
    color:'#6B7280', fontSize:'27px'},
    words('History, prescriptions, treatment notes, X-rays and payments — searchable, per patient.'));

  const bw = browser(r, { x:150, y:150, w:880, h:780, img:'record-tablet.png', ih:2160 });
  /* highlight ring that travels between sections of the record */
  const ring = add(r, 'div', null, {position:'absolute', borderRadius:'16px',
    border:'2.5px solid #2170D9', boxShadow:'0 0 0 7px rgba(33,112,217,.13)', pointerEvents:'none'});
  const ringLbl = add(r, 'div', null, {position:'absolute',
    padding:'9px 17px', borderRadius:'999px', background:'#2170D9', color:'#fff',
    font:'600 18px/1 var(--mono)', letterSpacing:'.08em', whiteSpace:'nowrap'}, '');

  /* everything below is in SOURCE-image px of the 1640-wide capture */
  const SC = 880 / 1640;          /* source px → viewport px */
  const COL_X = 225, COL_W = 1306;/* the record's content column */
  const stops = [
    { at:1.25, scroll:0,    sy:329,  sh:238, lbl:'TREATMENT PLAN'    },
    { at:2.85, scroll:182,  sy:643,  sh:447, lbl:'PRESCRIPTION'      },
    { at:4.40, scroll:792,  sy:1820, sh:326, lbl:'TREATMENT CHARGES' },
  ];
  const chips = ['Complete treatment timeline','X-ray & document storage','Instant search by name or phone']
    .map((c, i) => add(r, 'div', 'lyr', {left:'1130px', top:(646 + i*60)+'px',
      display:'flex', alignItems:'center', gap:'14px', font:'500 24px/1 var(--font)', color:'#14171C'},
      `<span style="width:7px;height:7px;border-radius:50%;background:#2170D9;display:block;flex:none"></span>${c}`));

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.28,E.out), 1 - p(t,6.80,0.32,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.42 * p(t,0.1,1.0,E.out));

    labelIn(lab, t, 0.14);
    staggerIn(h,   t, 0.26, 0.046, 0.85, E.out5);
    staggerIn(sub, t, 0.60, 0.013, 0.78, E.out5);
    chips.forEach((c, i) => {
      const q = p(t, 1.24 + i*0.15, 0.7, E.out5);
      tf(c, { x: 26 - 26*q, o: q });
    });

    const bq = p(t, 0.34, 1.25, E.soft);
    tf(bw, { x: -70 + 70*bq, y: Math.sin(t*0.66)*5, s: 0.93 + 0.07*bq, o: bq });
    typeUrl(bw._url, 'app.dentomate.in/patient', t, 0.62, 1.0);

    /* eased scroll between the record's sections */
    let sc = 0;
    for (let i = 0; i < stops.length; i++){
      const from = i === 0 ? 0 : stops[i-1].scroll;
      sc = lerp(from, stops[i].scroll, p(t, stops[i].at - 0.55, 0.8, E.inOut));
      if (t < stops[i].at + 0.9) break;
    }
    bw.scrollTo(sc * SC);

    /* ring is pinned to its section, so it travels with the page as it scrolls */
    let cur = -1;
    stops.forEach((st, i) => { if (t >= st.at - 0.02) cur = i; });
    if (cur >= 0){
      const st = stops[cur];
      const app  = p(t, st.at, 0.55, E.soft);
      const gone = cur === stops.length - 1 ? 0 : p(t, stops[cur+1].at - 0.42, 0.3, E.lin);
      const vx = bw.offsetLeft + COL_X * SC;
      const vy = bw.offsetTop + 46 + (st.sy - sc) * SC;
      ring.style.left   = vx.toFixed(1) + 'px';
      ring.style.top    = vy.toFixed(1) + 'px';
      ring.style.width  = (COL_W * SC).toFixed(1) + 'px';
      ring.style.height = (st.sh  * SC).toFixed(1) + 'px';
      tf(ring, { s: 0.975 + 0.025*app, o: app * (1 - gone) });
      ringLbl.textContent = st.lbl;
      ringLbl.style.left = vx.toFixed(1) + 'px';
      ringLbl.style.top  = (vy - 62).toFixed(1) + 'px';
      tf(ringLbl, { y: 10 - 10*app, o: app * (1 - gone) });
    } else { ring.style.opacity = '0'; ringLbl.style.opacity = '0'; }

    if (t > 6.42){
      const o = 1 - p(t, 6.44, 0.38, E.in3);
      staggerOut(h, t, 6.44, 0.010, 0.38);
      staggerOut(sub, t, 6.42, 0.005, 0.36);
      chips.forEach(c => tf(c, { o, x: 18*(1-o) }));
      tf(bw, { x: 40*(1-o), s: 1 - 0.04*(1-o), o });
      ring.style.opacity = String(Number(ring.style.opacity||0) * o);
      ringLbl.style.opacity = String(Number(ringLbl.style.opacity||0) * o);
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 6 — ANALYTICS  (38.55 → 46.6)
   ============================================================ */
scene('analytics', 38.55, 8.05, function(r){
  const bg = darkBg(r, {bg:'#0C0F14'});
  const lab = sectionLabel(r, '04', 'REVENUE ANALYTICS', 1090, 176, true);
  const h = add(r, 'div', 'h3', {position:'absolute', left:'1090px', top:'232px', width:'690px',
    color:'#fff', fontSize:'58px'}, words('See which month made the most money.'));
  const sub = add(r, 'div', 'body', {position:'absolute', left:'1090px', top:'424px', width:'640px',
    color:'rgba(255,255,255,.58)', fontSize:'30px'}, words('Then do more of that.'));

  const bw = browser(r, { x:118, y:170, w:880, h:748, img:'analytics-tablet.png', ih:2160 });

  const stats = [
    { k:'MTD REVENUE',           to:76000, pre:'₹',  suf:'',  dec:0, note:'+16.6% vs last month', col:'#fff'    },
    { k:'CONSULT → TREATMENT',   to:84.0,  pre:'',   suf:'%', dec:1, note:'visits resulting in treatment', col:'#5B9BE8' },
    { k:'AVG REVENUE / PATIENT', to:9496,  pre:'₹',  suf:'',  dec:0, note:'across all lifetime visits', col:'#00C853' },
  ].map((s, i) => {
    const c = add(r, 'div', 'card dk', { left:'1090px', top:(516 + i*152)+'px',
      width:'690px', height:'134px', padding:'22px 30px' });
    add(c, 'div', null, {font:'600 17px/1 var(--mono)', letterSpacing:'.16em',
      color:'rgba(255,255,255,.44)'}, s.k);
    const row = add(c, 'div', null, {display:'flex', alignItems:'baseline', gap:'18px', marginTop:'14px'});
    const v = add(row, 'div', 'num', {fontSize:'50px', color:s.col});
    const n = add(row, 'div', null, {font:'500 20px/1 var(--font)', color:'rgba(255,255,255,.46)'}, s.note);
    c._v = v; c._s = s; return c;
  });

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.30,E.out), 1 - p(t,7.72,0.33,E.lin)));
    drift(bg, t, 0.55);
    bg.grid.style.opacity = String(0.42 * p(t,0.1,1.1,E.out));

    labelIn(lab, t, 0.16);
    staggerIn(h,   t, 0.28, 0.046, 0.85, E.out5);
    staggerIn(sub, t, 0.66, 0.030, 0.78, E.out5);

    const bq = p(t, 0.36, 1.30, E.soft);
    tf(bw, { x: -66 + 66*bq, y: Math.sin(t*0.62)*6, s: 0.93 + 0.07*bq, o: bq });
    typeUrl(bw._url, 'app.dentomate.in/analytics', t, 0.64, 1.1);
    /* scroll so the cash-flow chart fills the frame */
    bw.scrollTo(lerp(0, 560, p(t, 1.45, 3.4, E.inOut)) * (880/1640));

    stats.forEach((c, i) => {
      const a = 1.30 + i*0.26;
      const q = p(t, a, 0.85, E.soft);
      tf(c, { x: 40 - 40*q, y: 16 - 16*q, o: q });
      const cq = p(t, a + 0.12, 1.15, E.out7);
      const val = c._s.to * cq;
      c._v.innerHTML = monoNum(c._s.pre + (c._s.dec ? val.toFixed(c._s.dec) : inr(val)) + c._s.suf);
    });

    if (t > 7.34){
      const o = 1 - p(t, 7.36, 0.38, E.in3);
      staggerOut(h, t, 7.36, 0.010, 0.38);
      staggerOut(sub, t, 7.34, 0.008, 0.36);
      stats.forEach(c => tf(c, { o, x: 26*(1-o) }));
      tf(bw, { x: -34*(1-o), s: 1 - 0.04*(1-o), o });
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 7 — MULTI-CLINIC  (46.55 → 52.7)
   ============================================================ */
scene('clinics', 46.55, 6.15, function(r){
  const bg = lightBg(r);
  const lab = sectionLabel(r, '05', 'MULTI-CLINIC', 760, 118);
  const h = add(r, 'div', 'h2', {position:'absolute', left:'0px', top:'172px', width:W+'px',
    textAlign:'center', color:'#14171C', fontSize:'76px'},
    words('Up to three branches. One account.'));
  const sub = add(r, 'div', 'body', {position:'absolute', left:'460px', top:'290px', width:'1000px',
    textAlign:'center', color:'#6B7280'},
    words('Add a location to the plan you already pay for — not a second subscription.'));

  const names = [
    { n:'Sharma Dental Care', c:'Bengaluru', tag:'HQ',       col:'#2170D9', f:'One shared patient list' },
    { n:'SmileCraft Dental',  c:'Mumbai',    tag:'BRANCH 2', col:'#5B9BE8', f:'Staff access set per branch' },
    { n:'Pearl Dental Studio',c:'Delhi',     tag:'BRANCH 3', col:'#00C853', f:'Switch branch in one click' },
  ].map((b, i) => {
    const c = add(r, 'div', 'card', { left:(292 + i*452)+'px', top:'420px',
      width:'404px', height:'326px', padding:'36px 34px' });
    add(c, 'div', null, {display:'inline-flex', alignItems:'center', gap:'9px', padding:'8px 15px',
      borderRadius:'999px', background:'rgba(33,112,217,.09)', color:b.col,
      font:'600 15px/1 var(--mono)', letterSpacing:'.14em'}, b.tag);
    add(c, 'div', null, {font:'700 33px/1.16 var(--font)', letterSpacing:'-.02em',
      color:'#14171C', marginTop:'26px'}, b.n);
    add(c, 'div', null, {font:'400 22px/1 var(--font)', color:'#9AA3AF', marginTop:'12px'}, b.c);
    const f = add(c, 'div', null, {display:'flex', alignItems:'center', gap:'11px',
      marginTop:'34px', font:'500 20px/1 var(--font)', color:'#6B7280'});
    add(f, 'div', null, {width:'9px',height:'9px',borderRadius:'50%',background:'#00C853'});
    add(f, 'span', null, null, b.f);
    return c;
  });

  const foot = add(r, 'div', 'lyr', {left:'0px', top:'834px', width:W+'px',
    display:'flex', justifyContent:'center', gap:'110px'});
  const fstats = [['₹0','extra per branch or per seat'],['1 click','to switch branch, no second login'],['3','branches on one Pro plan']]
    .map(([v, k]) => {
      const b = add(foot, 'div', null, {textAlign:'center'});
      add(b, 'div', 'num', {fontSize:'52px', color:'#2170D9'}, v);
      add(b, 'div', null, {font:'400 20px/1 var(--font)', color:'#9AA3AF', marginTop:'12px'}, k);
      return b;
    });

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.28,E.out), 1 - p(t,5.84,0.31,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.45 * p(t,0.1,1.0,E.out));

    labelIn(lab, t, 0.14);
    staggerIn(h,   t, 0.26, 0.050, 0.85, E.out5);
    staggerIn(sub, t, 0.58, 0.018, 0.78, E.out5);

    /* cards fan in from a stack and settle into a row */
    names.forEach((c, i) => {
      const q = p(t, 0.92 + i*0.15, 1.0, E.soft);
      const fanX = (i - 1) * -160, fanR = (i - 1) * -7;
      tf(c, { x: fanX*(1-q), y: 80*(1-q) + Math.sin(t*0.8)*5,
              r: fanR*(1-q), s: 0.88 + 0.12*q, o: q });
    });
    fstats.forEach((b, i) => {
      const q = p(t, 1.72 + i*0.13, 0.75, E.soft);
      tf(b, { y: 26 - 26*q, o: q });
    });

    if (t > 5.44){
      const o = 1 - p(t, 5.46, 0.36, E.in3);
      staggerOut(h, t, 5.46, 0.010, 0.36);
      staggerOut(sub, t, 5.44, 0.005, 0.34);
      names.forEach(c => tf(c, { y: -34*(1-o) + Math.sin(t*0.8)*5, s: 1-0.05*(1-o), o }));
      fstats.forEach(b => tf(b, { o, y: -18*(1-o) }));
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 8 — PROOF  (52.65 → 60.2)
   ============================================================ */
scene('proof', 52.65, 7.55, function(r){
  const bg = darkBg(r, {bg:'#0B0E13'});
  const lab = sectionLabel(r, '06', 'PILOT RESULTS', 760, 128, true);
  const h = add(r, 'div', 'h2', {position:'absolute', left:'0px', top:'186px', width:W+'px',
    textAlign:'center', color:'#fff', fontSize:'74px'},
    words('30% more returning patients. In 90 days.'));

  const nums = [
    { to:30,   pre:'', suf:'%',  lbl:'more returning patients', dec:0 },
    { to:200,  pre:'', suf:'+',  lbl:'Indian dental clinics',   dec:0 },
    { to:8,    pre:'₹', suf:'k', lbl:'monthly WhatsApp cost cut', dec:0 },
    { to:5,    pre:'', suf:'', unit:'min', lbl:'to set up, no developer', dec:0 },
  ].map((s, i) => {
    const b = add(r, 'div', 'lyr', {left:(128 + i*424)+'px', top:'352px', width:'400px',
      textAlign:'center'});
    const v = add(b, 'div', 'num', {fontSize:'104px', color:'#fff'});
    add(b, 'div', null, {font:'400 22px/1.4 var(--font)', color:'rgba(255,255,255,.52)',
      marginTop:'20px'}, s.lbl);
    const ln = add(b, 'div', null, {width:'66px', height:'2px', background:'rgba(33,112,217,.8)',
      margin:'26px auto 0', transformOrigin:'center'});
    b._v = v; b._s = s; b._ln = ln; return b;
  });

  const quote = add(r, 'div', null, {position:'absolute', left:'316px', top:'668px', width:'1288px',
    textAlign:'center'});
  const qt = add(quote, 'div', null, {font:'500 34px/1.5 var(--font)', letterSpacing:'-.015em',
    color:'rgba(255,255,255,.88)'},
    words('“Dentomate cut our ₹12,000 WhatsApp bill to zero — and we saw 28% more recall appointments in the first two months.”'));
  const who = add(quote, 'div', null, {display:'flex', alignItems:'center', justifyContent:'center',
    gap:'16px', marginTop:'34px'});
  add(who, 'div', null, {width:'50px',height:'50px',borderRadius:'50%',
    background:'linear-gradient(135deg,#2170D9,#1A4D9E)', color:'#fff',
    font:'700 19px/50px var(--font)', textAlign:'center', letterSpacing:'.02em'}, 'VS');
  add(who, 'div', null, {textAlign:'left'},
    `<div style="font:600 22px/1 var(--font);color:#fff">Dr. Vikram Singh</div>
     <div style="font:400 19px/1 var(--font);color:rgba(255,255,255,.45);margin-top:8px">Founder, SmileCraft Dental · 3 clinics, Bengaluru</div>`);

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.30,E.out), 1 - p(t,7.24,0.31,E.lin)));
    drift(bg, t, 0.6);
    bg.grid.style.opacity = String(0.4 * p(t,0.1,1.1,E.out));

    labelIn(lab, t, 0.14);
    staggerIn(h, t, 0.26, 0.048, 0.85, E.out5);

    nums.forEach((b, i) => {
      const a = 0.95 + i*0.20;
      const q = p(t, a, 0.9, E.soft);
      tf(b, { y: 44 - 44*q, s: 0.9 + 0.1*q, o: q });
      const cq = p(t, a + 0.06, 1.25, E.out7);
      b._v.innerHTML = monoNum(b._s.pre + Math.round(b._s.to * cq) + b._s.suf)
        + (b._s.unit ? `<span class="unit" style="font-size:.52em;margin-left:.14em">${b._s.unit}</span>` : '');
      b._ln.style.transform = `scaleX(${p(t, a+0.45, 0.7, E.out4).toFixed(4)})`;
    });

    staggerIn(qt, t, 2.30, 0.014, 0.8, E.out5);
    const wq = p(t, 3.30, 0.8, E.soft);
    tf(who, { y: 24 - 24*wq, o: wq });

    if (t > 6.86){
      const o = 1 - p(t, 6.88, 0.36, E.in3);
      staggerOut(h, t, 6.88, 0.010, 0.36);
      staggerOut(qt, t, 6.86, 0.004, 0.34);
      nums.forEach(b => tf(b, { o, y: -26*(1-o), s: 1-0.06*(1-o) }));
      tf(who, { o }); tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 9 — PRICING  (60.15 → 66.7)
   ============================================================ */
scene('pricing', 60.15, 6.55, function(r){
  const bg = lightBg(r);
  const lab = sectionLabel(r, '07', 'SIMPLE, HONEST PRICING', 700, 104);
  const h = add(r, 'div', 'h2', {position:'absolute', left:'0px', top:'156px', width:W+'px',
    textAlign:'center', color:'#14171C', fontSize:'72px'},
    words('One prevented no-show pays for 7+ months.'));
  const sub = add(r, 'div', 'body', {position:'absolute', left:'460px', top:'268px', width:'1000px',
    textAlign:'center', color:'#6B7280'},
    words('Billed yearly. Free plan forever — no card required.'));

  const plans = [
    { n:'Free',    pr:'₹0',   per:'forever',  yr:'no card required',
      f:['Patient records & prescriptions','Auto post-care WhatsApp','Up to 20 new patients / month'], hot:false },
    { n:'Starter', pr:'₹333', per:'/month',   yr:'₹3,990 billed yearly',
      f:['Unlimited patients','Automatic overdue recalls','Custom letterhead + GST invoicing'], hot:false },
    { n:'Pro',     pr:'₹666', per:'/month',   yr:'₹7,990 billed yearly',
      f:['Unlimited recall campaigns','Up to 3 clinic branches','Priority WhatsApp support'], hot:true },
  ].map((pl, i) => {
    const hot = pl.hot;
    const c = add(r, 'div', 'card', { left:(268 + i*470)+'px', top:'386px',
      width:'420px', height:'478px', padding:'38px 36px',
      background: '#fff' });
    if (hot){
      c.style.background = 'linear-gradient(168deg,#181C23 0%,#11141A 100%)';
      c.style.borderColor = 'rgba(33,112,217,.4)';
      c.style.boxShadow = '0 24px 60px -16px rgba(33,112,217,.42),0 0 0 1px rgba(33,112,217,.22)';
      add(c, 'div', null, {position:'absolute', right:'30px', top:'-16px', padding:'9px 18px',
        borderRadius:'999px', background:'#2170D9', color:'#fff',
        font:'600 15px/1 var(--mono)', letterSpacing:'.12em'}, 'MOST POPULAR');
    }
    const ink = hot ? '#fff' : '#14171C', mut = hot ? 'rgba(255,255,255,.5)' : '#9AA3AF';
    add(c, 'div', null, {font:'600 24px/1 var(--font)', color:ink, letterSpacing:'-.01em'}, pl.n);
    const row = add(c, 'div', null, {display:'flex', alignItems:'baseline', gap:'10px', marginTop:'22px'});
    add(row, 'div', 'num', {fontSize:'62px', color: hot ? '#5B9BE8' : '#2170D9'}, pl.pr);
    add(row, 'div', null, {font:'400 22px/1 var(--font)', color:mut}, pl.per);
    add(c, 'div', null, {font:'400 19px/1 var(--mono)', color:mut, marginTop:'14px'}, monoNum(pl.yr));
    add(c, 'div', null, {height:'1px', background: hot ? 'rgba(255,255,255,.1)' : '#EDEFF3',
      margin:'30px 0 26px'});
    pl.f.forEach(f => {
      const fr = add(c, 'div', null, {display:'flex', gap:'13px', alignItems:'flex-start',
        marginBottom:'18px', font:'400 21px/1.35 var(--font)', color: hot ? 'rgba(255,255,255,.82)' : '#4B5563'});
      add(fr, 'div', null, {flex:'none', marginTop:'4px'},
        `<svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.4l3 3 6-6.6" stroke="${hot ? '#00C853' : '#00A844'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
      add(fr, 'span', null, null, f);
    });
    c._hot = hot; return c;
  });

  const roi = add(r, 'div', 'lyr', {left:'0px', top:'924px', width:W+'px', textAlign:'center',
    font:'500 28px/1 var(--font)', color:'#6B7280', letterSpacing:'-.01em'},
    words('One prevented no-show = ₹3,000 recovered. Most dentists see ROI in the first week.'));

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.28,E.out), 1 - p(t,6.24,0.31,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.45 * p(t,0.1,1.0,E.out));

    labelIn(lab, t, 0.12);
    staggerIn(h,   t, 0.24, 0.046, 0.85, E.out5);
    staggerIn(sub, t, 0.56, 0.018, 0.78, E.out5);

    plans.forEach((c, i) => {
      const q = p(t, 0.86 + i*0.17, 1.0, E.soft);
      const lift = c._hot ? p(t, 1.62, 0.9, E.soft) * 22 : 0;
      tf(c, { y: 76 - 76*q - lift + Math.sin(t*0.75)*4,
              s: (0.9 + 0.1*q) * (c._hot ? 1 + 0.028*p(t,1.62,0.9,E.soft) : 1), o: q });
    });

    staggerIn(roi, t, 2.10, 0.012, 0.75, E.out5);

    if (t > 5.86){
      const o = 1 - p(t, 5.88, 0.36, E.in3);
      staggerOut(h, t, 5.88, 0.010, 0.36);
      staggerOut(sub, t, 5.86, 0.005, 0.34);
      staggerOut(roi, t, 5.86, 0.004, 0.34);
      plans.forEach(c => tf(c, { y: -30*(1-o) - (c._hot?22:0), s: 1-0.06*(1-o), o }));
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 10 — END CARD  (66.65 → 72.8)
   ============================================================ */
scene('end', 66.65, 6.15, function(r){
  const bg = darkBg(r, {bg:'#0A0D12'});
  const wrap = add(r, 'div', 'lyr', {left:'0px', top:'0px', width:W+'px', height:H+'px',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'});

  const mk = add(wrap, 'div', null, {marginBottom:'40px'}, markSVG(112, '#fff', 7));
  const name = add(wrap, 'div', null, {font:'700 96px/1 var(--font)', color:'#fff',
    letterSpacing:'-.045em'}, chars('Dentomate'));
  const line = add(wrap, 'div', 'body', {color:'rgba(255,255,255,.62)', marginTop:'30px',
    fontSize:'36px'}, words('Start free. No card required.'));

  const btn = add(wrap, 'div', null, {marginTop:'56px', position:'relative'});
  const ring = add(btn, 'div', null, {position:'absolute', inset:'-10px', borderRadius:'999px',
    border:'2px solid rgba(33,112,217,.55)'});
  const b = add(btn, 'div', 'btn', null, 'app.dentomate.in');

  const foot = add(wrap, 'div', null, {marginTop:'62px', display:'flex', alignItems:'center',
    gap:'14px', font:'400 22px/1 var(--font)', color:'rgba(255,255,255,.4)'});
  add(foot, 'div', null, {width:'7px',height:'7px',borderRadius:'50%',background:'#00C853'});
  add(foot, 'span', null, null, 'Joined by 200+ Indian dental clinics');

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.34,E.out), 1 - p(t,5.72,0.43,E.lin)));
    drift(bg, t, 0.45);
    bg.grid.style.opacity = String(0.34 * p(t,0.2,1.3,E.out));

    const pop = p(t, 0.16, 1.2, E.spring);
    tf(mk, { s: 0.7 + 0.3*pop, y: 20 - 20*pop, o: p(t,0.16,0.5,E.out) });
    staggerIn(name, t, 0.54, 0.030, 0.85, E.out5);
    const ls = p(t, 0.54, 1.5, E.out5);
    name.style.letterSpacing = (0.02 - 0.065*ls).toFixed(4) + 'em';
    staggerIn(line, t, 1.00, 0.028, 0.8, E.out5);

    const bq = p(t, 1.42, 0.9, E.soft);
    tf(b, { y: 30 - 30*bq, s: 0.9 + 0.1*bq, o: bq });
    /* CTA ring pulses twice */
    const ph_ = ((t - 2.15) % 1.55 + 1.55) % 1.55;
    const pr = t > 2.15 ? u(ph_, 0, 1.05) : 0;
    tf(ring, { s: 1 + 0.10*pr, o: t > 2.15 ? (1 - pr) * 0.85 : 0 });

    const fq = p(t, 2.10, 0.8, E.soft);
    tf(foot, { y: 22 - 22*fq, o: fq });

    /* final slow push-out */
    const push = p(t, 0.1, 6.0, E.lin);
    tf(wrap, { s: 1 + 0.026*push, y: -8*push });
  }};
});

/* ============================================================
   GLOBAL OVERLAYS + FRAME DRIVER
   ============================================================ */
const overlay = add(S, 'div', null, {position:'absolute', inset:'0', pointerEvents:'none', zIndex:'50'});
/* fine film grain (static SVG noise, scrolled per-frame so it shimmers) */
const grain = add(overlay, 'div', null, {position:'absolute', inset:'-200px', opacity:'0.035',
  mixBlendMode:'overlay',
  backgroundImage:`url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>`
      .replace('%23n', '#n'))}")`,
  backgroundSize:'200px 200px'});
/* opening + closing fade from/to black */
const fade = add(overlay, 'div', null, {position:'absolute', inset:'0', background:'#000'});

const TOTAL = 72.8;
window.TOTAL_DURATION = TOTAL;

window.renderFrame = function(t){
  for (const s of scenes){
    const lt = t - s.start;
    const on = lt >= -0.0005 && lt <= s.dur + 0.0005;
    if (on){
      if (s.root.style.display !== 'block') s.root.style.display = 'block';
      s.root.style.opacity = '1';
      s.update(lt, t);
    } else if (s.root.style.display !== 'none'){
      s.root.style.display = 'none';
      s.root.style.opacity = '0';
    }
  }
  /* grain shimmer — quantised so it reads as grain, not motion */
  const gx = (Math.floor(t * 24) * 61) % 200, gy = (Math.floor(t * 24) * 113) % 200;
  grain.style.backgroundPosition = `${gx}px ${gy}px`;
  /* top and tail */
  fade.style.opacity = String(Math.max(1 - p(t, 0.0, 0.55, E.out), p(t, TOTAL - 0.85, 0.85, E.in3)));
};

/* signal readiness once fonts and every image have decoded */
window.SCENE_READY = false;
(async function ready(){
  try { await document.fonts.ready; } catch(e){}
  const imgs = [...document.images];
  await Promise.all(imgs.map(im => im.complete && im.naturalWidth
    ? Promise.resolve()
    : new Promise(res => { im.onload = res; im.onerror = res; })));
  try { await Promise.all(imgs.map(im => im.decode ? im.decode().catch(()=>{}) : null)); } catch(e){}
  window.renderFrame(0);
  window.SCENE_READY = true;
})();
