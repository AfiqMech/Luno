const puppeteer = require('puppeteer');

async function scrapePage(url) {
    if (!url) {
        console.error("Error: Please provide a URL to scrape.");
        process.exit(1);
    }

    console.log(`🌍 Initiating Deep Web Scrape for: ${url}`);

    let browser;
    try {
        // Launch a headless browser
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        });

        const page = await browser.newPage();

        // Anti-bot detection mitigation (pretend to be a real user)
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        console.log("⏳ Navigating and waiting for network idle...");
        // Go to URL and wait until the network is quiet (ensures React/Vue apps load)
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Optional: Scroll down to trigger lazy-loaded elements
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        console.log("📄 Extracting text payload...");

        // Extract the core text of the page, ignoring scripts and styles
        const pageText = await page.evaluate(() => {
            // Remove junk elements 
            const elementsToRemove = document.querySelectorAll('script, style, noscript, nav, footer, iframe, svg');
            elementsToRemove.forEach(el => el.remove());

            return document.body.innerText || document.body.textContent;
        });

        console.log("\n✅ Web Scrape Successful!");
        console.log("--- START EXTRACTED CONTENT ---");
        console.log(pageText.trim());
        console.log("--- END EXTRACTED CONTENT ---");

    } catch (error) {
        console.error(`❌ Scrape Failed: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Get the URL from the command line arguments
const targetUrl = process.argv[2];
scrapePage(targetUrl);
