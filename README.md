# fallcloser · loop closer

**Ring 6 (resolution) flagship** — closes open loops across the estate. Peer to `fallresolve` (Phase 1 resolution) · fallcloser handles the batch-close side.

## What it closes

- Stale FallMarket transactions (>30d escrowed, benchmark never ran)
- Unmerged forks with no upstream contact >90d
- Pending subscriptions in `awaiting-onboarding` state
- Benchmark queue backlog (queued >7d)
- Broken listings marked but never repaired
- Session tasks marked in_progress with no updates >48h

## Emits

Signed `estate-closure-report.json` at daily 05:00 UTC (after fallwatcher's 04:30 report).

## Wired to

- FallMarket transaction lifecycle (auto-refund + notify at expiry)
- Nightly workflow chain (audit → shim → scrub → repair → **close** → build-catalog)
- `estate-closure-log.jsonl` (audit trail)

MIT · AI-Native Solutions
