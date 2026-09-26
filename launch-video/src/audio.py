#!/usr/bin/env python3
"""Procedural soundtrack for the Dentomate launch film.
124 BPM, A minor. Synthesised from scratch; no samples."""
import numpy as np, wave, struct, math

SR   = 48000
DUR  = 72.8
BPM  = 124.0
BEAT = 60.0 / BPM
BAR  = BEAT * 4
N    = int(DUR * SR)
T    = np.arange(N) / SR

rng = np.random.default_rng(7)

# ---------- helpers ----------
def env_ad(n, a, d, curve=2.5):
    """percussive attack/decay envelope, n samples"""
    e = np.zeros(n)
    na = max(1, int(a * SR)); nd = max(1, int(d * SR))
    na = min(na, n); e[:na] = np.linspace(0, 1, na)
    rest = n - na
    if rest > 0:
        k = np.linspace(0, 1, rest)
        e[na:] = (1 - k) ** curve
    return e

def svf_lp(x, fc, q=0.8):
    """state-variable low-pass; fc may be scalar or per-sample array"""
    n = len(x)
    fc = np.broadcast_to(np.asarray(fc, dtype=float), (n,))
    f = 2.0 * np.sin(np.pi * np.clip(fc, 20, SR * 0.45) / SR)
    dmp = np.clip(1.0 / q, 0.05, 2.0)
    low = np.zeros(n); band = 0.0; lo = 0.0
    for i in range(n):
        hi = x[i] - lo - dmp * band
        band += f[i] * hi
        lo += f[i] * band
        low[i] = lo
    return low

def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf): return
    m = min(len(sig), len(buf) - i)
    if m > 0: buf[i:i+m] += sig[:m] * gain

def soft(x, k=1.4):
    return np.tanh(x * k) / np.tanh(k)

# ---------- harmony ----------
# i - VI - III - VII  in A minor, one bar each
CHORDS = [
    dict(bass=55.00,  pad=[220.00, 261.63, 329.63], arp=[440.00, 523.25, 659.25]),  # Am
    dict(bass=43.65,  pad=[174.61, 220.00, 261.63], arp=[349.23, 440.00, 523.25]),  # F
    dict(bass=65.41,  pad=[196.00, 261.63, 329.63], arp=[523.25, 392.00, 659.25]),  # C
    dict(bass=49.00,  pad=[196.00, 246.94, 293.66], arp=[392.00, 493.88, 587.33]),  # G
]
def chord_at(t):
    return CHORDS[int(t / BAR) % 4]

# ---------- arrangement intensity ----------
# scene cuts drive how full the arrangement is
CUTS = [4.35, 9.55, 14.95, 22.95, 31.45, 38.55, 46.55, 52.65, 60.15, 66.65]
def ramp(t, a, b):
    return float(np.clip((t - a) / (b - a), 0, 1))
def intensity(t):
    """0..1 arrangement fullness"""
    if t < 9.55:   return 0.22 + 0.10 * ramp(t, 0, 9.55)      # cold open: sparse
    if t < 14.95:  return 0.48 + 0.20 * ramp(t, 9.55, 12.5)   # logo reveal
    if t < 46.55:  return 0.78                                # product act
    if t < 60.15:  return 0.90                                # proof
    if t < 66.65:  return 1.00                                # pricing peak
    return 0.72 - 0.42 * ramp(t, 69.5, 72.8)                  # end card, settle

INT = np.array([intensity(x) for x in T])

# ---------- percussion grid ----------
kick_times, hat_times = [], []
b = 0.0
while b < DUR:
    bar_i = int(b / BAR)
    beat_in = int(round((b % BAR) / BEAT)) % 4
    if b >= 14.95 - 0.001:                       # drums enter at the product act
        if beat_in in (0, 2): kick_times.append(b)
        elif b >= 22.95: kick_times.append(b) if beat_in == 3 and bar_i % 2 == 1 else None
    if b >= 22.95: hat_times.append(b + BEAT / 2)
    b += BEAT
kick_times = [k for k in kick_times if k is not None and k < DUR - 0.1]

# ---------- voices ----------
bass = np.zeros(N); pad = np.zeros(N); arp = np.zeros(N)
kick = np.zeros(N); hat = np.zeros(N); fx = np.zeros(N); air = np.zeros(N)

# --- sub bass: one note per bar, slight portamento feel ---
nb = int(math.ceil(DUR / BAR))
for i in range(nb):
    t0 = i * BAR
    if t0 > DUR: break
    f = chord_at(t0 + 0.01)['bass']
    n = int(min(BAR * 1.02, DUR - t0) * SR)
    if n <= 0: break
    tt = np.arange(n) / SR
    e = np.minimum(env_ad(n, 0.012, BAR * 1.0, 1.1), 1.0)
    sig = np.sin(2*np.pi*f*tt) * 0.85 + np.sin(2*np.pi*f*2*tt) * 0.16
    place(bass, soft(sig, 1.2) * e, t0, 1.0)

# --- pad: detuned saw stack, slow filter sweep per bar ---
for i in range(nb):
    t0 = i * BAR
    if t0 > DUR: break
    n = int(min(BAR * 1.35, DUR - t0) * SR)
    if n <= 0: break
    tt = np.arange(n) / SR
    ch = chord_at(t0 + 0.01)
    s = np.zeros(n)
    for f in ch['pad']:
        for det in (-0.13, 0.0, 0.11):
            ph = 2*np.pi*(f + det)*tt
            s += (2*(ph/(2*np.pi) % 1.0) - 1.0) * 0.32        # saw
            s += np.sin(ph) * 0.18
    s /= (len(ch['pad']) * 3)
    fc = 420 + 900 * np.linspace(0, 1, n) ** 0.7
    s = svf_lp(s, fc, q=0.9)
    e = np.minimum(env_ad(n, 0.28, BAR * 1.3, 1.3), 1.0)
    place(pad, s * e, t0, 1.0)

# --- pluck arpeggio: 8ths, enters with the product act ---
step = BEAT / 2
t0 = 14.95
k = 0
while t0 < DUR - 0.2:
    ch = chord_at(t0 + 0.01)
    f = ch['arp'][k % len(ch['arp'])] * (2.0 if (k % 8) == 6 else 1.0)
    n = int(0.42 * SR)
    tt = np.arange(n) / SR
    e = env_ad(n, 0.003, 0.40, 3.2)
    ph = 2*np.pi*f*tt
    s = ((2*(ph/(2*np.pi) % 1.0) - 1.0) * 0.5 + np.sin(ph) * 0.6)
    s = svf_lp(s, 900 + 2600 * np.exp(-tt * 9), q=1.5) * e
    accent = 1.0 if (k % 4) else 1.25
    place(arp, s, t0, 0.55 * accent)
    t0 += step; k += 1

# --- kick: sine pitch drop + click ---
for t0 in kick_times:
    n = int(0.34 * SR); tt = np.arange(n) / SR
    f = 118 * np.exp(-tt * 34) + 46
    s = np.sin(2*np.pi*np.cumsum(f)/SR) * env_ad(n, 0.001, 0.30, 2.6)
    click = rng.normal(0, 1, n) * env_ad(n, 0.0005, 0.012, 4.0) * 0.25
    place(kick, soft(s * 1.1, 1.6) + click, t0, 1.0)

# --- hat: short filtered noise, offbeat ---
for t0 in hat_times:
    if t0 >= DUR: break
    n = int(0.075 * SR)
    s = rng.normal(0, 1, n) * env_ad(n, 0.0004, 0.068, 4.5)
    s = s - svf_lp(s, 6500, 0.7)          # crude high-pass
    place(hat, s, t0, 0.20)

# --- risers + impacts on the act breaks ---
BIG = [9.55, 14.95, 22.95, 46.55, 60.15, 66.65]
for t0 in BIG:
    # riser
    rl = 1.35; n = int(rl * SR); tt = np.arange(n) / SR
    k_ = tt / rl
    nz = rng.normal(0, 1, n)
    sweep = svf_lp(nz, 300 + 5200 * k_ ** 2.2, q=2.6)
    tone = np.sin(2*np.pi*np.cumsum(180 + 900 * k_ ** 2.5)/SR) * 0.30
    place(fx, (sweep * 0.55 + tone) * (k_ ** 2.0) * 0.55, t0 - rl)
    # impact
    n = int(1.6 * SR); tt = np.arange(n) / SR
    boom = np.sin(2*np.pi*np.cumsum(90*np.exp(-tt*8) + 38)/SR) * env_ad(n, 0.002, 1.5, 2.2)
    crack = svf_lp(rng.normal(0, 1, n), 2400, 0.9) * env_ad(n, 0.001, 0.32, 3.0)
    place(fx, soft(boom, 1.5) * 0.95 + crack * 0.30, t0, 1.0)

# --- small ticks on the minor cuts (problem-montage beats) ---
for t0 in (4.35, 6.05, 7.65, 31.45, 38.55, 52.65):
    n = int(0.5 * SR); tt = np.arange(n) / SR
    s = np.sin(2*np.pi*np.cumsum(220*np.exp(-tt*20) + 60)/SR) * env_ad(n, 0.001, 0.42, 2.6)
    place(fx, s * 0.42, t0)

# --- airy top texture, swells through the film ---
nz = rng.normal(0, 1, N)
airt = svf_lp(nz, 1800 + 900*np.sin(2*np.pi*T/13.0), q=0.7)
airt = airt - svf_lp(airt, 700, 0.7)
air = airt * (0.030 + 0.030 * INT)

# --- shimmer on the logo reveal ---
for i, f in enumerate([880.0, 1318.5, 1760.0]):
    n = int(3.0 * SR); tt = np.arange(n) / SR
    s = np.sin(2*np.pi*f*tt) * env_ad(n, 0.05, 2.9, 2.0) * 0.05
    place(fx, s, 9.85 + i * 0.09)

# ---------- sidechain ----------
duck = np.ones(N)
for t0 in kick_times:
    i = int(t0 * SR); n = int(0.30 * SR)
    m = min(n, N - i)
    if m > 0:
        d = 1.0 - 0.52 * (1 - np.linspace(0, 1, m)) ** 1.8
        duck[i:i+m] = np.minimum(duck[i:i+m], d)

# ---------- mix ----------
lvl_pad  = 0.30 + 0.24 * INT
lvl_bass = 0.34 + 0.30 * INT
lvl_arp  = 0.40 * np.clip((T - 14.95) / 2.0, 0, 1) * (0.55 + 0.45 * INT)
lvl_kick = 0.80
lvl_hat  = 0.75 * np.clip((T - 22.95) / 1.5, 0, 1)

mix = (pad * lvl_pad * duck + bass * lvl_bass * duck + arp * lvl_arp * duck
       + kick * lvl_kick + hat * lvl_hat + fx * 0.72 + air)

# gentle stereo: pad and arp widened via short haas + inverted-ish detune
def widen(x, ms):
    d = int(SR * ms / 1000.0)
    y = np.zeros_like(x); y[d:] = x[:-d]; return y
L = mix + 0.22 * widen(pad * lvl_pad, 11) + 0.14 * widen(arp * lvl_arp, 7)
R = mix + 0.22 * widen(pad * lvl_pad, 17) + 0.14 * widen(arp * lvl_arp, 13)

# master: soft clip, fade in/out
for ch in (L, R):
    ch *= 1.0
L = soft(L * 0.72, 1.25); R = soft(R * 0.72, 1.25)
fi = np.clip(T / 0.6, 0, 1)
fo = np.clip((DUR - T) / 1.6, 0, 1)
L *= fi * fo; R *= fi * fo

peak = max(np.abs(L).max(), np.abs(R).max())
L *= 0.89 / peak; R *= 0.89 / peak

stereo = np.empty(N * 2, dtype=np.float32)
stereo[0::2] = L; stereo[1::2] = R
pcm = (np.clip(stereo, -1, 1) * 32767).astype('<i2')

with wave.open('soundtrack.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote soundtrack.wav  %.2fs  peak=%.3f  kicks=%d  hats=%d'
      % (DUR, peak, len(kick_times), len(hat_times)))
