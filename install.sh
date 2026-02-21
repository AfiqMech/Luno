#!/bin/bash

echo "🌌 Welcome to the Ultimate Antigravity Installer 🌌"
echo "This will install core skills, workflows, and global MCP servers."

AGENTS_DIR="$HOME/.agents"
SKILLS_DIR="$AGENTS_DIR/skills"
WORKFLOWS_DIR="$AGENTS_DIR/workflows"
MCP_DIR="$HOME/.gemini/antigravity"

# 1. Create Directories
echo -e "\n📁 Creating core directories..."
mkdir -p "$SKILLS_DIR"
mkdir -p "$WORKFLOWS_DIR"
mkdir -p "$MCP_DIR"

# 2. Copy Files
echo "🚀 Copying Antigravity Engine..."
cp -R ./skills/* "$SKILLS_DIR/"
cp -R ./workflows/* "$WORKFLOWS_DIR/"
cp ./package.json "$SKILLS_DIR/package.json"

# 3. Setup Configs
echo "⚙️  Configuring MCP Servers..."
read -p "Enter your GitHub Personal Access Token (or press Enter to skip): " GITHUB_TOKEN
MCP_TEMPLATE=$(cat ./mcp_config.json.template)

if [ -n "$GITHUB_TOKEN" ]; then
    MCP_TEMPLATE="${MCP_TEMPLATE//YOUR_GITHUB_PERSONAL_ACCESS_TOKEN/$GITHUB_TOKEN}"
fi

MCP_TEMPLATE="${MCP_TEMPLATE//<YOUR_HOME_DIR>/$HOME}"
MCP_TEMPLATE="${MCP_TEMPLATE//<YOUR_PROJECT_DIR>/$(pwd)}"
echo "$MCP_TEMPLATE" > "$MCP_DIR/mcp_config.json"

# 4. Setup ENV Keys
echo -e "\n🔑 API Key Configuration"
ENV_CONTENT=""
read -p "Luma AI Key (Video) [optional]: " LUMA_KEY
[ -n "$LUMA_KEY" ] && ENV_CONTENT+="LUMA_API_KEY=$LUMA_KEY\n"

read -p "ElevenLabs API Key (Audio) [optional]: " ELEVEN_KEY
[ -n "$ELEVEN_KEY" ] && ENV_CONTENT+="ELEVENLABS_API_KEY=$ELEVEN_KEY\n"

read -p "Supabase Project URL (Database) [optional]: " SUPABASE_URL
[ -n "$SUPABASE_URL" ] && ENV_CONTENT+="SUPABASE_URL=$SUPABASE_URL\n"

read -p "Supabase Anon Key [optional]: " SUPABASE_KEY
[ -n "$SUPABASE_KEY" ] && ENV_CONTENT+="SUPABASE_ANON_KEY=$SUPABASE_KEY\n"

echo -e "$ENV_CONTENT" > "$SKILLS_DIR/.env"

# 5. NPM Install & Link
echo -e "\n📦 Installing dependencies (this takes a minute)..."
cd "$SKILLS_DIR" || exit
npm install
npm link

echo -e "\n✅ Ultimate Antigravity Installation Complete!"
echo "You can now run 'antigravity' from any terminal to use your new universal skills!"
