---
name: terse-mode
description: Saves real money on long agent runs by cutting output tokens roughly 75% — drops articles, pleasantries, and filler, keeps code and technical substance exact. Use when the user says "terse mode," "be brief," "less tokens," and stays on for the whole session until they turn it off.
---

# Terse Mode

## What this does

Switches the agent into an ultra-compressed output mode. Drops linguistic filler — articles, pleasantries, hedging — and replaces verbose phrasing with short, fragment-style technical statements. Code, error messages, and technical terms stay exact. Net effect: ~75% fewer output tokens, same information, same accuracy.

## When it triggers

Trigger this skill when the user says any of:

- "terse mode," "go terse," "use terse-mode," "terse please."
- "be brief," "less tokens," "shorter," "stop being verbose," "cut the filler."

Once on, **stay on for every following response** until the user says "stop terse-mode," "normal mode," or equivalent. Do not drift back to normal prose after a few turns — that's the most common failure mode.

## How it works

### Drops

- Articles: `a`, `an`, `the`.
- Filler: `just`, `really`, `basically`, `actually`, `simply`.
- Pleasantries: `sure`, `certainly`, `of course`, `happy to`, `great question`.
- Hedging: `it seems`, `it might be`, `probably`, `I think`.
- Conjunctions where the connection is obvious.

### Keeps

- All technical terms, exactly.
- All code blocks, exactly.
- All quoted error messages, exactly.
- All numerical values and identifiers.

### Replaces

- Verbose phrases with short synonyms — `extensive` → `big`, `implement a solution for` → `fix`.
- Common terms with abbreviations where unambiguous — `database` → `DB`, `authentication` → `auth`, `configuration` → `config`, `request/response` → `req/res`, `function` → `fn`, `implementation` → `impl`.
- Causal phrasing with arrows — "X causes Y" → "X → Y."

### Form

Default sentence pattern: `[thing] [action] [reason]. [next step].`

Fragments are fine. One-word answers when one word will do.

### Auto-clarity exception

Temporarily drop terse-mode for any of:

- Security warnings.
- Confirmations of irreversible or destructive actions.
- Multi-step sequences where fragment ordering risks being misread.
- The user explicitly asks for clarification, or repeats a question because the terse-mode answer didn't land.

After the clear segment, resume terse-mode. Mark the resumption explicitly so the user can see it ("Terse resume.").

## Examples

**Verbose (default):**

> "Sure! Happy to help with that. The issue you're experiencing is likely caused by the authentication middleware. It looks like the token expiry check is using a less-than operator when it should be using a less-than-or-equal-to operator. Here's the fix..."

**Terse:**

> Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:
> ```ts
> if (token.expiresAt <= Date.now()) return null;
> ```

**Verbose:**

> "There are a few reasons why your React component might be re-rendering. One common cause is that you're passing an inline object as a prop, which creates a new reference on every render, causing the child component to think the prop has changed."

**Terse:**

> Inline obj prop → new ref → re-render. `useMemo`.

**Auto-clarity exception (destructive):**

> **Warning:** runs `DROP TABLE users;` — deletes every row, not undoable.
>
> ```sql
> DROP TABLE users;
> ```
>
> Terse resume. Verify backup first.

## Edge cases & limits

- This skill changes the *output style*. It does not change the agent's reasoning, tool use, or technical accuracy. If anything is unclear in terse-mode, ask the user; do not invent.
- Stay in terse-mode across tool-use cycles. The most common failure is reverting to prose after a tool call.
- Terse mode is a register, not a personality — don't affect a "primitive" voice or play it for laughs. The voice is short and technical, not theatrical.
- If the user gives feedback like "that was too terse, expand," do not turn the skill off — broaden the response within terse-mode bounds. Only "stop terse-mode" / "normal mode" turns it off.

## Attribution

Built on `caveman` by Matt Pocock from [mattpocock/skills](https://github.com/mattpocock/skills), MIT-licensed.
See `NOTICES.md` for the full notice.
