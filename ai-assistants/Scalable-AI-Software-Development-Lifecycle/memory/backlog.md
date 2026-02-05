# Product Backlog

## 🚨 High Priority (AMLD & Critical Fixes)

### AMLD Workshop Readiness
- [ ] **[Data]** Fix upload and refresh of datasets issues (Source: AMLD)
    - *Context: Critical for workshop participants.*
- [ ] **[Analytics]** Integrate Matomo metrics for user action tracking
    - [ ] **Phase 2**: Map personas from roles and app categories from metadata.
    - [ ] **Phase 3**: Capture Web Vitals (LCP, CLS, TTFB) and UI/API error hashing.
    - [ ] **Phase 4**: Configure Funnels (Dashboard -> Workspace -> Session).
- [ ] **[UX]** Refine user journey for the specific AMLD use case (Source: AMLD)
- [ ] **[Sessions]** Use cards for session listing.
- [ ] **[Notifications]** Handle refresh token for notifications.

### Critical Bugs
- [ ] **[Forms]** Fix: Forms are quitting/resetting when content is updated (Potential Zustand/Context issue).
- [ ] **[Sessions]** Fix: Session edits are not working.
- [ ] **[Markdown]** Fix: Markdown save doesn't work when creating.
- [ ] **[Markdown]** Fix: Markdown preview doesn't work.
- [ ] **[Sessions]** Fix: Session not showing after creation (requires refresh).
- [ ] **[Bug]** Fix: Xpra navigation bar takes full width and masks apps.
- [ ] **[Workspaces]** Fix: Workspace creation requires manual refresh.

## 📦 Features & Improvements

### Data Management
- [ ] Interface to move data between workspaces.
- [ ] Folder upload capability.
- [UR.2] Upload large files (>50GB) with progress feedback.
- [UR.8] Secure transfer between workspaces without local download.
- [UR.9] Request authorization to download files locally.

### Workspace & Permissions
- [ ] **[Store]** Harmonize global, user, and workspace stores (local vs server config).
- [ ] **[Tags]** Rename/Refactor `tag` to `tags` everywhere.
- [ ] **[Admin]** Interface to manage members (add/remove) and list user roles.
- [ ] **[Workspaces]** Create workspace directly on dashboard.
- [ ] **[Sessions]** Display session names everywhere (instead of technical IDs/placeholders).
- [ ] **[Apps]** Find a better way to start apps.
- [ ] **[Apps]** Reload state for app instances.
- [UR.4] Workspace creation assistant (storage/security config).
- [UR.13] RBAC interface for granular permissions.
- [UR.17] Admin interface to edit/delete workspaces.

### UI/UX Polish
- [ ] Restore "Loading" state on iframes.
- [ ] Restore breadcrumbs and styles.
- [ ] **[Help]** Fix "Help" display (Z-index/Overlay issue).
- [ ] **[Login]** Remove app store hero or simplify it.
- [ ] **[Login]** Fix forms visibility on login page.
- [ ] **[Sessions]** Create session: get rid of the app image in the chooser.
- [ ] **[UI]** Add documentation panel on the right.
- [ ] **[Mobile]** Ensure responsive design (min 360px) [UR.16].
- [ ] **[Nav]** Tab/Windowing system for open apps [UR.15, UR.12].
- [UR.1] High Performance: Initial load < 5s.
- [UR.3] Clear, understandable error messages with suggested actions.
- [UR.6] Personal Dashboard (Workspaces, Recent, Notifications).
- [UR.7] Public Workspace Directory with filtering.
- [UR.5] Admin: Custom Logo and Theme options.
- [UR.10] Approver Interface: Validate/Refuse download requests.
- [UR.11] Admin: Audit Log interface.
- [UR.14] "My Data" page listing user access.

## 💡 Ideas & Research (Bookmarks)

### Concepts
- **PHI**: Personal Health Information handling.
- **FAIR**: Implementation of FAIR principles.
- **Social Network for Science**: Long term vision.
- **Chorus Light**: Feature store, synthetic data generator.

### References
- [Tehdas (Health Data)](https://tehdas.eu/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [React Markdown](https://remarkjs.github.io/react-markdown/)
- [Flower (Federated Learning)](https://flower.ai/docs/framework/tutorial-series-what-is-federated-learning.html)
- [Private AI](https://docs.privateaim.net/)
- [EBRAINS Permissions](https://docs.kg.ebrains.eu/8387ccd27a186dea3dd0b949dc528842/permissions.html#invitations)
- [Marmot Graph](https://marmotgraph.org/?qr#/ecosystem)
- [Open Metadata](https://github.com/openMetadataInitiative)
- [MindsDB](https://mindsdb.com/open-source-federated-data-engine-for-ai)
- [Dice UI](https://www.diceui.com/)
- [Kibo UI](https://www.kibo-ui.com/blocks/codebase)
- [Shadcn Kanban](https://www.shadcn.io/components/data/kanban)
