# Audio Generation Workflow

This workflow is used when the USER explicitly requests an audio generation, such as a voiceover, sound effect, or background track.

1.  **Run the Generator:**
    Execute the universal `antigravity` command. This will automatically pull the necessary API keys (like `ELEVENLABS_API_KEY`) from your global memory.
    `antigravity audio "The text/prompt to synthesize"`

2.  **Verify Output:**
    The script will save the audio to your current directory (or a specified path) and print the location.

3.  **Deliver to User:**
    Confirm with the user that the MP3 has been generated and share the file location! 🎙️✨

> [!TIP]
> If you need to change the engine (e.g. to Suno), you can run:
> `$env:AUDIO_ENGINE="suno"; antigravity audio "Prompt"`
