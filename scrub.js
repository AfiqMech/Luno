const fs = require('fs');
const path = require('path');

function scrubFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace C:\Users\afiqh\.agents with dynamic resolution in JS
    if (filePath.endsWith('.js')) {
        content = content.replace(/['"]C:\\\\Users\\\\afiqh\\\\\.agents\\\\skills['"]/g, "require('path').join(require('os').homedir(), '.agents', 'skills')");
    }

    // Replace hardcoded node paths in MD
    if (filePath.endsWith('.md')) {
        content = content.replace(/node "C:\\Users\\afiqh\\\.agents\\skills\\[^"]+"/g, "antigravity $COMMAND");
        content = content.replace(/C:\\Users\\afiqh\\\.agents/g, "~/.agents");
        content = content.replace(/AfiqMech/gi, "your_username");
        content = content.replace(/afiqmechs/gi, "your_username");
    }

    // Scrub Template
    if (filePath.endsWith('.template')) {
        content = content.replace(/ghp_[a-zA-Z0-9]+/g, "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN");
        content = content.replace(/C:\/Users\/afiqh/g, "<YOUR_HOME_DIR>");
        content = content.replace(/D:\/NewApp/g, "<YOUR_PROJECT_DIR>");
    }

    fs.writeFileSync(filePath, content, 'utf-8');
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules') processDir(fullPath);
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.md') || fullPath.endsWith('.template')) {
                scrubFile(fullPath);
            }
        }
    }
}

processDir('d:/NewApp/skills');
processDir('d:/NewApp/workflows');
scrubFile('d:/NewApp/mcp_config.json.template');
console.log('Scrubbing complete!');
