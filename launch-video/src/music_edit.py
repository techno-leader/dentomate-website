#!/usr/bin/env python3
"""Conform the supplied track to the locked 61.4s picture.

The track is 66.3s at 122.283 BPM with its drop at 11.408s. The film's biggest
moment is the logo reveal at 5.5s, so the track is started 5.908s in — the last
five seconds of its build — putting the drop exactly on the reveal.

That leaves the track 3.9s short of the film, so two bars are repeated at a
downbeat inside the steady middle section (inaudible there) to make up the
difference. Nothing is time-stretched; the tempo is untouched.
"""
import numpy as np, soundfile as sf, os

SR    = 48000
SRC   = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'music', 'source.wav')
OUT   = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'music', 'music_conformed.wav')

BPM   = 122.283
BAR   = 4 * 60.0 / BPM            # 1.96267 s
DROP  = 11.408                    # measured
END   = 63.467                    # last audible sample
VIDEO = 61.40
LOGO  = 5.50                      # the cut the drop must land on

START = DROP - LOGO               # 5.908
P     = DROP + 12 * BAR           # 34.960 — a downbeat in the steady section
INS   = 2 * BAR                   # 3.925 — two bars repeated
XF    = 0.030                     # seam crossfade

def s2n(t): return int(round(t * SR))

def main():
    y, sr = sf.read(SRC, always_2d=True)
    assert sr == SR, sr
    if y.shape[1] == 1: y = np.repeat(y, 2, axis=1)

    a = y[s2n(START): s2n(P + INS)]        # build + drop + steady, incl. the 2 bars
    b = y[s2n(P)    : s2n(END)]            # jump back a bar-pair, play to the end

    # equal-power crossfade across the seam so the repeat is seamless
    n = s2n(XF)
    fade = np.linspace(0, 1, n)[:, None]
    seam = a[-n:] * np.cos(fade * np.pi / 2) + b[:n] * np.sin(fade * np.pi / 2)
    out = np.concatenate([a[:-n], seam, b[n:]], axis=0)

    # trim to picture and shape the ends
    want = s2n(VIDEO)
    out = out[:want] if len(out) >= want else np.pad(out, ((0, want - len(out)), (0, 0)))

    fi = s2n(0.35)
    out[:fi] *= np.linspace(0, 1, fi)[:, None] ** 1.5
    fo = s2n(1.40)                          # matches the picture's fade to black
    out[-fo:] *= (np.linspace(1, 0, fo) ** 1.6)[:, None]

    sf.write(OUT, out, SR, subtype='PCM_24')
    print(f"{OUT}  {len(out)/SR:.3f}s  peak {np.abs(out).max():.3f}")
    print(f"  start {START:.3f}s   drop -> {LOGO:.2f}s   splice at music {P:.3f}s (+{INS:.3f}s)")

if __name__ == '__main__':
    main()
