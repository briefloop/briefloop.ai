# User Onboarding

Use `briefloop onboard` to capture the report objective, audience, language,
cadence, source posture, must-watch topics, exclusions, output style, and a
fresh workspace location. Ask in business language, show the resolved choices,
and obtain confirmation before initialization.

Then initialize a new SQLite workspace:

```bash
briefloop init <workspace> --from-onboarding onboarding.json
```

`briefloop init --web [--port <n>]` is an Experimental one-shot loopback
wizard on the same ControlStore bootstrap path. The wizard server exits after
the first successful submission or cancellation. The page hosted on
briefloop.ai is only a read-only synthetic preview: it creates no workspace,
submits no transaction, and returns no receipt.

Never point initialization at a JSON-only legacy workspace. There is no
migration or fallback path.
