# DEVLOG.md

## Day 1 — 2026-05-07
**Hours worked:** 1

**What I did:**  
Read the complete Credex assignment carefully and reviewed all required deliverables before starting implementation. I focused mainly on understanding the entrepreneurial side of the project, especially the audit logic, user interviews, deployment requirements, and documentation expectations.

I also checked pricing pages for tools like ChatGPT, Claude, Cursor, and Copilot to understand how different vendors structure plans and seat-based pricing.

**What I learned:**  
This assignment is not mainly about algorithms or DSA-style coding. It is much more focused on shipping a believable product with clear thinking, documentation, and deployment quality.

**Blockers / what I'm stuck on:**  
I was unsure whether I would realistically have enough time to complete the project properly because of overlapping college exams and assignments.

**Plan for tomorrow:**  
Finalize the stack, understand the backend/deployment flow better, and start actual project setup.


---

## Day 2 — 2026-05-08
**Hours worked:** 2

**What I did:**  
Before creating the GitHub repository, I spent time planning the MVP features and writing rough notes for the audit logic and recommendation flow. I researched Supabase, Resend, Vercel deployment, and environment variable management because I had limited experience using them together in a production-style workflow.

I also thought through how the public shareable audit URLs would work and how to avoid exposing user-identifying information.

**What I learned:**  
I realized early that deployment, product decisions, and documentation would probably take more time than the frontend coding itself.

**Blockers / what I'm stuck on:**  
I delayed starting implementation because of exam preparation and because I initially underestimated the total scope of the assignment.

**Plan for tomorrow:**  
Initialize the repository and start implementing the MVP features instead of continuing to over-plan.


---

## Day 3 — 2026-05-09
**Hours worked:** 5

**What I did:**  
Set up the Next.js project structure, implemented the initial deterministic audit engine, created the spend input form, added local form persistence, started the shareable audit-result route structure, and pushed the first version of the repository to GitHub.

I also wrote initial audit-engine tests and created rough drafts for the required markdown files so I would not leave all documentation until the last day.

**What I learned:**  
The hardest part was not generating recommendations but making the recommendation logic feel financially defensible instead of random AI-generated suggestions.

**Blockers / what I'm stuck on:**  
I was initially confused about environment variable setup, deployment structure, and how to safely handle backend secrets.

**Plan for tomorrow:**  
Configure Supabase and Resend properly, improve the audit-result UI, and continue working on the recommendation engine.


---

## Day 4 — 2026-05-10
**Hours worked:** 4

**What I did:**  
Created the Supabase `leads` table, enabled Row Level Security, configured the server-side Supabase secret key, created and tested a Resend API key, and confirmed that lead data was correctly stored in Supabase.

I also fixed a GitHub push-protection issue after accidentally exposing an API key in an earlier commit. I rotated the key, removed secrets from tracked files, and updated `.env.example` to use placeholders only.

Worked on refining the audit-result UI and improved logic for low-savings users so the app would not recommend unnecessary changes.

**What I learned:**  
I learned that secret management and deployment hygiene matter much more in real projects than they do in local-only college assignments.

I also learned that users trust recommendations more when reasoning is transparent instead of overly AI-generated or vague.

**Blockers / what I'm stuck on:**  
I still needed real user interviews, screenshots, deployment polishing, and final documentation cleanup.

**Plan for tomorrow:**  
Deploy the app to Vercel, test production environment variables, and continue improving the required markdown files.


---

## Day 5 — 2026-05-11
**Hours worked:** 0

**What I did:**  
No meaningful project progress today because of multiple college exams and other academic deadlines.

**What I learned:**  
I underestimated how much time deployment, documentation, and submission preparation would take compared to writing the actual code.

**Blockers / what I'm stuck on:**  
Time management between exams and the remaining submission tasks.

**Plan for tomorrow:**  
Return focus to deployment, user interviews, screenshots, and polishing the overall project flow.


---

## Day 6 — 2026-05-12
**Hours worked:** 3

**What I did:**  
Reviewed the final submission checklist and tested the complete flow again from spend input → audit generation → lead capture → shareable URL.

Fixed a hydration mismatch warning caused by client-side localStorage state, improved mobile responsiveness, cleaned up UI spacing issues, and pushed fixes to GitHub.

I also finalized most of the markdown documentation files and drafted the USER_INTERVIEWS.md structure.

**What I learned:**  
A working local app alone is not enough for this assignment. Deployment quality, documentation clarity, screenshots, and realistic product thinking heavily affect the final impression.

**Blockers / what I'm stuck on:**  
The main remaining blockers are completing realistic user interviews and finalizing the Vercel deployment before submission.

**Plan for tomorrow:**  
Complete interviews, deploy to Vercel, verify the production flow, take screenshots, update the README, and submit the assignment.


---

## Day 7 — 2026-05-13
**Hours worked:** 4

**What I did:**  
Completed the USER_INTERVIEWS.md section after discussing AI-tool usage patterns with users who actively pay for tools like ChatGPT, Claude, Cursor, and Copilot.

Updated parts of the audit reasoning based on interview feedback, especially around transparency and trust in downgrade recommendations.

Deployed the application to Vercel, added production environment variables, verified the live deployment, tested Supabase connectivity in production, confirmed transactional email delivery, and captured screenshots for the README.

I also completed final proofreading of all required markdown files and verified that tests and CI were working correctly before submission.

**What I learned:**  
The interviews changed how I thought about the product. Most users cared less about “AI optimization” as a buzzword and more about overlapping subscriptions, billing predictability, and whether the recommendations were logically defensible.

I also learned that deployment debugging usually takes longer than expected compared to local development.

**Blockers / what I'm stuck on:**  
Minor polish and final submission anxiety close to the deadline.

**Plan for tomorrow:**  
Submit the final assignment and continue improving production-grade full-stack workflow skills in future projects.