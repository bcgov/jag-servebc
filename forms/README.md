# Forms

The [formsflow.ai](https://formsflow.ai) form definition citizens, legal counsel, and staff use to submit and manage a Serve Legal request.

- `serveLegalDocuments.json` — the "Serve Legal Documents" form. Covers all six document types the platform accepts (Notice of Constitutional Question, Notice of Civil Claim, Petition, Notice of Appeal, Notice of Claim (Small Claims), Notice of Application), contact/service-address information, document attachments, and the staff-facing fields (status, responsibility group, notes) used once a submission is in review.

## Editing

This JSON is an export of the form as it exists in [formsflow.ai](https://formsflow.ai) — the live, editable copy lives in the deployed [formsflow.ai](https://formsflow.ai)'s Form Builder. Treat the file here as a backup/reference rather than the source of truth: make changes in the Form Builder UI, then re-export to update this file, rather than hand-editing the JSON and re-importing it.

Fields that hold data the BPMN process reads or writes (e.g. `applicationId`, `applicationStatus`, `servedDate`) are wired to specific `camunda:executionListener` fields in [`../bpmn`](../bpmn) — check there before renaming or removing a component.
