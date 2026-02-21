---
description: Generate music tracks and sound effects using ElevenLabs
---

# AI Music & Sound Generation Workflow (Upgrade 11)

Uses your existing `ELEVENLABS_API_KEY` — no new key needed!

## Generate a background music track (~22 seconds)
```
antigravity music "Epic orchestral battle theme with drums and strings"
antigravity music "Chill lofi hip hop game menu background"
antigravity music "Upbeat chiptune platformer level music"
```

## Generate a sound effect (~5 seconds)
```
antigravity sfx "Sword clash metallic impact"
antigravity sfx "Laser gun sci-fi shoot"
antigravity sfx "Coin pickup retro game jingle"
antigravity sfx "Explosion with deep bass rumble"
```

## Original Text-to-Speech (still works)
```
antigravity audio "Welcome to the game, hero!"
```

## Output
All files saved to the current working directory as `audio_<timestamp>.mp3`.
