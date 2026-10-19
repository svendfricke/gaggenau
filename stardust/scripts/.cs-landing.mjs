import { chromium } from 'playwright';
const [url, sel, props, width = '1440'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +width, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
console.log(await p.evaluate(([s, pr]) => [...document.querySelectorAll(s)].slice(0, 2).map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return `${e.tagName}.${e.className} ${Math.round(r.width)}x${Math.round(r.height)} ` + pr.split(',').map((k) => `${k}=${cs[k]}`).join(' '); }).join('\n'), [sel, props]));
await b.close();
