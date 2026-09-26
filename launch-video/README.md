# Dentomate launch film

A motion-graphics product launch video for **app.dentomate.in**, in the style used
for SaaS launches on X/Twitter: kinetic type, real product UI in device frames,
counter animations and a synced soundtrack.

| | |
|---|---|
| Runtime | 72.8 s |
| Master | 1920×1080, 60 fps, H.264 (`out/dentomate-launch-1080p.mp4`) |
| Social | 1080×1080 square and 1080×1920 vertical, blur-filled |
| Poster | `out/dentomate-launch-poster.jpg` |
| Audio | Procedurally synthesised, 124 BPM, A minor, normalised to −14 LUFS |

`SCRIPT.md` holds the scene-by-scene shot list and the source for every claim.

The 16:9 master is the primary cut. The square one works well in feed. The
vertical one is a letterboxed convenience cut — the type was laid out for 16:9,
so a true 9:16 edit would want the scenes re-composed rather than padded.

## What's real in it

The product shots are Dentomate's own `app.dentomate.in` captures that already
ship in `assets/images/` — Dashboard, WhatsApp Inbox, Patient Details, Analytics.
The copy, pricing and pilot numbers come from the marketing site. The typefaces
are the brand's own Open Runde and Geist Mono. Nothing is stock and nothing is
invented.

## How it's built

There is no video editor in the pipeline. `stage.html` is a 1920×1080 stage and
`timeline.js` exposes a single pure function, `window.renderFrame(t)`, that sets
every transform and opacity from the timestamp alone — no CSS animation, so a
frame is reproducible. `render.js` drives Playwright over the timeline and writes
one PNG per frame; `audio.py` synthesises the score from oscillators and noise;
`encode.sh` muxes them into the delivery masters.

## Rebuilding

```bash
cd src
./build.sh preview     # one frame per scene, into src/preview — fast sanity check
./build.sh             # full render (~17 min on 4 cores) then encode into out/
```

Needs node with `playwright`, `python3` with `numpy`, and `ffmpeg` with libx264.
`build.sh` fetches the fonts and copies the product stills on first run.

To change a scene, edit its block in `timeline.js` — each one is a `scene(name,
start, duration, build)` call whose `update(t)` receives scene-local time.
