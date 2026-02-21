# 🌕 Luno: The Ultimate AI Engineering Engine

**Luno** transforms your standard code assistant into an omnipotent, autonomous software engineering agent. By injecting a suite of tools and globally available scripts directly into your OS, Luno gives your AI the power to browse the web, generate multimedia, run visual QA tests, push to GitHub, query databases, and remember context across sessions.

---

## ✨ Features of Luno

Luno bridges the gap between text-generation and real-world execution. With it installed, your AI gains these superpowers:

### 1. 🧠 Omniscient Memory
Luno uses a persistent local SQLite database. The AI can save its learnings, your coding preferences, and ongoing project states, remembering you across completely separate chats and sessions.

### 2. 🎬 Native Multimedia Generation
No more switching tabs. Luno hooks directly into Luma, Hunyuan, and ElevenLabs. You can ask your AI to "Generate a cinematic video for my landing page" or "Synthesize a cyberpunk background track," and Luno will render the MP4s and MP3s directly into your project folder.

### 3. 🕸️ Deep Web Research (Scraping)
Standard AI web search relies on basic indexing. Luno uses a headless Puppeteer browser. Ask the AI to read complex documentation, scrape dynamic JavaScript sites (React/Vue), or extract specific text from live web apps securely and autonomously.

### 4. 📸 Playwright QA Engine
Luno can visually test your apps. You can ask the AI to "Run a test on my login page." Luno will boot a real browser, click the buttons you told it to, assert the success message, and drop a screenshot (`qa_result.png`) directly in your workspace showing the final state.

### 5. 🚀 1-Click Cloud Deployment
Tell the AI to "Deploy this frontend." Luno packages your app and ships it directly to Vercel or Netlify via terminal APIs.

### 6. 🐙 Autonomous GitHub Pipelines
Luno connects directly to GitHub via Octokit. Instead of manually initializing git, committing, and pushing, just tell the AI to "Publish this project to my GitHub." It will create the repo and push the code in one swoop.

### 7. 🗄️ Supabase Cloud Integration
Luno connects directly to Supabase. The AI can spin up tables, insert records, or query your live production data simply by you asking it in plain English.

### 8. 🔌 The MCP Array System
Built-in, zero-setup integrations with the Model Context Protocol (MCP) including Google Stitch (UI generation), Slack, Dart, and FileSystem servers.

---

## ⚙️ How to Install Luno (1-Click Setup)

Luno is designed for zero-friction installation. It automatically configures the hidden `.agents` directories and writes the MCP configuration file for you.

### For Windows
1. Download or git clone this repository to your machine.
2. Open PowerShell inside the `Luno` folder.
3. Run the installer:
   ```powershell
   .\install.ps1
   ```
4. Follow the on-screen prompts. Provide your API keys (like ElevenLabs or Luma) if you want multimedia generation, or simply press `Enter` to skip the ones you don't need.

### For Mac/Linux
1. Download or git clone this repository.
2. Open a terminal in the folder and make the script executable:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. Follow the on-screen prompts to input your keys.

---

## 🛠️ How to Apply & Use Luno

Once the installer finishes, Luno is **globally active** on your system. 

### Method 1: Ask the AI (The Magic Way)
Because the `workflows` directory was copied into your hidden `.agents` folder, your AI assistant *already knows how to use Luno*. 

You do not need to type commands. Simply open your AI chat and say:
- *"Scrape the docs at https://example.com and summarize them."*
- *"Push this current codebase to a new GitHub repo called my-cool-app."*
- *"Create a 5-second video of an astronaut floating in neon space."*
- *"Save this hex color palette to your memory so you remember it for my next project."*

The AI will automatically trigger the underlying Luno engines to execute your request.

### Method 2: Use the Global CLI (Manual Control)
If you just want to run Luno yourself, you can use the `antigravity` command from any terminal anywhere on your computer:

```bash
Luno Universal CLI
Usage: antigravity <power> [args]

Powers:
  video  "Prompt"          (Hunyuan/Luma)
  music  "Prompt"          (ElevenLabs/Suno)
  sfx    "Prompt"          (ElevenLabs/Suno)
  design "Prompt"          (Google Stitch)
  scrape <URL>             (Puppeteer Research)
  deploy <provider> <path> (Vercel/Netlify)
  qa     <URL> <Steps>    (Playwright Testing)
  memory <action> <key>    (Persistent Knowledge)
  github <command> [args]  (GitHub Repo Manager)
  database <action> [args] (Supabase Connector)
```

**Enjoy your radically upgraded AI capability!** 🌕
