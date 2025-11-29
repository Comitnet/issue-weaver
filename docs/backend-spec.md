Backend spec (you can literally copy-paste this)

Task: Build AI backend service for magazine generator

Context

Repo: Comitnet/issue-weaver

Content structure already exists under content/issues/...

Goal
Build a Node.js + TypeScript backend that:

Receives issue/topic info via HTTP.

Calls OpenAI to generate articles (Markdown body + metadata).

Writes files into content/issues/<issueId>/....

Commits using GitHub API (Octokit).

Tech

Node + TypeScript

Express (or similar)

Octokit for GitHub

Environment variables

OPENAI_API_KEY

GITHUB_TOKEN

GITHUB_REPO_OWNER (e.g. Comitnet)

GITHUB_REPO_NAME (e.g. issue-weaver)

Endpoints

POST /api/generate-issue

Input JSON:

{
  "issueId": "2025-01-dora-year-one",
  "topics": [
    "From the editor: DORA year one",
    "Operational resilience KPIs for DORA",
    "DORA vs NIS2 for EU financials"
  ],
  "language": "en",
  "wordCountPerArticle": 1500,
  "tone": "professional but readable"
}


Backend must:

Call OpenAI with a fixed system prompt asking for strict JSON:

{
  "articles": [
    {
      "slug": "editorial-dora-year-one",
      "title": "From the Editor: DORA Year One",
      "sectionLabel": "Editorial",
      "subtitle": "Why this regulation is different",
      "keyPoints": ["..."],
      "pullQuote": "...",
      "bodyMarkdown": "Full article in Markdown",
      "imagePrompt": "Prompt for an illustration or cover"
    }
  ],
  "coverPrompt": "Prompt text for the cover image"
}


Validate JSON (no free-text spills).

For each article:

Create/overwrite file:
content/issues/<issueId>/articles/<slug>.md

Use front-matter:

---
slug: "<slug>"
title: "<title>"
sectionLabel: "<sectionLabel>"
subtitle: "<subtitle>"
pullQuote: "<pullQuote>"
keyPoints:
  - "..."
---

<bodyMarkdown>


Update content/issues/<issueId>/toc.json to list the new articles (no need to handle page numbers yet).

Create/overwrite content/issues/<issueId>/cover-prompt.json with:

{ "prompt": "<coverPrompt>" }


Commit all changes with message:
feat: generate draft for issue <issueId>

POST /api/generate-article

Input:

{
  "issueId": "2025-01-dora-year-one",
  "topic": "Operational resilience KPIs for DORA",
  "slug": "dora-kpi-playbook",
  "language": "en",
  "wordCount": 1500,
  "tone": "professional but readable"
}


Same behavior as above but only for one article and without touching cover-prompt.json.

Deliverables

Code under /backend in the repo.

backend/README.md explaining:

How to run locally (npm install, npm run dev).

Example curl for the two endpoints.

Optional: simple HTML form for manual testing is a bonus.

Acceptance

I can start the backend (or access a deployed URL).

I call POST /api/generate-issue with my example and see:

New article .md files in GitHub.

toc.json updated.

cover-prompt.json created.

A commit in the repo with the message.
