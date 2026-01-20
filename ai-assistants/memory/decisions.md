# Decisions Log

| Date | ID | Decision | Context | Status |
| :--- | :--- | :--- | :--- | :--- |
| 2026-01-20 | DEC-001 | Use `useDevStoreCache` for global UI state | TypeScript errors when accessing `isUserLoaded` from `useAppState`. Centralized persistent cache is more reliable for user-specific settings. | Implemented |
| 2026-01-20 | DEC-002 | Global Cookie Consent Control | Moved cookie consent state to `useDevStoreCache` to allow opening the popup from the Privacy Settings page at any time. | Implemented |
| 2026-01-20 | DEC-003 | IP Anonymization (2 bytes) | Standardized IP masking in `RootLayout` script to comply with Swiss FADP/GDPR standards. | Implemented |
