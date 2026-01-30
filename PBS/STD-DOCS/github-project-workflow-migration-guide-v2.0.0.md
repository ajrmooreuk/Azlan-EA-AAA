# GitHub Project Workflow Migration Guide v2.0.0

## Document Control
- **Version**: 2.0.0
- **Last Updated**: 2026-01-23
- **Maintained by**: PF-Core-BAIV
- **Change Control**: This document is a change-controlled artifact in the registry

## Version History
- **v2.0.0** (2026-01-23): Complete rewrite focused on practical workflow automation migration. Addressed issue that v1.0.0 explained problems but didn't provide sufficient actionable solutions.
- **v1.0.0** (2026-01-23): Initial documentation (deprecated - inadequate solution coverage)

---

## Overview

This guide provides **actionable, step-by-step methods** for migrating GitHub Projects and their workflow automations to new projects. The key challenge: **GitHub's project copy feature doesn't migrate GitHub Actions automations**, so you need practical strategies to replicate automation across projects.

## The Real Problem

When you copy a GitHub Project:
- ✅ Fields, views, built-in workflows copy
- ❌ GitHub Actions workflows DO NOT copy
- ❌ Repository-level automation stays with original repos

**This guide solves that problem.**

---

## Table of Contents

1. [Quick Start: Complete Migration Process](#quick-start-complete-migration-process)
2. [Method 1: Document & Replicate (Manual but Reliable)](#method-1-document--replicate-manual-but-reliable)
3. [Method 2: Shared Workflow Templates (Scalable)](#method-2-shared-workflow-templates-scalable)
4. [Method 3: GraphQL API Automation (Advanced)](#method-3-graphql-api-automation-advanced)
5. [Built-in Workflow Migration](#built-in-workflow-migration)
6. [Practical Examples](#practical-examples)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start: Complete Migration Process

### Step-by-Step Migration Checklist

#### Phase 1: Copy the Project Structure
```bash
# 1. Copy the project (fields, views, built-in workflows)
gh project copy <SOURCE_NUMBER> \
  --source-owner <SOURCE_ORG> \
  --target-owner <TARGET_ORG> \
  --title "New Project Name"

# 2. Note the new project number from output
NEW_PROJECT_NUMBER=<number>
```

#### Phase 2: Document Current Automation
```bash
# 3. List all repositories connected to source project
# Visit: https://github.com/orgs/<ORG>/projects/<OLD_NUMBER>
# Note which repos have issues/PRs in the project

# 4. For each repository, check for project automation workflows
for repo in repo1 repo2 repo3; do
  gh api repos/<ORG>/$repo/contents/.github/workflows --jq '.[].name'
done
```

#### Phase 3: Migrate Built-in Workflows
```bash
# 5. Open new project settings
# https://github.com/orgs/<ORG>/projects/<NEW_NUMBER>/settings

# 6. Go to "Workflows" section
# 7. Manually reconfigure each built-in workflow:
#    - Auto-archive: Set your criteria
#    - Auto-add: Set repository filters
#    - Status changes: Configure status mappings
```

#### Phase 4: Migrate GitHub Actions Workflows
**Choose one approach:**
- [Method 1: Manual replication](#method-1-document--replicate-manual-but-reliable) (10-30 min per repo)
- [Method 2: Shared templates](#method-2-shared-workflow-templates-scalable) (1 hour setup, 2 min per repo)
- [Method 3: API automation](#method-3-graphql-api-automation-advanced) (2-3 hours setup, automated)

---

## Method 1: Document & Replicate (Manual but Reliable)

**Best for**: 1-5 repositories, one-time migration, need full control

### Step 1: Document Existing Automation

Create a migration inventory file:

```bash
# Create inventory
cat > project-automation-inventory.md << 'EOF'
# Project Automation Inventory

## Source Project
- **Project**: Old Project Name
- **Number**: 1
- **URL**: https://github.com/orgs/ORG/projects/1

## Target Project  
- **Project**: New Project Name
- **Number**: 5
- **URL**: https://github.com/orgs/ORG/projects/5

## Repositories with Automation

### Repo: example-repo-1
- **Workflow File**: `.github/workflows/project-automation.yml`
- **Triggers**: issues (opened, reopened, closed), pull_request (opened, closed)
- **Actions**: Add to project, set status
- **Status Mappings**:
  - Issue opened → "Todo"
  - Issue closed → "Done"
  - PR opened → "In Progress"
  - PR merged → "Done"

### Repo: example-repo-2
...

EOF
```

### Step 2: Extract Workflow Files

```bash
# For each repository, download the workflow file
ORG="your-org"
REPO="example-repo"

gh api repos/$ORG/$REPO/contents/.github/workflows/project-automation.yml \
  --jq '.content' | base64 -d > old-workflow-${REPO}.yml
```

### Step 3: Update Project Numbers

```bash
# Create updated workflow with new project number
OLD_PROJECT="1"
NEW_PROJECT="5"

# Simple find-replace
sed "s/project_id: ${OLD_PROJECT}/project_id: ${NEW_PROJECT}/g" \
  old-workflow-${REPO}.yml > new-workflow-${REPO}.yml

# Or for URL-based workflows
sed "s/projects\/${OLD_PROJECT}/projects\/${NEW_PROJECT}/g" \
  old-workflow-${REPO}.yml > new-workflow-${REPO}.yml
```

### Step 4: Deploy Updated Workflows

For each repository:

```bash
REPO="example-repo"
BRANCH="feature/update-project-automation"

# Create branch
gh api repos/$ORG/$REPO/git/refs/heads/main --jq '.object.sha' | \
  xargs -I {} gh api repos/$ORG/$REPO/git/refs \
  -f ref="refs/heads/${BRANCH}" -f sha="{}"

# Update workflow file
gh api repos/$ORG/$REPO/contents/.github/workflows/project-automation.yml \
  -X PUT \
  -f message="Update project automation to new project #${NEW_PROJECT}" \
  -f content="$(base64 < new-workflow-${REPO}.yml)" \
  -f branch="${BRANCH}" \
  -f sha="$(gh api repos/$ORG/$REPO/contents/.github/workflows/project-automation.yml --jq '.sha')"

# Create PR
gh pr create --repo $ORG/$REPO \
  --base main \
  --head ${BRANCH} \
  --title "Update project automation to new project" \
  --body "Migrating from Project #${OLD_PROJECT} to Project #${NEW_PROJECT}"
```

---

## Method 2: Shared Workflow Templates (Scalable)

**Best for**: 5+ repositories, ongoing project creation, standardized automation

### Architecture

```
shared-workflows/ (central repository)
├── .github/workflows/
│   └── reusable-project-automation.yml
└── composite-actions/
    └── project-automation/
        └── action.yml

repo1/.github/workflows/
└── project-automation.yml (calls shared workflow)

repo2/.github/workflows/
└── project-automation.yml (calls shared workflow)
```

### Step 1: Create Shared Reusable Workflow

Create `shared-workflows/.github/workflows/reusable-project-automation.yml`:

```yaml
name: Reusable Project Automation

on:
  workflow_call:
    inputs:
      project-number:
        required: true
        type: number
        description: 'GitHub Project number'
      organization:
        required: true
        type: string
        description: 'Organization name'
      status-todo:
        required: false
        type: string
        default: 'Todo'
      status-in-progress:
        required: false
        type: string
        default: 'In Progress'
      status-done:
        required: false
        type: string
        default: 'Done'
    secrets:
      project-token:
        required: true

jobs:
  issue-opened:
    if: github.event_name == 'issues' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/${{ inputs.organization }}/projects/${{ inputs.project-number }}
          github-token: ${{ secrets.project-token }}
      
      - uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ secrets.project-token }}
          organization: ${{ inputs.organization }}
          project_id: ${{ inputs.project-number }}
          resource_node_id: ${{ github.event.issue.node_id }}
          status_value: ${{ inputs.status-todo }}

  issue-closed:
    if: github.event_name == 'issues' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ secrets.project-token }}
          organization: ${{ inputs.organization }}
          project_id: ${{ inputs.project-number }}
          resource_node_id: ${{ github.event.issue.node_id }}
          status_value: ${{ inputs.status-done }}

  pr-opened:
    if: github.event_name == 'pull_request' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/${{ inputs.organization }}/projects/${{ inputs.project-number }}
          github-token: ${{ secrets.project-token }}
      
      - uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ secrets.project-token }}
          organization: ${{ inputs.organization }}
          project_id: ${{ inputs.project-number }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ inputs.status-in-progress }}

  pr-merged:
    if: github.event_name == 'pull_request' && github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ secrets.project-token }}
          organization: ${{ inputs.organization }}
          project_id: ${{ inputs.project-number }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ inputs.status-done }}
```

### Step 2: Deploy to Each Repository

Create minimal workflow in each repo (`.github/workflows/project-automation.yml`):

```yaml
name: Project Automation

on:
  issues:
    types: [opened, reopened, closed]
  pull_request:
    types: [opened, closed, reopened]

jobs:
  automate:
    uses: PF-Core-BAIV/shared-workflows/.github/workflows/reusable-project-automation.yml@main
    with:
      project-number: 5  # ← ONLY THING TO CHANGE PER PROJECT
      organization: PF-Core-BAIV
      status-todo: 'Todo'
      status-in-progress: 'In Progress'
      status-done: 'Done'
    secrets:
      project-token: ${{ secrets.PROJECT_TOKEN }}
```

### Step 3: Bulk Deployment Script

```bash
#!/bin/bash
# deploy-project-automation.sh

ORG="PF-Core-BAIV"
PROJECT_NUMBER="5"
REPOS=(
  "repo1"
  "repo2"
  "repo3"
  "repo4"
)

WORKFLOW_CONTENT=$(cat << EOF
name: Project Automation

on:
  issues:
    types: [opened, reopened, closed]
  pull_request:
    types: [opened, closed, reopened]

jobs:
  automate:
    uses: ${ORG}/shared-workflows/.github/workflows/reusable-project-automation.yml@main
    with:
      project-number: ${PROJECT_NUMBER}
      organization: ${ORG}
    secrets:
      project-token: \${{ secrets.PROJECT_TOKEN }}
EOF
)

for REPO in "${REPOS[@]}"; do
  echo "Deploying to ${REPO}..."
  
  # Create/update workflow file
  gh api repos/${ORG}/${REPO}/contents/.github/workflows/project-automation.yml \
    -X PUT \
    -f message="Add project automation for Project #${PROJECT_NUMBER}" \
    -f content="$(echo "$WORKFLOW_CONTENT" | base64)" \
    -f branch="main" \
    2>/dev/null || \
  gh api repos/${ORG}/${REPO}/contents/.github/workflows/project-automation.yml \
    -X PUT \
    -f message="Update project automation to Project #${PROJECT_NUMBER}" \
    -f content="$(echo "$WORKFLOW_CONTENT" | base64)" \
    -f branch="main" \
    -f sha="$(gh api repos/${ORG}/${REPO}/contents/.github/workflows/project-automation.yml --jq '.sha')"
  
  echo "✓ Deployed to ${REPO}"
done

echo "Done! Deployed to ${#REPOS[@]} repositories."
```

**To migrate to a new project, just update `PROJECT_NUMBER` and run the script.**

---

## Method 3: GraphQL API Automation (Advanced)

**Best for**: Large-scale migrations (10+ repos), automated infrastructure

### Complete Migration Script

```bash
#!/bin/bash
# migrate-project-automation.sh

set -e

SOURCE_ORG="PF-TeamBAIV"
SOURCE_PROJECT_NUMBER="1"
TARGET_ORG="PF-Core-BAIV"
TARGET_PROJECT_NUMBER="5"

echo "=== GitHub Project Automation Migration ==="
echo "From: ${SOURCE_ORG}/Project#${SOURCE_PROJECT_NUMBER}"
echo "To: ${TARGET_ORG}/Project#${TARGET_PROJECT_NUMBER}"
echo

# Step 1: Get source project info
echo "📊 Fetching source project details..."
SOURCE_PROJECT=$(gh api graphql -f query="
  query {
    organization(login: \"${SOURCE_ORG}\") {
      projectV2(number: ${SOURCE_PROJECT_NUMBER}) {
        id
        title
        fields(first: 20) {
          nodes {
            ... on ProjectV2SingleSelectField {
              name
              options {
                id
                name
              }
            }
          }
        }
      }
    }
  }
")

echo "✓ Source project fetched"

# Step 2: Get target project info
echo "📊 Fetching target project details..."
TARGET_PROJECT=$(gh api graphql -f query="
  query {
    organization(login: \"${TARGET_ORG}\") {
      projectV2(number: ${TARGET_PROJECT_NUMBER}) {
        id
        title
        fields(first: 20) {
          nodes {
            ... on ProjectV2SingleSelectField {
              name
              options {
                id
                name
              }
            }
          }
        }
      }
    }
  }
")

echo "✓ Target project fetched"

# Step 3: Find repositories with items in source project
echo "🔍 Finding repositories connected to source project..."
REPOS=$(gh api graphql -f query="
  query {
    organization(login: \"${SOURCE_ORG}\") {
      projectV2(number: ${SOURCE_PROJECT_NUMBER}) {
        items(first: 100) {
          nodes {
            content {
              ... on Issue {
                repository {
                  name
                }
              }
              ... on PullRequest {
                repository {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
" | jq -r '.data.organization.projectV2.items.nodes[].content.repository.name' | sort -u)

REPO_ARRAY=($REPOS)
echo "✓ Found ${#REPO_ARRAY[@]} repositories:"
printf '  - %s\n' "${REPO_ARRAY[@]}"

# Step 4: For each repo, check for automation workflows
echo
echo "🔍 Checking for existing automation workflows..."
REPOS_WITH_AUTOMATION=()

for REPO in "${REPO_ARRAY[@]}"; do
  HAS_WORKFLOW=$(gh api repos/${SOURCE_ORG}/${REPO}/contents/.github/workflows \
    --jq '.[] | select(.name | contains("project")) | .name' 2>/dev/null || echo "")
  
  if [ -n "$HAS_WORKFLOW" ]; then
    REPOS_WITH_AUTOMATION+=("$REPO")
    echo "  ✓ ${REPO}: Found automation workflows"
  else
    echo "  ○ ${REPO}: No automation workflows"
  fi
done

# Step 5: Update workflows in repositories
echo
echo "🔄 Updating automation workflows..."

for REPO in "${REPOS_WITH_AUTOMATION[@]}"; do
  echo
  echo "Processing ${REPO}..."
  
  # Get workflow files
  WORKFLOW_FILES=$(gh api repos/${SOURCE_ORG}/${REPO}/contents/.github/workflows \
    --jq '.[] | select(.name | contains("project")) | .name')
  
  for WORKFLOW_FILE in $WORKFLOW_FILES; do
    echo "  📄 ${WORKFLOW_FILE}"
    
    # Get current content
    CURRENT_CONTENT=$(gh api repos/${SOURCE_ORG}/${REPO}/contents/.github/workflows/${WORKFLOW_FILE} \
      --jq '.content' | base64 -d)
    
    # Replace project references
    UPDATED_CONTENT=$(echo "$CURRENT_CONTENT" | \
      sed "s/project_id: ${SOURCE_PROJECT_NUMBER}/project_id: ${TARGET_PROJECT_NUMBER}/g" | \
      sed "s/projects\/${SOURCE_PROJECT_NUMBER}/projects\/${TARGET_PROJECT_NUMBER}/g" | \
      sed "s/${SOURCE_ORG}/${TARGET_ORG}/g")
    
    # Check if content changed
    if [ "$CURRENT_CONTENT" != "$UPDATED_CONTENT" ]; then
      echo "  ✏️  Updating workflow..."
      
      # Get current SHA
      CURRENT_SHA=$(gh api repos/${SOURCE_ORG}/${REPO}/contents/.github/workflows/${WORKFLOW_FILE} \
        --jq '.sha')
      
      # Update file
      gh api repos/${SOURCE_ORG}/${REPO}/contents/.github/workflows/${WORKFLOW_FILE} \
        -X PUT \
        -f message="chore: Migrate project automation from ${SOURCE_ORG}#${SOURCE_PROJECT_NUMBER} to ${TARGET_ORG}#${TARGET_PROJECT_NUMBER}" \
        -f content="$(echo "$UPDATED_CONTENT" | base64)" \
        -f sha="${CURRENT_SHA}" \
        -f branch="main" >/dev/null
      
      echo "  ✓ Updated"
    else
      echo "  ○ No changes needed"
    fi
  done
done

echo
echo "=== Migration Complete ==="
echo "Updated ${#REPOS_WITH_AUTOMATION[@]} repositories"
```

Save as `migrate-project-automation.sh`, chmod +x, and run:

```bash
./migrate-project-automation.sh
```

---

## Built-in Workflow Migration

Built-in workflows **DO** copy with the project, but you should verify and adjust them:

### Verification Checklist

```bash
# 1. Open new project workflows settings
open "https://github.com/orgs/<ORG>/projects/<NEW_NUMBER>/settings/workflows"

# 2. Check each workflow:
```

**Auto-archive items:**
- ✓ Verify status conditions match your new project's status field
- ✓ Test with a draft issue

**Auto-add items:**
- ✓ Update repository filters if different repos should be tracked
- ✓ Verify label/milestone filters still apply

**Item closed → Done:**
- ✓ Verify "Done" status exists in new project
- ✓ Adjust status name if different

**Pull request merged → Done:**
- ✓ Same verification as above

### Manual Reconfiguration Steps

If workflows didn't copy correctly:

1. **Auto-archive**:
   ```
   Workflows → Add workflow → Auto-archive items
   Set: Status = Done (for 7 days)
   ```

2. **Auto-add from repository**:
   ```
   Workflows → Add workflow → Auto-add to project
   Filters: is:issue is:open repo:<org>/<repo>
   ```

3. **Status automation**:
   ```
   Workflows → Default workflows
   Enable: "When issue/PR closed, set status to Done"
   Enable: "When PR merged, set status to Done"
   ```

---

## Practical Examples

### Example 1: Migrate Single Project, 3 Repos

```bash
# 1. Copy project
gh project copy 1 --source-owner OldOrg --target-owner NewOrg --title "Sprint Board"
# Output: Created project NewOrg#5

# 2. Update automation in each repo
NEW_PROJECT=5

for REPO in api-service frontend-app data-pipeline; do
  gh api repos/NewOrg/${REPO}/contents/.github/workflows/project-automation.yml \
    --jq '.content' | base64 -d | \
    sed "s/project_id: 1/project_id: ${NEW_PROJECT}/g" | \
    gh api repos/NewOrg/${REPO}/contents/.github/workflows/project-automation.yml \
      -X PUT \
      -f message="Update to project #${NEW_PROJECT}" \
      -f content=@- \
      -f sha="$(gh api repos/NewOrg/${REPO}/contents/.github/workflows/project-automation.yml --jq '.sha')" \
      --input -
done
```

### Example 2: Setup Shared Workflow for Future Projects

```bash
# 1. Create shared-workflows repo
gh repo create PF-Core-BAIV/shared-workflows --public

# 2. Add reusable workflow (see Method 2)
# 3. In each repo, add minimal caller workflow

# 4. Create new project in future
gh project create --owner PF-Core-BAIV --title "Q2 2026 Roadmap"
# Output: Created project #8

# 5. No need to update any automation code! Just update input:
#    project-number: 8  # ← change only this
```

### Example 3: Bulk Migration with Agent Labels

```yaml
# shared-workflows/.github/workflows/agent-aware-project-automation.yml
name: Agent-Aware Project Automation

on:
  workflow_call:
    inputs:
      discovery-project:
        type: number
        required: true
      analysis-project:
        type: number
        required: true
      oaa-project:
        type: number
        required: true

jobs:
  route-by-label:
    runs-on: ubuntu-latest
    steps:
      - name: Route to Discovery
        if: contains(github.event.issue.labels.*.name, 'cluster:discovery')
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/PF-Core-BAIV/projects/${{ inputs.discovery-project }}
          
      - name: Route to Analysis  
        if: contains(github.event.issue.labels.*.name, 'cluster:analysis')
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/PF-Core-BAIV/projects/${{ inputs.analysis-project }}
          
      - name: Route to OAA
        if: contains(github.event.issue.labels.*.name, 'agent:oaa')
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/PF-Core-BAIV/projects/${{ inputs.oaa-project }}
```

---

## Troubleshooting

### Issue: Workflow runs but items don't appear in project

**Cause**: Token permissions insufficient

**Solution**:
```bash
# Check token has 'project' scope
# Regenerate PAT with correct permissions:
# Settings → Developer settings → Personal access tokens
# Scopes: repo, project, read:org

# Update org secret
gh secret set PROJECT_TOKEN --org PF-Core-BAIV
```

### Issue: Can't find which repos have automation

**Solution**:
```bash
# Search all org repos for project automation
gh api graphql --paginate -f query='
  query($org: String!, $cursor: String) {
    organization(login: $org) {
      repositories(first: 100, after: $cursor) {
        nodes {
          name
          object(expression: "HEAD:.github/workflows") {
            ... on Tree {
              entries {
                name
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
' -f org=PF-Core-BAIV | \
jq -r '.data.organization.repositories.nodes[] | 
  select(.object.entries[]?.name | contains("project")) | 
  .name'
```

### Issue: Reusable workflow not found

**Cause**: Workflow file not in `.github/workflows/` or wrong path

**Solution**:
```bash
# Verify workflow exists and is accessible
gh api repos/PF-Core-BAIV/shared-workflows/contents/.github/workflows/reusable-project-automation.yml

# Check workflow syntax
gh workflow view reusable-project-automation.yml --repo PF-Core-BAIV/shared-workflows
```

### Issue: Items added to wrong project

**Cause**: Multiple workflows active, old project number still in code

**Solution**:
```bash
# Search all workflow files for old project number
gh api search/code -q "project_id: 1 org:PF-Core-BAIV" --jq '.items[] | .repository.name + ": " + .path'

# Update all occurrences
```

---

## Best Practices

### 1. Always Use Reusable Workflows for New Automation
- Easier to migrate in future
- Single source of truth
- Version control for automation logic

### 2. Document Project Numbers
Create `PROJECT_REGISTRY.md`:
```markdown
# Active Projects

| Project Name | Number | Purpose | Repos |
|--------------|--------|---------|-------|
| Sprint Board | 5 | Active development | api, frontend, backend |
| Backlog | 3 | Feature planning | api, frontend, backend |
| Discovery | 8 | Agent cluster | all repos |
```

### 3. Use Environment Variables
```yaml
# In caller workflows, externalize config
env:
  PROJECT_NUMBER: 5
  ORG_NAME: PF-Core-BAIV
  STATUS_TODO: 'Todo'
  STATUS_DONE: 'Done'
```

### 4. Test Before Bulk Deployment
```bash
# Test with one repo first
./deploy-project-automation.sh test-repo

# Verify items flow correctly
# Then deploy to all
```

### 5. Keep Migration Scripts in Repo
```
infrastructure/
├── scripts/
│   ├── migrate-project-automation.sh
│   ├── deploy-project-automation.sh
│   └── audit-project-automation.sh
└── docs/
    └── project-migration-history.md
```

---

## Summary: Which Method to Use?

| Scenario | Recommended Method | Time | Complexity |
|----------|-------------------|------|------------|
| 1-2 repos, one-time | Method 1: Manual | 15 min | Low |
| 3-5 repos, occasional projects | Method 1: Manual | 30 min | Low |
| 5+ repos, frequent projects | Method 2: Shared Workflows | 1hr setup + 5min/project | Medium |
| 10+ repos, automated infra | Method 3: GraphQL API | 2hr setup + automated | High |
| Starting fresh | Method 2: Shared Workflows | 1hr setup | Medium |

---

## Related Documentation
- See: `git-feature-branch-workflow.md` for branch strategy
- See: `github-projects-operating-guide.md` for project management
- See: `github-idea-to-pr-traceability.md` for issue workflows
- GitHub Issue Automation Strategy (Rule: v6Rz03wevwmj7LgZ0N17qR)

---

**Document Control Notes**:
- This document should be versioned when modified (v2.1.0, v2.2.0, etc.)
- Changes must be tracked with rationale
- Part of PF-Core registry controlled artifacts
