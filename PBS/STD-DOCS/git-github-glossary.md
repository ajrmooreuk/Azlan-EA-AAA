# Git & GitHub Glossary

## Purpose
Clear definitions of Git and GitHub terms used in our team documentation, organized alphabetically for easy reference.

---

## A

### Amend
Modifying the most recent commit. Used to add forgotten files or fix commit messages before pushing.
```bash
git commit --amend
```

### Approval
When a reviewer formally accepts changes in a pull request, indicating the code is ready to merge.

---

## B

### Branch
An independent line of development. Branches let you work on features without affecting the main codebase.
- **main** - The primary branch (production-ready code)
- **feature branch** - A temporary branch for new work

### Branch Protection
Rules that prevent direct changes to important branches (like main). Requires pull requests and prevents force pushes.

---

## C

### Clone
Creating a local copy of a remote repository on your machine.
```bash
git clone https://github.com/TeamBAIV/PF-Core-BAIV.git
```

### Commit
A snapshot of your changes saved to Git history. Like a save point in your work.
```bash
git commit -m "Add new feature"
```

### Commit Message
A description of what changed in a commit. Should be clear and concise.

### Conflict
When Git can't automatically merge changes because two people edited the same lines. Must be resolved manually.

### Co-Author
Someone who contributed to a commit. AI assistants like Warp should be credited.
```
Co-Authored-By: Warp <agent@warp.dev>
```

---

## D

### Diff
Shows differences between files, commits, or branches.
```bash
git diff
```

### Draft PR
A pull request marked as "work in progress" - not ready for final review or merge.

---

## F

### Fetch
Downloads changes from remote repository but doesn't merge them into your work.
```bash
git fetch origin main
```

### Force Push
Overwrites remote branch history with local changes. **DANGEROUS - avoid on main!**
```bash
git push --force  # ❌ Don't use on main
```

### Fork
A personal copy of someone else's repository. Used for contributing to projects you don't have write access to.

---

## G

### Git
The version control system that tracks changes to files over time. Runs on your local machine.

### GitHub
A cloud platform for hosting Git repositories. Adds collaboration features like pull requests and issues.

### GitHub CLI (gh)
Command-line tool for interacting with GitHub.
```bash
gh pr create
```

---

## H

### HEAD
A pointer to your current position in the repository (usually the latest commit on your current branch).

### History
The chronological record of all commits in a repository.

---

## I

### Issue
A GitHub feature for tracking bugs, tasks, or feature requests. Like a ticket system.

---

## L

### Local
Your personal copy of the repository on your computer.

---

## M

### Main (formerly Master)
The primary branch containing production-ready code. Protected from direct changes.

### Merge
Combining changes from one branch into another.
```bash
git merge feature/my-work
```

### Merge Commit
A special commit that combines two branches, preserving both histories.

### Merge Conflict
See **Conflict**

---

## O

### Origin
The default name for the remote repository on GitHub.
```bash
git push origin main
```

---

## P

### PR (Pull Request)
A request to merge changes from one branch into another. Enables code review before merging.

### Protected Branch
A branch with rules preventing direct pushes, deletions, or force pushes. See **Branch Protection**.

### Pull
Downloads changes from remote and merges them into your current branch.
```bash
git pull origin main
```

### Push
Uploads your local commits to the remote repository on GitHub.
```bash
git push origin feature/my-work
```

---

## R

### Rebase
Replays your commits on top of another branch. Creates cleaner history but more complex than merge.
```bash
git rebase origin/main
```

### Reflog
A log of all Git operations, useful for recovering lost commits.
```bash
git reflog
```

### Remote
A version of the repository hosted on GitHub (or another server), not on your local machine.

### Repository (Repo)
A project tracked by Git, containing all files and their complete history.

### Reset
Moves the current branch to a different commit. Can discard changes.
```bash
git reset --hard HEAD  # ⚠️ Destructive!
```

### Review
The process of examining code changes in a pull request before merging.

### Reviewer
A team member assigned to review and approve a pull request.

---

## S

### Squash
Combining multiple commits into a single commit. Often used when merging PRs.

### Squash and Merge
A merge strategy that condenses all PR commits into one commit on main.

### Stage (Staging Area)
Preparing files to be committed. Files must be staged before committing.
```bash
git add file.md  # Stages file.md
```

### Stash
Temporarily saving uncommitted changes so you can switch branches.
```bash
git stash        # Save changes
git stash pop    # Restore changes
```

### Status
Shows which files are changed, staged, or untracked.
```bash
git status
```

---

## T

### Tag
A named reference to a specific commit, often used for version releases (e.g., v1.0.0).

### Tracking Branch
A local branch linked to a remote branch, enabling easy push/pull.
```bash
git push -u origin feature/my-work  # -u sets up tracking
```

---

## U

### Uncommitted Changes
Modifications to files that haven't been saved with `git commit` yet.

### Unstage
Removing files from the staging area without discarding changes.
```bash
git reset HEAD file.md
```

### Upstream
The original repository when you've forked a project. Also refers to the remote branch being tracked.

---

## W

### Working Directory (Working Tree)
The current state of files in your repository, including uncommitted changes.

### Workflow
The process and steps used for development (e.g., feature branch workflow).

---

## Common Command Quick Reference

| Command | What It Does |
|---------|-------------|
| `git status` | Check current state |
| `git branch` | List branches |
| `git checkout -b <name>` | Create new branch |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit changes |
| `git push` | Upload to GitHub |
| `git pull` | Download from GitHub |
| `git merge` | Combine branches |
| `git log` | View commit history |
| `git diff` | See changes |
| `git stash` | Save work temporarily |

---

## GitHub-Specific Terms

### Actions
GitHub's CI/CD automation platform. Runs tests and deployments automatically.

### Collaborator
Someone with access to contribute to a private repository.

### Gist
A simple way to share code snippets or small files on GitHub.

### Organization
A shared GitHub account for teams (e.g., TeamBAIV).

### Repository Settings
Configuration panel for branches, collaborators, webhooks, and more.

### Star
Bookmarking a repository to show appreciation or save for later.

### Watch
Subscribe to notifications for repository activity (issues, PRs, commits).

---

## Workflow-Specific Terms

### Feature Branch
A branch created to develop a specific feature or fix. Deleted after merging.

### Feature Branch Workflow
The practice of creating a branch for each feature, then merging via PR. **Our team standard.**

### Hotfix
An urgent fix branched directly from main, bypassing normal workflow.

### WIP (Work In Progress)
A pull request or commit that's not yet ready for review.

---

## Common Acronyms

| Acronym | Meaning |
|---------|---------|
| **PR** | Pull Request |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **CLI** | Command Line Interface |
| **VCS** | Version Control System |
| **SHA** | Secure Hash Algorithm (commit identifier) |
| **WIP** | Work In Progress |
| **LGTM** | Looks Good To Me (review approval) |

---

## Visual Concepts

### Repository Structure
```
Repository
├── Branches
│   ├── main (protected)
│   ├── feature/login
│   └── fix/bug-123
├── Commits (history)
├── Remote (GitHub)
└── Local (your machine)
```

### Git Workflow States
```
Working Directory → Staging Area → Local Repository → Remote Repository
     (edit)           (add)          (commit)           (push)
```

---

## When to Use What

| Situation | Command/Action |
|-----------|---------------|
| Start new work | `git checkout -b feature/name` |
| Save progress | `git add .` then `git commit` |
| Upload to GitHub | `git push` |
| Get latest changes | `git pull` |
| Share for review | Create PR on GitHub |
| Switch branches mid-work | `git stash` |
| Undo local changes | `git reset --hard HEAD` |
| Fix last commit | `git commit --amend` |

---

## Red Flags - Don't Do These!

❌ **git push --force origin main** - Overwrites protected history  
❌ **Commit directly to main** - Bypasses code review  
❌ **Delete .git folder** - Loses all history  
❌ **Commit passwords/keys** - Security risk  
❌ **Work on main branch** - Creates merge conflicts  
❌ **git reset --hard** without knowing what it does - Loses work  

---

## Getting Help

### In the Terminal
```bash
git help <command>        # Full documentation
git <command> --help      # Same as above
git <command> -h          # Quick options list
```

### Resources
- [Official Git Glossary](https://git-scm.com/docs/gitglossary)
- [GitHub Glossary](https://docs.github.com/en/get-started/quickstart/github-glossary)
- Our team docs:
  - `git-feature-branch-workflow.md`
  - `github-branch-protection-setup.md`

---

## Pro Tips

💡 **Commit often** - Small commits are easier to understand and revert  
💡 **Write clear messages** - Your future self will thank you  
💡 **Pull before push** - Avoid conflicts by staying up to date  
💡 **Use branches** - Keep main clean and stable  
💡 **Review diffs** - Always check what you're about to commit  
💡 **Ask for help** - Better to ask than to break things  

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-20  
**Author:** TeamBAIV  
**Status:** Active  
**Related Docs:**
- `git-feature-branch-workflow.md`
- `github-branch-protection-setup.md`
