# Legal Services Branch (LSB) - `Serve Legal Documents Portal`

[![Lifecycle:Stable](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

`Serve Legal Documents Portal` is a specialized web application that allows members of the public or legal counsel to digitally serve one of six specific legal document types on the Attorney General of British Columbia entirely online. By automating the intake and tracking process, this platform replaces the requirement for physical, in-person legal service.

---

## Core System Architecture & Business Logic

The system is built on top of the **formsflow.ai** framework (which is managed outside this repo), utilizing customized components to meet unique Legal Services Branch requirements:

*   **Intake & UX Customization (`/form`):** Uses formsflow.ai based online form to streamline the public intake experience and handle secure multi-document uploads.
*   **Business Rules Engine (`/bpmn`):** Orchestrates the legal validation flow using Camunda BPM. It automatically handles legal deadlines by calculating whether a submission arrived within legally-recognized business hours. If an intake happens after-hours or on a holiday, the workflow recalculates forward to the next valid business moment before firing the final confirmation.
*   **Custom Business Logic Backend (`/api`):** A dedicated backend service managing application state, metadata transformation, and integration points.

---

## Technical Component Breakdown

### 1. Backend Service (`/api`)
The core backend service providing custom endpoints to bridge our custom frontend UX with the formsflow ecosystem. It handles localized business rule evaluations, timestamp calculations, and status tracking.

### 2. Business Workflows (`/bpmn`)
Contains the BPMN 2.0 diagrams and decision tables managed via Camunda.
*   **Time-Stamp Calculation:** Evaluates intake timestamps against British Columbia business hours and statutory holidays.
*   **State Machine:** Tracks submissions from `Intake` $\rightarrow$ `Staff Review` $\rightarrow$ `Served Confirmation`.
*   **Automated Notifications:** Sends the legally binding "Served" confirmation email once validation criteria are cleared.

### 3. Forms & UI Components (`/form`)
Houses the custom configurations and component extensions for the client-facing forms interface. This handles layout injections, validations specific to the six supported legal document types, and file attachment handling.

---

## Getting Started

### Prerequisites
*   Docker Desktop & Docker Compose
*   [Camunda Modeler](https://camunda.com/download/modeler/) (for updating `/bpmn` files)
*   Node.js (for local frontend/API manipulation)

### Local Development Environment
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/bcgov/jag-servebc.git](https://github.com/bcgov/jag-servebc.git)
    cd jag-servebc
    ```
2.  **Initialize Environment configurations:**
    Navigate to `/api`, copy the `.env.example` template to `.env`, and provide the required environment-specific secrets (database configurations, Keycloak endpoints, notification service client IDs).
3.  **Boot the system stack:**
    ```bash
    docker-compose up -d --build
    ```

---

## License

```text
Copyright 2026 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
