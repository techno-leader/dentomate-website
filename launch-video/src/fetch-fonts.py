#!/usr/bin/env python3
"""Fetch the brand typefaces and emit fonts.css.

Open Runde  — Dentomate's UI face, from the upstream GitHub repo.
Geist Mono  — all numerics, from Google Fonts (every subset, so ₹ renders).
"""
import re, subprocess, os, sys

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")
HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
os.makedirs(FONTS, exist_ok=True)

def curl(url, out=None):
    cmd = ["curl", "-sSL", "-m", "40", "-H", "User-Agent: " + UA, url]
    if out:
        cmd[1:1] = ["-o", out]
        subprocess.run(cmd, check=True)
        return None
    return subprocess.run(cmd, capture_output=True, text=True, check=True).stdout

rules = []

# --- Open Runde ---
for weight, name in [(400, "Regular"), (500, "Medium"), (600, "Semibold"), (700, "Bold")]:
    fn = f"OpenRunde-{name}.woff2"
    curl(f"https://raw.githubusercontent.com/lauridskern/open-runde/main/src/web/{fn}",
         os.path.join(FONTS, fn))
    rules.append("@font-face{font-family:'Open Runde';font-style:normal;font-weight:%d;"
                 "font-display:block;src:url('fonts/%s') format('woff2');}" % (weight, fn))

# --- Geist Mono, every subset ---
css = curl("https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap")
seen = {}
for block in re.findall(r"@font-face\s*\{(.*?)\}", css, re.S):
    w  = re.search(r"font-weight:\s*(\d+)", block).group(1)
    u  = re.search(r"url\((https://[^)]+)\)", block).group(1)
    ur = re.search(r"unicode-range:\s*([^;]+);", block)
    idx = len(seen.setdefault(w, []))
    fn = f"GeistMono-{w}-{idx}.woff2"
    seen[w].append(fn)
    curl(u, os.path.join(FONTS, fn))
    rules.append("@font-face{font-family:'Geist Mono';font-style:normal;font-weight:%s;"
                 "font-display:block;src:url('fonts/%s') format('woff2');%s}"
                 % (w, fn, ("unicode-range:" + ur.group(1).strip() + ";") if ur else ""))

with open(os.path.join(HERE, "fonts.css"), "w") as f:
    f.write("\n".join(rules))
print(f"{len(rules)} @font-face rules → fonts.css")
