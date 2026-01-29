# Event Taxonomy

## Naming Convention
*   **Category**: Functional Area (PascalCase) e.g., `Workspace`, `Auth`, `Data`
*   **Action**: Specific Action or Lifecycle Event (PascalCase) e.g., `Create`, `Launch`, `Upload`
*   **Name**: Outcome or specific context (PascalCase/SnakeCase) e.g., `Start`, `Success`, `Failure`, `Click`, `Form_Error`

## Standard Events Definition

### Authentication & User (`Auth`)
| Category | Action | Name | Description | Value (Optional) |
| :--- | :--- | :--- | :--- | :--- |
| `Auth` | `Signup` | `Start` | User clicked sign-up button | - |
| `Auth` | `Signup` | `Submit` | User submitted sign-up form | - |
| `Auth` | `Signup` | `Error` | Form validation/submission error | Error Code |
| `Auth` | `Signup` | `Success` | Registration successful | - |
| `Auth` | `Login` | `Success` | Successful login | - |
| `Auth` | `Logout` | `Click` | User logged out | - |

### Workspace (`Workspace`)
| Category | Action | Name | Value / Custom Dim |
| :--- | :--- | :--- | :--- |
| `Workspace` | `Create` | `Start` | - |
| `Workspace` | `Create` | `Success` | Workspace ID (Dim) |
| `Workspace` | `Create` | `Error` | Error Type |
| `Workspace` | `Delete` | `Success` | - |

### Data Management (`Data`)
| Category | Action | Name | Value / Custom Dim |
| :--- | :--- | :--- | :--- |
| `Data` | `Upload` | `Start` | File Size (Bytes) |
| `Data` | `Upload` | `Success` | - |
| `Data` | `Upload` | `Error` | - |

### Compute & Sessions (`Session`, `AppInstance`)
| Category | Action | Name | Value / Custom Dim |
| :--- | :--- | :--- | :--- |
| `Session` | `Launch` | `Start` | - |
| `Session` | `Launch` | `Success` | Session ID (Dim) |
| `Session` | `Terminate`| `Click` | Duration (sec) - *Calculated* |
| `AppInstance`| `Launch` | `Success` | - |
| `User` | `Consent` | `Update` | Status (`true`/`false`) |

### System & Performance (`System`)
| Category | Action | Name | Description | Value |
| :--- | :--- | :--- | :--- | :--- |
| `System` | `Warning` | `Quota` | Quota warning displayed | Type (storage/compute) |
| `System` | `Error` | `UI` | Frontend runtime error | Message Hash |
| `System` | `Performance`| `WebVitals`| Core web vitals metrics | LCP/CLS/TTFB (ms) |

## Custom Dimensions Mapping
*Ensure these are configured in the Matomo Interface first.*

| Index (ID) | Name | Scope | Example Value |
| :--- | :--- | :--- | :--- |
| 1 | UserRole | Visit | `Researcher`, `Admin` |
| 2 | WorkspaceID | Action | `ws-12345` |
| 3 | AppRef | Action | `jupyter-lab`, `r-studio` |
| 4 | ErrorType | Action | `400_bad_request`, `quota_exceeded` |
