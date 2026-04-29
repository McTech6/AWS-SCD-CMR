const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200 });
    const { buildPosterHTML } = await import('../Backend/src/assets/posterTemplate.js');
    const html = buildPosterHTML({ name: 'Test', imageDataUri: 'data:image/png;base64,123' });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    const el = await page.$('#poster');
    if (!el) throw new Error('no #poster element found');
    await el.screenshot({ type: 'png' });
    console.log('SUCCESS');
    await browser.close();
  } catch (e) {
    console.error('ERROR:', e);
    process.exit(1);
  }
})();
