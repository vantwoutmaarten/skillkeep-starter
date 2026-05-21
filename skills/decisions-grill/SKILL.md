---
name: decisions-grill
description: Stops the agent building the wrong thing. Interrogates the user about a plan one question at a time until every load-bearing decision is resolved, with a recommended answer for every question. Use before non-trivial work, when a plan feels vague, or when the user says "grill me" or "stress-test this."
---

# Decisions Grill

## What this does

Interviews you relentlessly about a plan, design, or feature until you and the agent share a complete understanding of it. Walks the decision tree one branch at a time, resolves dependencies between decisions in order, and offers a recommended answer for every question — so the conversation is fast and you only have to react, not invent.

## When it triggers

Trigger this skill when:

- The user says "grill me," "interview me on this," "stress-test this plan," "pull this design apart."
- The user describes a plan or design and asks whether it's ready.
- You're about to start a non-trivial implementation and the design has gaps.
- Multiple ambiguous decisions are sitting on top of each other and a wrong guess at the bottom invalidates the top.

Do NOT trigger this for casual chat, for fact lookups, or once the plan is already clearly resolved.

## How it works

Run the interview by these rules. Do not skip them.

1. **Ask one question at a time.** Never batch questions. Each message contains exactly one question (and your recommended answer).
2. **Provide a recommended answer for every question.** The user should always be able to reply with just "yes," "no," or a short correction. State your recommendation and one-line reasoning.
3. **Walk the decision tree top-down.** Resolve the parent decision before asking about its children. If decision B only matters once A is resolved a certain way, do not ask B yet.
4. **If a question can be answered by reading the codebase, do that instead.** Don't ask the user something the repo already knows. Inspect the files, then incorporate what you found into the next question.
5. **Stay in scope.** One feature, one plan. If the user opens a new topic, finish the current branch first or explicitly note the new branch and return to it.
6. **Confirm before destructive moves.** If grilling reveals that an earlier decision must change and that change affects work-in-progress, do not silently rewrite — surface the change explicitly and ask before proceeding.
7. **State what you decided.** When the interview concludes, summarise the resolved decisions in a short list so the user can scan-check them before any code is written.

## Examples

**Input — vague feature request:**

> User: "I want to add a notifications system."

**Output — first message:**

> I'll start at the top of the design tree.
>
> **Q1: Where do these notifications appear?**
> Recommendation: in-app only, as a bell-icon dropdown on every page. Reason: simplest path that delivers value; email/push can be added later as separate channels behind the same core model. Sound right, or do you need email/push in the MVP?

(Then, only after the user answers Q1, ask Q2 — e.g. real-time vs polling — and so on, down each branch.)

**Closing message after ~10 questions:**

> Design tree resolved. Decisions:
>
> 1. Channel: in-app only.
> 2. Storage: `notifications` table, one row per recipient.
> 3. Delivery: server-sent events, fallback to 30s polling.
> 4. Read state: per-user, marked on view.
> 5. Retention: 90 days, soft-delete.
>
> Shall I now hand off to `implementation-plan` (or your preferred planning skill) to turn this into an implementation plan?

## Edge cases & limits

- This skill resolves design questions; it does not produce an implementation plan, write code, or write a spec document. Hand off to a planning skill (e.g. `implementation-plan`, `prd-from-context`) once the tree is resolved.
- If the user asks for the interview to be terse, switch to one-line questions with one-line recommendations. Don't drop the "one question per message" rule — drop the prose around it.
- If the user pushes back on a recommendation, accept the correction without arguing, update the tree, and continue. Do not relitigate resolved branches unless the user asks.
- If the user's answer reveals an inconsistency with an earlier decision, flag it explicitly ("This conflicts with Q3 — want to revisit Q3 or adjust here?") rather than silently choosing.

## Attribution

Built on `grill-me` by Matt Pocock from [mattpocock/skills](https://github.com/mattpocock/skills), MIT-licensed.
See `NOTICES.md` for the full notice.
