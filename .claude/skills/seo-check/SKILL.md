---
name: seo-check
description: Check SEO optimization for a page
argument-hint: <page path, e.g., /calculators/salary>
allowed-tools: Read Glob Grep
---

# SEO Check Workflow

Check SEO for: **$ARGUMENTS**

## Step 1: Find Page File

```bash
# Convert path to file location
# /calculators/salary -> src/app/calculators/salary/page.tsx
```

## Step 2: Check Metadata

| Element | Requirement | Status |
|---------|-------------|--------|
| Title | < 60 characters | [ ] |
| Description | 150-160 characters | [ ] |
| Keywords | 5-10 relevant | [ ] |
| Canonical | Absolute URL | [ ] |
| OG Title | Same as title | [ ] |
| Twitter Card | Properly set | [ ] |

## Step 3: Check JSON-LD

| Component | Required | Status |
|-----------|----------|--------|
| BreadcrumbJsonLd | Always | [ ] |
| CalculatorJsonLd | Calculators | [ ] |
| ArticleJsonLd | Blog posts | [ ] |
| CustomFAQJsonLd | If FAQ exists | [ ] |

## Step 4: Check Static Export

```typescript
// Should be present at end of page
export const revalidate = false;
export const dynamic = 'force-static';
```

## Step 5: Check Content

| Element | Requirement | Status |
|---------|-------------|--------|
| H1 | Contains primary keyword | [ ] |
| Heading hierarchy | Proper H2/H3 nesting | [ ] |
| Internal links | Present | [ ] |
| Image alt texts | Descriptive | [ ] |

## Step 6: Generate Report

```markdown
# SEO Audit: $ARGUMENTS

## Score: X/10

### Passed
- ✅ Item 1
- ✅ Item 2

### Failed
- ❌ Item 1 - Fix: description

### Recommendations
1. Recommendation 1
2. Recommendation 2
```
