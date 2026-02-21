const { execSync } = require('child_process');
const path = require('path');

async function deploy(provider, projectPath) {
    if (!provider || !projectPath) {
        console.error("Usage: node deploy_skill.js <provider> <projectPath>");
        console.error("Providers: vercel, netlify");
        process.exit(1);
    }

    const absolutePath = path.resolve(projectPath);
    console.log(`🚀 Initiating deployment to ${provider}...`);
    console.log(`📂 Project Path: ${absolutePath}`);

    try {
        if (provider.toLowerCase() === 'vercel') {
            console.log("☁️ Running Vercel Deployment (Production)...");
            // Run vercel --prod --yes to deploy silently if linked
            // Note: User needs to run 'vercel login' once manually in their terminal
            const output = execSync(`vercel --prod --yes`, {
                cwd: absolutePath,
                stdio: 'pipe',
                encoding: 'utf-8'
            });
            console.log("✅ Deployment successful!");
            console.log(output);

            // Extract the URL from the output if possible
            const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
            if (urlMatch) {
                console.log(`🌍 Live URL: ${urlMatch[0]}`);
                console.log(`[[ANTIGRAVITY_DEPLOY_URL]]: ${urlMatch[0]}`);
            }
        } else {
            console.error(`❌ Provider "${provider}" is not yet supported.`);
        }
    } catch (error) {
        console.error("❌ Deployment failed:");
        console.error(error.stdout || error.message || error);

        if ((error.stdout || "").includes("Login required")) {
            console.log("\n🔑 ACTION REQUIRED: Please run 'vercel login' in your terminal once to authenticate.");
        }
        process.exit(1);
    }
}

const providerArg = process.argv[2];
const pathArg = process.argv[3] || process.cwd();

deploy(providerArg, pathArg);
