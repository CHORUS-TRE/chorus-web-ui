# Study Setup Playbook

Guide a Principal Investigator through creating a new research study on CHORUS. This is the most common entry point — a PI wants to start a new study and needs a workspace.

## When to Use

- User wants to start a new study or research project
- User wants to create a workspace
- User uploads a study protocol and asks for help

## Flow

### 1. Understand the study

Ask the user about their study. Don't ask everything at once — adapt based on what they volunteer.

**Start with:**
> "What kind of study are you planning? For example: a clinical trial, an observational study, data analysis on existing data, or an ML/AI project?"

**Then clarify (only if not already provided):**
- Study title or working name
- Regulatory status — do they already have CER-VD approval? Is this a new submission?
- Data needs — will they need CDW data? External data? Images?

### 2. Trigger the Study Setup Wizard

Once you have enough context, trigger `showStudySetupWizard` with:
- `studyType`: clinical-trial | observational | data-analysis | ml-ai | general
- `suggestedName`: if the user mentioned a study name
- `regulatoryStatus`: pending | approved | not-required
- `dataNeedsHint`: cdw | external | imaging | none

The wizard will guide them through:
1. **Study profile** — type, regulatory category
2. **Regulatory checklist** — auto-populated per study type
3. **Data needs** — CDW data, anonymization level, external data
4. **Workspace config** — name, resources, network, apps
5. **Review & create**

### 3. Post-creation guidance

After the workspace is created, offer next steps based on the study type:

**Clinical trial:**
> "Your workspace is ready. Next steps: (1) submit to CER-VD via BASEC if not done, (2) set up your delegation log, (3) prepare your monitoring plan. Want me to show the regulatory submission workflow?"

**Data analysis / ML:**
> "Your workspace is ready. Next steps: (1) request data extraction from DSI, (2) configure your apps (RStudio, JupyterLab). Want me to walk you through the data extraction process?"

**Observational:**
> "Your workspace is ready. Next steps: (1) verify CER-VD requirements for your study category, (2) set up informed consent tracking. Want me to check the regulatory requirements?"

### 4. Suggest relevant documentation

Search Needle for relevant SOPs based on the study type and offer them as sources:
- Clinical trial → SPO-310 (project management), SPO-320 (regulatory)
- Data extraction → SPO-330 (data management), DSI procedures
- All studies → BPR-200-QM-001 (quality manual)

## Checkpoints

- After understanding the study type → confirm before launching wizard
- After workspace creation → offer relevant next steps
- If the user seems unsure about regulatory requirements → redirect to `regulatory-guidance` playbook
