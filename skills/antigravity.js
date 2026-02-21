#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const SKILLS_DIR = require('path').join(require('os').homedir(), '.agents', 'skills');

const commands = {
    'video': (prompt) => `node "${path.join(SKILLS_DIR, 'video_generator.js')}" "${prompt}"`,
    'audio': (prompt) => `node "${path.join(SKILLS_DIR, 'audio_generator.js')}" "${prompt}"`,
    'music': (prompt) => `node "${path.join(SKILLS_DIR, 'audio_generator.js')}" "${prompt}"`,
    'sfx': (prompt) => `node "${path.join(SKILLS_DIR, 'audio_generator.js')}" "${prompt}"`,
    'design': (prompt) => `node "${path.join(SKILLS_DIR, 'stitch_bridge.js')}" "${prompt}"`,
    'scrape': (url) => `node "${path.join(SKILLS_DIR, 'web_scraper.js')}"` + ` "${url}"`,
    'deploy': (args) => `node "${path.join(SKILLS_DIR, 'deploy_skill.js')}" ${args}`,
    'qa': (args) => `node "${path.join(SKILLS_DIR, 'qa_engine.js')}" ${args}`,
    'memory': (args) => `node "${path.join(SKILLS_DIR, 'memory_manager.js')}" ${args}`,
    'github': (args) => `node "${path.join(SKILLS_DIR, 'github_skill.js')}" ${args}`,
    'database': (args) => `node "${path.join(SKILLS_DIR, 'supabase_skill.js')}" ${args}`,
};

const usage = `
🌌 Antigravity Universal CLI 🌌
Usage: antigravity <power> [args]

Powers:
  video  "Prompt"          (Hunyuan/Luma)
  audio  "Prompt"          (ElevenLabs/Suno)
  design "Prompt"          (Google Stitch)
  scrape <URL>             (Puppeteer Research)
  deploy <provider> <path> (Vercel/Netlify)
  qa     <URL> <Steps>    (Playwright Testing)
  memory <action> <key>    (Persistent Knowledge)
  github <command> [args]  (GitHub Repo Manager)

Example: antigravity github create-repo my-app
`;

const power = process.argv[2];
const args = process.argv.slice(3).join(' ');

if (!power || !commands[power]) {
    console.log(usage);
    process.exit(0);
}

try {
    const memoryManager = path.join(SKILLS_DIR, 'memory_manager.js');
    const memoryJson = execSync(`node "${memoryManager}" list --json`, { encoding: 'utf-8' });
    const memory = JSON.parse(memoryJson);

    // Inject common keys into process.env so skills can use them
    if (memory.LUMA_API_KEY) process.env.LUMA_API_KEY = memory.LUMA_API_KEY;
    if (memory.REPLICATE_API_TOKEN) process.env.REPLICATE_API_TOKEN = memory.REPLICATE_API_TOKEN;
    if (memory.ELEVENLABS_API_KEY) process.env.ELEVENLABS_API_KEY = memory.ELEVENLABS_API_KEY;
    if (memory.GITHUB_TOKEN) process.env.GITHUB_TOKEN = memory.GITHUB_TOKEN;
    if (memory.SUPABASE_URL) process.env.SUPABASE_URL = memory.SUPABASE_URL;
    if (memory.SUPABASE_ANON_KEY) process.env.SUPABASE_ANON_KEY = memory.SUPABASE_ANON_KEY;
    // Set AUDIO_ENGINE for music/sfx routing
    if (power === 'music') process.env.AUDIO_ENGINE = 'music';
    if (power === 'sfx') process.env.AUDIO_ENGINE = 'sfx';
} catch (e) {
    // Memory might be empty or missing, skip injection
}

try {
    const fullCommand = commands[power](args);
    console.log(`⚡ Executing Universal Skill: ${power}...`);
    // Use the current process.env which now contains the memory keys
    execSync(fullCommand, {
        stdio: 'inherit',
        env: { ...process.env }
    });
} catch (error) {
    console.error(`\n❌ Antigravity error executing "${power}"`);
    process.exit(1);
}
