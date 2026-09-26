#!/usr/bin/env bash
# Encode rendered frames + soundtrack into the delivery masters.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-$D/out}"
mkdir -p "$OUT"
FPS=60
AUD="$D/soundtrack.wav"
AF="loudnorm=I=-13.5:TP=-2.0:LRA=11:measured_I=-15.42:measured_TP=-0.92:measured_LRA=10.20:measured_thresh=-25.66:offset=1.58:linear=true,alimiter=limit=0.71:attack=4:release=70:level=disabled"

echo "==> 1/3  master 1920x1080"
ffmpeg -y -hide_banner -loglevel error -stats \
  -framerate $FPS -i "$D/frames/f_%06d.png" -i "$AUD" \
  -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.2 \
  -pix_fmt yuv420p -x264-params "ref=4:bframes=3:rc-lookahead=60" \
  -c:a aac -b:a 256k -ar 48000 -af "$AF" \
  -movflags +faststart -shortest \
  "$OUT/dentomate-launch-1080p.mp4"

echo "==> 2/3  square 1080x1080 (blur-fill)"
ffmpeg -y -hide_banner -loglevel error -stats \
  -i "$OUT/dentomate-launch-1080p.mp4" \
  -filter_complex "[0:v]split=2[bg][fg]; \
    [bg]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,boxblur=28:2,eq=brightness=-0.06[b]; \
    [fg]scale=1080:-2[f]; \
    [b][f]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -movflags +faststart \
  "$OUT/dentomate-launch-square.mp4"

echo "==> 3/3  vertical 1080x1920 (blur-fill)"
ffmpeg -y -hide_banner -loglevel error -stats \
  -i "$OUT/dentomate-launch-1080p.mp4" \
  -filter_complex "[0:v]split=2[bg][fg]; \
    [bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:2,eq=brightness=-0.06[b]; \
    [fg]scale=1080:-2[f]; \
    [b][f]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -movflags +faststart \
  "$OUT/dentomate-launch-vertical.mp4"

echo "==> poster frame"
ffmpeg -y -hide_banner -loglevel error -i "$D/frames/f_000870.png" \
  -vf scale=1920:1080 -q:v 2 "$OUT/dentomate-launch-poster.jpg"

echo
ls -lh "$OUT"
