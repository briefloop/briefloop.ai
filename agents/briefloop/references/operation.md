# Daily operation

## Roles

| Role | Responsibility |
| --- | --- |
| BriefLoop (main agent) | conversation, research planning, drafting and revision; runs on the main-chain model |
| Scout | collects sources inside the shared budget |
| Analyst | writes the draft |
| Evaluator | scores the draft and compares candidates in an independent session |
| Wiki Maintainer | turns feedback and execution notes into the workspace Wiki |
| Skill Proposer | proposes skills from the Wiki; only verified candidates are enabled |

## Chat and reports

The chat is the workbench: upload material, ask questions, or ask for a report. A report is queued as a job with its own context; chat and report jobs share the workspace but not their conversation.

## Research budget

The budget belongs to one report and is shared by every scout. It is reserved transactionally before a tool call, a failed search still counts, and nothing is extended automatically. When the budget runs out the report keeps the evidence it has and lists the gaps.

## Editing and evaluation

- The draft is a rich document: text, simple tables, images, colour and citations. Markdown is the import and export format.
- Versions are kept, and a score is bound to the version it scored.
- 评价后自动修订一次并复核 runs one revision from the independent evaluation; unresolved items stay visible.
- 数据与缺口 shows stored metrics, calculations and gaps without calling a model.

## Delivery

- 生成 Word writes a `.docx` from a fixed version and shows progress; download it and open it in Word or WPS.
- 正式交付 binds the saved version with its template, sources and review record. Later edits create new versions and leave the release untouched.
- 审计包 exports the fixed material with its evidence and review record when the user asks for it.

## Source tools on the command line

```sh
briefloop tool --workspace <dir> add-url --run <run_id> --url <url>
briefloop tool --workspace <dir> read-source --id <source_id>
briefloop tool --workspace <dir> render-source --id <source_id> --pages 1 3
briefloop tool --workspace <dir> register-figure --run <run_id> --image <png> --title <title>
briefloop tool --workspace <dir> prepare-report-data --run <run_id> --file <json>
briefloop tool --workspace <dir> workspace-action --request <request.json>
```

## Pausing

`briefloop serve --paused` opens a workspace without re-running queued jobs or feedback learning; the app offers to resume them. Closing the browser does not stop a running job.
