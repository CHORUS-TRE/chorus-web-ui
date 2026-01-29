# Measurement Plan

## Executive Summary
This plan defines the analytics strategy for CHORUS to track critical user journeys: Sign-up, Workspace Creation, Data Upload, and Compute Usage (Sessions/Apps). The focus is on conversion rates and identifying error states.

## 1. User Journeys & Tracking Points

### Journey 1: User Onboarding (Sign-up)
**Goal**: Identify drop-off points in registration.
*   **Step 1**: Click "Sign Up" button -> `Auth | Signup | Start`
*   **Step 2**: View Sign Up Form -> `Pageview: /signup`
*   **Step 3**: Submit Form (Success) -> `Auth | Signup | Submit`
*   **Step 4**: Email Verification (Landing) -> `Pageview: /verify`
*   **Step 5**: First Login -> `Auth | Login | Complete`

### Journey 2: Workspace Management
**Goal**: Track successful environment provisioning.
*   **Step 1**: Click "New Workspace" -> `Workspace | Create | Start`
*   **Step 2**: Submit Workspace Config -> `Workspace | Create | Submit`
*   **Step 3**: Creation Success -> `Workspace | Create | Success`
*   **Step 4**: Creation Error -> `Workspace | Create | Error` (Dimension: ErrorType)

### Journey 3: Data Ingestion
**Goal**: Monitor data upload reliability.
*   **Step 1**: Initiate Upload -> `Data | Upload | Start` (Dimension: FileType, SizeBucket)
*   **Step 2**: Upload Complete -> `Data | Upload | Success`
*   **Step 3**: Upload Fail -> `Data | Upload | Error`

### Journey 4: Compute & Analysis (The "Work")
**Goal**: Measure engagement with analysis tools.
*   **Step 1**: Launch Session -> `Session | Launch | Start`
*   **Step 2**: Session Active -> `Session | Launch | Success` (Dimension: SessionType e.g., Jupyter, VSCode)
*   **Step 3**: Launch App Instance -> `AppInstance | Launch | Start` (Dimension: AppName)
*   **Step 4**: App Instance Running -> `AppInstance | Launch | Success`

## 2. Key Performance Indicators (KPIs)
1.  **Onboarding Conversion Rate**: `(Signup Complete / Signup Start) * 100`
2.  **Workspace Health Score**: `(Workspace Success / Workspace Attempts) * 100`
3.  **Data Ingestion Success Rate**: `(Upload Success / Upload Attempts) * 100`
4.  **Active Researcher Rate**: % of active users who launch at least 1 session/app per week.

## 3. Privacy & Compliance Configuration
*   **IP Anonymization**: Enabled (2 bytes masked e.g. `192.168.xxx.xxx`) to comply with Swiss FADP/GDPR.
*   **Consent Management**: 
    *   Strict "No tracking until consent" policy.
    *   Integrated with `useDevStoreCache` for persistence and `MatomoConsentSync` for real-time tracking behavior.
    *   Dedicated Privacy Policy page available at `/privacy-policy`.
*   **Do Not Track**: Honor browser DNT settings.
*   **Data Retention**: 13 months for events, 25 months for aggregates.
*   **PII Masking**: Ensure no Usernames, Emails, or Dataset Names are passed. Use IDs (Workspace ID, App ID) or hashed values.

## 4. Custom Dimensions (Configured)
| Index | Name | Scope | Example Value |
| :--- | :--- | :--- | :--- |
| 1 | UserRole | Visit | `Researcher`, `Admin` |
| 2 | WorkspaceID | Action | `ws-12345` |
| 3 | AppRef | Action | `jupyter-lab`, `r-studio` |
| 4 | ErrorType | Action | `400_bad_request`, `quota_exceeded` |

## 5. Implementation Roadmap
*   **Phase 1 — Core Core Events (Done)**: Auth, Workspace, Data, Session foundations.
*   **Phase 2 — Personas & Categories**: Derive persona from roles, map app categories.
*   **Phase 3 — Performance & Errors**: Web Vitals, UI/API error hashing.
*   **Phase 4 — Funnels**: Measure Dashboard → Workspace Create → Session Start.
