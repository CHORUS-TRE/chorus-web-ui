# Data Extraction Playbook

Guide a researcher through the DSI data extraction process. This is the second most common request — a PI needs patient data from the Clinical Data Warehouse (CDW).

## When to Use

- User asks about extracting data, patient data, clinical data
- User mentions CDW, HORUS, feasibility study
- User asks "how do I get data for my study?"

## Flow

### 1. Determine the track

DSI operates three extraction tracks. Ask the user what they need:

> "What stage is your data request at? I can help with:
> 1. **Feasibility study** — checking if enough data exists before starting your study (no patient data extracted)
> 2. **Authorized study extraction** — you have CER-VD approval and need de-identified data
> 3. **Specific request** — genomic biobank samples or de-identified medical images"

If the user is unsure, ask:
- Do you have CER-VD (ethics committee) approval for this study?
- Do you need actual patient data, or just counts/statistics?

### 2. Show the appropriate workflow

Trigger `showWorkflow` with the matching workflow ID:

| Track | Workflow ID | Steps |
|-------|------------|-------|
| Feasibility | `feasibility-study` | 5 steps |
| Authorized extraction | `data-extraction` | 7 steps |
| Specific requests | Explain verbally (varies) | Depends on type |

### 3. Track-specific guidance

#### Track 1: Feasibility Study (5 steps)

Key points to explain:
1. **Request** — PI sends structured request to DSI (inclusion/exclusion criteria, study period, variables)
2. **Validation** — DSI checks data availability in CDW
3. **Extraction** — Aggregate statistics only (counts, distributions). No patient-level data.
4. **Peer review** — 10% internal review, 100% for multicenter studies
5. **Delivery** — Report with consent statistics, age breakdown, cohort size

> "A feasibility study gives you aggregate numbers — patient counts, demographics — to help you plan your study. No patient-level data leaves the CDW at this stage."

**Search Needle** for DSI feasibility procedures to cite specific steps.

#### Track 2: Authorized Study Extraction (7 steps)

Key points to explain:
1. **Request** — PI submits extraction request with CER-VD approval number
2. **Validation** — DSI validates consent status via HORUS Consent module
3. **Protocol review** — Cross-check requested variables against approved protocol
4. **Extraction** — Data pulled from CDW using validated queries
5. **De-identification** — HIPAA standard by default; custom for AI projects (Swissethics check)
6. **Quality control** — Peer review + automated validation
7. **Delivery** — Via HORUS Restitution module to the PI's workspace

> "For an authorized extraction, you need your CER-VD approval number. DSI will verify consent for each patient and de-identify the data before delivery."

**Key systems involved:** HORUS CDW, HORUS Consent, HORUS Restitution

#### Track 3: Specific Requests

Two sub-types:
- **Genomic biobank** — involves BGC scientific committee approval, LPA, MEIP
- **Medical imaging** — involves TRM, ADIS, DSR, APP, de-identified DICOM delivery

> "Specific requests follow a different path. Which type do you need: genomic samples from the biobank, or de-identified medical images?"

### 4. Help with the request

After showing the workflow, offer practical help:
- "Want me to search for the request form template?"
- "Need help drafting your inclusion/exclusion criteria?"
- "Want me to check what data is available in the CDW for your study domain?"

Search Needle for:
- SPO-330-APP-001 (Data Management Plan Template)
- SPO-330-SOP-001 (Database Setup)
- CDM-610-APP-001 (Data Anonymization Request Form)

## Checkpoints

- After identifying the track → confirm understanding before showing workflow
- After showing workflow → ask if they need help with a specific step
- If user doesn't have CER-VD approval → redirect to `regulatory-guidance` playbook
