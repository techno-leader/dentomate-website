/* Frame renderer: drives window.renderFrame(t) and writes a PNG per frame. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');

const DIR   = __dirname;
const FPS   = Number(process.env.FPS || 60);
const OUT   = process.env.OUT || path.join(DIR, 'frames');
const FROM  = process.env.FROM ? Number(process.env.FROM) : null;   // seconds
const TO    = process.env.TO   ? Number(process.env.TO)   : null;
const ONLY  = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null; // preview times

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    args: ['--force-color-profile=srgb', '--font-render-hinting=none',
           '--disable-lcd-text', '--hide-scrollbars']
  });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE:', m.text()); });

  await page.goto('file://' + path.join(DIR, 'stage.html'), { waitUntil: 'load' });
  await page.waitForFunction('window.SCENE_READY === true', null, { timeout: 60000 });
  const TOTAL = await page.evaluate('window.TOTAL_DURATION');
  console.log('duration', TOTAL, 's @', FPS, 'fps');

  const stage = page.locator('#stage');

  if (ONLY) {
    for (const t of ONLY) {
      await page.evaluate(t => window.renderFrame(t), t);
      const f = path.join(OUT, `preview_${String(t).replace('.', '_')}.png`);
      await stage.screenshot({ path: f });
      console.log('preview', t, '→', path.basename(f));
    }
    await browser.close(); return;
  }

  const first = FROM != null ? Math.round(FROM * FPS) : 0;
  const last  = TO   != null ? Math.round(TO   * FPS) : Math.ceil(TOTAL * FPS);
  const t0 = Date.now();
  for (let i = first; i < last; i++) {
    const t = i / FPS;
    await page.evaluate(t => window.renderFrame(t), t);
    await stage.screenshot({ path: path.join(OUT, `f_${String(i).padStart(6, '0')}.png`) });
    if (i % 120 === 0 || i === last - 1) {
      const done = i - first + 1, tot = last - first;
      const el = (Date.now() - t0) / 1000;
      const eta = el / done * (tot - done);
      console.log(`  ${done}/${tot}  ${(done/tot*100).toFixed(1)}%  ${el.toFixed(0)}s elapsed  ~${eta.toFixed(0)}s left`);
    }
  }
  await browser.close();
  console.log('frames written to', OUT);
})();
