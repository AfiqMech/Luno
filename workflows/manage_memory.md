---
description: Read, write, or delete persistent memory nodes across isolated chats.
---
This workflow allows Antigravity to retain "long-term memory" across different projects and sessions. Use this workflow when the user asks you to remember a preference (like "always use TailwindCSS"), or when you need to store API keys, persistent settings, or context notes that should outlast the current chat.

**Important**: This memory is globally available across the entire computer.

// turbo-all
1. To store a memory:
   ```bash
   antigravity $COMMAND set "<KEY>" "<VALUE>"
   ```
   *Example*: `antigravity $COMMAND set "framework_preference" "Next.js"`

2. To read a memory:
   ```bash
   antigravity $COMMAND get "<KEY>"
   ```

3. To list all stored memories:
   ```bash
   antigravity $COMMAND list
   ```

4. To delete a memory:
   ```bash
   antigravity $COMMAND delete "<KEY>"
   ```

**Rules**:
- Always check the memory `list` at the start of a new, complex project to see if the user has any global preferences you should adhere to.
