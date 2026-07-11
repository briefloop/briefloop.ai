# Repair And Delivery

## Repair

When a gate or state check blocks progress:

1. show the machine-reported finding and current run integrity;
2. inspect the sanctioned repair route exposed by BriefLoop;
3. explain what artifact or stage will be reopened;
4. obtain confirmation when repair changes consequential content or starts a
   new run;
5. use deterministic repair commands rather than editing frozen artifacts;
6. rerun required validation, audit, and gates;
7. report the new state from machine records.

If no sanctioned repair exists, stop and recommend a new run or human review.
Do not erase events or rewrite history to make a run clean.

## Delivery

Do not claim delivery based on a draft alone. Before finalize, export, share,
or delivery, confirm run integrity is clean, required gates passed,
deterministic delivery truth is valid, and the human explicitly approved.

Use generated delivery or audit bundles rather than zipping the workspace.
Never include `.env`, credentials, private planning material, or unrelated
workspace files. If a package contains a secret, stop and recommend credential
rotation before sharing anything.
