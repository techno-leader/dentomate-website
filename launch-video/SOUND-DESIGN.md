# Dentomate launch film — sound design & voiceover brief

Spec for the audio pass on the 61.4s launch film. The picture is locked; this
document is what a composer, sound designer or VO artist needs to work to it.

## Status

**Music: supplied and conformed.** The track (`Calculated Rise`, 66.3s, 122.283
BPM) was edited to picture — see *Conforming the music* below. It is not a
placeholder.

**Sound design: built.** Every cue in the sheet below is synthesised by
`src/sfx.py` and mixed by `src/mix.py`. Roughly 180 individual events.

**Voiceover: not recorded.** Section 3 is the brief for it. The current mix is
the no-VO cut; the ducking automation in `mix.py` has the headroom reserved.

---

## 1. What it has to feel like

A product launch film, not an advert. Confident, precise, modern. The sound
should feel like **good software**: clean, responsive, well-machined. Every
motion on screen should have a physical consequence you can hear.

Three rules:

1. **Restraint beats density.** The temptation is wall-to-wall music. Resist it.
   The cold open should be nearly silent so the first impact lands.
2. **Sync is the whole job.** Nine hard cuts. Every one gets an accent. A film
   that hits its cuts sounds expensive even with modest material.
3. **It must work muted.** See below — this is the constraint most launch
   videos get wrong.

### The silent-first constraint

On X/Twitter and LinkedIn the video autoplays **muted**. Most viewers will never
hear a frame of this. That means:

- The film must already be legible with no audio. It is — nothing depends on VO.
- Audio is an *upgrade* for the viewer who unmutes, not a carrier of information.
- **Never put a fact only in the VO.** If a claim matters, it is on screen too.
- Ship a burned-in-caption variant for feeds. Captions are not optional in 2026;
  a large share of sound-on viewers still watch with captions enabled.

### Reference feel

Not for copying — for calibrating. Linear/Vercel/Raycast launch films: sparse
sub-heavy beds, a lot of air, tight transient design, almost no melody. Avoid
the corporate-uplifting-piano register entirely, and avoid EDM build-and-drop.

---

## 2. Deliverables

| File | Format | Notes |
|---|---|---|
| `music.wav` | 48 kHz / 24-bit stereo | Full-length bed, no SFX, no VO |
| `sfx.wav` | 48 kHz / 24-bit stereo | All design elements, no music |
| `vo.wav` | 48 kHz / 24-bit mono | Dry, unprocessed, one take per line |
| `mix-master.wav` | 48 kHz / 24-bit stereo | Final, −14 LUFS-I / −1.5 dBTP |
| `mix-noVO.wav` | 48 kHz / 24-bit stereo | Music + SFX only, same targets |
| Stems | 48 kHz / 24-bit | Music / SFX / VO buses, for future recuts |

Hand back the stems. The next version of this film will recut the picture, and
a flattened mix cannot follow it.

---

## 2b. Conforming the music

The supplied track did not line up with the picture, so it was edited to it
rather than the other way round. `src/music_edit.py` does this and is
reproducible.

**Measured:** 122.283 BPM (bar = 1.96267s), drop at **11.408s**, last audible
sample at 63.467s.

**The edit, in three moves:**

1. **Start 5.908s in.** The film's biggest moment is the logo reveal at 5.50s,
   so the track starts at `drop − 5.50`, putting the drop exactly on the
   reveal. Verified at 5.504s — four milliseconds out. The 5.5s that now open
   the film are the last and most intense part of the track's build, which is
   what the kinetic opener wants under it.

2. **Repeat two bars.** Trimming the head left the track 3.9s short of the
   film. Two bars are repeated at a downbeat inside the steady middle section
   (music 34.960s, which lands around 29s of picture) with a 30ms equal-power
   crossfade at the seam. In a section that uniform it is inaudible. Nothing is
   time-stretched — the tempo is untouched.

3. **Shape the ends.** 0.35s fade in, 1.4s fade out matched to the picture's
   fade to black.

**What this buys, beyond the drop:**

| Picture | Music lands on |
|---|---|
| 5.50 logo reveal | the drop (−29 dB → −16 dB) |
| 17.50 WhatsApp | full-energy section |
| 43.50 pilot result | the tail of the track's breakdown — it pulls back right before the claim, then swells through the 30% count-up |
| 49.00 pricing | the track's loudest passage |
| 55.10 end card | a dip, then the final swell fills the card |
| 61.40 out | the track's own ending, to the sample |


## 3. Voiceover

### Casting

- **Indian English, neutral urban register.** The audience is dentists in
  Mumbai, Delhi, Bengaluru. An RP British or American read would sound like it
  was made for somebody else.
- **Warm, mid-range, unhurried.** Either gender. Think a competent colleague
  explaining something, not an announcer.
- Age read 30–45. Avoid the bright "startup explainer" delivery.

### Direction

- **Pace: slow.** There is a lot of room. The temptation is to fill it — don't.
  Air between lines is what makes it feel premium.
- **Down at the end of lines.** No upward inflection. Statements, not pitches.
- **No smile in the voice.** Dry and certain beats friendly and eager.
- Record at least three takes per line: neutral, warmer, drier. Give the mixer
  options for how the line sits against the music under it.
- Record 10 seconds of room tone. It will be needed for gaps.

### Pronunciation

| Written | Say |
|---|---|
| Dentomate | **DEN**-toh-mayt (stress first syllable) |
| ₹333 | "three hundred and thirty-three rupees" |
| app.dentomate.in | "app dot dentomate dot in" |
| 30% | "thirty percent" |
| 90 days | "ninety days" |

### Script

Times are the **start** of each line. The line must finish before the next
scene's cut. Total spoken ≈ 95 words over a 55-second window — a relaxed
1.7 words/second with substantial gaps.

| # | In | Out by | Line | Direction |
|---|---|---|---|---|
| 1 | 06.2 | 09.8 | "This is Dentomate." | Flat, low. A label, not an announcement. |
| 2 | 11.2 | 16.8 | "Your whole practice — patients, visits, billing — on one screen." | Let the dashes breathe. Land on "one screen". |
| 3 | 18.4 | 23.8 | "The moment a patient leaves your chair, a branded prescription lands on their phone." | Lift very slightly on "the moment". |
| 4 | 25.4 | 30.2 | "Every record in one place. Notes, X-rays, payments — searchable." | Clipped. Four items, four beats. |
| 5 | 31.8 | 37.2 | "And the numbers that tell you what's actually growing." | Stress "actually". |
| 6 | 38.8 | 42.8 | "Up to three branches. One account." | Two short statements. Full stop between. |
| 7 | 44.2 | 48.4 | "Clinics in our pilot saw thirty percent more patients come back." | The only line with any warmth. |
| 8 | 49.6 | 54.4 | "Free to start. Three hundred and thirty-three rupees a month to grow." | Matter-of-fact. Do not sell it. |
| 9 | 56.2 | 60.4 | "Dentomate. Start free at app dot dentomate dot in." | Slowest line in the film. |

**Note on line 7:** this cites the pilot result that is on screen. Keep the
words "in our pilot" — it is the difference between a reported figure and an
unqualified claim.

### Alternate: no-VO cut

Ship this too, and honestly consider leading with it. A launch film that plays
on typography and product alone reads as more self-assured, and it travels
better across languages. If there is no VO, the music must carry more: add a
melodic motif entering at 10.5 and returning at 55.1 to give the film a spine.

---

## 4. Music

### Frame

- **Tempo:** 120 BPM. Bar = 2.0s. Steady — no tempo changes.
- **Key:** A minor, moving to A major-ish brightness in the final act (raise the
  third in the pad from C to C# at 49.0). It is a small move and it does a lot.
- **Metre:** 4/4 throughout.
- **Composed to picture**, not to a loop. The cuts do not fall on bar lines and
  should not be forced to — the SFX carries the sync, the music carries the arc.

### Instrumentation

Keep the palette to five voices. More than that and it stops sounding designed.

| Voice | Character |
|---|---|
| **Sub** | Sine-ish, 40–70 Hz, one note per bar. The floor of the whole film. |
| **Pad** | Wide, slow-moving, heavily filtered. Never plays a recognisable melody. |
| **Pulse** | A muted, short, dry note on eighths. Felt more than heard. Provides the forward motion. |
| **Kick** | Soft, round, no click. This is not a dance track. |
| **Air** | Granular/noise texture, high and quiet, swelling under the light scenes. |

Deliberately absent: piano, strings, plucked melodies, vocal chops, snares,
claps. Any of these would pull it toward advert.

### Arrangement

| Act | Time | What the music does |
|---|---|---|
| Cold open | 0.0–5.5 | **Near silence.** Sub only, very low, one note. No pulse, no kick. Let the SFX own it. |
| Logo | 5.5–10.5 | Pad arrives on the flash at 5.5. Still no drums. Air swells. |
| Product I | 10.5–24.6 | Pulse enters at 10.5. Kick enters at 17.5, not before — the film should gain a heartbeat at the second product scene, not the first. |
| Product II | 24.6–38.0 | Full but restrained. Add one harmonic layer at 31.0 for the analytics scene. |
| Scale | 38.0–49.0 | Widest point. Pad opens up. |
| Pricing | 49.0–55.1 | **Drop the kick.** Counter-intuitive and it works — pulling the floor out makes the pricing land. Pad brightens (the third). |
| End card | 55.1–61.4 | Kick returns once at 55.1, then everything decays. Last 1.5s: sub and air only, fading to nothing. |

### Two things not to do

- **Do not build continuously to the end.** The pricing dip is what gives the
  end card somewhere to go.
- **Do not resolve on a major chord swell.** Let it simply stop breathing. The
  film ends on a URL, not a crescendo.

---

## 5. Sound design

This is where the film is won. The product scenes are full of small motions —
chips landing, a message sending, counters running, a highlight travelling —
and each one wants a sound.

### Palette

| Family | Spec | Used for |
|---|---|---|
| **Transition whoosh** | 0.6–1.1s, filtered noise sweeping 400 Hz → 6 kHz, stereo-wide, tail into the cut | Every scene change |
| **Impact** | 40–90 Hz sine drop + short mid crack, 0.8–1.6s tail | Cuts into a new act |
| **Sub drop** | Pure sine 55→35 Hz, 1.2s | The three biggest moments only |
| **UI tick** | 15–40 ms, dry, 2–5 kHz, near-silent tail | Chips, bullets, counters, ring moves |
| **Send / receive** | Short rising pair for send, softer falling for receipt | The WhatsApp beat |
| **Counter run** | Very quiet granular tick at ~40 Hz repetition, riding the counter | Analytics and results numbers |
| **Riser** | 1.0–1.6s noise + pitch sweep, ducked hard at the peak | Into the three act breaks |
| **Reverse** | Reversed cymbal/noise, 0.5s, ending exactly on a cut | Pre-roll before logo and end card |
| **Air movement** | Long, quiet, slow-panning noise bed | Under the light product scenes |

### The UI layer is the differentiator

Record real sounds rather than pulling library UI blips: a fingernail on glass,
a light switch, a mechanical keyboard key with the spring damped, a coin on
wood, a camera shutter at low level. Pitch them up, gate them hard, and mix them
**quiet** — 25–30 dB below the music. They should be subliminal. This layer is
almost always what separates a film that sounds designed from one that sounds
scored.

### Cue sheet

Times are absolute seconds. "→" means the sound leads *into* that time.

| Time | Picture | Sound |
|---|---|---|
| 0.00 | Black | Silence. True silence, not room tone. |
| 0.30 | First hairline draws | Single UI tick, very dry, hard-panned centre |
| 0.50 | Grid snaps in | Four short ticks in quick succession, widening in the stereo field |
| 0.86 | Record bars streak in from the sides | Layered short whooshes, panned to match travel direction. This is the first big sound in the film. |
| 1.55 | Bars settle into the field | Cluster of soft UI taps, staggered ~20 ms apart |
| 1.95 | "PATIENTS" punches on | Impact (mid-weight) + a 200 ms reverse leading into it |
| 2.50 | "RECORDS" | Same, pitched up a tone, slightly drier |
| 3.05 | "RECALLS" | Same, pitched up again, add a short sub drop |
| 3.60 | Field converges inward | Rising whoosh, 0.9s, accelerating |
| 4.48 | Whip / compression to a line | Hard whoosh out, then **cut all sound at 4.60** |
| 4.60–5.45 | Near silence, line pulses | Only a faint sub and a single ping at 4.70 |
| **5.50** | **Flash to light, logo** | Sub drop + bright impact + reverse tail resolving. The biggest single hit in the film. Pad enters here. |
| 6.10 | Outline mark fades up | Two soft ticks |
| 6.80 | Solid mark wipes up through it | Slow filtered sweep, 0.5s, rising |
| 7.40 | Wordmark letters settle | Very quiet granular tick run, one per letter |
| **10.50** | Cut → dashboard | Whoosh + light impact. **Pulse enters.** |
| 10.97 | Browser pushes in | Low swell under it |
| 11.15 | URL types | 6–8 near-silent key ticks, irregular spacing |
| 11.75, 11.91 | Callout chips land | One soft tap each |
| **17.50** | Cut → WhatsApp | Whoosh + impact. **Kick enters.** |
| 18.45 | Phone rises into frame | Low upward swell |
| 19.65 | "Prescription sent" badge leaves the app | **Send sound** — short rising pair, panned left→right across the flight |
| 20.75 | Badge lands on the phone | Soft receipt tap, panned right |
| 20.90 | "Delivered & read" ticks | Two quick bright ticks, a semitone apart |
| **24.60** | Cut → records | Whoosh + impact |
| 25.65 | Highlight ring appears on Treatment Plan | Single soft tick + brief filtered swell |
| 27.10 | Ring travels to Prescription | Short slide — pitched noise following the movement |
| 28.50 | Ring travels to Charges | Same, pitched down |
| **31.00** | Cut → analytics (to dark) | Whoosh + impact + **sub drop**. The tonal shift to dark wants weight. |
| 32.15–33.85 | Three stat counters run | Counter-run texture under each, stopping dead as each number lands |
| 33.30, 33.56, 33.82 | Each number settles | One dry tick per landing |
| **38.00** | Cut → multi-clinic (to light) | Whoosh + bright impact |
| 38.75, 38.89, 39.03 | Three branch cards fan out | Three taps, staggered, spread across the stereo field |
| **43.50** | Cut → results | Whoosh + impact |
| 43.95 | "30%" counts up | Counter run, longer and more prominent than the analytics ones |
| 45.20 | 30% lands | Impact, mid-weight — this is the claim of the film |
| 45.40, 45.58 | Supporting stats | One tick each, much quieter |
| **49.00** | Cut → pricing | Whoosh, **no impact**. **Kick drops out.** The absence is the accent. |
| 49.75, 49.91, 50.07 | Three plan cards rise | Three soft taps ascending in pitch |
| 50.45 | Pro card lifts and glows | Quiet upward swell |
| **55.10** | Cut → end card (to dark) | Sub drop + impact. Kick returns for one bar. |
| 55.19 | Mark springs in | Short reverse resolving on the landing |
| 55.55 | Wordmark settles | Granular tick run |
| 56.39 | CTA appears | One clear, bright tick — the last deliberate sound |
| 57.10, 58.65 | CTA ring pulses | Nothing. Let it be silent. |
| 60.55–61.40 | Fade to black | Music decays alone. Last 0.6s: silence. |

---

## 6. Mix

### Buses

```
MUSIC ──┐
SFX   ──┼── MIX BUS ── limiter ── master
VO    ──┘
```

- **VO → MUSIC duck:** −4 dB, 80 ms attack, 260 ms release. Gentle. If it
  pumps, it is too much.
- **VO → SFX duck:** −2 dB only. The UI layer should survive under the voice.
- **SFX impacts → MUSIC duck:** −2.5 dB, 40 ms, 180 ms. Gives the hits room.
- No ducking at all on the sub bus. It should be continuous.

### Voice treatment

- High-pass at 85 Hz. De-ess at 6–8 kHz, 3 dB max.
- Carve the music bus 2.5–4 kHz by 2–3 dB while VO is present, rather than
  boosting the voice there.
- Compression: 3:1, slow attack, aiming for 4–6 dB reduction on peaks. The read
  is calm; do not squash it into urgency.
- A very short room (0.5s, low mix) so it does not sound booth-dry against the
  wide music. No visible tail.

### Level targets

| Element | Level relative to mix |
|---|---|
| VO | −6 dB peak, sitting clearly forward |
| Music (under VO) | −18 to −16 LUFS-S |
| Music (no VO) | −14 to −12 LUFS-S |
| Impacts | Peak −6 dB, never limiting the bus |
| UI layer | −28 to −24 dB. Subliminal. |

### Masters

| Destination | Integrated | True peak |
|---|---|---|
| X / Twitter, LinkedIn | −14 LUFS | −1.5 dBTP |
| YouTube | −14 LUFS | −1.0 dBTP |
| Instagram / TikTok | −14 LUFS | −1.5 dBTP |
| Web embed (site hero) | −16 LUFS | −2.0 dBTP |

Do not master hotter than −14. Every platform normalises down, and a hot master
only loses dynamic range on the way.

---

## 7. Notes on the current mix

- **The UI layer is synthesised, not recorded.** It works, but the brief's
  advice still stands: an hour recording real objects (fingernail on glass, a
  damped keyboard key, a coin on wood) would beat it. That is the highest-value
  remaining upgrade.
- **Reverb is a single synthetic IR** shared by every hit. A real plate or a
  convolution of an actual room would give the impacts more character.
- **No VO ducking is active** because there is no VO yet. The automation is in
  `mix.py` behind the `IMPACTS` list; adding a voice bus means adding a second
  duck envelope, not restructuring the mix.
- **Stereo width comes from panning and decorrelated noise**, which is honest
  but modest. Mid/side widening on the music bus would open it up, at the cost
  of some mono compatibility — worth testing on a phone speaker first.

## 8. Sourcing

- **Music:** commission it if the budget exists — 60 seconds to this spec is a
  small job for a composer and the difference is obvious. Failing that,
  Musicbed / Artlist / Epidemic have adequate beds in this register. Search for
  "minimal tech", "ambient pulse", "sub-driven", not "corporate inspiring".
- **SFX:** a transition/UI pack is fine as a base, but record the UI layer
  yourself as described above. An hour with a phone and quiet room beats any
  library for this.
- **VO:** cast through an Indian VO marketplace rather than a global one, for
  the register. Budget for a retake pass after the mix — lines almost always
  need adjusting once they sit against the picture.
- **Licensing:** confirm the music licence covers paid social. Many "free for
  YouTube" licences do not, and a launch film is exactly the asset that gets
  promoted.

---

## 9. Handing it back

Drop `mix-master.wav` in as `launch-video/src/soundtrack.wav` and re-run:

```bash
cd launch-video/src && ./encode.sh ../out
```

Encoding reads the WAV directly, so no re-render is needed — the frames are
untouched. If the file's length differs from 61.4s, adjust `DUR` in `audio.py`
(or just trim the WAV) so the muxer does not pad or truncate the tail.

For the caption variant, supply an SRT against the VO script above and burn it
with `subtitles=` in the encode filter chain.
