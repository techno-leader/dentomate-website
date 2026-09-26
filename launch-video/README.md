# Dentomate launch film

A motion-graphics product launch video for **app.dentomate.in**, in the style used
for SaaS launches on X/Twitter: kinetic type, real product UI in device frames,
counter animations and a synced soundtrack.

| | |
|---|---|
| Runtime | 61.4 s |
| Master | 1920×1080, 60 fps, H.264 (`out/dentomate-launch-1080p.mp4`) |
| Social | 1080×1080 square and 1080×1920 vertical, blur-filled |
| Poster | `out/dentomate-launch-poster.jpg` |
| Audio | Supplied track conformed to picture + ~180 synthesised sound-design cues, −14.1 LUFS |

`SCRIPT.md` holds the scene-by-scene shot list and the source for every claim.
`SOUND-DESIGN.md` covers the audio: how the supplied track was conformed to
picture, the full sound-design cue sheet, and the voiceover brief and script
(the VO itself is not recorded yet — the current mix is the no-VO cut).

The 16:9 master is the primary cut. The square one works well in feed. The
vertical one is a letterboxed convenience cut — the type was laid out for 16:9,
so a true 9:16 edit would want the scenes re-composed rather than padded.

## What's real in it

The product shots are Dentomate's own `app.dentomate.in` captures that already
ship in `assets/images/` — Dashboard, WhatsApp Inbox, Patient Details, Analytics.
The copy, pricing and pilot numbers come from the marketing site. The typefaces
are the brand's own Open Runde and Geist Mono, and the mark is the shipped
`logo.png` / `logo-dark.png` itself — solid on light backgrounds and outlined on
dark, the same pairing the site uses in its header and footer. Nothing is stock,
nothing is redrawn and nothing is invented.

The "200+ clinics" figure and the customer testimonial are deliberately left out
of this cut and are expected in a later version.

## How it's built

There is no video editor in the pipeline. `stage.html` is a 1920×1080 stage and
`timeline.js` exposes a single pure function, `window.renderFrame(t)`, that sets
every transform and opacity from the timestamp alone — no CSS animation, so a
frame is reproducible. `render.js` drives Playwright over the timeline and writes
one PNG per frame; `audio.py` synthesises the score from oscillators and noise;
`music_edit.py` conforms the supplied track to the picture, `sfx.py`
synthesises the sound-design layer, `mix.py` combines them, and `encode.sh`
muxes the result into the delivery masters.

## Rebuilding

```bash
cd src
./build.sh preview     # one frame per scene, into src/preview — fast sanity check
./build.sh             # full render (~17 min on 4 cores) then encode into out/
```

Needs node with `playwright`, `python3` with `numpy`, `scipy`, `soundfile` and
`librosa`, and `ffmpeg` with libx264.
`build.sh` fetches the fonts and copies the product stills on first run.

To change a scene, edit its block in `timeline.js` — each one is a `scene(name,
start, duration, build)` call whose `update(t)` receives scene-local time.
