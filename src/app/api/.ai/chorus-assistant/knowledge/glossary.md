# Glossary — Key Terms and Acronyms

## Institutions & Departments

| Term | Full Name | Description |
|------|-----------|-------------|
| **CHUV** | Centre Hospitalier Universitaire Vaudois | University Hospital of Lausanne |
| **BPR** | Bureau du Promoteur de Recherche | CHUV Sponsor Research Office — manages QMS |
| **DSI** | Direction des Systèmes d'Information | IT department — manages data extractions |
| **CER-VD** | Commission d'Éthique de la Recherche du Canton de Vaud | Cantonal ethics committee |
| **BGC** | Biobanque Génomique du CHUV | CHUV genomic biobank |
| **LPA** | Laboratoire de Pathologie | Pathology laboratory |
| **MEIP** | — | Molecular analysis platform |
| **TRM** | Technique en Radiologie Médicale | Medical imaging technicians |
| **ADIS** | Applications et Développement des SI de Santé | Health IS development team |

## Regulatory

| Term | Full Name | Description |
|------|-----------|-------------|
| **HRA** | Human Research Act (LRH) | Swiss federal law governing human research |
| **ClinO** | Clinical Trials Ordinance (OClin) | Ordinance for clinical trials |
| **HRO** | Human Research Ordinance (ORH) | Ordinance for non-interventional research |
| **ICH GCP** | International Council for Harmonisation — Good Clinical Practice | International standard for clinical trials |
| **BASEC** | Business Administration System for Ethics Committees | Swiss ethics submission portal |
| **SNCTP** | Swiss National Clinical Trials Portal | National trial registration |
| **Kofam** | Koordinationsstelle Forschung am Menschen | Coordination office for human research |
| **FOPH** | Federal Office of Public Health | Swiss health authority |

## Data & Technology

| Term | Full Name | Description |
|------|-----------|-------------|
| **CDW** | Clinical Data Warehouse | CHUV's central clinical data repository |
| **HORUS** | Hospital Research Unified Data & Analytics Services | Platform for clinical data management |
| **eCRF** | Electronic Case Report Form | Digital data collection form for clinical trials |
| **CDASH** | Clinical Data Acquisition Standards Harmonization | Data acquisition standard |
| **CDISC** | Clinical Data Interchange Standards Consortium | Data interchange standards body |
| **SDTM** | Study Data Tabulation Model | Standardized data format |
| **REDCap** | Research Electronic Data Capture | Electronic data capture tool |
| **TRE** | Trusted Research Environment | Secure compute environment for sensitive data |

## CHORUS Platform

| Term | Description |
|------|-------------|
| **Workspace** | Isolated research environment for a study |
| **Workbench** | Running compute session (K8s pod) inside a workspace |
| **App** | Containerized tool (RStudio, JupyterLab, etc.) |
| **App Instance** | A deployed instance of an app in a workspace |
| **DevStore** | Key-value store for workspace configuration (images, settings) |
| **Approval Request** | Data extraction or transfer request requiring authorization |
| **Gatekeeper** | Authentication and authorization service |

## Clinical Research

| Term | Full Name | Description |
|------|-----------|-------------|
| **PI** | Principal Investigator | Lead researcher for a study |
| **CRA** | Clinical Research Associate | Monitor who verifies study conduct |
| **DMC** | Data Monitoring Committee | Independent safety oversight committee |
| **ICF** | Informed Consent Form | Document signed by study participants |
| **AE** | Adverse Event | Any untoward medical event in a participant |
| **SAE** | Serious Adverse Event | AE that is life-threatening, fatal, or causes hospitalization |
| **SUSAR** | Suspected Unexpected Serious Adverse Reaction | Unexpected SAE related to the study drug |
| **SDV** | Source Data Verification | Comparing CRF data to original medical records |
| **CAPA** | Corrective and Preventive Action | Quality management process for addressing issues |
| **SOP** | Standard Operating Procedure | Documented process for a specific activity |
| **WI** | Work Instruction | Step-by-step task guidance |
| **DMP** | Data Management Plan | Plan for data collection, processing, and storage |

## De-identification

| Term | Description |
|------|-------------|
| **HIPAA Safe Harbor** | Remove 18 identifiers (names, dates, IDs, etc.) |
| **K-anonymity** | Each record is indistinguishable from k-1 other records |
| **Pseudonymization** | Replace identifiers with codes (reversible) |
| **Anonymization** | Remove all identifiers (irreversible) |
| **General consent** | CHUV patient consent for data/sample reuse in research |

## Training Levels (BPR)

| Level | Name | Scope |
|-------|------|-------|
| **RU** | Recherche Utilisateur | Basic research awareness |
| **RO** | Recherche Opérationnel | Operational research skills |
| **ROP** | Recherche Opérationnel Plus | Advanced research operations |
