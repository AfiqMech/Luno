---
description: Run an autonomous browser test to verify that a feature or app is working.
---
This workflow allows Antigravity to verify the quality of its own work. Use this after building a new UI component, fixing a bug, or before a project deployment.

// turbo-all
1. Identify the URL of the app to test (local or live).
2. Define a list of test steps in JSON format.
   *Example*: `[{"action": "click", "selector": "button.submit"}, {"action": "assertText", "selector": ".success-msg", "value": "Saved!"}]`
3. Run the QA engine script via node:
   ```bash
   antigravity $COMMAND "<URL>" '<STEPS_JSON>'
   ```
   *Replace `<URL>` with the target address.*
   *Replace `<STEPS_JSON>` with your list of actions.*

4. Read the output for "✅ All test steps passed successfully!"
5. View the generated screenshot to visually confirm the state of the app! 📸
6. If the test fails, analyze the error message and proactively fix the code! 🛠️
