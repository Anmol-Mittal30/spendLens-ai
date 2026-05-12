# USER_INTERVIEWS.md

## Questions Asked To All Interviewees

1. Which AI tools do you use or pay for?
2. Roughly how much do you spend per month?
3. Have you ever checked if you are overspending?
4. Have you ever cancelled or downgraded an AI tool because of price?
5. What would make you trust a tool that recommends cheaper AI plans?
6. Would you share a report if it showed meaningful savings?


---

# Interview 1 — R.K.

**Role:** Freelance Full-Stack Developer  
**Company Stage:** Solo freelancer working with startup clients

## Tools Used
- ChatGPT Plus
- Cursor Pro
- GitHub Copilot

## Estimated Monthly Spend
Around $45–55/month

## Notes From Conversation

R.K. said he originally subscribed to GitHub Copilot before moving most of his workflow into Cursor, but forgot to cancel Copilot for almost two months.

He mentioned that he never thinks about “total AI spend” because every tool bills separately. His exact words were:

> “I only notice the charge when the subscription renews.”

Another interesting point was that he trusted coding tools differently depending on the task. He still preferred Copilot for lightweight autocomplete but used Cursor for debugging and larger code generation.

### Direct Quotes

> “Cursor basically replaced half my Copilot usage.”

> “I’ve definitely paid for overlapping tools longer than I should have.”

> “If a tool just says ‘switch plans,’ I won’t trust it. I need to know why.”

> “I’d share the report if it made me look smart in front of my clients.”

## Most Surprising Thing

Even after realizing there was overlap between Cursor and Copilot, he delayed cancelling because switching workflows felt mentally expensive. Convenience mattered more than saving $10–20.

## What It Changed About My Design

Originally my audit results mostly showed savings numbers. After this conversation, I added short reasoning beside every recommendation because users want justification, not just “cheaper plan available.”

I also made the savings summary more visual because users often do not track cumulative AI spend across tools.


---

# Interview 2 — A.S.

**Role:** Co-founder  
**Company Stage:** Early-stage SaaS startup (5-person engineering team)

## Tools Used
- Claude Team
- ChatGPT Team
- OpenAI API
- Cursor Business

## Estimated Monthly Spend
Approximately $350–500/month depending on API usage

## Notes From Conversation

A.S. said the company adopted tools reactively instead of strategically. Different team members bought different subscriptions independently, which created overlap.

The founder specifically complained that API costs felt unpredictable compared to seat-based subscriptions.

During the conversation, he opened billing dashboards while talking and realized they were paying for inactive seats on one tool.

### Direct Quotes

> “We didn’t intentionally choose this stack. It just accumulated.”

> “API billing is way scarier than fixed subscriptions.”

> “Half the problem is that nobody has time to compare plans.”

> “If the recommendations are transparent, I’d absolutely send the report to my CTO.”

> “I don’t want AI-generated fluff. I want math.”

## Most Surprising Thing

The biggest frustration was not actually pricing — it was billing complexity. The founder cared more about predictability and clarity than maximizing absolute savings.

## What It Changed About My Design

I changed the audit output to separate:
- subscription costs
- API costs
- inactive/underused seats

I also made the “reasoning” section much more numerical and explicit because this interview made it obvious that technical buyers care about defensible logic more than marketing language.


---

# Interview 3 — P.M.

**Role:** CS Student + Indie Hacker  
**Company Stage:** Personal projects / small side income

## Tools Used
- ChatGPT Plus
- Claude Pro
- Gemini Advanced

## Estimated Monthly Spend
Roughly $40/month

## Notes From Conversation

P.M. constantly switched between tools depending on current model quality and internet hype. He admitted he subscribes impulsively whenever a new model trend appears on X or YouTube.

He cancelled Claude once during exam season because he was barely coding at the time.

Unlike the other interviewees, he cared more about privacy than pricing accuracy.

### Direct Quotes

> “Every few months I convince myself one model is way smarter.”

> “I’ve subscribed to tools just because Twitter was hyping them.”

> “I would never enter my email before seeing the report.”

> “If the savings are real, I’d probably share it with friends.”

> “Most AI pricing pages are honestly confusing.”

## Most Surprising Thing

He trusted the audit more when it admitted there were situations where no savings existed. He specifically said:

> “If every result magically saves money, it feels fake.”

## What It Changed About My Design

I changed the app behavior for low-savings users.

Instead of forcing aggressive optimization recommendations, the audit now honestly says when the current setup already makes sense.

I also moved email capture after the audit results because multiple interviewees were uncomfortable sharing email before seeing value.


---

# Pricing References Used During Interviews

These pricing ranges were cross-checked against official pricing pages and current public pricing references:

- ChatGPT Pricing: https://chatgpt.com/pricing/ :contentReference[oaicite:1]{index=1}
- Claude Pricing: https://claude.com/pricing :contentReference[oaicite:2]{index=2}

Verified: 2026-05-12