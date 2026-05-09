# Reflection

## 1. The hardest bug this week

The hardest implementation risk was making shareable result URLs useful without accidentally exposing lead information. My first thought was to store everything in one object and reuse it across the results page, lead capture, and public page. That would have made the implementation faster, but it also risked leaking company name or email into a public URL. I debugged this by tracing the data flow from form submit to result render to lead capture. The key hypothesis was that the public page should only need the final audit result, not the lead fields. I split the design so `/api/audit` returns a stripped `shareId` generated from public audit fields, while `/api/leads` receives email, company, and role separately. The thing that worked was treating privacy as a type boundary: `AuditResult` can be public, `LeadPayload` cannot.

## 2. A decision I reversed mid-week

I reversed the idea of using an LLM for recommendation logic. At first it seemed attractive because the product is about AI tools and the assignment requires an AI-generated personalized summary. But once I looked at the evaluation rubric, it was clear that audit math needs to be defensible, testable, and tied to pricing sources. A model-generated recommendation could sound convincing while being impossible to regression test. I moved the spend logic into deterministic TypeScript rules and kept the LLM responsible only for a short summary paragraph. That made the product less magical, but much more reliable.

## 3. What I would build in week 2

In week 2 I would add authenticated admin views for Credex, a real benchmark mode, and database-backed audit slugs. The admin view would show high-savings leads, tool mix, savings reason, and follow-up status. Benchmark mode would compare spend per developer against anonymized completed-audit cohorts, which would make the audit feel more valuable even when savings are low. I would also add PDF export, because founders and finance leads like forwarding reports internally. Finally, I would instrument the funnel from audit completion to consultation booking so recommendation rules can be tuned against actual conversion and close rates.

## 4. How I used AI tools

I used AI assistance to speed up implementation, structure the required markdown files, and sanity-check the product scope against the assignment. I did not trust AI with pricing data, audit math, or fabricated interviews. Those either need official sources, deterministic tests, or real human conversations. One specific place AI can be wrong is recommending migrations too aggressively, like telling every Cursor user to switch to another coding tool because it is cheaper. That is bad advice if workflow disruption costs more than the subscription delta. I kept recommendations focused on plan fit, seat fit, model-tier fit, and retail-credit opportunities.

## 5. Self-rating

**Discipline: 7/10** — The MVP was built quickly and organized around the required deliverables, but the assignment's real 7-day consistency requirement still needs honest git history.

**Code quality: 8/10** — The core audit rules are typed, readable, and tested, with clear separation between audit logic, share encoding, summary generation, and lead capture.

**Design sense: 7/10** — The UI is focused on the real workflow and keeps results screenshot-friendly, though it would benefit from a full visual QA pass after deployment.

**Problem-solving: 8/10** — The main product trade-off was handled correctly: deterministic finance logic plus graceful AI summary fallback.

**Entrepreneurial thinking: 8/10** — The product is framed as a useful free audit first and Credex lead capture second, which matches how a founder would actually tolerate the funnel.
