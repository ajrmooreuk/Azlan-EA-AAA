# GitHub Branch Protection Rules Setup Guide

## Purpose
Prevent accidental overwrites and data loss on main branches across all repositories by enabling branch protection rules.

## Why This Matters
Without branch protection, the main branch can be:
- Force-pushed (overwriting history and deleting files)
- Deleted accidentally
- Modified without review
- Reset to previous commits, losing work

## Setup Instructions

### For Each Repository

#### Step 1: Access Branch Protection Settings
1. Go to your GitHub repository (e.g., `https://github.com/TeamBAIV/PF-Core-BAIV`)
2. Click **Settings** tab
3. In the left sidebar, click **Branches**
4. Under "Branch protection rules", click **Add rule** or **Add branch protection rule**

#### Step 2: Configure Protection Rules
Enter the following settings:

**Branch name pattern:**
```
main
```

**Required Settings (Check these boxes):**

✅ **Require a pull request before merging**
   - Require approvals: 1 (or 0 if working solo, but still creates a review trail)
   - Allow specified actors to bypass pull request requirements: ✅ (Add yourself if you need emergency access)

✅ **Require status checks to pass before merging** (optional but recommended)
   - If you have CI/CD workflows, select the required checks

✅ **Require conversation resolution before merging** (optional)

✅ **Require signed commits** (optional but increases security)

✅ **Require linear history** (prevents merge commits if preferred)

✅ **Do not allow bypassing the above settings**
   - ⚠️ Only enable if you want ABSOLUTE protection
   - Leave unchecked if you need emergency override capability

✅ **Restrict who can push to matching branches**
   - Leave empty to block all direct pushes
   - Or add specific users/teams who can push directly

✅ **Allow force pushes** - ❌ **LEAVE UNCHECKED** (Critical!)

✅ **Allow deletions** - ❌ **LEAVE UNCHECKED** (Critical!)

#### Step 3: Save Rules
1. Scroll down and click **Create** or **Save changes**
2. Confirm the rules are active by checking the green "Protected" badge next to your branch

### Recommended Minimal Protection (Solo Developer)
If you're working alone and want basic protection without too much friction:

```
✅ Require a pull request before merging
   - Require approvals: 0
✅ Allow force pushes: ❌ NO
✅ Allow deletions: ❌ NO
```

This prevents accidental force pushes and deletions while still allowing you to merge your own PRs.

### Recommended Maximum Protection (Team Environment)
```
✅ Require a pull request before merging
   - Require approvals: 1+
✅ Require status checks to pass before merging
✅ Require conversation resolution before merging
✅ Do not allow bypassing the above settings
✅ Restrict who can push to matching branches
✅ Allow force pushes: ❌ NO
✅ Allow deletions: ❌ NO
```

## Your Repositories to Protect

Based on your indexed codebases, apply these rules to:
- `TeamBAIV/PF-Core-BAIV` ⚠️ (just recovered from data loss)
- `TeamBAIV/PF-TeamBAIV` (if applicable)
- Any other repositories in the TeamBAIV organization

## Using GitHub CLI (gh) - Bulk Setup

If you have `gh` CLI installed, you can set up protection rules via command line:

```bash
# For a single repo
gh api repos/TeamBAIV/PF-Core-BAIV/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":0}' \
  --field enforce_admins=false \
  --field restrictions=null \
  --field allow_force_pushes='{"enabled":false}' \
  --field allow_deletions='{"enabled":false}'
```

## Verification

After setup, test protection by attempting a force push:
```bash
git push --force origin main
```

You should see:
```
! [remote rejected] main -> main (protected branch hook declined)
error: failed to push some refs
```

This means protection is working! ✅

## Emergency Override

If you absolutely need to force push (rare emergency):
1. Go to Settings → Branches
2. Temporarily disable "Do not allow bypassing"
3. Make your force push
4. **IMMEDIATELY re-enable protection rules**

⚠️ Never leave protection disabled.

## Best Practices

1. **Always work on feature branches**, not main
2. **Create PRs** for all changes, even solo work
3. **Review diffs** before merging
4. **Never use `git push --force`** on main
5. **Use `git push --force-with-lease`** on feature branches only (safer)

## References
- [GitHub Docs: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Docs: Managing branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-20  
**Author:** TeamBAIV  
**Status:** Active
