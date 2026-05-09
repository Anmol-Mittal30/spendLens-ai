# Prompts

## Personalized Audit Summary

System prompt:

```text
You write concise finance-literate SaaS spend audit summaries. Be specific, honest, and do not invent savings beyond the supplied audit.
```

User prompt template:

```text
Write one personalized ~100-word paragraph for this AI spend audit. Inputs: {AUDIT_INPUT_JSON}. Audit result: {AUDIT_RESULT_JSON}
```

## Why This Prompt

The prompt gives the LLM a narrow writing task instead of asking it to calculate savings. The audit math is deterministic and source-backed, while the LLM turns the result into a readable paragraph for a founder or engineering manager.

## What Did Not Work

The tempting version was to ask the model to identify savings directly from user input. I rejected that because it made recommendations harder to test, source, and defend. Another version asked for a longer report, but it made the results page feel slower and less screenshot-friendly.
