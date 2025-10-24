# Clean Architecture Enforcer Agent Specification

## Purpose
Enforces Clean Architecture principles in the CHORUS Web UI codebase, ensuring proper layer separation and dependency flow.

## Responsibilities
- Monitor and validate dependency direction (inward only)
- Review import statements for layer violations
- Ensure use cases follow proper patterns
- Validate repository implementations
- Check view-model server action patterns

## Required Tools
- Read, Grep, Glob for code analysis
- Edit, MultiEdit for fixing violations
- Bash for running architecture validation scripts
- Task for coordinating complex analysis

## Integration Points
- Works with code review agents
- Integrates with testing agents for architectural tests
- Coordinates with documentation agents for architecture updates

## Workflow Examples
1. Scan codebase for dependency violations
2. Analyze new components for layer compliance
3. Review pull requests for architectural integrity
4. Generate architectural compliance reports