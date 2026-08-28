# BPMN Processes

Process definitions and DMN decision tables that drive a Serve Legal request from intake through service confirmation. Edit these with formsflow.ai, not a plain text editor — the diagram layout is stored alongside the process definition.

## Processes

| File | Process ID | What it does |
| --- | --- | --- |
| `Serve Legal Process.bpmn` | `serve-legal-process` | Top-level orchestrator. Receives the submission, forks into a staff document-review task and the served-date verification in parallel, and calls `Save request data` at each state transition (create/save/complete). |
| `Save request data.bpmn` | `save-request-data-process` | Reusable subprocess that creates or updates the served-document record in `servebc-api` (POST on initial create, PUT on subsequent saves). |
| `Verify served date.bpmn` | `verify-served-date-process` | Checks the current time against business-hours/holiday rules, waits until a valid business moment if needed, then sends the "served" confirmation email and records the served date. |
| `Notification email.bpmn` | `email-notification-process` | Sends a templated notification email via the CHES email service. |

## Decision tables (DMN)

- `holidays.dmn` / `weektype.dmn` / `nextworkingday.dmn` — business-day and BC statutory holiday calculations used by `Verify served date`.
- `documenttype-mapping.dmn` — maps a submitted document type to routing/notification behaviour.
- `emailtemplate*.dmn` — per-environment (DEV/TEST/PROD) email template selection.

