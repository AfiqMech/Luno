# Automated Deployment Workflow

This workflow allows Antigravity to take a local code project and push it to a live production URL.

1.  **Verify Project:**
    Ensure the directory contains a `package.json` or static assets.

2.  **Run the Deployer:**
    Use the universal `antigravity` command to push the project live.
    `antigravity deploy vercel "C:\absolute\path\to\project"`

3.  **Authentication:**
    If the deployment fails with a "Login required" error, ask the user to run `vercel login` in their terminal once.

4.  **Confirm URL:**
    Read the terminal output, extract the **Live URL**, and share it with the user! 🌍

5.  **Save to Memory:**
    Remember the deployment URL for future reference:
    `antigravity memory set last_deployed_url "https://your-app.vercel.app"`
