import { chromium } from 'playwright';
const [url, sel, width = '1440'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +width, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
console.log(await p.evaluate((s) => [...document.querySelectorAll(s)].map((e) => e.outerHTML.replace(/srcset="[^"]*"/g, '').replace(/<svg.*?<\/svg>/g, '<svg/>')).join('\n\n'), sel));
await b.close();
