# Control Boundary

## One Runtime Authority

For a fresh 0.14 Codex run, SQLite ControlStore in `briefloop.db` is the sole
runtime authority. Strict request DTOs cross the write boundary; deterministic
domain services own effects and return receipts. Agents write proposals only
inside the invocation scratch path allowed by the current envelope.

The legacy JSON control plane is deleted. JSON-only workspaces are unsupported:
do not migrate, import, dual-read, dual-write, or use them as fallback. Legacy
JSON control files and report, status, handoff, finalize, Quality Panel,
Markdown, JSON/JSONL, and HTML exports are non-authoritative projections.
Strict action, envelope, and human-request JSON payloads may carry input across
the write boundary, but they are revalidated against ControlStore and are not
authority by themselves.

## Human Authority

Humans approve consequential setup, merge, release, and final delivery. Agent
prose, button clicks in a static preview, and CLI flags outside a typed request
are not authorization.

## Evidence And Quality

Provenance is not semantic proof. A link or recorded span does not prove every
word of a claim. LAJ is an Experimental advisory second opinion whose utility
and efficacy are NOT MEASURED. No current surface guarantees correctness,
completeness, hallucination elimination, output quality, or quality improvement.

## No Learning Claim

The Improvement Ledger is unavailable. No run consumes website feedback,
Quality Panel suggestions, or an improvement snapshot. Do not promise automatic
learning or that accepting a suggestion improves a later run.
