# SkillKeep starter

Three of the skills we use most, packaged free.

## What this is

Three agent skills for Claude Code, MIT-licensed, free. They cover plan-grilling before non-trivial work, root-cause debugging, and a terse-output mode that cuts tokens by roughly 75%. One command installs them into `~/.claude/skills/`.

SkillKeep is a small catalog of curated agent skills. This starter pack is the free sample.

## Install

Pick whichever feels right.

With npx (Node 18 or newer):

```sh
npx skillkeep-starter
```

With curl:

```sh
curl -sSL https://raw.githubusercontent.com/vantwoutmaarten/skillkeep-starter/main/install.sh | bash
```

Prefer to read the script first? Clone and run locally:

```sh
git clone https://github.com/vantwoutmaarten/skillkeep-starter.git
cd skillkeep-starter
./install.sh
```

All three paths drop the same three skills into `~/.claude/skills/`. Re-running is safe and overwrites in place.

## The three skills

### [decisions-grill](skills/decisions-grill/SKILL.md)

Stops the agent from building the wrong thing. The skill interrogates a plan one question at a time until every load-bearing decision is resolved, and offers a recommended answer for each. Triggers when you say "grill me", "stress-test this", or describe a plan and ask if it's ready.

### [root-cause-debug](skills/root-cause-debug/SKILL.md)

Forces a four-phase root-cause process before any code change. Stops the "fix one bug, create three more" loop, especially under time pressure. Triggers on any failing test, broken build, or unexpected behaviour, or when you say "debug this" or "figure out why X is broken".

### [terse-mode](skills/terse-mode/SKILL.md)

Cuts output tokens by roughly 75% by dropping articles, pleasantries, and filler. Keeps code and technical substance exact. Triggers when you say "terse mode", "be brief", or "less tokens", and stays on for the rest of the session until you turn it off.

## What's next

The full catalog is at [skillkeep.io](https://skillkeep.io).

## Credits

All three skills are derived from open-source work by others. Thank you, Matt and Jesse.

- `decisions-grill` builds on [grill-me](https://github.com/mattpocock/skills) by Matt Pocock.
- `root-cause-debug` builds on [systematic-debugging](https://github.com/obra/superpowers) by Jesse Vincent.
- `terse-mode` builds on [caveman](https://github.com/mattpocock/skills) by Matt Pocock.

Full upstream notices in [NOTICES.md](NOTICES.md). Everything here is MIT-licensed.
