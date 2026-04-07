# Regulatory Framework — Swiss Clinical Research

Domain knowledge about the Swiss regulatory landscape for clinical research.

## Legal Framework

### Federal Laws

| Law | Abbreviation | Scope |
|-----|-------------|-------|
| Human Research Act | **HRA** (LRH) | Umbrella law for all human research in Switzerland |
| Clinical Trials Ordinance | **ClinO** (OClin) | Clinical trials with drugs, devices, other interventions |
| Human Research Ordinance | **HRO** (ORH) | Non-interventional research, observational studies |
| Therapeutic Products Act | **TPA** (LPTh) | Drug and device regulation |
| Organisational Ordinance HRA | **OrgO-HRA** | Organizational provisions (ethics committees, etc.) |

### International Standards

| Standard | Scope |
|----------|-------|
| **ICH GCP E6(R2)** | Good Clinical Practice — international standard for clinical trials |
| **Declaration of Helsinki** | Ethical principles for medical research involving humans |
| **Declaration of Taipei** | Ethical considerations for health databases and biobanks |
| **GDPR** | EU General Data Protection Regulation (applies when EU data involved) |

### Data Standards

| Standard | Used for |
|----------|---------|
| **CDASH** | Clinical Data Acquisition Standards Harmonization |
| **CDISC** | Clinical Data Interchange Standards Consortium |
| **SDTM** | Study Data Tabulation Model |
| **21 CFR Part 11** | Electronic records and signatures (FDA) |

## Regulatory Authorities

### CER-VD (Commission d'Éthique de la Recherche du Canton de Vaud)

- **Role:** Ethics committee for the Canton of Vaud
- **Portal:** BASEC (Business Administration System for Ethics Committees)
- **Reviews:** All human research requiring ethics approval
- **Approval types:**
  - Full review (clinical trials, high-risk studies)
  - Simplified review (low-risk, non-interventional)
  - Notification only (certain retrospective studies)

### Swissmedic

- **Role:** Swiss agency for therapeutic products
- **Reviews:** Clinical trial authorizations for drugs and medical devices
- **Categories:**
  - **Cat. A:** Authorized drugs at standard dose → notification only
  - **Cat. B:** Authorized drugs at non-standard use → authorization required
  - **Cat. C:** Non-authorized drugs / first-in-human → full authorization

### FOPH / Kofam

- **FOPH:** Federal Office of Public Health — oversees HRA implementation
- **Kofam:** Coordination Office for Human Research — manages SNCTP (Swiss National Clinical Trials Portal)
- **SNCTP:** All clinical trials must be registered

### BASEC Portal

The central submission system for all Swiss ethics committees:
- Online submission of study protocols
- Document management (protocol, consent forms, IB)
- Communication with ethics committee
- Amendment submissions
- Annual safety reports

## Study Classification

### By HRA Category

| Category | Description | Ethics Review | Swissmedic |
|----------|-------------|---------------|------------|
| Clinical trial (ClinO) | Intervention with drug/device | Full review | Yes (Cat. B/C) |
| Non-drug intervention | Surgery, physiotherapy, etc. | Full review | No |
| Observational (HRO) | No intervention, prospective | Review required | No |
| Retrospective | Existing data, no new collection | May be exempt | No |
| Human bio material | Tissue, blood, genetic | Review required | No |
| Anonymized data only | Fully anonymous, no re-identification | Exempt | No |

### Key Decision Points

1. **Is it research on humans?** → If yes, HRA applies
2. **Is there an intervention?** → If yes, ClinO applies (need Swissmedic for drugs/devices)
3. **Does it involve identifiable data?** → If yes, ethics approval needed
4. **Is it fully anonymized?** → If yes, may be exempt from HRA
5. **Does it involve genetic data?** → Additional requirements (GHRA)

## Informed Consent Requirements

| Study Type | Consent Required | Form |
|------------|-----------------|------|
| Clinical trial | Written informed consent | Study-specific ICF |
| Observational (prospective) | Written or oral (documented) | Study-specific ICF |
| Retrospective (coded) | General consent sufficient | CHUV general consent |
| Retrospective (anonymous) | No consent needed | N/A |
| Emergency research | Waiver possible (HRA Art. 30) | Retrospective consent |

**CHUV General Consent:** Patients at CHUV sign a general consent covering reuse of data and samples for research. Status is tracked in **HORUS Consent**.

## Key Timelines

| Milestone | Regulatory Timeline |
|-----------|-------------------|
| CER-VD review | ~30 days (standard), ~15 days (simplified) |
| Swissmedic Cat. B | ~30 days |
| Swissmedic Cat. C | ~60 days |
| Annual safety report | Within 90 days of data lock point |
| SAE reporting (to sponsor) | Within 24 hours |
| SUSAR reporting (to CER-VD) | 7 days (fatal/life-threatening), 15 days (other) |

## How to Use This Knowledge

When a user asks about regulations:
1. Classify their study type first
2. Map to the right regulatory path
3. Always search Needle for BPR-specific procedures (SPO-320 series)
4. Cite specific law articles when relevant (e.g., "HRA Art. 34")
5. Never guess timelines — refer to official sources
6. If unsure → recommend the user consult the BPR regulatory team
