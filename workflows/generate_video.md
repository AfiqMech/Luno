---
description: How to generate AI videos for the user
---
# Video Generation Workflow

When the user requests you (Antigravity) to generate a video or animation, you should automatically follow this workflow script.

1.  **Run the Generator:**
    Execute the universal `antigravity` command. This will automatically pull the necessary API keys from your global memory.
    `antigravity video "The user's prompt goes here"`

2.  **Wait for the Output:**
    Use `command_status` to monitor the output. The script takes time. Do not assume it failed if it takes 30-60 seconds.

3.  **Deliver to User:**
    Once the terminal outputs `[[ANTIGRAVITY_VIDEO_SAVED]]`, note the absolute path. If the user asked for an artifact, embed the video in the artifact using standard markdown syntax `![Video](absolute_path.mp4)`. Otherwise, simply `notify_user` that the video was successfully generated and saved at that path.

> [!TIP]
> If the command fails because the API key is missing, look at the error message. It will tell you which key is missing. Ask the user to run `antigravity memory set <KEY_NAME> "YOUR_KEY"` to fix it.
