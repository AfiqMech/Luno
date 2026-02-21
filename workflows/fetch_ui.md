---
description: How to fetch AI-generated UI designs using Google Stitch
---
# Fetch UI via Stitch Workflow

When the user requests you (Antigravity) to design a new UI screen, a widget, or a layout component using Stitch, you should follow this automated workflow:

1.  **Execute the Bridge Script:**
    You must trigger the local `stitch_bridge.js` file with the user's prompt to connect to the Google Stitch MCP server. 
    *Powershell:* `node d:\NewApp\.agents\skills\stitch_bridge.js "The user's prompt goes here"`

2.  **Wait and Read the Raw Output:**
    The Stitch MCP Server takes a few moments to generate the UI components. Monitor the terminal output. The script is programmed to print out the raw JSON response between the `--- STITCH RAW OUTPUT ---` terminal flags.

3.  **Synthesize into the App Codebase:**
    Once you have read the JSON/text output from the Stitch server, do **NOT** just spit the code back to the user. You are the Lead Engineer.
    * Parse the Flutter or Web code provided by Stitch.
    * Automatically create the necessary `.dart` (or `.js/.tsx`) files in the user's `d:\NewApp` directory using the `write_to_file` tool.
    * If you are working in a Flutter app, ensure the UI snippet has correct Material/Cupertino imports and is integrated into the routing or `main.dart` if needed.

4.  **Confirm with the User:**
    Use `notify_user` to tell the user you have successfully pulled the requested design from Stitch and integrated it into their project files. Provide the file paths you modified.
