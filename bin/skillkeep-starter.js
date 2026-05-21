#!/usr/bin/env node
// SkillKeep starter — installer (npm/npx)
// Cross-platform Node version of install.sh. Fetches three SKILL.md files
// from this repo's main branch on GitHub and writes them into
// ~/.claude/skills/. Pure-Node, no dependencies. Mirrors the bash installer's
// banner, per-skill status lines, and TTY/NO_COLOR gating.

const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const https = require('node:https');

const REPO_RAW =
  'https://raw.githubusercontent.com/vantwoutmaarten/skillkeep-starter/main';
const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');
const SKILLS = ['decisions-grill', 'root-cause-debug', 'terse-mode'];

const useColor =
  process.stdout.isTTY &&
  !process.env.NO_COLOR &&
  process.env.TERM !== 'dumb';

const c = useColor
  ? {
      bold: '\x1b[1m',
      dim: '\x1b[2m',
      reset: '\x1b[0m',
      cyan: '\x1b[36m',
      green: '\x1b[32m',
      red: '\x1b[31m',
    }
  : { bold: '', dim: '', reset: '', cyan: '', green: '', red: '' };

function fetchText(url, redirects = 3) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'user-agent': 'skillkeep-starter' } },
      (res) => {
        const { statusCode, headers } = res;
        if ((statusCode === 301 || statusCode === 302) && headers.location) {
          res.resume();
          if (redirects <= 0) return reject(new Error('too many redirects'));
          return resolve(fetchText(headers.location, redirects - 1));
        }
        if (statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${statusCode} for ${url}`));
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => resolve(body));
      },
    );
    req.on('error', reject);
    req.setTimeout(15_000, () => req.destroy(new Error('request timed out')));
  });
}

async function main() {
  process.stdout.write('\n');
  process.stdout.write(
    `  ${c.bold}${c.cyan}▍${c.reset} ${c.bold}SkillKeep starter${c.reset}\n`,
  );
  process.stdout.write(
    `  ${c.bold}${c.cyan}▍${c.reset} ${c.dim}Three of the skills we use most, packaged free.${c.reset}\n`,
  );
  process.stdout.write('\n');

  await fs.mkdir(SKILLS_DIR, { recursive: true });

  let fail = false;
  for (const skill of SKILLS) {
    const padded = skill.padEnd(20);
    if (useColor) {
      process.stdout.write(
        `  ${c.dim}→${c.reset} ${c.bold}${padded}${c.reset}  ${c.dim}working...${c.reset}`,
      );
    }
    try {
      const body = await fetchText(`${REPO_RAW}/skills/${skill}/SKILL.md`);
      const dest = path.join(SKILLS_DIR, skill);
      await fs.mkdir(dest, { recursive: true });
      await fs.writeFile(path.join(dest, 'SKILL.md'), body, 'utf8');
      if (useColor) {
        process.stdout.write(
          `\r\x1b[K  ${c.dim}→${c.reset} ${c.bold}${padded}${c.reset}  ${c.green}✓ installed${c.reset}\n`,
        );
      } else {
        process.stdout.write(`  -> ${padded}  installed\n`);
      }
    } catch (e) {
      if (useColor) {
        process.stdout.write(
          `\r\x1b[K  ${c.dim}→${c.reset} ${c.bold}${padded}${c.reset}  ${c.red}✗ failed${c.reset}\n`,
        );
      } else {
        process.stdout.write(`  -> ${padded}  failed\n`);
      }
      process.stderr.write(`    ${e.message}\n`);
      fail = true;
    }
  }

  if (fail) {
    process.stderr.write(
      `\n  ${c.red}one or more skills failed to install${c.reset}\n`,
    );
    process.exit(1);
  }

  process.stdout.write('\n');
  process.stdout.write(
    `  ${c.dim}Installed to ~/.claude/skills${c.reset}\n`,
  );
  process.stdout.write(
    `  Open Claude Code in any directory to use them.\n`,
  );
  process.stdout.write('\n');
  process.stdout.write(
    `  ${c.dim}More at https://skillkeep.io${c.reset}\n`,
  );
  process.stdout.write('\n');
}

main().catch((err) => {
  process.stderr.write(`${err.stack || err.message || err}\n`);
  process.exit(1);
});
