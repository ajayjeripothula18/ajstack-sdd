#!/usr/bin/env node

/**
 * ajstack-sdd CLI
 * Spec-Driven Development (SDD) agent workflow and skills for Claude Code, Antigravity, and Cursor.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');

const SKILLS = [
  { name: 'project-init', phase: 'Phase 0 (Initiate)', desc: 'Greenfield delta-interview & Brownfield code discovery into canonical docs/' },
  { name: 'linear-slice', phase: 'Phase 1 (Slice)', desc: 'Fast drift detection, 4 issue templates, and spec:ready issue creation' },
  { name: 'sdd-flow', phase: 'Phase 2 (Execute)', desc: 'Hybrid orchestrator: Investigate -> Isolate -> Build -> Interrogate -> Ship' },
  { name: 'forensics', phase: 'Phase 2 (Execute)', desc: 'Root-cause diagnosis, plan evaluation, schema checks, and PR bot review auditing' },
  { name: 'new-feature', phase: 'Phase 2 (Execute)', desc: 'Dedicated Git worktree isolation in .worktrees/<name> from origin/main' },
  { name: 'code-structure', phase: 'Phase 2 (Execute)', desc: 'Service layer architecture & senior subtractive engineering standards' },
  { name: 'evidence-driven-testing', phase: 'Phase 2 (Execute)', desc: 'Annotated video recordings and Playwright probes proving acceptance criteria' },
  { name: 'before-and-after', phase: 'Phase 2 (Execute)', desc: 'Visual UI screenshot diff comparisons formatted into PR-ready markdown tables' },
  { name: 'interrogate', phase: 'Phase 2 (Execute)', desc: 'Pre-flight adversarial diff audit for async crashes, OCC races, and repro tests' },
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

function runValidate() {
  console.log(`\n🔍 Validating ajstack-sdd skills suite (${SKILLS.length} skills):\n`);
  let hasErrors = false;

  for (const skill of SKILLS) {
    const rootDir = path.join(PACKAGE_ROOT, skill.name);
    const skillFile = path.join(rootDir, 'SKILL.md');

    if (!fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()) {
      console.log(`  ❌ ${skill.name}: Missing skill directory`);
      hasErrors = true;
      continue;
    }

    if (!fs.existsSync(skillFile)) {
      console.log(`  ❌ ${skill.name}: Missing SKILL.md`);
      hasErrors = true;
      continue;
    }

    const content = fs.readFileSync(skillFile, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`  ❌ ${skill.name}: Missing or invalid YAML frontmatter`);
      hasErrors = true;
      continue;
    }

    const frontmatter = frontmatterMatch[1];
    if (!frontmatter.includes('name:') || !frontmatter.includes('description:')) {
      console.log(`  ❌ ${skill.name}: Frontmatter missing 'name' or 'description'`);
      hasErrors = true;
      continue;
    }

    const agySkillFile = path.join(PACKAGE_ROOT, '.agents', 'skills', skill.name, 'SKILL.md');
    if (fs.existsSync(agySkillFile)) {
      const agyContent = fs.readFileSync(agySkillFile, 'utf8');
      if (content !== agyContent) {
        console.log(`  ⚠️  ${skill.name}: Content drift between root and .agents/skills/`);
        hasErrors = true;
        continue;
      }
    }

    console.log(`  ✓ ${skill.name.padEnd(24)} Valid frontmatter & parity confirmed`);
  }

  if (hasErrors) {
    console.error('\n❌ Skill validation failed with errors.\n');
    process.exit(1);
  } else {
    console.log(`\n🎉 All ${SKILLS.length} skills validated successfully with 100% integrity!\n`);
  }
}

function runDoctor(targetDir = process.cwd()) {
  console.log('\n🩺 Running ajstack-sdd environment doctor:\n');

  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  const nodeOk = major >= 18;
  console.log(`  ${nodeOk ? '✓' : '❌'} Node.js: ${nodeVersion} ${nodeOk ? '(supported)' : '(requires Node 18+)'}`);

  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    console.log(`  ✓ Git: ${gitVersion}`);
  } catch {
    console.log('  ❌ Git: Not found in PATH');
  }

  try {
    const ghVersion = execSync('gh --version', { encoding: 'utf8' }).split('\n')[0].trim();
    console.log(`  ✓ GitHub CLI: ${ghVersion}`);
  } catch {
    console.log('  ℹ GitHub CLI (gh): Not installed (optional, required for greploop)');
  }

  try {
    const pyVersion = execSync('python3 --version', { encoding: 'utf8' }).trim();
    console.log(`  ✓ Python: ${pyVersion}`);
  } catch {
    console.log('  ℹ Python 3: Not found (required for evidence.py and greploop)');
  }

  console.log(`\n📁 Checking project environment: ${targetDir}`);
  const hasAgentsMd = fs.existsSync(path.join(targetDir, 'AGENTS.md'));
  console.log(`  ${hasAgentsMd ? '✓' : '⚠️'} AGENTS.md: ${hasAgentsMd ? 'Present' : 'Missing (run npx ajstack-sdd init)'}`);

  const hasClaudeSkills = fs.existsSync(path.join(targetDir, '.claude', 'skills'));
  console.log(`  ${hasClaudeSkills ? '✓' : 'ℹ'} .claude/skills: ${hasClaudeSkills ? 'Installed' : 'Not present'}`);

  const hasAgySkills = fs.existsSync(path.join(targetDir, '.agents', 'skills'));
  console.log(`  ${hasAgySkills ? '✓' : 'ℹ'} .agents/skills: ${hasAgySkills ? 'Installed' : 'Not present'}`);

  const gitignorePath = path.join(targetDir, '.gitignore');
  let worktreeIgnored = false;
  if (fs.existsSync(gitignorePath)) {
    const giContent = fs.readFileSync(gitignorePath, 'utf8');
    worktreeIgnored = giContent.includes('.worktrees');
  }
  console.log(`  ${worktreeIgnored ? '✓' : '⚠️'} .gitignore: ${worktreeIgnored ? '.worktrees/ ignored' : '.worktrees/ not ignored'}\n`);
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
  validate        Validate all skills' directory structure, YAML frontmatter, and parity
  doctor          Check environment readiness (Node, Git, gh, Python, and local skills)
  --help, -h      Show this help message

EXAMPLES:
  npx ajstack-sdd init               # Setup in current repo
  npx ajstack-sdd upgrade            # Upgrade skills in current repo
  npx ajstack-sdd validate           # Verify skill suite integrity
  npx ajstack-sdd doctor             # Diagnose environment readiness
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
  case 'validate':
  case 'check':
    runValidate();
    break;
  case 'doctor':
    runDoctor(args[1] && !args[1].startsWith('-') ? path.resolve(args[1]) : process.cwd());
    break;
  case '--help':
  case '-h':
  case 'help':
  default:
    runHelp();
    break;
}
