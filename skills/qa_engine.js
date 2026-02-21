const { chromium } = require('playwright');

async function runTest(url, testSteps) {
    if (!url) {
        console.error("Usage: node qa_engine.js <url> '[{\"action\": \"click\", \"selector\": \"#btn\"}]'");
        process.exit(1);
    }

    console.log(`🧪 Starting QA Engine Test for: ${url}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log(`🌐 Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle' });

        const steps = testSteps ? JSON.parse(testSteps) : [];
        console.log(`📝 Executing ${steps.length} test steps...`);

        for (const step of steps) {
            console.log(`👉 Step: ${step.action} on ${step.selector || 'page'}`);

            if (step.action === 'click') {
                await page.click(step.selector);
            } else if (step.action === 'type') {
                await page.fill(step.selector, step.value);
            } else if (step.action === 'assertText') {
                const content = await page.textContent(step.selector);
                if (!content.includes(step.value)) {
                    throw new Error(`Assertion Failed: Expected "${step.value}" but found "${content}"`);
                }
            } else if (step.action === 'wait') {
                await page.waitForTimeout(step.value || 1000);
            }
        }

        console.log("✅ All test steps passed successfully!");

        // Take a final screenshot of the state
        const screenshotPath = `qa_result_${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        console.log(`[[ANTIGRAVITY_QA_SCREENSHOT]]: ${screenshotPath}`);

    } catch (error) {
        console.error("❌ QA Test Failed:");
        console.error(error.message || error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

const urlArg = process.argv[2];
const stepsArg = process.argv[3];

runTest(urlArg, stepsArg);
