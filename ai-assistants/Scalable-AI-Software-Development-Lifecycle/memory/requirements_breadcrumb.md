# Requirements

## Universal Breadcrumb & Navigation
**Status:** In Progress (Stage 1)

### User Story
As a user, I want a clear breadcrumb navigation in the header of every page so that I can easily understand my location in the application hierarchy and navigate back to parent resources (e.g., from a Session back to a Workspace).

### Functional Requirements
1. **Accessibility**: The breadcrumb must be visible on ALL pages, including those displaying iframes (Sessions, Webapps).
2. **Hierarchy**: It should show the path: `Home > [Workspace Name] > [Session Name/App Name]`.
3. **Interactivity**: Each segment of the breadcrumb (except the last one) should be a clickable link.
4. **Consistency**: The header bar styling must be consistent across the entire application.

### Technical Constraints
- The `isIFramePage` logic currently hides the header bar to maximize space. We need to find a balance or unify the layouts.
- Dynamic naming: We need to resolve IDs in the URL to human-readable names (Workspaces store, etc.).

### Acceptance Criteria
- [ ] Header bar containing the breadcrumb is visible on the Dashboard.
- [ ] Header bar containing the breadcrumb is visible on a Session page.
- [ ] Breadcrumb correctly reflects the current URL structure.
- [ ] Clicking segments navigates the user correctly.
- [ ] Iframe height on session pages is adjusted to accommodate the header without breaking.
