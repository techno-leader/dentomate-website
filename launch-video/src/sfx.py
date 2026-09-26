#!/usr/bin/env python3
"""Sound design layer for the Dentomate launch film.

Synthesises every transition, impact, riser and UI element in the cue sheet in
SOUND-DESIGN.md and lays them against the locked 61.4s picture. Output is a
stereo bed with no music in it — the mix stage combines the two.
"""
import numpy as np
from scipy import signal
import soundfile as sf, os

SR   = 48000
DUR  = 61.40
N    = int(DUR * SR)
HERE = os.path.dirname(os.path.abspath(__file__))
rng  = np.random.default_rng(20260926)

# ───────────────────────── primitives ─────────────────────────
def n_(t): return int(round(t * SR))
def env(n, a, d, curve=2.4):
    e = np.zeros(n); na = min(max(1, n_(a)), n)
    e[:na] = np.linspace(0, 1, na) ** 0.7
    if n - na > 0:
        e[na:] = (1 - np.linspace(0, 1, n - na)) ** curve
    return e

def noise(n): return rng.normal(0, 1, n)

def bp_sweep(x, f0, f1, q=1.4, curve=1.0, block=256):
    """band-pass whose centre glides f0 -> f1 across the signal"""
    n = len(x); out = np.zeros(n)
    k = np.linspace(0, 1, max(1, n // block + 1)) ** curve
    fc = f0 + (f1 - f0) * k
    st = None
    for i, b in enumerate(range(0, n, block)):
        seg = x[b:b+block]
        if not len(seg): break
        f = float(np.clip(fc[min(i, len(fc)-1)], 25, SR*0.45))
        sos = signal.butter(2, [max(20, f/ (1+ .9/q)), min(SR*0.47, f*(1+ .9/q))],
                            btype='band', fs=SR, output='sos')
        if st is None: st = signal.sosfilt_zi(sos) * seg[0]
        y, st = signal.sosfilt(sos, seg, zi=st)
        out[b:b+len(seg)] = y
    return out

def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, min(f, SR*0.45), 'low', fs=SR, output='sos'), x)
def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, max(20, f), 'high', fs=SR, output='sos'), x)

def sine_sweep(n, f0, f1, curve=3.0):
    k = np.linspace(0, 1, n) ** curve
    f = f0 + (f1 - f0) * k
    return np.sin(2*np.pi*np.cumsum(f)/SR)

def soft(x, k=1.5): return np.tanh(x*k)/np.tanh(k)

def stereo(l, r=None):
    if r is None: r = l
    return np.stack([l, r], axis=1)

def pan(x, pos):
    """pos -1 left .. +1 right, equal power"""
    a = (pos + 1) * np.pi / 4
    return np.stack([x*np.cos(a), x*np.sin(a)], axis=1)

# ───────────────────────── elements ─────────────────────────
def whoosh(dur=0.85, direction=0, bright=1.0, level=1.0):
    """filtered-noise sweep that travels across the stereo field"""
    n = n_(dur)
    body = bp_sweep(noise(n), 420*bright, 5600*bright, q=1.1, curve=1.6)
    body *= np.sin(np.linspace(0, np.pi, n)) ** 1.3
    air  = hp(noise(n), 5000) * (np.linspace(0, 1, n) ** 2.4) * 0.35
    x = (body + air) * level
    if direction == 0:
        return stereo(x * 0.92, x)
    p = np.linspace(-direction, direction, n) * 0.85
    a = (p + 1) * np.pi / 4
    return np.stack([x*np.cos(a), x*np.sin(a)], axis=1)

def impact(weight=1.0, bright=1.0, tail=1.3):
    """sub drop + mid crack; the workhorse accent"""
    n = n_(tail)
    sub  = sine_sweep(n, 96*weight, 34, curve=2.6) * env(n, 0.002, tail, 2.1)
    body = lp(noise(n), 700) * env(n, 0.001, 0.30, 3.0) * 0.55
    crk  = bp_sweep(noise(n), 2600*bright, 900, q=1.0, curve=0.8) * env(n, 0.0008, 0.24, 3.4) * 0.40
    x = soft(sub*1.1, 1.6) * weight + body*0.6 + crk
    return stereo(x*0.95, x)

def subdrop(level=1.0, tail=1.5):
    n = n_(tail)
    x = sine_sweep(n, 62, 28, curve=2.2) * env(n, 0.004, tail, 1.8) * level
    return stereo(soft(x, 1.3))

def tick(pitch=1.0, bright=1.0, level=1.0, dur=0.05):
    n = n_(dur)
    x = hp(noise(n), 2200*bright) * env(n, 0.0004, dur, 4.2)
    x += np.sin(2*np.pi*(1800*pitch)*np.arange(n)/SR) * env(n, 0.0004, dur*0.55, 5.0) * 0.30
    return stereo(x*level)

def riser(dur=1.3, level=1.0):
    n = n_(dur); k = np.linspace(0, 1, n)
    nz = bp_sweep(noise(n), 280, 6200, q=2.2, curve=2.2) * 0.55
    tn = np.sin(2*np.pi*np.cumsum(170 + 980*k**2.6)/SR) * 0.30
    x = (nz + tn) * (k ** 2.1) * level
    x *= 1 - np.clip((k - 0.92) / 0.08, 0, 1)      # duck right at the peak
    return stereo(x*0.9, x)

def reverse(dur=0.5, bright=1.0, level=1.0):
    n = n_(dur)
    x = bp_sweep(noise(n), 900*bright, 4200*bright, q=1.2) * env(n, 0.001, dur, 2.0)
    return stereo(x[::-1] * level)

def swell(dur=0.9, f=140, level=1.0):
    n = n_(dur)
    x = lp(noise(n), f*6) * np.sin(np.linspace(0, np.pi, n))**1.6
    x += np.sin(2*np.pi*f*np.arange(n)/SR) * np.sin(np.linspace(0, np.pi, n))**2 * 0.25
    return stereo(x*level)

def counter_run(dur, level=1.0, rate=34):
    """the quiet granular chatter under a number counting up"""
    n = n_(dur); out = np.zeros(n)
    step = SR / rate
    i = 0.0
    while i < n - 200:
        m = n_(0.014)
        g = hp(noise(m), 3400) * env(m, 0.0003, 0.013, 4.0)
        k = int(i); out[k:k+m] += g[:min(m, n-k)] * (0.5 + 0.5*rng.random())
        i += step * (0.8 + 0.4*rng.random())
    out *= (1 - np.linspace(0, 1, n) ** 3)
    return stereo(out*level*0.9, out*level)

def send_ping():
    n = n_(0.34)
    x = np.sin(2*np.pi*np.cumsum(np.linspace(720, 1180, n))/SR) * env(n, 0.003, 0.30, 3.2)
    x += np.sin(2*np.pi*np.cumsum(np.linspace(1440, 2360, n))/SR) * env(n, 0.003, 0.20, 3.6)*0.4
    return stereo(x*0.8)

def receive_ping():
    n = n_(0.30)
    x = np.sin(2*np.pi*np.cumsum(np.linspace(980, 640, n))/SR) * env(n, 0.004, 0.26, 3.0)
    return stereo(x*0.7)

def slide(dur=0.26, up=True, level=1.0):
    n = n_(dur)
    f0, f1 = (700, 1500) if up else (1500, 700)
    x = bp_sweep(noise(n), f0, f1, q=3.2) * np.sin(np.linspace(0, np.pi, n))**1.4
    return stereo(x*level)

# ───────────────────────── reverb ─────────────────────────
def make_ir(dur=1.5, damp=4200):
    n = n_(dur); t = np.linspace(0, 1, n)
    def one(seed):
        r = np.random.default_rng(seed)
        x = r.normal(0, 1, n) * np.exp(-t * 6.0)
        x[:n_(0.012)] = 0                      # pre-delay
        return lp(x, damp)
    l, r = one(11), one(29)
    ir = np.stack([l, r], axis=1)
    return ir / np.abs(ir).max() * 0.6

IR = make_ir()
def rev(x, mix=0.22):
    wet = np.stack([signal.fftconvolve(x[:, c], IR[:, c])[:len(x)] for c in range(2)], axis=1)
    return x * (1 - mix) + wet * mix

# ───────────────────────── the cue sheet ─────────────────────────
bus_hit  = np.zeros((N, 2))     # impacts, whooshes, risers — gets reverb
bus_ui   = np.zeros((N, 2))     # ticks and foley — stays dry and quiet
bus_air  = np.zeros((N, 2))

def put(bus, sig, t, g=1.0):
    i = n_(t)
    if i < 0:
        sig = sig[-i:]; i = 0
    m = min(len(sig), N - i)
    if m > 0: bus[i:i+m] += sig[:m] * g

CUTS_BIG   = [5.50, 17.50, 31.00, 43.50, 55.10]
CUTS_LIGHT = [10.50, 24.60, 38.00, 49.00]

# — opener —
put(bus_ui,  tick(1.0, 1.4, 0.9),                     0.30)
for i, d in enumerate([0.0, 0.055, 0.105, 0.150]):
    put(bus_ui, tick(0.8 + i*0.18, 1.2, 0.55 - i*0.07), 0.50 + d)
put(bus_hit, whoosh(0.72, -1, 1.0, 1.15),             0.86)
put(bus_hit, whoosh(0.66, +1, 0.9, 1.00),             0.94)
put(bus_hit, whoosh(0.80,  0, 1.2, 0.68),             1.02)
for i in range(9):
    put(bus_ui, tick(0.7 + rng.random()*0.9, 1.0, 0.30), 1.48 + i*0.022 + rng.random()*0.012)
for i, (a, pch) in enumerate([(1.95, 1.0), (2.50, 1.12), (3.05, 1.26)]):
    put(bus_hit, reverse(0.24, 1.0 + i*0.15, 0.55),   a - 0.24)
    put(bus_hit, impact(0.85 + i*0.10, 1.0 + i*0.2, 1.1), a)
    if i == 2: put(bus_hit, subdrop(0.85, 1.4),       a)
put(bus_hit, whoosh(0.92, 0, 1.1, 0.80),              3.60)
put(bus_hit, whoosh(0.34, +1, 1.9, 1.55),             4.38)
put(bus_hit, impact(0.55, 1.6, 0.55),                 4.48)
put(bus_ui,  tick(1.6, 1.6, 0.52, 0.12),              4.70)

# — logo: the biggest hit in the film —
put(bus_hit, riser(1.45, 0.95),                       5.50 - 1.45)
put(bus_hit, reverse(0.42, 1.2, 0.70),                5.50 - 0.42)
put(bus_hit, impact(1.35, 1.35, 1.8),                 5.50)
put(bus_hit, subdrop(1.15, 1.7),                      5.50)
put(bus_ui,  tick(0.9, 1.0, 0.40),                    6.10)
put(bus_ui,  tick(1.15, 1.1, 0.34),                   6.18)
put(bus_hit, swell(0.55, 260, 0.30),                  6.80)
for i in range(9):
    put(bus_ui, tick(1.0 + i*0.06, 1.3, 0.13, 0.03),  7.40 + i*0.030)

# — scene transitions —
for c in CUTS_BIG[1:]:
    put(bus_hit, riser(1.25, 0.72),                   c - 1.25)
    put(bus_hit, whoosh(0.85, -1 if c in (17.50, 43.50) else +1, 1.0, 0.78), c - 0.45)
    put(bus_hit, impact(1.0, 1.1, 1.4),               c)
put(bus_hit, subdrop(0.85, 1.5),                      31.00)   # the tonal shift to dark
put(bus_hit, subdrop(0.95, 1.6),                      55.10)
for c in CUTS_LIGHT:
    put(bus_hit, whoosh(0.72, +1 if c in (10.50, 38.00) else -1, 1.05, 0.62), c - 0.38)
    if c != 49.00:                                    # pricing gets no impact — the gap is the accent
        put(bus_hit, impact(0.62, 1.15, 0.95),        c)

# — dashboard —
put(bus_hit, swell(1.00, 120, 0.26),                  10.97)
for i in range(9):
    put(bus_ui, tick(1.3 + rng.random()*0.5, 1.5, 0.10, 0.025), 11.15 + i*0.055 + rng.random()*0.02)
put(bus_ui,  tick(0.9, 1.0, 0.30),                    11.75)
put(bus_ui,  tick(1.1, 1.0, 0.26),                    11.91)

# — whatsapp —
put(bus_hit, swell(0.95, 150, 0.24),                  18.45)
put(bus_ui,  send_ping(),                             19.65, 0.95)
put(bus_hit, whoosh(1.00, +1, 1.3, 0.62),             19.65)
put(bus_ui,  receive_ping(),                          20.75, 0.80)
put(bus_ui,  tick(1.5, 1.5, 0.46),                    20.90)
put(bus_ui,  tick(1.68, 1.5, 0.40),                   20.97)

# — records: the ring travelling between sections —
put(bus_ui,  tick(1.0, 1.2, 0.34),                    25.65)
put(bus_hit, swell(0.5, 300, 0.16),                   25.65)
put(bus_ui,  slide(0.26, True,  0.30),                27.10)
put(bus_ui,  slide(0.26, False, 0.30),                28.50)

# — analytics counters —
put(bus_ui,  counter_run(1.10, 0.30),                 32.15)
put(bus_ui,  counter_run(1.10, 0.26),                 32.41)
put(bus_ui,  counter_run(1.10, 0.24),                 32.67)
for i, a in enumerate([33.30, 33.56, 33.82]):
    put(bus_ui, tick(1.0 + i*0.14, 1.1, 0.34),        a)

# — multi-clinic cards —
for i, a in enumerate([38.75, 38.89, 39.03]):
    s = tick(0.85 + i*0.15, 1.0, 0.32)
    put(bus_ui, pan(s[:, 0], -0.55 + i*0.55),         a)

# — the claim —
put(bus_ui,  counter_run(1.25, 0.42, 40),             43.95)
put(bus_hit, impact(0.95, 1.25, 1.5),                 45.20)
put(bus_ui,  tick(1.0, 1.1, 0.24),                    45.40)
put(bus_ui,  tick(1.2, 1.1, 0.22),                    45.58)

# — pricing —
for i, a in enumerate([49.75, 49.91, 50.07]):
    put(bus_ui, tick(0.9 + i*0.16, 1.0, 0.30),        a)
put(bus_hit, swell(0.85, 220, 0.20),                  50.45)

# — end card —
put(bus_hit, reverse(0.38, 1.1, 0.46),                55.19 - 0.30)
put(bus_ui,  tick(1.0, 1.1, 0.30),                    55.19)
for i in range(9):
    put(bus_ui, tick(1.0 + i*0.05, 1.25, 0.11, 0.028), 55.55 + i*0.028)
put(bus_ui,  tick(1.35, 1.4, 0.78),                   56.39)

# ─────────── second pass: one sound for every on-screen event ───────────
def label_wipe(t0):
    """the numbered section label sliding in with its rule"""
    put(bus_ui, tick(1.45, 1.5, 0.22, 0.035), t0)
    put(bus_ui, slide(0.30, True, 0.13),      t0 + 0.06)

def word_run(t0, count, step, level=0.075):
    """one near-silent tick per word as a headline masks up"""
    for i in range(count):
        put(bus_ui, tick(1.1 + i*0.05, 1.5, level, 0.022), t0 + i*step)

def scroll_tex(t0, dur, level=0.055):
    """soft movement under a page or phone scrolling"""
    n = n_(dur)
    x = bp_sweep(noise(n), 900, 2200, q=0.8, curve=0.5)
    x *= np.sin(np.linspace(0, np.pi, n)) ** 1.1
    put(bus_ui, stereo(x*level, np.roll(x, 419)*level), t0)

def type_run(t0, dur, chars, level=0.085):
    """URL typing — irregular, dry, barely there"""
    for i in range(chars):
        put(bus_ui, tick(1.3 + rng.random()*0.6, 1.6, level*(0.6+0.6*rng.random()), 0.020),
            t0 + dur*i/chars + rng.random()*0.012)

def item_tick(t0, i=0, level=0.26):
    put(bus_ui, tick(0.88 + i*0.13, 1.1, level), t0)

# dashboard  (scene starts 10.45)
label_wipe(10.61); word_run(10.75, 5, 0.055)
type_run(11.15, 1.15, 14); scroll_tex(11.60, 5.00)

# whatsapp  (17.45)
label_wipe(17.59); word_run(17.71, 7, 0.048)
type_run(18.11, 1.00, 13); scroll_tex(18.75, 5.00); scroll_tex(19.35, 2.40, 0.045)
item_tick(18.50, 0); item_tick(18.68, 1)

# records  (24.55)
label_wipe(24.69); word_run(24.81, 4, 0.046)
type_run(25.15, 0.95, 12)
scroll_tex(25.55, 0.80, 0.05); scroll_tex(27.00, 0.80, 0.05); scroll_tex(28.40, 0.80, 0.05)
item_tick(25.55, 0); item_tick(25.71, 1)

# analytics  (30.95)
label_wipe(31.11); word_run(31.23, 4, 0.046)
type_run(31.57, 1.05, 14); scroll_tex(32.30, 3.00)

# multi-clinic  (37.95)
label_wipe(38.09); word_run(38.19, 4, 0.050)
item_tick(39.50, 0, 0.22); item_tick(39.64, 1, 0.20)

# pilot result  (43.45)
label_wipe(43.61); word_run(44.80, 6, 0.040)

# pricing  (48.95)
label_wipe(49.07); word_run(49.19, 6, 0.046)

# end card  (55.05)
word_run(55.99, 5, 0.046)

# — air bed under the light scenes —
air = bp_sweep(noise(N), 1500, 2600, q=0.7, curve=0.4)
airenv = np.zeros(N); tt = np.arange(N)/SR
for a, b in [(6.3, 10.4), (10.6, 17.4), (18.0, 24.5), (25.0, 30.9),
             (31.5, 37.9), (38.5, 43.4), (44.0, 48.9), (49.3, 55.0)]:
    m = (tt >= a) & (tt < b)
    airenv[m] = np.sin(np.linspace(0, np.pi, m.sum())) ** 0.6
airenv = lp(airenv, 3.0)
put(bus_air, stereo(air*0.9, np.roll(air, 733)), 0.0)
bus_air *= airenv[:, None] * 0.055

# ───────────────────────── bus mix ─────────────────────────
mix = rev(bus_hit, 0.20) * 1.05 + bus_ui * 1.00 + bus_air
peak = np.abs(mix).max()
mix = soft(mix / max(peak, 1e-9) * 0.86, 1.15)
sf.write(os.path.join(HERE, 'music', 'sfx.wav'), mix, SR, subtype='PCM_24')
print(f"sfx.wav  {len(mix)/SR:.3f}s  peak {np.abs(mix).max():.3f}")
