# Tests

Run all tests:

```bash
npm test
```

Automated tests:

- `tests/audit.test.ts` — downgrades Cursor Business for tiny teams.
- `tests/audit.test.ts` — moves small Claude Team usage to Claude Pro.
- `tests/audit.test.ts` — flags ChatGPT Pro when Team pricing is more appropriate.
- `tests/audit.test.ts` — optimizes high OpenAI API spend with cheaper model tiers.
- `tests/audit.test.ts` — avoids manufacturing savings for a well-fit stack.
- `tests/audit.test.ts` — marks the Credex high-savings threshold correctly.

The audit engine is intentionally deterministic, so these tests assert exact savings amounts and recommendation behavior.
