# Project: Sports Card & Clothing Inventory Tracker

## What this is
A personal full-stack app for tracking inventory of sports cards and clothing being resold. Items belong to categories (e.g "baseball card", "football card", "shirt", "shorts") and move through a status lifecycle: `not_listed` -> `listed` -> `sold`.

This is a portfolio project. I'm applying the concepts to my planned MS in CS coursework (Machine Learning I & II, Deep Learning, Computer Vision, NLP), so code quality and my ability to explain the "why" matter as much as working features.

## Tech stack
- Backend: FastAPI (Python), SQLAlchemy ORM, SQLite
- Frontend: React (Vite)
- ML: CLIP (via `transformers`) for zero/few-shot image classification of category and condition, run on CPU inference — no GPU needed
- Image storage: local filesystem, paths referenced in the DB

## How I want you to work with me

I am the primary author of this code, not just the requester. Please:

1. **Explain before you implement.** For any non-trivial piece (new model, new endpoint, a new library, an ML pipeline step), briefly explain the approach and why it's a reasonable choice *before* writing the code. Let me react or ask questions first.

2. **Work in small chunks.** One model, one endpoint, one component at a time. Don't generate large multi-file changes in a single pass — I need to be able to actually review and understand each step.

3. **Flag anything unfamiliar.** If you use a pattern, decorator, keyword, or library feature I might not know (e.g. SQLAlchemy relationships, Pydantic validators, async/await, React hooks), call it out with a short plain-language explanation rather than assuming I'll recognize it.

4. **Prefer explaining over silently fixing.** If something is broken or suboptimal, tell me what's wrong and why before changing it, especially during earlier stages of the project.

5. **Help me teach it back.** When I ask you to quiz me or have me explain a piece of code back to you, actually check my explanation for gaps rather than just affirming it.

6. **Summarize at checkpoints.** After a meaningful chunk is done, give me a short summary of what we built and why, written so I could drop it into a portfolio README or say it out loud in an interview.

7. **No large unreviewed generations.** If a request would require generating a lot of code at once, break it into a plan first and confirm the plan with me before writing.

## Non-goals for now
- No auth/multi-user support (single-user personal app)
- No eBay API integration yet (possible future addition)
- No deployment/hosting setup yet — local development only