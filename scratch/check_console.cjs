const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Catch console logs
  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });

  // Catch page errors
  page.on('pageerror', err => {
    console.error('[PAGE ERROR]:', err.toString());
  });

  try {
    console.log('Navigating to http://localhost:5180/');
    await page.goto('http://localhost:5180/', { waitUntil: 'networkidle2' });

    console.log('Logging in...');
    await page.type('#email', 'devansh@nurturinggreen.in');
    await page.type('#pw', 'password');
    await page.click('button[type="submit"]');

    console.log('Waiting for navigation to /modules...');
    await new Promise(r => setTimeout(r, 2000));
    console.log('Current URL:', page.url());

    console.log('Navigating to /retail-ops...');
    await page.goto('http://localhost:5180/retail-ops', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    console.log('Current URL:', page.url());

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await browser.close();
  }
})();
