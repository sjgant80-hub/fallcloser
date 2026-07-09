#!/usr/bin/env node
// fallcloser · batch loop-closer · reads FallMarket + estate state, emits closure actions
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const HOME = process.env.USERPROFILE || process.env.HOME;
const FM = join(HOME, 'Downloads/fallmarket');
const now = new Date().toISOString();
const actions = [];
try {
  const audit = existsSync(join(FM, 'estate-quality.json')) ? JSON.parse(readFileSync(join(FM, 'estate-quality.json'), 'utf-8')) : null;
  if (audit) {
    for (const r of audit.results) {
      if (r.grade === 'F') actions.push({ action: 'archive-candidate', repo: r.id, reason: 'F-grade · restore or archive', priority: 'high' });
      if (r.public_safe === false) actions.push({ action: 'scrub-required', repo: r.id, reason: 'contamination detected', priority: 'critical' });
      if (r.geo_missing?.length >= 2) actions.push({ action: 'geo-shim', repo: r.id, missing: r.geo_missing, priority: 'medium' });
    }
  }
} catch (e) {}
const report = { v: 1, generated_at: now, closer: 'fallcloser v1.0.0', total_actions: actions.length, actions };
writeFileSync(join(FM, 'estate-closure-report.json'), JSON.stringify(report, null, 2));
console.log(`fallcloser · ${actions.length} closure actions`);
