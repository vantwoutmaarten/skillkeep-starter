---
name: root-cause-debug
description: Cuts debug time from hours to minutes by forcing a four-phase root-cause process before any code change — and stops the "fix one bug, create three more" loop. Use for any failing test, broken build, or unexpected behaviour, especially under time pressure or after a previous fix didn't work.
---

# Root-Cause Debug

## What this does

Forces a disciplined four-phase process — root-cause investigation, pattern analysis, hypothesis, then fix — before any code changes. Stops the most expensive failure mode in agentic debugging: stacking guessed fixes until the codebase is worse than the original bug.

## When it triggers

Trigger this skill when:

- Any test is failing, any build is broken, any production bug is reported.
- Behaviour is unexpected, output is wrong, performance has regressed.
- A previous fix didn't work, or "worked" but didn't pass review.
- You've already tried two or more changes and are tempted to try another.
- The user says "debug this," "figure out why X is broken," "this just started failing."

The rule that catches the worst cases: if you're under time pressure and the "obvious" fix is tempting, **use this skill anyway** — systematic is faster than thrashing, every time.

## How it works

Move through the four phases in order. Each phase has a clear done-state. You cannot start a later phase before the earlier one is complete.

### Iron rule

No fix proposed without root-cause investigation. Symptom fixes count as failures of this skill.

### Phase 1 — Root-cause investigation

1. **Read the error message, fully.** Stack trace, line numbers, error codes — all of it. The message often contains the exact answer.
2. **Reproduce it consistently.** Can you trigger it on demand? What are the exact steps? If you can't reproduce, gather data — do not guess.
3. **Check what changed.** Recent commits, new dependencies, config changes, environment differences. Bugs almost always appear next to a change.
4. **Instrument component boundaries (multi-layer systems).** Log what data enters and leaves each layer. Run once. The evidence shows *where* it breaks, not just that it breaks.
5. **Trace bad data backward.** Find the call that introduced the bad value, then the call above that, until you reach the source. Fix at the source, not at the symptom.

Done when: you can state, in one sentence, the actual root cause — not the symptom.

### Phase 2 — Pattern analysis

1. **Find similar working code in the same codebase.** What does the working version do?
2. **If implementing against a reference, read the reference end-to-end.** Don't skim. Partial understanding produces partial fixes.
3. **List every difference between working and broken — however small.** Don't pre-filter "that can't matter." It often does.
4. **Map the dependencies** — settings, env, config, assumed state.

Done when: you can name the specific difference responsible for the failure.

### Phase 3 — Hypothesis and minimal test

1. **State one hypothesis** in the form "X is the root cause because Y." Specific, not vague.
2. **Test the smallest possible change that proves or kills the hypothesis.** One variable at a time. Do not bundle fixes.
3. **If the test confirms the hypothesis, move to Phase 4.** If not, form a new hypothesis. Do not add more fixes on top of failed ones.
4. **If three fix attempts have failed, stop and question the architecture.** Three failed fixes is a signal that the pattern itself is wrong, not the next fix attempt. Surface this to the user before attempting fix #4.

Done when: a single minimal change has confirmed the root cause.

### Phase 4 — Fix at the root

1. **Write a failing test that reproduces the bug.** Use the project's test framework if available, a one-off script if not. The fix must turn this test from red to green.
2. **Apply one change** — the root-cause fix, nothing else. No bundled refactors, no "while I'm here" cleanup.
3. **Verify.** Test passes. No other tests broken. Original symptom gone.
4. **State what you did** in one short summary — root cause, fix, test added.

### Personality rules

- Don't celebrate. Don't say "great, that's fixed!" before verifying.
- Ask before destructive changes — deleting code, force-pushing, undoing git history, anything irreversible.
- If you don't know something, say "I don't understand X yet" rather than pretending.
- After the cycle, report briefly: root cause, fix, evidence it worked, any tests added.

## Examples

**Input:**

> User: "Tests are passing locally but failing in CI on the `signing` step."

**Output (Phase 1 abbreviated):**

> Root cause not yet known. Instrumenting layers before guessing.
>
> Added one diagnostic run to the CI job:
> ```bash
> echo "secret set? ${IDENTITY:+yes}${IDENTITY:-no}"      # workflow layer
> env | grep IDENTITY || echo "missing in build env"      # build layer
> security find-identity -v                                # keychain layer
> ```
> Ran it. Output shows `IDENTITY` is set at workflow level but missing in the build env.
>
> **Root cause:** the `with: env:` block in the workflow doesn't propagate secrets into the called shell script — the variable is defined for the job, not the step.
>
> Proceeding to Phase 2 to check how other passing jobs propagate this secret.

(Then Phase 2 confirms the pattern; Phase 3 tests adding the `env:` block at step level; Phase 4 commits the one-line fix and the regression check.)

## Edge cases & limits

- "Heisenbugs" — timing-dependent or environment-dependent failures that can't be reproduced — get treated as evidence of an unstable system. Document what was investigated; add retry/timeout/monitoring; surface to the user. Do not pretend the root cause was found when it wasn't.
- The "three failed fixes = architecture is wrong" rule is the most-skipped step. Do not skip it. After three failed fixes, stop and discuss with the user.
- This skill does not replace platform-specific debuggers (gdb, lldb, browser devtools). Use them inside Phase 1 to gather evidence.

## Attribution

Built on `systematic-debugging` by Jesse Vincent from [obra/superpowers](https://github.com/obra/superpowers), MIT-licensed.
See `NOTICES.md` for the full notice.
