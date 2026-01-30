# GitHub Project Workflow Migration Guide

## Overview
This guide documents strategies and methods for migrating GitHub Projects (v2) and their associated automated workflows to new projects, with specific focus on maintaining automation consistency across multiple repositories.

## Table of Contents
1. [Project Copy vs Migration](#project-copy-vs-migration)
2. [Built-in Project Workflows](#built-in-project-workflows)
3. [GitHub Actions Workflows](#github-actions-workflows)
4. [Cross-Repository Workflow Automation](#cross-repository-workflow-automation)
5. [Best Practices](#best-practices)
6. [Common Pitfalls](#common-pitfalls)

---

## Project Copy vs Migration

### Using GitHub UI/CLI to Copy Projects

**Easiest Method**: GitHub provides a built-in copy feature that preserves most project configuration.

#### What Gets Copied:
- Fields (custom fields, status fields)
- Views (table, board, roadmap)
- Configured built-in workflows
- Insights configuration
- Draft items (optional)

#### What Does NOT Get Copied:
- Activity history
- Automation via GitHub Actions
- Triage settings

#### Via GitHub UI:
1. Navigate to the project you want to copy
2. Click the three dots (•••) menu
3. Select "Make a copy"
4. Set the Owner (user or organization)
5. Name the new project
6. Choose whether to copy draft issues
7. Click "Copy project"

#### Via GitHub CLI:
```bash
gh project copy <SOURCE_PROJECT_NUMBER> \
  --source-owner <SOURCE_OWNER> \
  --target-owner <TARGET_OWNER> \
  --title "New Project Name"
```

**Example:**
```bash
gh project copy 1 \
  --source-owner PF-TeamBAIV \
  --target-owner PF-Core-BAIV \
  --title "BAIV Assessment Workflows"
```

---

## Built-in Project Workflows

### Overview
GitHub Projects v2 includes built-in workflows that automatically update item status based on events.

### Default Built-in Workflows:
1. **Auto-archive items**: Archive items when they meet specific criteria
2. **Auto-add items**: Automatically add items from a repository when they match a filter
3. **Status automation**:
   - Set status to "Done" when issues/PRs are closed
   - Set status to "Done" when PRs are merged
   - Set status to "Todo" when items are added

### Configuring Built-in Workflows:
1. Open your project
2. Click on "⋯" menu → "Workflows"
3. Enable/configure desired workflows
4. Set triggers and target status values

### Limitations:
- Limited customization options
- Cannot trigger on custom field changes
- No complex conditional logic
- Built-in workflows are **project-specific** and must be reconfigured after copying

---

## GitHub Actions Workflows

### Repository-Level Automation
GitHub Actions workflows provide more powerful automation but are **repository-specific**, not project-specific.

### Key Principle:
> A project can span multiple repositories, but a workflow is specific to a repository. You must add the workflow to each repository that you want your project to track.

### Basic Project Automation Workflow

Create `.github/workflows/project-automation.yml` in each repository:

```yaml
name: Add Issues to Project

on:
  issues:
    types: [opened, reopened]
  pull_request:
    types: [opened, review_requested]

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - name: Add to project
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/<ORG>/projects/<NUMBER>
          github-token: ${{ secrets.PROJECT_TOKEN }}
```

### Authentication Requirements

#### Option 1: Personal Access Token (Recommended for User Projects)
1. Create a PAT with `project` and `repo` scopes
2. Add as repository/organization secret (e.g., `PROJECT_TOKEN`)
3. Reference in workflow: `${{ secrets.PROJECT_TOKEN }}`

#### Option 2: GitHub App (Recommended for Organization Projects)
1. Create or use existing GitHub App
2. Grant read/write permissions to organization projects
3. Install app in organization for all relevant repositories
4. Store App ID as configuration variable
5. Store private key as secret
6. Reference in workflow with app authentication

### Advanced Project Automation

For more complex automation, use third-party actions:

#### leonsteinhaeuser/project-beta-automations
```yaml
name: Project Automations

on:
  issues:
    types: [opened, reopened, closed]
  pull_request:
    types: [opened, reopened, review_requested, closed]

env:
  todo: "Todo ✏️"
  done: "Done ✅"
  in_progress: "In Progress 🚧"

jobs:
  issue_opened:
    runs-on: ubuntu-latest
    if: github.event_name == 'issues' && github.event.action == 'opened'
    steps:
      - name: Move issue to ${{ env.todo }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ secrets.PROJECT_TOKEN }}
          organization: PF-Core-BAIV
          project_id: 1
          resource_node_id: ${{ github.event.issue.node_id }}
          status_value: ${{ env.todo }}

  issue_closed:
    runs-on: ubuntu-latest
    if: github.event_name == 'issues' && github.event.action == 'closed'
    steps:
      - name: Move issue to ${{ env.done }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ secrets.PROJECT_TOKEN }}
          organization: PF-Core-BAIV
          project_id: 1
          resource_node_id: ${{ github.event.issue.node_id }}
          status_value: ${{ env.done }}
```

---

## Cross-Repository Workflow Automation

### Challenge
When you have multiple repositories that should use the same project automation workflows, manually copying workflow files to each repository is inefficient and error-prone.

### Solution 1: Composite Actions (Recommended)

Create a shared repository for reusable actions:

**Structure:**
```
shared-workflows/
├── project-automation/
│   └── action.yml
└── issue-linking/
    └── action.yml
```

**Shared Action (`shared-workflows/project-automation/action.yml`):**
```yaml
name: 'Project Automation'
description: 'Add issues/PRs to project board'

inputs:
  project-number:
    description: 'Project number'
    required: true
  organization:
    description: 'Organization name'
    required: true
  gh-token:
    description: 'GitHub token with project access'
    required: true

runs:
  using: 'composite'
  steps:
    - name: Add to project
      uses: actions/add-to-project@v0.5.0
      with:
        project-url: https://github.com/orgs/${{ inputs.organization }}/projects/${{ inputs.project-number }}
        github-token: ${{ inputs.gh-token }}
      shell: bash
```

**Using the Shared Action in Each Repository:**
```yaml
name: Project Automation

on:
  issues:
    types: [opened]

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - name: Run project automation
        uses: PF-Core-BAIV/shared-workflows/project-automation@v1.0.0
        with:
          project-number: 1
          organization: PF-Core-BAIV
          gh-token: ${{ secrets.PROJECT_TOKEN }}
```

### Solution 2: Reusable Workflows

**Shared Workflow (`.github/workflows/project-automation.yml` in shared repo):**
```yaml
name: Reusable Project Automation

on:
  workflow_call:
    inputs:
      project-number:
        required: true
        type: number
      organization:
        required: true
        type: string
    secrets:
      token:
        required: true

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/${{ inputs.organization }}/projects/${{ inputs.project-number }}
          github-token: ${{ secrets.token }}
```

**Calling Reusable Workflow:**
```yaml
name: Project Automation

on:
  issues:
    types: [opened]

jobs:
  call-shared-workflow:
    uses: PF-Core-BAIV/shared-workflows/.github/workflows/project-automation.yml@main
    with:
      project-number: 1
      organization: PF-Core-BAIV
    secrets:
      token: ${{ secrets.PROJECT_TOKEN }}
```

### Solution 3: Workflow Files Sync Action

For syncing entire workflow files across repositories:

```yaml
name: Sync Workflow Files

on:
  push:
    branches: [main]
    paths:
      - '.github/workflows/project-automation.yml'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source
        uses: actions/checkout@v3
      
      - name: Sync to multiple repos
        uses: varunsridharan/action-github-workflow-sync@main
        with:
          repositories: |
            PF-Core-BAIV/repo1
            PF-Core-BAIV/repo2
            PF-Core-BAIV/repo3
          workflow-files: |
            .github/workflows/project-automation.yml
          github-token: ${{ secrets.WORKFLOW_SYNC_TOKEN }}
```

---

## Best Practices

### 1. Centralize Workflow Configuration
- Store shared workflow logic in a central repository
- Use composite actions or reusable workflows
- Version your shared workflows (tags/releases)

### 2. Project Configuration as Code
- Document project field configurations
- Script project setup using GitHub CLI or GraphQL API
- Store configuration in version control

### 3. Authentication Security
- Use GitHub Apps for organization-level projects
- Limit PAT scopes to minimum required permissions
- Enable SAML SSO for PATs when required
- Store tokens as organization secrets when possible

### 4. Testing Workflow Changes
- Test workflow changes in a dedicated test project first
- Use `workflow_dispatch` for manual testing
- Monitor workflow runs for errors

### 5. Documentation
- Document project number and organization for each project
- Maintain a mapping of which repositories use which projects
- Document custom status field values and their meanings

### 6. Migration Checklist
When migrating a project:
- [ ] Copy project using UI/CLI
- [ ] Reconfigure built-in workflows
- [ ] Update project numbers in GitHub Actions workflows
- [ ] Update organization/owner references
- [ ] Test automation with a draft issue/PR
- [ ] Verify custom field configurations
- [ ] Update project URLs in documentation
- [ ] Configure auto-add filters if needed

---

## Common Pitfalls

### 1. Forgotten Repository-Specific Workflows
**Problem**: Copying a project doesn't copy GitHub Actions workflows to repositories.
**Solution**: Maintain a list of all repositories that should have project automation and deploy workflows to each.

### 2. Hardcoded Project Numbers
**Problem**: Project numbers change when copying projects.
**Solution**: Use environment variables or workflow inputs for project numbers.

### 3. Insufficient Token Permissions
**Problem**: `GITHUB_TOKEN` doesn't have project access.
**Solution**: Always use a PAT or GitHub App with project permissions.

### 4. SAML Enforcement Issues
**Problem**: Organization requires SSO for PATs.
**Solution**: Enable SSO when creating the PAT.

### 5. Built-in Workflow Limitations
**Problem**: Built-in workflows can't handle complex logic.
**Solution**: Use GitHub Actions for advanced automation requirements.

### 6. Cross-Repository Access
**Problem**: Workflows triggered by forked PRs can't access secrets.
**Solution**: Use `pull_request_target` instead of `pull_request` (with caution).

---

## GraphQL API for Advanced Migration

For complex migrations or bulk operations, use the GitHub GraphQL API:

### Get Project ID and Field Information
```bash
gh api graphql -f query='
  query {
    organization(login: "PF-Core-BAIV") {
      projectV2(number: 1) {
        id
        field(name: "Status") {
          ... on ProjectV2SingleSelectField {
            id
            options {
              id
              name
            }
          }
        }
      }
    }
  }
'
```

### Add Item to Project
```bash
project_id="PVT_kwDOABc..." # From above query
item_id="I_kwDOABc..."      # Issue/PR node_id

gh api graphql -f query='
  mutation {
    addProjectV2ItemById(input: {
      projectId: "'$project_id'"
      contentId: "'$item_id'"
    }) {
      item {
        id
      }
    }
  }
'
```

---

## Integration with PF-Core Agent System

### Agent-Specific Labels
When implementing project automation for the PF-Core agent system, use labels to filter by agent responsibility:

```yaml
name: Agent-Aware Project Automation

on:
  issues:
    types: [opened, labeled]

jobs:
  route-to-agent-project:
    runs-on: ubuntu-latest
    steps:
      - name: Route to Discovery Cluster
        if: contains(github.event.issue.labels.*.name, 'cluster:discovery')
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/PF-Core-BAIV/projects/1
          github-token: ${{ secrets.PROJECT_TOKEN }}
      
      - name: Route to OAA Agent
        if: contains(github.event.issue.labels.*.name, 'agent:oaa')
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/PF-Core-BAIV/projects/2
          github-token: ${{ secrets.PROJECT_TOKEN }}
```

---

## Resources

### Official Documentation
- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Automating Projects Using Actions](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/automating-projects-using-actions)
- [Built-in Automations](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations)

### GitHub CLI
- [gh project commands](https://cli.github.com/manual/gh_project)

### Useful Actions
- [actions/add-to-project](https://github.com/actions/add-to-project)
- [leonsteinhaeuser/project-beta-automations](https://github.com/leonsteinhaeuser/project-beta-automations)

---

## Version History
- **v1.0.0** (2026-01-23): Initial documentation for GitHub Project workflow migration strategies

## Related Documentation
- See also: `Git-Repository-Setup-And-Sync-Procedure.md` for repository setup procedures
- GitHub Issue Automation Strategy (Rule: v6Rz03wevwmj7LgZ0N17qR)

---

**Maintained by**: PF-TeamBAIV  
**Last Updated**: 2026-01-23
