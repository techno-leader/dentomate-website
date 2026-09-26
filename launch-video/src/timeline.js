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

/* ---------------- brand mark ----------------
   The shipped logo files, not a redraw. Both are 512x512 RGBA with the mark
   itself occupying 330x399 in the middle, so elements are sized from the
   mark's visual height and the transparent padding is subtracted from the
   gap below it. logo.png is the solid mark the site uses on light
   backgrounds; logo-dark.png is the outlined one it uses on dark.        */
const MARK_BOX = 399 / 512;            /* mark height ÷ canvas height */
const MARK_PAD = (512 - 454) / 512;    /* transparent padding below the mark */
function markImg(parent, visualH, variant, style){
  const px = visualH / MARK_BOX;
  const d = add(parent, 'div', null, Object.assign({ position:'relative',
    width:px+'px', height:px+'px' }, style || {}));
  const im = add(d, 'img', null, { position:'absolute', left:'0', top:'0',
    width:px+'px', height:px+'px', display:'block' });
  im.src = IMG + (variant === 'outline' ? 'logo-dark.png' : 'logo.png');
  d._img = im; d._px = px;
  return d;
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


/* deterministic RNG so the opener's scatter is identical every render */
function rnd(seed){
  let s = seed >>> 0;
  return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* ============================================================
   SCENE 0 — KINETIC OPENER  (0.00 → 5.60)
   Pure motion graphics. Three words, nothing else to read.
   ============================================================ */
scene('opener', 0.0, 5.60, function(r){
  add(r, 'div', null, {position:'absolute', inset:'0', background:'#07090C'});
  const gA = add(r, 'div', 'glow', {width:'900px', height:'900px',
    background:'rgba(33,112,217,.30)', left:'-200px', top:'-260px', opacity:'0'});
  const gB = add(r, 'div', 'glow', {width:'800px', height:'800px',
    background:'rgba(26,77,158,.26)', left:'1300px', top:'500px', opacity:'0'});

  const gridWrap = add(r, 'div', null, {position:'absolute', inset:'0', overflow:'hidden'});
  const grid = add(gridWrap, 'div', 'grid-bg', {opacity:'0'});

  /* the two hairlines that strike first */
  const hLine = add(r, 'div', null, {position:'absolute', left:'0px', top:'539px',
    width:W+'px', height:'1.5px', background:'rgba(120,175,245,.9)', transformOrigin:'center'});
  const vLine = add(r, 'div', null, {position:'absolute', left:'959px', top:'0px',
    width:'1.5px', height:H+'px', background:'rgba(120,175,245,.45)', transformOrigin:'center'});

  /* an abstracted record list that streaks in and then collapses */
  const field = add(r, 'div', null, {position:'absolute', inset:'0', willChange:'transform,opacity'});
  const rg = rnd(20260926);
  const chips = [];
  for (let row = 0; row < 8; row++){
    const y = 128 + row * 104;
    let x = 168 + rg() * 130;
    const n = 2 + Math.floor(rg() * 2);
    for (let k = 0; k < n; k++){
      const w = 190 + rg() * 430;
      if (x + w > 1800) break;
      const hot = rg() > 0.72, tall = rg() > 0.74;
      const c = add(field, 'div', null, {position:'absolute', left:x+'px', top:y+'px',
        width:w+'px', height:(tall ? 34 : 18)+'px', borderRadius:'999px',
        background: hot ? 'rgba(33,112,217,.72)' : 'rgba(255,255,255,.125)',
        border:'1px solid rgba(255,255,255,.10)', willChange:'transform,opacity'});
      chips.push({ n:c, dir: (row % 2) ? 1 : -1, d: row*0.042 + k*0.028 + rg()*0.05 });
      x += w + 44 + rg() * 90;
    }
  }
  /* accent dots riding the same grid */
  const dots = [];
  for (let i = 0; i < 14; i++){
    const d = add(field, 'div', null, {position:'absolute',
      left:(150 + rg()*1620)+'px', top:(120 + rg()*840)+'px',
      width:'9px', height:'9px', borderRadius:'50%',
      background: rg() > 0.5 ? 'rgba(0,200,83,.75)' : 'rgba(120,175,245,.7)'});
    dots.push({ n:d, d: 0.9 + rg()*0.7 });
  }

  /* speed streaks, in two bursts */
  const streaks = [];
  for (let i = 0; i < 26; i++){
    const burst2 = i >= 12;
    const s = add(r, 'div', null, {position:'absolute',
      left:'760px', top:(90 + rg()*900)+'px',
      width:(120 + rg()*260)+'px', height:'2px', borderRadius:'2px',
      background:'linear-gradient(90deg,rgba(120,175,245,0),rgba(160,200,255,.9),rgba(120,175,245,0))',
      opacity:'0', willChange:'transform,opacity'});
    streaks.push({ n:s, at: burst2 ? (3.58 + rg()*0.82) : (0.94 + rg()*0.60),
      dir: rg() > 0.5 ? 1 : -1 });
  }

  /* two thin rings that pulse on the word hits */
  const rings = [0, 1].map(i => add(r, 'div', null, {position:'absolute',
    left:'960px', top:'540px', marginLeft:'-260px', marginTop:'-260px',
    boxSizing:'border-box', width:'520px', height:'520px', borderRadius:'50%',
    border:'1.5px solid rgba(120,175,245,.5)', opacity:'0'}));

  /* the only three words in the opener */
  const BEATS = [1.95, 2.50, 3.05];
  const wordNodes = ['PATIENTS', 'RECORDS', 'RECALLS'].map(txt => {
    const holder = add(r, 'div', null, {position:'absolute', inset:'0',
      display:'none', alignItems:'center', justifyContent:'center'});
    const tx = add(holder, 'div', null, {font:'700 152px/1 var(--font)', color:'#fff',
      letterSpacing:'-.045em', whiteSpace:'nowrap'}, chars(txt));
    holder._tx = tx; return holder;
  });

  /* the beat of silence before the logo */
  const endLine = add(r, 'div', null, {position:'absolute', left:'660px', top:'539px',
    width:'600px', height:'2px', background:'rgba(120,175,245,.9)',
    transformOrigin:'center', opacity:'0'});
  const endDot = add(r, 'div', null, {position:'absolute', left:'953px', top:'532px',
    width:'14px', height:'14px', borderRadius:'50%', background:'#5B9BE8', opacity:'0'});

  add(r, 'div', 'vig', {background:
    'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,.5) 74%, rgba(0,0,0,.88) 100%)'});

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.04,E.lin), 1 - p(t,5.44,0.16,E.lin)));

    const gq = p(t, 0.5, 1.6, E.out);
    gA.style.opacity = String(0.85 * gq); gB.style.opacity = String(0.7 * gq);
    tf(gA, { x: Math.sin(t*0.6)*44, y: Math.cos(t*0.5)*30, s: 1 + 0.06*Math.sin(t*0.8) });
    tf(gB, { x: Math.cos(t*0.55)*48, y: Math.sin(t*0.42)*36, s: 1 + 0.06*Math.cos(t*0.7) });

    /* A — the strike */
    const hl = p(t, 0.28, 0.42, E.out5);
    hLine.style.transform = `scaleX(${hl.toFixed(4)})`;
    hLine.style.opacity = String(hl * (1 - p(t, 1.30, 0.55, E.lin)));
    const vl = p(t, 0.40, 0.40, E.out5);
    vLine.style.transform = `scaleY(${vl.toFixed(4)})`;
    vLine.style.opacity = String(vl * 0.75 * (1 - p(t, 1.22, 0.50, E.lin)));

    /* grid snaps open from the centre */
    const grq = p(t, 0.50, 0.62, E.out4);
    grid.style.opacity = String(0.62 * grq * (1 - 0.6*p(t, 3.7, 0.9, E.lin)));
    grid.style.clipPath = `inset(${((1-grq)*50).toFixed(2)}% ${((1-grq)*50).toFixed(2)}% ${((1-grq)*50).toFixed(2)}% ${((1-grq)*50).toFixed(2)}%)`;

    /* word hits dim and shove the field */
    let dim = 0, shove = 0;
    BEATS.forEach((a, i) => {
      const k = 1 - Math.min(1, Math.abs(t - (a + 0.10)) / 0.42);
      if (k > dim) dim = k;
      const s = 1 - Math.min(1, Math.abs(t - a) / 0.30);
      if (s > shove) shove = s * (i % 2 ? -1 : 1);
    });

    /* B — chips streak in, then the whole field collapses and whips out */
    const conv = p(t, 3.60, 0.92, E.inOutQ);
    const whip = p(t, 4.48, 0.26, E.in3);
    const fAlpha = (1 - 0.55*dim) * (1 - 0.88*conv) * (1 - whip);
    chips.forEach(c => {
      const q = p(t, 0.86 + c.d, 0.70, E.out5);
      const off = c.dir * (1 - q) * 1560;
      const str = 1 + (1-q)*(1-q)*7;
      c.n.style.transform = `translate3d(${off.toFixed(1)}px,0,0) scaleX(${str.toFixed(3)})`;
      c.n.style.opacity = String(Math.min(1, q*2.4) * fAlpha);
    });
    dots.forEach(d => {
      const q = p(t, d.d, 0.5, E.soft);
      tf(d.n, { s: q, o: q * fAlpha * 0.9 });
    });
    field.style.transform =
      `translate3d(${(shove*26).toFixed(1)}px,0,0) scale(${(1 - 0.82*conv).toFixed(4)}) scaleX(${(1 + whip*16).toFixed(3)})`;
    field.style.opacity = '1';

    /* streaks */
    streaks.forEach(s => {
      const q = u(t, s.at, 0.32);
      if (q <= 0 || q >= 1){ s.n.style.opacity = '0'; return; }
      s.n.style.opacity = String(Math.sin(q*Math.PI) * 0.8);
      s.n.style.transform =
        `translate3d(${((q - 0.5) * 2 * s.dir * 1500).toFixed(0)}px,0,0) scaleX(${(1 + Math.sin(q*Math.PI)*2.6).toFixed(2)})`;
    });

    /* rings pulse outward on each word */
    rings.forEach((rn, i) => {
      const a = BEATS[i] || BEATS[2];
      const q = u(t, a - 0.04, 0.72);
      tf(rn, { s: 0.42 + q*0.95, o: q > 0 && q < 1 ? (1-q)*0.55 : 0 });
    });

    /* C — the three words */
    wordNodes.forEach((wn, i) => {
      const a = BEATS[i], dur = 0.50;
      const on = t >= a - 0.03 && t < a + dur;
      wn.style.display = on ? 'flex' : 'none';
      if (!on) return;
      const q = p(t, a, 0.24, E.out5);
      const out = p(t, a + dur - 0.13, 0.13, E.in3);
      staggerIn(wn._tx, t, a, 0.011, 0.28, E.out5);
      tf(wn, { s: 1.20 - 0.20*q - 0.05*out, o: Math.min(1, q*3.5) * (1 - out) });
    });

    /* D — the held beat before the logo */
    const lq = p(t, 4.62, 0.36, E.out5);
    endLine.style.transform = `scaleX(${lq.toFixed(4)})`;
    endLine.style.opacity = String(lq * (1 - p(t, 5.24, 0.22, E.lin)));
    const dq = p(t, 4.70, 0.5, E.soft);
    tf(endDot, { s: dq * (1 + 0.28*Math.sin((t-4.7)*7)), o: dq * (1 - p(t, 5.22, 0.24, E.lin)) });
  }};
});

/* ============================================================
   SCENE 1 — LOGO REVEAL  (5.45 → 10.60)
   ============================================================ */
scene('logo', 5.45, 5.15, function(r){
  const bg = lightBg(r);
  const flash = add(r, 'div', null, {position:'absolute', inset:'0', background:'#fff'});
  const wrap = add(r, 'div', 'lyr', {left:'0px', top:'0px', width:W+'px', height:H+'px',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'});

  const MK = 150, MKPX = MK / MARK_BOX;
  const mk = add(wrap, 'div', null, { position:'relative', width:MKPX+'px',
    height:MKPX+'px', marginBottom:(46 - MKPX*MARK_PAD).toFixed(1)+'px' });
  const mkOut = add(mk, 'img', null, { position:'absolute', left:'0', top:'0',
    width:MKPX+'px', height:MKPX+'px', display:'block' });
  mkOut.src = IMG + 'logo-dark.png';
  const mkFill = add(mk, 'img', null, { position:'absolute', left:'0', top:'0',
    width:MKPX+'px', height:MKPX+'px', display:'block' });
  mkFill.src = IMG + 'logo.png';

  const name = add(wrap, 'div', null, {font:'700 116px/1 var(--font)', color:'#14171C',
    letterSpacing:'-.045em'}, chars('Dentomate'));
  const tag  = add(wrap, 'div', 'body', {color:'#6B7280', marginTop:'30px', fontSize:'34px'},
    words('Dental clinic software, built for Indian practice.'));
  const pill = add(wrap, 'div', 'tag', {marginTop:'44px', opacity:'0'}, 'app.dentomate.in');

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.08,E.lin), 1 - p(t,4.82,0.33,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.5 * p(t,0.35,1.2,E.out));
    flash.style.opacity = String(1 - p(t, 0.02, 0.38, E.out4));

    mkOut.style.opacity = p(t, 0.26, 0.66, E.out5).toFixed(4);
    const fillq = p(t, 0.68, 0.90, E.inOutQ);
    mkFill.style.clipPath = `inset(${((1 - fillq) * 100).toFixed(2)}% 0% 0% 0%)`;
    const pop = p(t, 0.30, 1.20, E.spring);
    tf(mk, { s: 0.68 + 0.32*pop, y: 24 - 24*pop });

    staggerIn(name, t, 0.80, 0.030, 0.82, E.out5);
    name.style.letterSpacing = (0.03 - 0.075*p(t, 0.80, 1.5, E.out5)).toFixed(4) + 'em';
    staggerIn(tag, t, 1.32, 0.026, 0.78, E.out5);
    const pq = p(t, 1.82, 0.75, E.soft);
    tf(pill, { y: 26 - 26*pq, s: 0.92 + 0.08*pq, o: pq });

    tf(wrap, { s: 1 + 0.028*p(t, 0.2, 4.8, E.lin), y: -6*p(t, 0.2, 4.8, E.lin) });

    if (t > 4.45){
      staggerOut(name, t, 4.48, 0.012, 0.40);
      staggerOut(tag,  t, 4.46, 0.008, 0.38);
      const o = 1 - p(t, 4.46, 0.40, E.in3);
      tf(mk,   { s: 1 - 0.12*(1-o), y: -30*(1-o), o });
      tf(pill, { o, y: -20*(1-o) });
    }
  }};
});

/* ============================================================
   SCENE 2 — THE DASHBOARD  (10.45 → 17.60)
   ============================================================ */
scene('hero', 10.45, 7.15, function(r){
  const bg = lightBg(r);
  const lab = sectionLabel(r, '01', 'THE DASHBOARD', 760, 96);
  const h = add(r, 'div', 'h2', {position:'absolute', left:'0px', top:'150px', width:W+'px',
    textAlign:'center', color:'#14171C'}, words('Your whole practice. One screen.'));

  const bw = browser(r, { x:340, y:318, w:1240, h:720, img:'dashboard-tablet.png', ih:2160 });
  const chips = [
    { t:'A patient registered in seconds', x:116,  y:452, d:0.0,  dot:'#00C853' },
    { t:'Revenue, live',                   x:1560, y:706, d:0.16, dot:'#2170D9' },
  ].map(c => {
    const n = add(r, 'div', 'chip', { left:c.x+'px', top:c.y+'px' },
      `<span class="d" style="background:${c.dot}"></span>${c.t}`);
    n._d = c.d; return n;
  });

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.26,E.out), 1 - p(t,6.80,0.32,E.lin)));
    drift(bg, t, 0.55);
    bg.grid.style.opacity = String(0.45 * p(t,0.1,1.2,E.out));

    labelIn(lab, t, 0.16);
    staggerIn(h, t, 0.30, 0.055, 0.85, E.out5);

    const rise = p(t, 0.52, 1.30, E.soft);
    const push = p(t, 0.52, 6.2, E.out);
    tf(bw, { y: 92 - 92*rise + Math.sin(t*0.7)*5, s: (0.90 + 0.10*rise) * (1 + 0.035*push), o: rise });
    bw.scrollTo(lerp(0, 400, p(t, 1.15, 5.0, E.inOut)));
    typeUrl(bw._url, 'app.dentomate.in/dashboard', t, 0.70, 1.20);

    chips.forEach(c => {
      const q = p(t, 1.30 + c._d, 0.82, E.soft);
      tf(c, { y: 30 - 30*q + Math.sin(t*0.9 + c._d*9)*6, s: 0.86 + 0.14*q, o: q });
    });

    if (t > 6.40){
      const o = 1 - p(t, 6.42, 0.40, E.in3);
      staggerOut(h, t, 6.42, 0.012, 0.40);
      tf(bw, { y: -46*(1-o), s: 1.035 + 0.05*(1-o), o });
      chips.forEach(c => tf(c, { o: o*o, s: 1 - 0.1*(1-o) }));
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 3 — WHATSAPP AUTO-SEND  (17.45 → 24.70)
   ============================================================ */
scene('whatsapp', 17.45, 7.25, function(r){
  const bg = lightBg(r, {bg:'linear-gradient(170deg,#FFFFFF 0%,#F6FAF7 60%,#EDF6F1 100%)'});
  const lab = sectionLabel(r, '02', 'WHATSAPP', 140, 268);
  const h = add(r, 'div', 'h3', {position:'absolute', left:'140px', top:'326px', width:'620px',
    color:'#14171C'}, words('Sent the moment they leave your chair.'));
  const feats = ['Your logo. Your signature.', 'No WhatsApp API bill.']
    .map((f, i) => {
      const n = add(r, 'div', 'lyr', {left:'140px', top:(608 + i*66)+'px', display:'flex',
        alignItems:'center', gap:'16px', font:'500 27px/1 var(--font)', color:'#14171C'});
      add(n, 'div', null, {width:'28px',height:'28px',borderRadius:'50%',background:'rgba(0,200,83,.14)',
        display:'flex',alignItems:'center',justifyContent:'center',flex:'none'},
        `<svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.4l3 3 6-6.6" stroke="#00A844" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
      add(n, 'span', null, null, f);
      return n;
    });

  const bw = browser(r, { x:830, y:170, w:830, h:700, img:'inbox-tablet.png', ih:2160 });
  const ph = phone(r, { x:1382, y:250, w:376, h:748, img:'inbox-mobile.png', ih:1688 });

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
    r.style.opacity = String(Math.min(p(t,0.0,0.26,E.out), 1 - p(t,6.90,0.32,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.30 * p(t,0.1,1.0,E.out));

    labelIn(lab, t, 0.14);
    staggerIn(h, t, 0.26, 0.048, 0.85, E.out5);
    feats.forEach((f, i) => {
      const q = p(t, 1.05 + i*0.18, 0.72, E.out5);
      tf(f, { x: -26 + 26*q, o: q });
    });

    const bq = p(t, 0.40, 1.25, E.soft);
    tf(bw, { x: 74 - 74*bq, y: Math.sin(t*0.62)*6, s: 0.94 + 0.06*bq, o: bq });
    bw.scrollTo(lerp(0, 150, p(t, 1.3, 5.0, E.inOut)));
    typeUrl(bw._url, 'app.dentomate.in/whatsapp', t, 0.66, 1.05);

    const pq = p(t, 1.00, 1.40, E.soft);
    tf(ph, { y: 120 - 120*pq + Math.cos(t*0.74)*7, x: 30 - 30*pq, s: 0.92 + 0.08*pq, o: pq });
    ph.scrollTo(lerp(0, 74, p(t, 1.9, 2.4, E.inOut)));

    const fq  = p(t, 2.20, 1.10, E.inOutQ);
    const pop = p(t, 2.15, 0.52, E.soft);
    tf(badge, { x: 196*fq, y: 402*fq - Math.sin(fq*Math.PI)*124, s: (0.7 + 0.3*pop) * (1 - 0.20*fq),
      o: Math.min(pop, 1 - p(t, 3.16, 0.26, E.lin)) });

    const tq = p(t, 3.42, 0.58, E.soft);
    tf(ticks, { y: 16 - 16*tq, s: 0.8 + 0.2*tq, o: tq });

    if (t > 6.50){
      const o = 1 - p(t, 6.52, 0.38, E.in3);
      staggerOut(h, t, 6.52, 0.010, 0.38);
      feats.forEach(f => tf(f, { o, x: -18*(1-o) }));
      tf(bw, { x: -40*(1-o), s: 1 - 0.04*(1-o), o });
      tf(ph, { x: -30*(1-o), y: -24*(1-o), s: 1 - 0.05*(1-o), o });
      tf(ticks, { o }); tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 4 — PATIENT RECORDS  (24.55 → 31.10)
   ============================================================ */
scene('records', 24.55, 6.55, function(r){
  const bg = lightBg(r);
  const lab = sectionLabel(r, '03', 'RECORDS', 1130, 296);
  const h = add(r, 'div', 'h3', {position:'absolute', left:'1130px', top:'354px', width:'460px',
    color:'#14171C'}, words('Every record. One place.'));
  const chips = ['Notes, X-rays, payments', 'Search by name or phone']
    .map((c, i) => add(r, 'div', 'lyr', {left:'1130px', top:(576 + i*62)+'px',
      display:'flex', alignItems:'center', gap:'15px', font:'500 26px/1 var(--font)', color:'#14171C'},
      `<span style="width:8px;height:8px;border-radius:50%;background:#2170D9;display:block;flex:none"></span>${c}`));

  const bw = browser(r, { x:150, y:150, w:880, h:780, img:'record-tablet.png', ih:2160 });
  const ring = add(r, 'div', null, {position:'absolute', borderRadius:'16px',
    border:'2.5px solid #2170D9', boxShadow:'0 0 0 7px rgba(33,112,217,.13)', pointerEvents:'none'});
  const ringLbl = add(r, 'div', null, {position:'absolute',
    padding:'9px 17px', borderRadius:'999px', background:'#2170D9', color:'#fff',
    font:'600 18px/1 var(--mono)', letterSpacing:'.08em', whiteSpace:'nowrap'}, '');

  const SC = 880 / 1640;
  const COL_X = 225, COL_W = 1306;
  const stops = [
    { at:1.10, scroll:0,    sy:329,  sh:238, lbl:'TREATMENT PLAN'    },
    { at:2.55, scroll:182,  sy:643,  sh:447, lbl:'PRESCRIPTION'      },
    { at:3.95, scroll:792,  sy:1820, sh:326, lbl:'TREATMENT CHARGES' },
  ];

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.26,E.out), 1 - p(t,6.22,0.31,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.42 * p(t,0.1,1.0,E.out));

    labelIn(lab, t, 0.14);
    staggerIn(h, t, 0.26, 0.046, 0.85, E.out5);
    chips.forEach((c, i) => {
      const q = p(t, 1.00 + i*0.16, 0.7, E.out5);
      tf(c, { x: 26 - 26*q, o: q });
    });

    const bq = p(t, 0.32, 1.20, E.soft);
    tf(bw, { x: -70 + 70*bq, y: Math.sin(t*0.66)*5, s: 0.93 + 0.07*bq, o: bq });
    typeUrl(bw._url, 'app.dentomate.in/patient', t, 0.60, 0.95);

    let sc = 0;
    for (let i = 0; i < stops.length; i++){
      const from = i === 0 ? 0 : stops[i-1].scroll;
      sc = lerp(from, stops[i].scroll, p(t, stops[i].at - 0.50, 0.72, E.inOut));
      if (t < stops[i].at + 0.8) break;
    }
    bw.scrollTo(sc * SC);

    let cur = -1;
    stops.forEach((st, i) => { if (t >= st.at - 0.02) cur = i; });
    if (cur >= 0){
      const st = stops[cur];
      const app  = p(t, st.at, 0.52, E.soft);
      const gone = cur === stops.length - 1 ? 0 : p(t, stops[cur+1].at - 0.40, 0.28, E.lin);
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

    if (t > 5.80){
      const o = 1 - p(t, 5.82, 0.36, E.in3);
      staggerOut(h, t, 5.82, 0.010, 0.36);
      chips.forEach(c => tf(c, { o, x: 18*(1-o) }));
      tf(bw, { x: 40*(1-o), s: 1 - 0.04*(1-o), o });
      ring.style.opacity = String(Number(ring.style.opacity||0) * o);
      ringLbl.style.opacity = String(Number(ringLbl.style.opacity||0) * o);
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 5 — ANALYTICS  (30.95 → 38.10)
   ============================================================ */
scene('analytics', 30.95, 7.15, function(r){
  const bg = darkBg(r, {bg:'#0C0F14'});
  const lab = sectionLabel(r, '04', 'ANALYTICS', 1090, 268, true);
  const h = add(r, 'div', 'h3', {position:'absolute', left:'1090px', top:'324px', width:'700px',
    color:'#fff', fontSize:'58px'}, words("Know what's actually growing."));

  const bw = browser(r, { x:118, y:170, w:880, h:748, img:'analytics-tablet.png', ih:2160 });

  const stats = [
    { k:'MTD REVENUE',        to:76000, pre:'₹', suf:'',  dec:0, col:'#fff'    },
    { k:'CONSULT → TREATMENT',to:84.0,  pre:'',  suf:'%', dec:1, col:'#5B9BE8' },
    { k:'REVENUE / PATIENT',  to:9496,  pre:'₹', suf:'',  dec:0, col:'#00C853' },
  ].map((s, i) => {
    const c = add(r, 'div', 'card dk', { left:'1090px', top:(500 + i*142)+'px',
      width:'690px', height:'124px', padding:'22px 30px' });
    add(c, 'div', null, {font:'600 17px/1 var(--mono)', letterSpacing:'.16em',
      color:'rgba(255,255,255,.42)'}, s.k);
    const v = add(c, 'div', 'num', {fontSize:'50px', color:s.col, marginTop:'16px'});
    c._v = v; c._s = s; return c;
  });

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.28,E.out), 1 - p(t,6.82,0.31,E.lin)));
    drift(bg, t, 0.55);
    bg.grid.style.opacity = String(0.42 * p(t,0.1,1.1,E.out));

    labelIn(lab, t, 0.16);
    staggerIn(h, t, 0.28, 0.046, 0.85, E.out5);

    const bq = p(t, 0.34, 1.25, E.soft);
    tf(bw, { x: -66 + 66*bq, y: Math.sin(t*0.62)*6, s: 0.93 + 0.07*bq, o: bq });
    typeUrl(bw._url, 'app.dentomate.in/analytics', t, 0.62, 1.05);
    bw.scrollTo(lerp(0, 560, p(t, 1.35, 3.0, E.inOut)) * (880/1640));

    stats.forEach((c, i) => {
      const a = 1.20 + i*0.26;
      const q = p(t, a, 0.82, E.soft);
      tf(c, { x: 40 - 40*q, y: 16 - 16*q, o: q });
      const cq = p(t, a + 0.10, 1.05, E.out7);
      const val = c._s.to * cq;
      c._v.innerHTML = monoNum(c._s.pre + (c._s.dec ? val.toFixed(c._s.dec) : inr(val)) + c._s.suf);
    });

    if (t > 6.40){
      const o = 1 - p(t, 6.42, 0.38, E.in3);
      staggerOut(h, t, 6.42, 0.010, 0.38);
      stats.forEach(c => tf(c, { o, x: 26*(1-o) }));
      tf(bw, { x: -34*(1-o), s: 1 - 0.04*(1-o), o });
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 6 — MULTI-CLINIC  (37.95 → 43.60)
   ============================================================ */
scene('clinics', 37.95, 5.65, function(r){
  const bg = lightBg(r);
  const lab = sectionLabel(r, '05', 'MULTI-CLINIC', 760, 174);
  const h = add(r, 'div', 'h2', {position:'absolute', left:'0px', top:'228px', width:W+'px',
    textAlign:'center', color:'#14171C', fontSize:'76px'},
    words('Three branches. One account.'));

  const names = [
    { n:'Sharma Dental Care',  c:'Bengaluru', tag:'HQ',       col:'#2170D9' },
    { n:'SmileCraft Dental',   c:'Mumbai',    tag:'BRANCH 2', col:'#5B9BE8' },
    { n:'Pearl Dental Studio', c:'Delhi',     tag:'BRANCH 3', col:'#00C853' },
  ].map((b, i) => {
    const c = add(r, 'div', 'card', { left:(292 + i*452)+'px', top:'414px',
      width:'404px', height:'218px', padding:'34px 34px' });
    add(c, 'div', null, {display:'inline-flex', alignItems:'center', padding:'8px 15px',
      borderRadius:'999px', background:'rgba(33,112,217,.09)', color:b.col,
      font:'600 15px/1 var(--mono)', letterSpacing:'.14em'}, b.tag);
    add(c, 'div', null, {font:'700 33px/1.16 var(--font)', letterSpacing:'-.02em',
      color:'#14171C', marginTop:'28px'}, b.n);
    add(c, 'div', null, {font:'400 22px/1 var(--font)', color:'#9AA3AF', marginTop:'12px'}, b.c);
    return c;
  });

  const foot = add(r, 'div', 'lyr', {left:'0px', top:'764px', width:W+'px',
    display:'flex', justifyContent:'center', gap:'150px'});
  const fstats = [['₹0','extra per branch'],['1 click','to switch']]
    .map(([v, k]) => {
      const b = add(foot, 'div', null, {textAlign:'center'});
      add(b, 'div', 'num', {fontSize:'56px', color:'#2170D9'}, v);
      add(b, 'div', null, {font:'400 21px/1 var(--font)', color:'#9AA3AF', marginTop:'14px'}, k);
      return b;
    });

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.26,E.out), 1 - p(t,5.34,0.30,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.45 * p(t,0.1,1.0,E.out));

    labelIn(lab, t, 0.14);
    staggerIn(h, t, 0.24, 0.050, 0.85, E.out5);

    names.forEach((c, i) => {
      const q = p(t, 0.80 + i*0.14, 0.95, E.soft);
      tf(c, { x: ((i - 1) * -160)*(1-q), y: 80*(1-q) + Math.sin(t*0.8)*5,
              r: ((i - 1) * -7)*(1-q), s: 0.88 + 0.12*q, o: q });
    });
    fstats.forEach((b, i) => {
      const q = p(t, 1.55 + i*0.14, 0.72, E.soft);
      tf(b, { y: 26 - 26*q, o: q });
    });

    if (t > 4.90){
      const o = 1 - p(t, 4.92, 0.34, E.in3);
      staggerOut(h, t, 4.92, 0.010, 0.34);
      names.forEach(c => tf(c, { y: -34*(1-o) + Math.sin(t*0.8)*5, s: 1-0.05*(1-o), o }));
      fstats.forEach(b => tf(b, { o, y: -18*(1-o) }));
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 7 — PILOT RESULT  (43.45 → 49.10)
   ============================================================ */
scene('result', 43.45, 5.65, function(r){
  const bg = darkBg(r, {bg:'#0B0E13'});
  const lab = sectionLabel(r, '06', 'PILOT RESULTS', 760, 214, true);

  const big = add(r, 'div', 'lyr', {left:'0px', top:'286px', width:W+'px', textAlign:'center'});
  const bigV = add(big, 'div', 'num', {fontSize:'210px', color:'#fff', lineHeight:'1'});
  const bigL = add(big, 'div', null, {font:'400 34px/1 var(--font)',
    color:'rgba(255,255,255,.60)', marginTop:'26px'},
    words('more returning patients, within 90 days'));

  const sub = add(r, 'div', 'lyr', {left:'0px', top:'714px', width:W+'px',
    display:'flex', justifyContent:'center', gap:'190px'});
  const subs = [['₹8k','monthly WhatsApp cost, gone'],['5 min','to go live']]
    .map(([v, k]) => {
      const b = add(sub, 'div', null, {textAlign:'center'});
      add(b, 'div', 'num', {fontSize:'64px', color:'#5B9BE8'}, v);
      add(b, 'div', null, {font:'400 21px/1 var(--font)', color:'rgba(255,255,255,.44)',
        marginTop:'16px'}, k);
      return b;
    });

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.28,E.out), 1 - p(t,5.34,0.30,E.lin)));
    drift(bg, t, 0.6);
    bg.grid.style.opacity = String(0.4 * p(t,0.1,1.1,E.out));

    labelIn(lab, t, 0.16);

    const q = p(t, 0.42, 0.95, E.soft);
    tf(big, { y: 46 - 46*q, s: 0.90 + 0.10*q, o: q });
    bigV.textContent = Math.round(30 * p(t, 0.50, 1.25, E.out7)) + '%';
    staggerIn(bigL, t, 1.35, 0.022, 0.75, E.out5);

    subs.forEach((b, i) => {
      const sq = p(t, 1.95 + i*0.18, 0.78, E.soft);
      tf(b, { y: 30 - 30*sq, o: sq });
    });

    if (t > 4.90){
      const o = 1 - p(t, 4.92, 0.34, E.in3);
      staggerOut(bigL, t, 4.92, 0.008, 0.34);
      tf(big, { y: -30*(1-o), s: 1 - 0.06*(1-o), o });
      subs.forEach(b => tf(b, { o, y: -20*(1-o) }));
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 8 — PRICING  (48.95 → 55.20)
   ============================================================ */
scene('pricing', 48.95, 6.25, function(r){
  const bg = lightBg(r);
  const lab = sectionLabel(r, '07', 'PRICING', 760, 150);
  const h = add(r, 'div', 'h2', {position:'absolute', left:'0px', top:'204px', width:W+'px',
    textAlign:'center', color:'#14171C', fontSize:'76px'},
    words('Start free. Upgrade when it pays.'));

  const plans = [
    { n:'Free',    pr:'₹0',   per:'forever', yr:'no card required',
      f:'Records, prescriptions, post-care WhatsApp', hot:false },
    { n:'Starter', pr:'₹333', per:'/month',  yr:'₹3,990 billed yearly',
      f:'Unlimited patients + automatic recalls',     hot:false },
    { n:'Pro',     pr:'₹666', per:'/month',  yr:'₹7,990 billed yearly',
      f:'Unlimited campaigns + 3 branches',           hot:true  },
  ].map((pl, i) => {
    const hot = pl.hot;
    const c = add(r, 'div', 'card', { left:(268 + i*470)+'px', top:'396px',
      width:'420px', height:'330px', padding:'38px 36px', background:'#fff' });
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
      margin:'28px 0 24px'});
    add(c, 'div', null, {font:'400 21px/1.4 var(--font)',
      color: hot ? 'rgba(255,255,255,.82)' : '#4B5563'}, pl.f);
    c._hot = hot; return c;
  });

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.26,E.out), 1 - p(t,5.94,0.30,E.lin)));
    drift(bg, t, 0.5);
    bg.grid.style.opacity = String(0.45 * p(t,0.1,1.0,E.out));

    labelIn(lab, t, 0.12);
    staggerIn(h, t, 0.24, 0.046, 0.85, E.out5);

    plans.forEach((c, i) => {
      const q = p(t, 0.80 + i*0.16, 0.95, E.soft);
      const lift = c._hot ? p(t, 1.50, 0.85, E.soft) * 22 : 0;
      tf(c, { y: 76 - 76*q - lift + Math.sin(t*0.75)*4,
              s: (0.9 + 0.1*q) * (c._hot ? 1 + 0.028*p(t,1.50,0.85,E.soft) : 1), o: q });
    });

    if (t > 5.55){
      const o = 1 - p(t, 5.57, 0.34, E.in3);
      staggerOut(h, t, 5.57, 0.010, 0.34);
      plans.forEach(c => tf(c, { y: -30*(1-o) - (c._hot?22:0), s: 1-0.06*(1-o), o }));
      tf(lab, { o });
    }
  }};
});

/* ============================================================
   SCENE 9 — END CARD  (55.05 → 61.40)
   ============================================================ */
scene('end', 55.05, 6.35, function(r){
  const bg = darkBg(r, {bg:'#0A0D12'});
  const wrap = add(r, 'div', 'lyr', {left:'0px', top:'0px', width:W+'px', height:H+'px',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'});

  const MK2 = 128, MK2PX = MK2 / MARK_BOX;
  const mk = markImg(wrap, MK2, 'outline',
    { marginBottom: (40 - MK2PX * MARK_PAD).toFixed(1) + 'px' });
  const name = add(wrap, 'div', null, {font:'700 96px/1 var(--font)', color:'#fff',
    letterSpacing:'-.045em'}, chars('Dentomate'));
  const line = add(wrap, 'div', 'body', {color:'rgba(255,255,255,.62)', marginTop:'30px',
    fontSize:'36px'}, words('Start free. No card required.'));

  const btn = add(wrap, 'div', null, {marginTop:'56px', position:'relative'});
  const ring = add(btn, 'div', null, {position:'absolute', inset:'-10px', borderRadius:'999px',
    border:'2px solid rgba(33,112,217,.55)'});
  const b = add(btn, 'div', 'btn', null, 'app.dentomate.in');

  return { update(t){
    r.style.opacity = String(Math.min(p(t,0.0,0.32,E.out), 1 - p(t,5.92,0.43,E.lin)));
    drift(bg, t, 0.45);
    bg.grid.style.opacity = String(0.34 * p(t,0.2,1.3,E.out));

    const pop = p(t, 0.14, 1.15, E.spring);
    tf(mk, { s: 0.7 + 0.3*pop, y: 20 - 20*pop, o: p(t,0.14,0.48,E.out) });
    staggerIn(name, t, 0.50, 0.030, 0.82, E.out5);
    name.style.letterSpacing = (0.02 - 0.065*p(t, 0.50, 1.45, E.out5)).toFixed(4) + 'em';
    staggerIn(line, t, 0.94, 0.028, 0.78, E.out5);

    const bq = p(t, 1.34, 0.85, E.soft);
    tf(b, { y: 30 - 30*bq, s: 0.9 + 0.1*bq, o: bq });
    const ph_ = ((t - 2.05) % 1.55 + 1.55) % 1.55;
    const pr = t > 2.05 ? u(ph_, 0, 1.05) : 0;
    tf(ring, { s: 1 + 0.10*pr, o: t > 2.05 ? (1 - pr) * 0.85 : 0 });

    tf(wrap, { s: 1 + 0.026*p(t, 0.1, 6.2, E.lin), y: -8*p(t, 0.1, 6.2, E.lin) });
  }};
});

/* ============================================================
   GLOBAL OVERLAYS + FRAME DRIVER
   ============================================================ */
const overlay = add(S, 'div', null, {position:'absolute', inset:'0', pointerEvents:'none', zIndex:'50'});
const grain = add(overlay, 'div', null, {position:'absolute', inset:'-200px', opacity:'0.035',
  mixBlendMode:'overlay',
  backgroundImage:`url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>`
      .replace('%23n', '#n'))}")`,
  backgroundSize:'200px 200px'});
const fade = add(overlay, 'div', null, {position:'absolute', inset:'0', background:'#000'});

const TOTAL = 61.4;
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
  const gx = (Math.floor(t * 24) * 61) % 200, gy = (Math.floor(t * 24) * 113) % 200;
  grain.style.backgroundPosition = `${gx}px ${gy}px`;
  fade.style.opacity = String(Math.max(1 - p(t, 0.0, 0.30, E.out), p(t, TOTAL - 0.85, 0.85, E.in3)));
};

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
