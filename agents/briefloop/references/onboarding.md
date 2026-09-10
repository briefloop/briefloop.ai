# First run

1. **Workspace.** Start the service and open the web app. Pick an existing folder or create one. A workspace holds `briefloop.db`, `sources/`, `exports/`, `jobs/` and `wiki/`; opening a folder does not start a model.
2. **Runtime and model.** 设置 → 模型与提供商 lists the CLIs found on this machine. Choose one, then pick a model from its catalogue or type any model ID. `default` means the model the host itself is configured with. Evaluator, Wiki Maintainer and Skill Proposer can have their own models; leave them empty to inherit the main chain.
3. **Task.** In 材料与需求 fill in title, objective, audience, period and length, upload material, and switch on 联网 if the host should search public sources. The shared research budget defaults to weekly 12 searches / 60 candidates / 18 full sources, or monthly 30 / 200 / 45, and can be adjusted for this report.
4. **Sections reserved for the user.** A section marked 人工填写 stays `待填充`; the generator leaves it alone.
5. **Company background.** Before the first internal weekly, BriefLoop asks whether to keep a company background base. If enabled, public filings and releases are tracked with source, date and history, and conflicts wait for the user's decision.
6. **Generate.** The draft appears as soon as it is saved. Scoring runs in an independent session, and 评价后自动修订一次并复核 produces one reviewed revision.

Continue with `references/operation.md`.
