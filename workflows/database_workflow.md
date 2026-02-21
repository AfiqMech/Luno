---
description: Cloud database for game scores, user data, and multiplayer state
---

# Database & Multiplayer Backend Workflow (Upgrade 12)

## Prerequisites — Get your free Supabase project:
1. Go to **[supabase.com](https://supabase.com)** → New Project (100% free tier)
2. Go to **Project Settings → API**
3. Copy your **Project URL** and **anon public key**
4. Save them:
```powershell
antigravity memory set SUPABASE_URL "https://xyz.supabase.co"
antigravity memory set SUPABASE_ANON_KEY "eyJ..."
```

## Query a table
```
antigravity database query scores
antigravity database query scores '{"player":"Afiq"}'
```

## Insert a row (e.g. game score)
```
antigravity database insert scores '{"player":"Afiq","score":9999,"level":5}'
```

## Upsert (insert or update)
```
antigravity database upsert scores '{"player":"Afiq","score":12000}'
```

## Delete a row
```
antigravity database delete scores player Afiq
```

## Call an RPC function (e.g. leaderboard)
```
antigravity database rpc get_top_scores '{"limit":10}'
```

## Game Dev Use Cases:
- **Leaderboard**: `insert scores` after each game session
- **Player saves**: `upsert player_state` to persist game progress
- **Multiplayer rooms**: `query rooms` to find active lobbies
- **Auth**: Use Supabase Auth for player login (email/Google/GitHub)
