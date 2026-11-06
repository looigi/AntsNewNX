#!/usr/bin/env node
// Incrementa la versione nel package.json SOLO dei progetti (apps/libs) i cui file
// sono cambiati dall'ultimo tag "<progetto>@<versione>".
// Poi delega a "nx release version" la scrittura del package.json, il commit e il tag.
//
// Uso:
//   node tools/release-version.mjs              -> patch sui progetti modificati
//   node tools/release-version.mjs minor        -> minor sui progetti modificati
//   node tools/release-version.mjs --dry-run    -> mostra cosa farebbe, senza modificare nulla
//   node tools/release-version.mjs --init-tags  -> crea i tag iniziali con le versioni attuali
//   node tools/release-version.mjs --projects=menu,Combo -> considera solo questi progetti
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const initTags = args.includes('--init-tags');
const bump = args.find((a) => ['patch', 'minor', 'major'].includes(a)) ?? 'patch';
const onlyArg = args.find((a) => a.startsWith('--projects='));
const only = onlyArg ? new Set(onlyArg.slice('--projects='.length).split(',').filter(Boolean)) : null;

const sh = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const tagExists = (tag) => {
  try { sh(`git rev-parse -q --verify "refs/tags/${tag}"`); return true; } catch { return false; }
};

// Progetti = cartelle in apps/ e libs/ con project.json + package.json
const projects = [];
for (const dir of ['apps', 'libs']) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const root = `${dir}/${entry.name}`;
    const projectJson = join(root, 'project.json');
    const packageJson = join(root, 'package.json');
    if (!existsSync(projectJson) || !existsSync(packageJson)) continue;
    const name = JSON.parse(readFileSync(projectJson, 'utf8')).name;
    if (only && !initTags && !only.has(name)) continue;
    const version = JSON.parse(readFileSync(packageJson, 'utf8')).version;
    projects.push({ name, root, version, tag: `${name}@${version}` });
  }
}

if (initTags) {
  for (const p of projects) {
    if (tagExists(p.tag)) { console.log(`= ${p.tag} esiste già`); continue; }
    if (!dryRun) sh(`git tag "${p.tag}"`);
    console.log(`+ ${p.tag}`);
  }
  console.log('\nRicorda di inviarli a GitHub con:  git push --tags');
  process.exit(0);
}

if (only && projects.length !== only.size) {
  const found = new Set(projects.map((p) => p.name));
  console.error(`✖ Progetti non trovati: ${[...only].filter((n) => !found.has(n)).join(', ')}`);
  process.exit(1);
}

// Il commit di versione includerebbe anche file già in stage: meglio fermarsi.
try { sh('git diff --cached --quiet'); } catch {
  if (!dryRun) {
    console.error('✖ Ci sono file in stage (git add) non committati: committali o togli lo stage prima di aggiornare le versioni.');
    process.exit(1);
  }
}

if (sh('git status --porcelain')) {
  console.warn('⚠ Ci sono modifiche non committate: vengono considerati solo i file già committati.\n');
}

const changed = [];
for (const p of projects) {
  if (!tagExists(p.tag)) {
    console.warn(`⚠ ${p.name}: tag "${p.tag}" non trovato, progetto saltato (lancia --init-tags).`);
    continue;
  }
  const files = sh(`git diff --name-only "${p.tag}" HEAD -- "${p.root}"`).split('\n').filter(Boolean);
  if (files.length) {
    changed.push(p.name);
    console.log(`● ${p.name} (${p.version}): ${files.length} file modificati`);
  }
}

if (!changed.length) {
  console.log('Nessun progetto modificato dall\'ultimo tag: nessuna versione da incrementare.');
  process.exit(0);
}

const cmd = `npx nx release version ${bump} --projects=${changed.join(',')}${dryRun ? ' --dry-run' : ''}`;
console.log(`\n> ${cmd}\n`);
execSync(cmd, { stdio: 'inherit' });
