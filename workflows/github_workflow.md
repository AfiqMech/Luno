---
description: Push code to GitHub automatically
---

# GitHub Integration Workflow

This workflow lets Antigravity commit and push code to GitHub without any manual steps.

## Prerequisites
- Run once: `antigravity memory set GITHUB_TOKEN "ghp_your_token"`
- Get your token at: https://github.com/settings/tokens → Generate new token (classic)
  - Required scopes: `repo` (full control)

## Create a new GitHub repo
```
antigravity github create-repo <repo-name> [description]
```

## Push all files from a local directory to GitHub
```
antigravity github push <local-dir> <owner/repo-name> [commit message]
```

**Example — push current project to a new repo:**
1. `antigravity github create-repo material-notes "My notes app"`
2. `antigravity github push d:\NewApp your_usernames/material-notes "feat: initial commit"`

## List your recent repos
```
antigravity github list-repos
```
