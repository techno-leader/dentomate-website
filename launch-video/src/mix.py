#!/usr/bin/env python3
"""Mix the conformed music with the sound-design layer into the final track."""
import numpy as np, soundfile as sf, os
from scipy import signal

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
M = os.path.join(HERE, 'music')

mus, _ = sf.read(os.path.join(M, 'music_conformed.wav'), always_2d=True)
sfx, _ = sf.read(os.path.join(M, 'sfx.wav'), always_2d=True)
n = min(len(mus), len(sfx)); mus, sfx = mus[:n], sfx[:n]
t = np.arange(n) / SR

def n_(x): return int(round(x * SR))

# ── music ducks briefly under each impact so the hits have room ──
IMPACTS = [1.95, 2.50, 3.05, 5.50, 10.50, 17.50, 24.60, 31.00, 38.00, 43.50, 45.20, 55.10]
duck = np.ones(n)
for a in IMPACTS:
    i = n_(a); m = min(n_(0.34), n - i)
    if m <= 0: continue
    depth = 0.58 if a in (5.50, 31.00, 43.50, 55.10) else 0.70
    duck[i:i+m] = np.minimum(duck[i:i+m],
                             depth + (1 - depth) * np.linspace(0, 1, m) ** 1.7)
duck = signal.sosfilt(signal.butter(2, 26, 'low', fs=SR, output='sos'), duck)

# ── the opener sits under the film's quietest passage; lift the SFX there ──
sfx_gain = np.ones(n) * 1.0
sfx_gain[:n_(5.5)] = 1.18
mix = mus * (0.60 * duck)[:, None] + sfx * sfx_gain[:, None] * 1.32

# ── master: soft clip, then normalise for the encoder to finish ──
mix = np.tanh(mix * 0.88) / np.tanh(0.88)
mix *= 0.90 / max(np.abs(mix).max(), 1e-9)

out = os.path.join(M, 'soundtrack.wav')
sf.write(out, mix, SR, subtype='PCM_24')
print(f"{out}  {len(mix)/SR:.3f}s  peak {np.abs(mix).max():.3f}")
