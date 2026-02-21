require('dotenv').config();
const fs = require('fs');
const https = require('https');
const path = require('path');

// --- Engine Drivers ---

async function runLumaEngine(prompt) {
    const LumaAI = require('lumaai');
    const client = new LumaAI({ authToken: process.env.LUMA_API_KEY });

    console.log(`🎬 [Luma] Initiating generation...`);
    let generation = await client.generations.create({ prompt });
    console.log(`⏳ [Luma] Generation started. ID: ${generation.id}`);

    let completed = false;
    while (!completed) {
        generation = await client.generations.get(generation.id);
        if (generation.state === 'completed') {
            completed = true;
        } else if (generation.state === 'failed') {
            throw new Error(`Luma failed: ${generation.failure_reason}`);
        } else {
            process.stdout.write(".");
            await new Promise(r => setTimeout(r, 4000));
        }
    }
    return generation.assets.video;
}

async function runHunyuanEngine(prompt) {
    // HunyuanVideo is typically run via Replicate or similar aggregators
    const Replicate = require('replicate');
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    console.log(`🎬 [Hunyuan] Initiating generation via Replicate...`);
    const output = await replicate.run(
        "tencent/hunyuan-video:8479564b998105fd932d88c2b5bc751d3889c89e",
        { input: { prompt: prompt, num_frames: 81 } }
    );

    // Output is usually the direct file URL
    return Array.isArray(output) ? output[0] : output;
}

// --- Main execution ---

async function main() {
    const prompt = process.argv[2];
    const engine = process.env.VIDEO_ENGINE || 'luma'; // Default to luma

    if (!prompt) {
        console.error("Usage: VIDEO_ENGINE=hunyuan node video_generator.js 'Prompt'");
        process.exit(1);
    }

    try {
        let videoUrl;
        if (engine === 'hunyuan') {
            videoUrl = await runHunyuanEngine(prompt);
        } else {
            videoUrl = await runLumaEngine(prompt);
        }

        console.log("\n📥 Downloading video from:", videoUrl);
        const fileName = `video_${Date.now()}.mp4`;
        const outputPath = path.join(process.cwd(), fileName);

        const file = fs.createWriteStream(outputPath);
        https.get(videoUrl, function (response) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`🎉 Success! Video saved: ${outputPath}`);
                console.log(`[[ANTIGRAVITY_VIDEO_SAVED]]: ${outputPath}`);
            });
        });

    } catch (error) {
        console.error(`❌ Error:`, error.message || error);
        process.exit(1);
    }
}

main();
