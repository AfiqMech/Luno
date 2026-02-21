const fs = require('fs');
const path = require('path');

// The memory file is stored globally next to the skills folder
const MEMORY_FILE = path.join(__dirname, '..', 'antigravity_memory.json');

// Ensure memory file exists
if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify({}, null, 2));
}

function loadMemory() {
    try {
        const data = fs.readFileSync(MEMORY_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Error reading memory file:", e);
        return {};
    }
}

function saveMemory(data) {
    try {
        fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error saving memory file:", e);
    }
}

function execute() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        console.log("Commands: set <key> <value>, get <key>, delete <key>, list");
        return;
    }

    const memory = loadMemory();

    switch (command) {
        case 'set':
            const keyToSet = args[1];
            const valToSet = args.slice(2).join(' ');
            if (!keyToSet || !valToSet) {
                console.error("Usage: set <key> <value>");
                break;
            }
            memory[keyToSet] = valToSet;
            saveMemory(memory);
            console.log(`✅ Saved to memory: [${keyToSet}] = ${valToSet}`);
            break;

        case 'get':
            const keyToGet = args[1];
            if (!keyToGet) {
                console.error("Usage: get <key>");
                break;
            }
            if (memory[keyToGet] !== undefined) {
                console.log(`🧠 Memory [${keyToGet}]: ${memory[keyToGet]}`);
            } else {
                console.log(`❌ No memory found for key: ${keyToGet}`);
            }
            break;

        case 'delete':
            const keyToDelete = args[1];
            if (!keyToDelete) {
                console.error("Usage: delete <key>");
                break;
            }
            if (memory[keyToDelete] !== undefined) {
                delete memory[keyToDelete];
                saveMemory(memory);
                console.log(`🗑️ Deleted from memory: ${keyToDelete}`);
            } else {
                console.log(`❌ Key not found: ${keyToDelete}`);
            }
            break;

        case 'list':
            const isJson = args.includes('--json');
            if (isJson) {
                console.log(JSON.stringify(memory));
            } else {
                console.log("📖 --- Antigravity Global Memory ---");
                const keys = Object.keys(memory);
                if (keys.length === 0) {
                    console.log("Memory is completely empty.");
                } else {
                    keys.forEach(k => console.log(`- ${k}: ${memory[k]}`));
                }
                console.log("-----------------------------------");
            }
            break;

        default:
            console.error("Unknown command. Use: set, get, delete, list");
    }
}

execute();
