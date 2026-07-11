# User Onboarding

## Translate Intent Into A Product Entry

- industry, market, competitor, weekly, 周报, 行业, 市场, 竞品 ->
  `industry-weekly`
- management monthly, operating review, 管理月报, 经营月报 ->
  `management-monthly`
- document or PDF review, evidence extraction, 文档审阅, PDF审阅, 证据摘录 ->
  `document-review`

## Collect A Small Batch Of Inputs

Ask for report type, topic, intended reader, reporting period, language, local
input or source preference, whether live web search should be enabled, and the
workspace location. Do not start with YAML fields or internal artifact names.
Summarize the resolved values in one short card and ask for confirmation.

## Workspace And Search Consent

A BriefLoop workspace is the local folder for one recurring report project.
Suggest a location outside the source repository, such as:

```text
~/Documents/BriefLoop/workspaces/<topic-slug>
```

Do not create it silently.

Online search is optional. If enabled, explain which provider and credential
are needed, check only whether the environment variable exists, and never
display its value. If declined, make the disabled choice explicit.

Example after approval:

```bash
briefloop new industry-weekly <workspace> --web-search-mode disabled
```
