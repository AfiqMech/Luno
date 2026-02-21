<#
.SYNOPSIS
Installs Ultimate Antigravity Skills & Workflows onto your Windows system.
#>

Write-Host "🌌 Welcome to the Ultimate Antigravity Installer 🌌" -ForegroundColor Cyan
Write-Host "This will install core skills, workflows, and global MCP servers."

$agentsDir = Join-Path $HOME ".agents"
$skillsDir = Join-Path $agentsDir "skills"
$workflowsDir = Join-Path $agentsDir "workflows"
$mcpDir = Join-Path $HOME ".gemini\antigravity"

# 1. Create Directories
Write-Host "`n📁 Creating core directories..." -ForegroundColor Yellow
if (-Not (Test-Path $agentsDir)) { New-Item -ItemType Directory -Force -Path $agentsDir | Out-Null }
if (-Not (Test-Path $skillsDir)) { New-Item -ItemType Directory -Force -Path $skillsDir | Out-Null }
if (-Not (Test-Path $workflowsDir)) { New-Item -ItemType Directory -Force -Path $workflowsDir | Out-Null }
if (-Not (Test-Path $mcpDir)) { New-Item -ItemType Directory -Force -Path $mcpDir | Out-Null }

# 2. Copy Files
Write-Host "🚀 Copying Antigravity Engine..." -ForegroundColor Yellow
Copy-Item -Path ".\skills\*" -Destination $skillsDir -Recurse -Force
Copy-Item -Path ".\workflows\*" -Destination $workflowsDir -Recurse -Force
Copy-Item -Path ".\package.json" -Destination $skillsDir\package.json -Force

# 3. Setup Configs
Write-Host "⚙️  Configuring MCP Servers..." -ForegroundColor Yellow
$mcpTemplate = Get-Content ".\mcp_config.json.template" -Raw
$githubToken = Read-Host "Enter your GitHub Personal Access Token (or press Enter to skip)"
if ($githubToken) {
    $mcpTemplate = $mcpTemplate -replace "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN", $githubToken
}
$mcpTemplate = $mcpTemplate -replace "<YOUR_HOME_DIR>", ($HOME -replace '\\', '/')
$mcpTemplate = $mcpTemplate -replace "<YOUR_PROJECT_DIR>", ((Get-Location).Path -replace '\\', '/')
$mcpConfigPath = Join-Path $mcpDir "mcp_config.json"
Set-Content -Path $mcpConfigPath -Value $mcpTemplate

# 4. Setup ENV Keys
Write-Host "`n🔑 API Key Configuration" -ForegroundColor Cyan
$envContent = ""
$lumaKey = Read-Host "Luma AI Key (Video) [optional]"
if ($lumaKey) { $envContent += "LUMA_API_KEY=$lumaKey`n" }
$elevenKey = Read-Host "ElevenLabs API Key (Audio) [optional]"
if ($elevenKey) { $envContent += "ELEVENLABS_API_KEY=$elevenKey`n" }
$supabaseUrl = Read-Host "Supabase Project URL (Database) [optional]"
if ($supabaseUrl) { $envContent += "SUPABASE_URL=$supabaseUrl`n" }
$supabaseKey = Read-Host "Supabase Anon Key [optional]"
if ($supabaseKey) { $envContent += "SUPABASE_ANON_KEY=$supabaseKey`n" }

Set-Content -Path (Join-Path $skillsDir ".env") -Value $envContent

# 5. NPM Install & Link
Write-Host "`n📦 Installing dependencies (this takes a minute)..." -ForegroundColor Yellow
Set-Location $skillsDir
npm install
npm link

Write-Host "`n✅ Ultimate Antigravity Installation Complete!" -ForegroundColor Green
Write-Host "You can now run 'antigravity' from any command prompt to use your new universal skills!"
