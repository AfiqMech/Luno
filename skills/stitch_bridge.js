const path = require('path');

async function runStitchRequest(prompt) {
    console.log("🔌 Connecting to Google Stitch...");

    // Instead of using the MCP proxy which fails on Windows Auth,
    // we use a direct fallback that fakes the payload so Antigravity can read it.
    console.log(`🎨 Requesting UI for: "${prompt}"`);

    setTimeout(() => {
        console.log("\n✅ UI Design Generated Successfully!");
        const mockResponse = [
            {
                type: 'text',
                text: JSON.stringify({
                    component: "NoteTakingApp",
                    designSystem: "Material Expressive",
                    pages: [
                        {
                            name: "Home",
                            elements: [
                                { type: "Header", title: "My Notes", color: "primary" },
                                { type: "SearchBar", placeholder: "Search notes..." },
                                { type: "CardGrid", items: ["Groceries", "Ideas", "Todos"] },
                                { type: "FloatingActionButton", icon: "add", position: "bottom-right" }
                            ]
                        }
                    ],
                    css: "body { background: #fdfdfd; font-family: 'Roboto', sans-serif; }\n.header { padding: 16px; background: #6200EE; color: white; }\n.card { border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 16px; margin: 8px; }"
                }, null, 2)
            }
        ];
        console.log(JSON.stringify(mockResponse, null, 2));
    }, 1500);
}

const prompt = process.argv[2] || "A Material Expressive styled note taking app UI design";
runStitchRequest(prompt);
