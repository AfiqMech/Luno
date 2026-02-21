---
description: Scrape a website to extract its text content securely.
---
This workflow allows Antigravity to perform deep web research by navigating to a URL, executing any dynamic JavaScript on the page (like React or Vue), bypassing basic bot protections, and returning the clean, readable text of the article or documentation.

Use this workflow whenever the USER asks you to read documentation, scrape a website, summarize an article, or verify live data from a URL.

// turbo
1. Run the scraper script using node:
   ```bash
   antigravity $COMMAND "<URL>"
   ```
   *Replace `<URL>` with the exact, fully-qualified web address the user provided or the one you want to research.*

2. Read the output of the terminal command. The text between `--- START EXTRACTED CONTENT ---` and `--- END EXTRACTED CONTENT ---` is the actual, readable content of the website. 
3. Summarize, synthesize, or utilize the scraped data to answer the user's exact request!
