# DSI Knowledge — Data Extraction Procedures

Domain knowledge about the DSI (Direction des Systèmes d'Information) clinical data extraction procedures at CHUV.

## Overview

The DSI manages all clinical data extractions from the **Clinical Data Warehouse (CDW)**. Three tracks exist depending on the request type and regulatory status.

## HORUS Platform Modules

Data extraction uses the **HORUS** platform (Hospital Research Unified Data & Analytics Services):

| Module | Purpose |
|--------|---------|
| **HORUS CDW** | Clinical Data Warehouse — source of all clinical data |
| **HORUS Consent** | Patient consent management — checks general consent status |
| **HORUS Restitution** | Secure data delivery to researchers |
| **HORUS Image** | De-identified medical image delivery |
| **HORUS Biobank (BGC)** | Genomic biobank sample management |
| **HORUS Cohort** | Cohort building and tracking |
| **HORUS Analytics** | Data exploration and visualization |

## Track 1: Feasibility Studies (5 Steps)

**Purpose:** Check data availability before starting a study. No patient-level data extracted.

| Step | Action | Responsible | System |
|------|--------|-------------|--------|
| 1 | PI submits feasibility request | PI | Email/form |
| 2 | DSI validates data availability | DSI data engineer | HORUS CDW |
| 3 | Aggregate data extraction | DSI data engineer | HORUS CDW |
| 4 | Peer review (10% internal, 100% multicenter) | DSI QC team | Internal |
| 5 | Delivery of feasibility report | DSI → PI | Email/secure |

**Output:** Report containing:
- Patient count matching criteria
- Consent statistics (% general consent)
- Age distribution / demographics
- Data completeness indicators

**Key rule:** No patient-level data leaves the CDW. Only aggregated statistics.

**Peer review policy:**
- 10% of all feasibility studies undergo internal peer review
- 100% of multicenter feasibility studies undergo peer review

## Track 2: Authorized Study Extraction (7 Steps)

**Purpose:** Extract de-identified patient data for an approved study.

**Prerequisite:** Valid CER-VD approval.

| Step | Action | Responsible | System |
|------|--------|-------------|--------|
| 1 | PI submits extraction request with CER-VD number | PI | Form |
| 2 | DSI validates consent status per patient | DSI | HORUS Consent |
| 3 | Protocol review — variables vs. approved protocol | DSI + PI | Manual |
| 4 | Data extraction from CDW | DSI data engineer | HORUS CDW |
| 5 | De-identification | DSI data engineer | Automated tools |
| 6 | Quality control + peer review | DSI QC team | Internal |
| 7 | Delivery via HORUS Restitution | DSI → PI workspace | HORUS Restitution |

**De-identification rules:**
- **Standard (HIPAA):** Remove 18 identifiers — default for most studies
- **Custom:** For AI/ML projects — requires Swissethics check, may need additional suppression
- **Decision tree:** AI project? → Check Swissethics guidelines → Apply enhanced de-identification

**Quality gates:**
- Consent verification for every patient in the cohort
- Variable-level check against approved protocol
- Automated validation of de-identification completeness
- Peer review before delivery

## Track 3: Specific Requests

### 3a. Genomic Biobank Samples

Involves multiple committees and labs:
- **CER-VD** — ethics approval
- **BGC Scientific Committee** — biobank governance approval
- **LPA** (Laboratoire de Pathologie) — sample retrieval
- **MEIP** — molecular analysis if needed

### 3b. De-identified Medical Images

Process:
- PI submits imaging request
- **TRM** (Imagerie médicale) identifies relevant images
- **ADIS** (Applications et Développement des Systèmes d'Information de Santé) prepares de-identification
- **DSR** applies de-identification to DICOM files
- Delivery via **HORUS Image** module
- **APP** validates image quality post de-identification

## Key Roles

| Role | Abbreviation | Responsibility |
|------|-------------|----------------|
| Principal Investigator | PI | Requests data, defines criteria |
| DSI Data Engineer | DSI-DE | Extracts and de-identifies data |
| DSI QC Team | DSI-QC | Reviews extractions |
| Data Protection Officer | DPO | Validates de-identification |

## How to Use This Knowledge

When a user asks about data:
1. Determine which track applies (feasibility / authorized / specific)
2. Show the workflow via `showWorkflow` tool
3. Search Needle for specific DSI procedures
4. Explain the quality gates and what the user needs to provide
5. If they don't have CER-VD approval → redirect to regulatory playbook
