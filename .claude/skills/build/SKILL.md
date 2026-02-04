---
name: build
description: Build and verify the project
allowed-tools: Bash Read Glob
---

# Build & Verify Workflow

## Step 1: Run Build

```bash
npm run build
```

## Step 2: Check for Errors

If build fails:
1. Read error messages carefully
2. Identify the failing file and line
3. Fix the issue
4. Re-run build

### Common Build Errors

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| Type error | Missing/wrong types | Add proper types |
| Module not found | Wrong import path | Fix import path |
| Export error | Missing export | Add export statement |
| Metadata error | Invalid metadata | Check metadata format |

## Step 3: Run Lint

```bash
npm run lint
```

## Step 4: Verify Static Pages

Check that public pages have:
```typescript
export const revalidate = false;
export const dynamic = 'force-static';
```

## Step 5: Report Results

Report:
- Build status (pass/fail)
- Any warnings
- Static pages generated
- Bundle size if significant changes
