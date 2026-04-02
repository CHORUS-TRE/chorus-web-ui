export interface WorkflowStep {
  title: string
  description: string
  responsible?: string
  system?: string
  docRef?: string
}

export interface WorkflowDefinition {
  title: string
  steps: WorkflowStep[]
}

export const WORKFLOWS: Record<string, WorkflowDefinition> = {
  'study-lifecycle': {
    title: 'Study Lifecycle',
    steps: [
      {
        title: 'Planning',
        description:
          'Feasibility assessment, risk analysis, budget, protocol design, data management plan',
        responsible: 'PI + BPR',
        docRef: 'SPO-310'
      },
      {
        title: 'Regulatory Submission',
        description:
          'BASEC submission to CER-VD, Swissmedic authorization (if applicable), SNCTP registration',
        responsible: 'PI + Regulatory Affairs',
        docRef: 'SPO-320'
      },
      {
        title: 'Site Setup',
        description:
          'Workspace creation on CHORUS, delegation log, team training, app installation',
        responsible: 'PI + Study coordinator',
        system: 'CHORUS',
        docRef: 'SIT-400, SIT-410'
      },
      {
        title: 'Study Conduct',
        description:
          'Data collection, monitoring visits, safety reporting, data extraction from CDW',
        responsible: 'Study team',
        system: 'CHORUS + HORUS',
        docRef: 'SIT-420, SPO-330, SPO-360'
      },
      {
        title: 'Close-out',
        description:
          'Database lock, statistical analysis, archiving, retention schedule, final report',
        responsible: 'PI + BPR',
        docRef: 'SIT-430'
      }
    ]
  },

  'feasibility-study': {
    title: 'Feasibility Study (DSI)',
    steps: [
      {
        title: 'Submit Request',
        description:
          'PI sends structured feasibility request to DSI: inclusion/exclusion criteria, study period, variables of interest',
        responsible: 'PI'
      },
      {
        title: 'Validate Data Availability',
        description:
          'DSI checks if requested data exists in the Clinical Data Warehouse and verifies query feasibility',
        responsible: 'DSI Data Engineer',
        system: 'HORUS CDW'
      },
      {
        title: 'Extract Aggregate Statistics',
        description:
          'Extract patient counts, demographics, consent rates. No patient-level data — only aggregated numbers',
        responsible: 'DSI Data Engineer',
        system: 'HORUS CDW'
      },
      {
        title: 'Peer Review',
        description:
          '10% of all feasibility studies undergo internal peer review. 100% review for multicenter studies',
        responsible: 'DSI QC Team'
      },
      {
        title: 'Deliver Report',
        description:
          'Feasibility report with consent statistics, age distribution, cohort size estimates, data completeness',
        responsible: 'DSI → PI'
      }
    ]
  },

  'data-extraction': {
    title: 'Data Extraction — Authorized Study',
    steps: [
      {
        title: 'Submit Extraction Request',
        description:
          'PI submits request with CER-VD approval number, specifying variables and cohort criteria',
        responsible: 'PI'
      },
      {
        title: 'Validate Consent Status',
        description:
          'DSI verifies general consent status for each patient in the cohort via HORUS Consent module',
        responsible: 'DSI',
        system: 'HORUS Consent'
      },
      {
        title: 'Protocol Review',
        description:
          'Cross-check requested variables against the approved study protocol to ensure compliance',
        responsible: 'DSI + PI'
      },
      {
        title: 'Data Extraction',
        description:
          'Extract patient-level data from the Clinical Data Warehouse using validated queries',
        responsible: 'DSI Data Engineer',
        system: 'HORUS CDW'
      },
      {
        title: 'De-identification',
        description:
          'Apply HIPAA Safe Harbor standard (remove 18 identifiers). Enhanced de-identification for AI/ML projects',
        responsible: 'DSI Data Engineer'
      },
      {
        title: 'Quality Control',
        description:
          'Peer review of extraction + automated validation of de-identification completeness',
        responsible: 'DSI QC Team'
      },
      {
        title: 'Delivery',
        description:
          'De-identified dataset delivered to the PI workspace via HORUS Restitution module',
        responsible: 'DSI → PI',
        system: 'HORUS Restitution'
      }
    ]
  },

  'regulatory-submission': {
    title: 'Regulatory Submission',
    steps: [
      {
        title: 'Define Regulatory Strategy',
        description:
          'Determine study category (ClinO/HRO), required approvals, and submission timeline',
        responsible: 'PI + Regulatory Affairs',
        docRef: 'SPO-320-POL-001'
      },
      {
        title: 'Prepare Documents',
        description:
          'Protocol, informed consent form, investigator brochure, insurance certificate, PI CV with GCP training',
        responsible: 'PI'
      },
      {
        title: 'Submit to BASEC',
        description:
          'Upload all documents to the BASEC portal for CER-VD ethics review',
        responsible: 'PI',
        system: 'BASEC',
        docRef: 'SPO-320-WI-001'
      },
      {
        title: 'CER-VD Review',
        description:
          'Ethics committee reviews the submission. Standard review ~30 days, simplified ~15 days',
        responsible: 'CER-VD'
      },
      {
        title: 'Swissmedic Authorization',
        description:
          'Required for drug/device trials (Cat. B/C). Cat. B ~30 days, Cat. C ~60 days. Skip if not applicable.',
        responsible: 'Swissmedic'
      },
      {
        title: 'Approval & Registration',
        description:
          'Receive approvals, register on SNCTP (Kofam), and proceed to site setup',
        responsible: 'PI',
        system: 'SNCTP'
      }
    ]
  },

  'workspace-setup': {
    title: 'CHORUS Workspace Setup',
    steps: [
      {
        title: 'Create Workspace',
        description:
          'Create a new workspace with study name, description, and initial configuration',
        responsible: 'PI / Study coordinator',
        system: 'CHORUS'
      },
      {
        title: 'Configure Security & Resources',
        description:
          'Set network policy, copy/paste rules, resource preset (CPU/GPU/memory), and storage allocation',
        responsible: 'PI / Admin',
        system: 'CHORUS'
      },
      {
        title: 'Add Team Members',
        description:
          'Invite study team members and assign roles (owner, member, viewer)',
        responsible: 'PI',
        system: 'CHORUS'
      },
      {
        title: 'Install Applications',
        description:
          'Deploy research tools from the App Store: RStudio, JupyterLab, VS Code, custom containers',
        responsible: 'PI / Study coordinator',
        system: 'CHORUS'
      },
      {
        title: 'Request Data',
        description:
          'Submit data extraction or transfer request to bring clinical data into the workspace',
        responsible: 'PI',
        system: 'CHORUS + DSI'
      }
    ]
  },

  'informed-consent': {
    title: 'Informed Consent Process',
    steps: [
      {
        title: 'Prepare ICF',
        description:
          'Draft the Informed Consent Form in the patient language (French for Vaud). Include all HRA-required elements.',
        responsible: 'PI',
        docRef: 'SIT-420-POL-002'
      },
      {
        title: 'Ethics Approval of ICF',
        description:
          'Submit ICF as part of BASEC submission. CER-VD must approve before use.',
        responsible: 'CER-VD'
      },
      {
        title: 'Train Study Team',
        description:
          'Ensure all personnel obtaining consent are trained on the protocol and ICF content',
        responsible: 'PI',
        docRef: 'BPR-500-WI-001'
      },
      {
        title: 'Obtain Consent',
        description:
          'Inform the participant, allow adequate reflection time, obtain signature on ICF',
        responsible: 'Delegated study staff'
      },
      {
        title: 'Document & Archive',
        description:
          'File original signed ICF in Investigator Site File. Give a copy to the participant.',
        responsible: 'Study coordinator'
      }
    ]
  },

  'safety-reporting': {
    title: 'Safety & AE Reporting',
    steps: [
      {
        title: 'Detect Adverse Event',
        description:
          'Any untoward medical occurrence in a study participant, whether or not related to the intervention',
        responsible: 'Investigator',
        docRef: 'SIT-440-SOP-002'
      },
      {
        title: 'Assess Severity & Causality',
        description:
          'Classify as AE or SAE. Assess relationship to study intervention (related, possibly related, unrelated)',
        responsible: 'Investigator',
        docRef: 'SIT-440-APP-003'
      },
      {
        title: 'Report SAE to Sponsor',
        description:
          'Report serious adverse events to the sponsor within 24 hours of awareness',
        responsible: 'Investigator → Sponsor'
      },
      {
        title: 'Sponsor Assessment',
        description:
          'Sponsor evaluates expectedness and causality. Determine if SUSAR.',
        responsible: 'Sponsor (BPR)',
        docRef: 'SPO-350-APP-002'
      },
      {
        title: 'Notify Authorities',
        description:
          'Report SUSARs to CER-VD and Swissmedic: 7 days (fatal/life-threatening), 15 days (other)',
        responsible: 'Sponsor (BPR)'
      },
      {
        title: 'Follow-up',
        description:
          'Monitor the event until resolution. Submit follow-up reports as needed.',
        responsible: 'Investigator + Sponsor'
      }
    ]
  },

  monitoring: {
    title: 'Clinical Monitoring',
    steps: [
      {
        title: 'Prepare Monitoring Plan',
        description:
          'Define monitoring strategy, visit frequency, SDV extent, and risk-based approach',
        responsible: 'Sponsor (BPR)',
        docRef: 'SPO-360-APP-001'
      },
      {
        title: 'Initiation Visit',
        description:
          'Train site staff on protocol, review delegation log, verify regulatory documents',
        responsible: 'CRA',
        docRef: 'SPO-360-APP-002'
      },
      {
        title: 'Routine Monitoring',
        description:
          'Verify informed consent, source data verification (SDV), check protocol compliance, review AE reporting',
        responsible: 'CRA',
        docRef: 'SPO-360-APP-003'
      },
      {
        title: 'Write Monitoring Report',
        description:
          'Document findings, action items, and follow-up needed after each visit',
        responsible: 'CRA',
        docRef: 'SPO-360-WI-002'
      },
      {
        title: 'Close-out Visit',
        description:
          'Final source data verification, reconcile queries, verify archiving readiness',
        responsible: 'CRA',
        docRef: 'SPO-360-APP-004'
      }
    ]
  }
}
