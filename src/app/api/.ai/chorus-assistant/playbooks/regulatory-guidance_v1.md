# Regulatory Guidance Playbook

Help researchers navigate Swiss clinical research regulatory requirements. This is loaded when users ask about ethics approvals, regulatory submissions, or compliance.

## When to Use

- User asks about CER-VD, BASEC, Swissmedic approvals
- User wants to know what approvals they need for their study
- User is preparing a regulatory submission
- User asks about HRA, ClinO, ICH GCP requirements

## Flow

### 1. Determine the study category

Swiss regulations classify research differently. Ask:

> "To determine the right regulatory path, I need to understand your study:
> - Is it a **clinical trial** (testing a drug, device, or intervention)?
> - An **observational study** (no intervention, just data collection)?
> - A **retrospective data analysis** (using existing data)?
> - Something involving **human biological material**?"

### 2. Map to regulatory requirements

Based on the category, explain the required approvals:

#### Clinical Trials (ClinO)

| Requirement | Authority | Needed? |
|-------------|-----------|---------|
| Ethics approval | CER-VD (via BASEC) | Always |
| Clinical trial authorization | Swissmedic | Cat. B & C drugs/devices |
| FOPH notification | Kofam / SNCTP | Always (registration) |
| DMC charter | Study sponsor | Risk-dependent |

Show workflow: `regulatory-submission`

Key BPR documents:
- SPO-320-POL-001 — Regulatory Strategy Policy
- SPO-320-WI-001 — BASEC Submission Instructions
- SPO-350-APP-001 — DMC Charter Template

#### Observational Studies (HRO)

| Requirement | Authority | Needed? |
|-------------|-----------|---------|
| Ethics approval | CER-VD (via BASEC) | Most cases |
| Informed consent | PI responsibility | Required unless waiver |
| Data protection | CHUV DPO | If personal data involved |

Key BPR documents:
- SIT-420-POL-002 — Informed Consent Process
- CDM-620-APP-002 — Data Security Policy

#### Retrospective Data Analysis

| Requirement | Authority | Needed? |
|-------------|-----------|---------|
| Ethics approval | CER-VD | If using non-anonymized data |
| General consent check | HORUS Consent | Always |
| DSI data request | DSI team | For CDW data |

> "For retrospective studies, the key question is whether your data will be fully anonymized. If yes, you may not need CER-VD approval. If you need identifiable or coded data, you'll need ethics approval."

#### Human Biological Material

| Requirement | Authority | Needed? |
|-------------|-----------|---------|
| Ethics approval | CER-VD | Always |
| Biobank committee | BGC scientific committee | For biobank samples |
| Material transfer agreement | Legal department | If cross-institutional |

### 3. BASEC Submission Guidance

If the user needs to submit to BASEC, provide a focused walkthrough:

> "BASEC (Business Administration System for Ethics Committees) is the portal for all Swiss ethics submissions. Here's what you'll need:"

1. **Study protocol** — latest approved version
2. **Informed consent form** — in the patient's language (French for Vaud)
3. **Investigator's Brochure** — for drug trials
4. **Insurance certificate** — for interventional studies
5. **CV of PI** — current, with GCP training certificate
6. **Budget & funding** — declaration of funding sources and conflicts

Search Needle for SPO-320-WI-001 (BASEC Submission Instructions) and provide specific steps.

### 4. Offer to show detailed workflow

> "Want me to show the full regulatory submission workflow step by step?"

Trigger `showWorkflow` with `regulatory-submission` if they say yes.

### 5. Connect to next steps

After regulatory guidance:
- If they don't have a workspace yet → offer `study-setup` playbook
- If they need data → offer `data-extraction` playbook
- If they need to check existing approval status → search Needle for tracking forms

## Checkpoints

- After identifying study category → confirm before showing requirements
- After listing requirements → ask if they need help with a specific submission
- If study category is unclear → ask clarifying questions, don't guess
