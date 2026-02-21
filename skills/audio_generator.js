const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Engine Drivers ---

async function runElevenLabs(prompt, outputPath) {
    const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY missing.");

    const client = new ElevenLabsClient({ apiKey });
    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel

    console.log(`🎙️ [ElevenLabs] Synthesizing speech...`);
    const audioStream = await client.textToSpeech.convert(voiceId, {
        text: prompt,
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_44100_128",
    });

    // New SDK returns an async iterable — collect chunks and write to file
    const chunks = [];
    for await (const chunk of audioStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    fs.writeFileSync(outputPath, Buffer.concat(chunks));

}

async function runSuno(prompt, outputPath) {
    // Suno typically requires an unofficial API bridge (e.g., suno-api)
    // Here we assume the user has set up a bridge and provided the BASE_URL
    const SUNO_API_URL = process.env.SUNO_API_URL || "http://localhost:3000";

    console.log(`🎙️ [Suno] Requesting song matching: "${prompt}"`);

    // This is a pattern for common suno-api wrappers
    const response = await fetch(`${SUNO_API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, make_instrumental: false, wait_audio: true })
    });

    const data = await response.json();
    const audioUrl = data[0].audio_url;

    console.log(`📥 Downloading Suno track...`);
    const file = fs.createWriteStream(outputPath);
    return new Promise((resolve, reject) => {
        https.get(audioUrl, (res) => {
            res.pipe(file);
            file.on('finish', resolve);
            file.on('error', reject);
        });
    });
}

// --- Upgrade 11: Music Generation (ElevenLabs Music API) ---
async function runElevenLabsMusic(prompt, outputPath) {
    const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY missing.");

    const client = new ElevenLabsClient({ apiKey });
    console.log(`🎵 [ElevenLabs Music] Generating track: "${prompt}"...`);

    const audioStream = await client.textToSoundEffects.convert({
        text: prompt,
        duration_seconds: 22, // ~22s of music
        prompt_influence: 0.5,
    });

    const chunks = [];
    for await (const chunk of audioStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    fs.writeFileSync(outputPath, Buffer.concat(chunks));
}

// --- Upgrade 11: Sound Effects (ElevenLabs SFX) ---
async function runElevenLabsSFX(prompt, outputPath) {
    const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY missing.");

    const client = new ElevenLabsClient({ apiKey });
    console.log(`🔊 [ElevenLabs SFX] Generating sound effect: "${prompt}"...`);

    const audioStream = await client.textToSoundEffects.convert({
        text: prompt,
        duration_seconds: 5,
        prompt_influence: 0.7,
    });

    const chunks = [];
    for await (const chunk of audioStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    fs.writeFileSync(outputPath, Buffer.concat(chunks));
}

// --- Main execution ---

async function main() {
    const prompt = process.argv[2];
    const outputPath = process.argv[3] || path.join(process.cwd(), `audio_${Date.now()}.mp3`);
    const engine = process.env.AUDIO_ENGINE || 'elevenlabs';

    if (!prompt) {
        console.error("Usage:");
        console.error("  node audio_generator.js 'Prompt'           # TTS speech");
        console.error("  AUDIO_ENGINE=music node audio_generator.js 'Prompt'  # Music track");
        console.error("  AUDIO_ENGINE=sfx   node audio_generator.js 'Prompt'  # Sound effect");
        process.exit(1);
    }

    try {
        if (engine === 'suno') {
            await runSuno(prompt, outputPath);
        } else if (engine === 'music') {
            await runElevenLabsMusic(prompt, outputPath);
        } else if (engine === 'sfx') {
            await runElevenLabsSFX(prompt, outputPath);
        } else {
            await runElevenLabs(prompt, outputPath);
        }
        console.log(`✅ Success! Audio saved: ${outputPath}`);
    } catch (error) {
        console.error(`❌ Error:`, error.message || error);
        process.exit(1);
    }
}

main();

