# Study Lifecycle — Quick Reference

## Phases

```
Planning ──► Regulatory ──► Site Setup ──► Conduct ──► Close-out
   │              │              │            │            │
   ▼              ▼              ▼            ▼            ▼
Feasibility   CER-VD/BASEC   Workspace    Data mgmt    Archiving
Risk assess   Swissmedic     Delegation   Monitoring   Retention
Budget        SNCTP          Training     Safety/AE    Final report
Protocol      Insurance      Apps setup   Amendments
```

## Phase Details

### 1. Planning (SPO-310)

| Activity | BPR Document | Tool |
|----------|-------------|------|
| Feasibility assessment | SPO-310-APP-002 | — |
| Risk assessment | SPO-310-APP-005 | — |
| Budget planning | SPO-310-APP-003 | — |
| Project initiation | SPO-310-APP-004 | showStudySetupWizard |
| Data management plan | SPO-330-APP-001 | — |

**DSI involvement:** Request feasibility study (Track 1) to validate data availability.

### 2. Regulatory (SPO-320)

| Activity | BPR Document | Authority |
|----------|-------------|-----------|
| Regulatory strategy | SPO-320-POL-001 | — |
| BASEC submission | SPO-320-WI-001 | CER-VD |
| Swissmedic authorization | SPO-320-WI-002 | Swissmedic |
| SNCTP registration | — | Kofam |
| Insurance certificate | — | Insurer |

**Timeline:** CER-VD ~30 days, Swissmedic Cat. B ~30 days, Cat. C ~60 days.

### 3. Site Setup (SIT-400, SIT-410)

| Activity | BPR Document | On CHORUS |
|----------|-------------|-----------|
| Site activation | SIT-400-SOP-001 | Create workspace |
| Delegation log | SIT-410-APP-001 | Add members + roles |
| Initiation visit | SIT-410-APP-002 | — |
| Training | BPR-500-WI-001 | — |
| App setup | — | Install apps (RStudio, Jupyter, etc.) |

**CHORUS actions:** Create workspace → configure network/storage → add team members → install apps.

### 4. Study Conduct (SIT-420, SPO-330, SPO-360, SIT-440)

| Activity | BPR Document | On CHORUS |
|----------|-------------|-----------|
| Informed consent | SIT-420-POL-002 | — |
| Data collection | SPO-330-SOP-001 | Workbench sessions |
| Monitoring visits | SPO-360-SOP-001 | — |
| AE/SAE reporting | SIT-440-SOP-002 | — |
| Data extraction (CDW) | DSI procedures | Approval request |
| Data transfers | — | Data transfer request |

**DSI involvement:** Request authorized extraction (Track 2) once CER-VD approved.

### 5. Close-out (SIT-430)

| Activity | BPR Document | On CHORUS |
|----------|-------------|-----------|
| Database lock | SPO-330-SOP-003 | — |
| Statistical analysis | SPO-340-POL-001 | Workbench sessions |
| Archiving | SIT-430-SOP-001 | Export + archive |
| Retention schedule | SIT-430-APP-001 | — |
| Close-out visit | SPO-360-APP-004 | — |

**Retention:** Minimum 10 years after study completion (per Swiss law).

## Study Types → Lifecycle Variations

| Study Type | Planning | Regulatory | Data Source | Key Difference |
|------------|----------|-----------|-------------|----------------|
| Clinical trial | Full | CER-VD + Swissmedic | eCRF + CDW | Monitoring required |
| Observational | Standard | CER-VD only | CDW | No Swissmedic |
| Retrospective | Light | CER-VD (maybe) | CDW only | No site setup |
| ML/AI project | Standard | CER-VD + Swissethics | CDW (enhanced de-id) | Extra de-identification |
