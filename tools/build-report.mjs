#!/usr/bin/env node
// Compila i progetti e, alla fine, riassume gli errori progetto per progetto
// indicando file e riga. Il log completo viene salvato in build-report.log.
//
// Uso:
//   node tools/build-report.mjs                      -> build di produzione di tutti i progetti
//   node tools/build-report.mjs -c development       -> altra configurazione
//   node tools/build-report.mjs --projects=Ants,menu -> solo alcuni progetti
//   node tools/build-report.mjs --parallel=1         -> un progetto alla volta (meno memoria)
// Gli argomenti vengono passati a "nx run-many -t build".
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const LOG = 'build-report.log';
const userArgs = process.argv.slice(2);
const hasConfig = userArgs.some((a) => a === '-c' || a.startsWith('--configuration') || a.startsWith('-c='));
const args = [
  'nx', 'run-many', '-t', 'build',
  ...(hasConfig ? [] : ['-c', 'production']),
  '--nxBail=false', '--skipNxCache', '--outputStyle=stream',
  ...userArgs,
];

const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
const started = Date.now();
console.log(`> npx ${args.join(' ')}\n  (log completo in ${LOG})\n`);

const child = spawn(`npx ${args.join(' ')}`, { shell: true, env: { ...process.env, FORCE_COLOR: '0', NX_TUI: 'false' } });
let raw = '';
let pending = '';
const onData = (chunk) => {
  const text = stripAnsi(chunk.toString());
  raw += text;
  // Mostra solo l'avanzamento, non tutto l'output
  pending += text;
  const lines = pending.split(/\r?\n/);
  pending = lines.pop();
  for (const l of lines) {
    const m = l.match(/^> nx run (\S+)/);
    if (m) console.log(`  ⏳ ${m[1]}`);
  }
};
child.stdout.on('data', onData);
child.stderr.on('data', onData);

child.on('close', (code) => {
  writeFileSync(LOG, raw);
  const lines = raw.split(/\r?\n/);

  // Progetti falliti secondo Nx
  const failed = [];
  const fi = lines.findIndex((l) => /Failed tasks:/.test(l));
  if (fi >= 0) {
    for (let i = fi + 1; i < lines.length; i++) {
      const m = lines[i].match(/^\s*-\s+([^:\s]+):/);
      if (m) failed.push(m[1]);
      else if (lines[i].trim() && !/^\s*$/.test(lines[i])) break;
    }
  }

  // Raccoglie gli errori per progetto (righe con prefisso "Progetto: ")
  const errorRe = /\[ERROR\]|error TS\d+|ERROR in|FATAL ERROR|heap out of memory|Cannot find module|Could not resolve|Module build failed|^\s*Error:|✖|Unable to read|Failed to start plugin worker|plugin worker is exiting/;
  const locRe = /((?:apps|libs|node_modules)[\\/][^\s:]+\.(?:ts|html|css|scss|json|mjs|js)):(\d+):(\d+)/;
  const byProject = new Map();
  let current = null; // ultimo errore aperto, per agganciare la posizione nelle righe successive
  for (const line of lines) {
    const pm = line.match(/^([A-Za-z0-9_.-]+):\s(.*)$/);
    const project = pm ? pm[1] : null;
    const body = pm ? pm[2] : line;
    if (project && errorRe.test(body)) {
      const msg = body.replace(/^\s*X\s*/, '').replace(/\s*\[plugin [^\]]+\]\s*$/, '').trim();
      const loc = body.match(locRe);
      current = { msg, where: loc ? `${loc[1]}:${loc[2]}:${loc[3]}` : '' };
      if (!byProject.has(project)) byProject.set(project, []);
      byProject.get(project).push(current);
    } else if (current && project && !current.where) {
      const loc = body.match(locRe);
      if (loc) current.where = `${loc[1]}:${loc[2]}:${loc[3]}`;
    }
  }

  const secs = Math.round((Date.now() - started) / 1000);
  const okMatch = raw.match(/Successfully ran target \S+ for (\d+) projects?/);
  console.log('\n' + '='.repeat(70));
  if (code === 0 && !failed.length) {
    console.log(`✅ BUILD OK ${okMatch ? `(${okMatch[1]} progetti)` : ''} in ${secs}s`);
    process.exit(0);
  }

  console.log(`❌ BUILD FALLITA in ${secs}s — progetti con errori: ${failed.length ? failed.join(', ') : '(vedi log)'}`);
  const projects = failed.length ? failed : [...byProject.keys()];
  for (const p of projects) {
    const errs = byProject.get(p) || [];
    // Un errore per messaggio+posizione
    const seen = new Set();
    const unique = errs.filter((e) => { const k = e.msg + '|' + e.where; if (seen.has(k)) return false; seen.add(k); return true; });
    console.log(`\n■ ${p}  (${unique.length} errori distinti)`);
    if (!unique.length) {
      console.log(`   nessun messaggio riconosciuto: cerca "${p}:" in ${LOG}`);
      continue;
    }
    // Gli errori NG8001/NG8002 sono quasi sempre conseguenze: mostra prima gli altri
    unique.sort((a, b) => /NG800[12]/.test(a.msg) - /NG800[12]/.test(b.msg));
    for (const e of unique.slice(0, 15)) {
      console.log(`   • ${e.msg.slice(0, 160)}`);
      if (e.where) console.log(`     → ${e.where}`);
    }
    if (unique.length > 15) console.log(`   … altri ${unique.length - 15} errori in ${LOG}`);
    if (unique.some((e) => /heap out of memory|FATAL ERROR/.test(e.msg))) {
      console.log('   ⚠ Memoria esaurita: riprova con --parallel=1 o aumenta --max-old-space-size nel file .env');
    }
    if (unique.some((e) => /plugin worker|Unable to read angular\.json/.test(e.msg))) {
      console.log('   ⚠ Errore di Nx, non del codice: il plugin worker non è partito in tempo. Controlla NX_ISOLATE_PLUGINS=false in .env e riprova.');
    }
  }
  console.log(`\nLog completo: ${LOG}`);
  process.exit(code || 1);
});
