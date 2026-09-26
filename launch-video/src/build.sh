#!/usr/bin/env bash
# Rebuild the launch film end to end.
#   ./build.sh            full render (4 parallel workers) + encode
#   ./build.sh preview    one frame per scene into ./preview
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
cd "$D"

# 1. brand fonts — Open Runde (GitHub) + Geist Mono (Google Fonts)
[ -d fonts ] || python3 fetch-fonts.py

# 2. product stills — the real app captures that ship with the site
mkdir -p img && cp ../../assets/images/*.png ../../assets/images/*.jpg img/ 2>/dev/null || true

if [ "${1:-}" = "preview" ]; then
  mkdir -p preview
  ONLY=1.4,3.0,8.0,14,21,28,34.5,41,46,52,58.5 OUT="$D/preview" node render.js
  exit 0
fi

# 3. frames — split across 4 browsers, ~17 min on 4 cores
rm -rf frames && mkdir -p frames
for i in 0 1 2 3; do
  FROM=$(python3 -c "print(61.4*$i/4)") TO=$(python3 -c "print(61.4*($i+1)/4)") \
    OUT="$D/frames" node render.js > "w$i.log" 2>&1 &
done
wait

# 4. audio: conform the supplied track, build the SFX layer, mix
mkdir -p music
[ -f music/source.wav ] || ffmpeg -y -loglevel error -i ../audio/Calculated_Rise.mp3 \
  -ar 48000 -ac 2 -c:a pcm_s24le music/source.wav
python3 music_edit.py
python3 sfx.py
python3 mix.py
cp music/soundtrack.wav soundtrack.wav

# 5. encode
./encode.sh "$D/../out"
