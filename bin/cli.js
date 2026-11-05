#!/usr/bin/env node

/**
 * ajstack-sdd CLI
 * Spec-Driven Development (SDD) agent workflow and skills for Claude Code, Antigravity, and Cursor.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');

const SKILLS = [
  { name: 'project-init', phase: 'Phase 0 (Initiate)', desc: 'Greenfield delta-interview & Brownfield code discovery into canonical docs/' },
  { name: 'linear-slice', phase: 'Phase 1 (Slice)', desc: 'Fast drift detection, 4 issue templates, and spec:ready issue creation' },
  { name: 'sdd-flow', phase: 'Phase 2 (Execute)', desc: 'Hybrid orchestrator: Investigate -> Isolate -> Build -> Interrogate -> Ship' },
  { name: 'forensics', phase: 'Phase 2 (Execute)', desc: 'Read-only root cause investigation and reproduction script generation' },
  { name: 'new-feature', phase: 'Phase 2 (Execute)', desc: 'Dedicated Git worktree isolation in .worktrees/<name> from origin/main' },
  { name: 'code-structure', phase: 'Phase 2 (Execute)', desc: 'Service layer architecture & senior subtractive engineering standards' },
  { name: 'evidence-driven-testing', phase: 'Phase 2 (Execute)', desc: 'Annotated video recordings and Playwright probes proving acceptance criteria' },
  { name: 'before-and-after', phase: 'Phase 2 (Execute)', desc: 'Visual UI screenshot diff comparisons formatted into PR-ready markdown tables' },
  { name: 'interrogate', phase: 'Phase 2 (Execute)', desc: 'Pre-flight adversarial diff audit requiring executable failing tests' },
  { name: 'greploop', phase: 'Phase 2 (Execute)', desc: 'Automated Greptile code review and fix cycles targeting clean 5/5 score' },
  { name: 'greploop-apps', phase: 'Phase 2 (Execute)', desc: 'Compatibility trigger (@greptile-apps) for large PRs' },
  { name: 'unslop', phase: 'Cross-cutting', desc: 'Cuts AI tells and comment slop from PRs, commits, docs, and source code' }
];

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function ensureGitignore(targetDir) {
  const gitignorePath = path.join(targetDir, '.gitignore');
  const ignoreEntries = ['.worktrees/', 'worktrees/'];
  let content = '';

  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf8');
  }

  const toAdd = ignoreEntries.filter(entry => !content.includes(entry));
  if (toAdd.length > 0) {
    const addition = `\n# Worktrees (ajstack-sdd)\n${toAdd.join('\n')}\n`;
    fs.appendFileSync(gitignorePath, addition, 'utf8');
    console.log('✓ Added .worktrees/ to .gitignore');
  }
}

function runInit(targetDir = process.cwd(), force = false) {
  console.log('\n🚀 Bootstrapping ajstack-sdd in:', targetDir);

  const claudeSkillsDir = path.join(targetDir, '.claude', 'skills');
  const agySkillsDir = path.join(targetDir, '.agents', 'skills');

  // 1. Copy skills to .claude/skills and .agents/skills
  console.log('\n📦 Installing skills suite:');
  for (const skill of SKILLS) {
    const skillSrc = path.join(PACKAGE_ROOT, skill.name);
    if (fs.existsSync(skillSrc)) {
      copyDirRecursive(skillSrc, path.join(claudeSkillsDir, skill.name));
      copyDirRecursive(skillSrc, path.join(agySkillsDir, skill.name));
      console.log(`  ✓ ${skill.name} (${skill.phase})`);
    }
  }

  // 2. Copy AGENTS.md
  const agentsSrc = path.join(PACKAGE_ROOT, 'AGENTS.md');
  const agentsDest = path.join(targetDir, 'AGENTS.md');
  if (fs.existsSync(agentsSrc)) {
    if (!fs.existsSync(agentsDest) || force) {
      fs.copyFileSync(agentsSrc, agentsDest);
      console.log('✓ Created AGENTS.md');
    } else {
      console.log('ℹ AGENTS.md already exists (skipped)');
    }
  }

  // 3. Create CLAUDE.md
  const claudeDest = path.join(targetDir, 'CLAUDE.md');
  if (!fs.existsSync(claudeDest) || force) {
    fs.writeFileSync(claudeDest, '@AGENTS.md\n', 'utf8');
    console.log('✓ Created CLAUDE.md pointing to @AGENTS.md');
  } else {
    console.log('ℹ CLAUDE.md already exists (skipped)');
  }

  // 4. Update .gitignore
  ensureGitignore(targetDir);

  console.log('\n🎉 Project setup complete!');
  console.log('• Claude Code can now call skills directly: /project-init, /linear-slice, /new-feature, etc.');
  console.log('• Antigravity agents can now access skills via .agents/skills/\n');
}

function runUpgrade(targetDir = process.cwd()) {
  console.log('\n🔄 Upgrading ajstack-sdd skills in:', targetDir);

  const claudeSkillsDir = path.join(targetDir, '.claude', 'skills');
  const agySkillsDir = path.join(targetDir, '.agents', 'skills');

  let updatedCount = 0;
  const hasAgy = fs.existsSync(agySkillsDir);
  const hasClaude = fs.existsSync(claudeSkillsDir);

  if (!hasAgy && !hasClaude) {
    console.log('⚠️ No existing .agents/skills or .claude/skills found.');
    console.log('   Run `npx ajstack-sdd init` instead to bootstrap the project.\n');
    return;
  }

  let claudeIsSymlinkToAgy = false;
  if (hasClaude) {
    try {
      const stats = fs.lstatSync(claudeSkillsDir);
      if (stats.isSymbolicLink()) {
        const realClaude = fs.realpathSync(claudeSkillsDir);
        const realAgy = hasAgy ? fs.realpathSync(agySkillsDir) : null;
        if (realAgy && realClaude === realAgy) {
          claudeIsSymlinkToAgy = true;
        }
      }
    } catch {
      // fallback
    }
  }

  console.log('\n📦 Syncing skills to latest version:');
  for (const skill of SKILLS) {
    const skillSrc = path.join(PACKAGE_ROOT, skill.name);
    if (fs.existsSync(skillSrc)) {
      if (hasAgy) {
        copyDirRecursive(skillSrc, path.join(agySkillsDir, skill.name));
      }
      if (hasClaude && !claudeIsSymlinkToAgy) {
        copyDirRecursive(skillSrc, path.join(claudeSkillsDir, skill.name));
      }
      console.log(`  ✓ Synced ${skill.name} (${skill.phase})`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Successfully upgraded ${updatedCount} skills in ${targetDir}!`);
  console.log('ℹ Existing AGENTS.md was preserved. Review ajstack-sdd/AGENTS.md for new Phase 2 skills (/sdd-flow, /forensics, /interrogate).\n');
}

function runGlobal() {
  const homeDir = os.homedir();
  const globalClaude = path.join(homeDir, '.claude', 'skills');
  const globalAgy = path.join(homeDir, '.gemini', 'config', 'skills');

  console.log('\n🌍 Installing ajstack-sdd globally:');
  console.log(`• Claude Code: ${globalClaude}`);
  console.log(`• Antigravity: ${globalAgy}\n`);

  for (const skill of SKILLS) {
    const skillSrc = path.join(PACKAGE_ROOT, skill.name);
    if (fs.existsSync(skillSrc)) {
      copyDirRecursive(skillSrc, path.join(globalClaude, skill.name));
      copyDirRecursive(skillSrc, path.join(globalAgy, skill.name));
      console.log(`  ✓ Installed ${skill.name}`);
    }
  }

  console.log('\n🎉 Global installation complete!');
  console.log(`You can now use all ${SKILLS.length} skills across ANY project via / slash commands in Claude Code and globally in Antigravity!\n`);
}

function runList() {
  console.log(`\n📋 ajstack-sdd Skills Suite (${SKILLS.length} Skills):\n`);
  for (const skill of SKILLS) {
    console.log(`  • /${skill.name.padEnd(24)} [${skill.phase}]`);
    console.log(`    ${skill.desc}\n`);
  }
}

function runHelp() {
  console.log(`
ajstack-sdd — Spec-Driven Development Agent Workflow & Skills

USAGE:
  npx ajstack-sdd [command] [options]

COMMANDS:
  init            Bootstrap skills, AGENTS.md, CLAUDE.md, and .gitignore in the target project
  upgrade         Upgrade all installed skills to latest version without modifying custom AGENTS.md
  --global, -g    Install skills globally to ~/.claude/skills and ~/.gemini/config/skills
  list            List all available skills and descriptions
  --help, -h      Show this help message

EXAMPLES:
  npx ajstack-sdd init               # Setup in current repo
  npx ajstack-sdd upgrade            # Upgrade skills in current repo
  npx ajstack-sdd upgrade /path/to   # Upgrade skills in specific directory
  npx ajstack-sdd --global           # Install globally on machine
  npx github:ajayjeripothula18/ajstack-sdd init   # Run directly via GitHub
`);
}

// CLI Argument Routing
const args = process.argv.slice(2);
const command = args[0] || '--help';

switch (command) {
  case 'init': {
    const targetDir = args[1] && !args[1].startsWith('-') ? path.resolve(args[1]) : process.cwd();
    runInit(targetDir, args.includes('--force'));
    break;
  }
  case 'upgrade':
  case 'update': {
    const targetDir = args[1] && !args[1].startsWith('-') ? path.resolve(args[1]) : process.cwd();
    runUpgrade(targetDir);
    break;
  }
  case '--global':
  case '-g':
  case 'global':
    runGlobal();
    break;
  case 'list':
  case 'ls':
    runList();
    break;
  case '--help':
  case '-h':
  case 'help':
  default:
    runHelp();
    break;
}
