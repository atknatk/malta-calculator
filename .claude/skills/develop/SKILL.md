---
name: develop
description: Master development workflow - handles complete feature development from planning to testing
argument-hint: <feature or task description>
allowed-tools: Read Write Edit Bash Glob Grep WebSearch Task
---

# Master Development Workflow

Execute complete development workflow for: **$ARGUMENTS**

## Phase 1: Pre-Development Setup

### 1.1 Check Current State
```bash
git status
git branch -a
git log --oneline -5
```

### 1.2 Create Feature Branch
Based on the task type, create appropriate branch:
- Feature: `feature/{short-description}`
- Fix: `fix/{issue-description}`
- Blog: `blog/{slug}`
- Refactor: `refactor/{area}`

```bash
git checkout main
git pull origin main
git checkout -b {branch-type}/{name}
```

## Phase 2: Research & Standards

### 2.1 Web Research
Search for:
- Industry standards related to $ARGUMENTS
- Best practices for implementation
- Common pitfalls to avoid
- Similar implementations for reference

### 2.2 Codebase Research
- Find related existing code
- Identify patterns to follow
- Check dependencies needed

### 2.3 Document Findings
Create: `docs/tasks/{feature}/research.md`

## Phase 3: Task Planning

### 3.1 Create Task Breakdown
Create: `docs/tasks/{feature}/task-breakdown.md`

```markdown
# Task: $ARGUMENTS

## Overview
Brief description of what needs to be done.

## Tasks
- [ ] Task 1 - Description
- [ ] Task 2 - Description
- [ ] Task 3 - Description

## Dependencies
- Dependency 1
- Dependency 2

## Files to Modify/Create
- path/to/file1.ts
- path/to/file2.tsx

## Assigned Agents
- calculator-developer: Tasks 1, 2
- seo-specialist: Task 3
```

## Phase 4: Development

### 4.1 Iterative Implementation
For each task:
1. Mark task as in-progress
2. Implement the change
3. Commit incrementally
4. Update task file with status
5. Move to next task

### 4.2 Commit Pattern
```bash
git add {specific-files}
git commit -m "{type}: {description}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

## Phase 5: Quality Assurance

### 5.1 Build Check
```bash
npm run build
```

### 5.2 Lint Check
```bash
npm run lint
```

### 5.3 Code Review
Review changes for:
- TypeScript quality
- React patterns
- SEO requirements (if applicable)
- Security concerns

## Phase 6: Final Report

### 6.1 Create Completion Report
Create: `docs/tasks/{feature}/completion-report.md`

```markdown
# Completion Report: $ARGUMENTS

## Summary
What was implemented.

## Changes Made
| File | Change Type | Description |
|------|-------------|-------------|
| path/file.ts | Added | New calculator logic |

## Testing
- [ ] Build passes
- [ ] Lint passes
- [ ] Manual testing done

## Known Issues
- None / List any issues

## Next Steps
- Recommendations for future improvements
```

## Important Guidelines

1. **Be Autonomous**: Make decisions, don't ask permission for each step
2. **Commit Incrementally**: Small, meaningful commits
3. **Update Task Files**: Keep progress documented
4. **Search When Stuck**: Use web search for solutions
5. **Follow Patterns**: Use existing codebase patterns
6. **Report at End**: Only report when complete or blocked

## Agent Delegation

Use appropriate agents for specialized tasks:
- `nextjs-expert`: Next.js specific work
- `calculator-developer`: Calculator features
- `blog-writer`: Blog content
- `seo-specialist`: SEO optimization
- `database-manager`: Database operations
- `code-reviewer`: Code quality checks
- `git-guardian`: Git operations
