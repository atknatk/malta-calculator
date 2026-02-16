# Weekly Blog Post Generator - Malta Calculator

You are generating a weekly blog post for the Malta Calculator website (maltacalculator.com).
This is an automated task running in CI/CD. Follow ALL steps carefully.

IMPORTANT CONSTRAINTS:

- Blog topics MUST be about Malta tax, financial calculations, or calculator-related content
- ALL facts must be sourced from official Malta government websites
- NEVER publish duplicate or overlapping content with existing blog posts

---

## Step 1: Determine the Topic & Check for Duplicates

1. Read the file `.github/blog-topics.json` to get the list of candidate topics
2. Read `src/app/blog/page.tsx` to see ALL existing blog posts (check the `blogPosts` array)
3. List ALL existing blog post directories under `src/app/blog/` to get every slug
4. For the candidate topic, check ONLY for **exact duplicates**:
   a. **Exact slug match**: Does the exact same slug already exist as a directory?
   b. **Same primary topic**: Is there an existing post with an almost identical title covering the exact same subject?
5. Pick the FIRST topic that does NOT have an exact slug match or identical title
6. If a SPECIFIC TOPIC was provided at the end of this prompt, use that instead

IMPORTANT DUPLICATE RULES:

- Related topics are NOT duplicates. Example: "Stamp Duty Guide" and "Property Transfer Tax Guide" are DIFFERENT topics even though they overlap.
- A topic that covers a SPECIFIC ANGLE of a broader existing topic is NOT a duplicate. Example: "Rental Income Tax: 15% vs Progressive comparison" is NOT a duplicate of a general "Tax Rates" guide.
- Only skip a topic if the EXACT SAME subject is already covered with the SAME depth and angle.
- When in doubt, DO NOT skip the topic. Write the blog post.

**If ALL topics have exact slug matches, output "NO_NEW_TOPIC_AVAILABLE" and stop.**

---

## Step 2: Research the Topic from Official Sources

### Primary Sources (MUST use these first)

Search these official Malta government sites for authoritative data:

| Source                             | URL                   | Content                         |
| ---------------------------------- | --------------------- | ------------------------------- |
| Commissioner for Revenue (CFR)     | cfr.gov.mt            | Tax rates, tax forms, FSS rules |
| Social Security                    | socialsecurity.gov.mt | SSC rates, pensions, benefits   |
| Malta Government                   | gov.mt                | Legislation, government gazette |
| Malta Financial Services Authority | mfsa.mt               | Financial regulations           |
| Malta Budget Documents             | budget.gov.mt         | Annual budget measures          |
| Jobsplus                           | jobsplus.gov.mt       | Employment rules, permits       |

### Handling Cloudflare / Access Errors

Some official sites (especially cfr.gov.mt) may return Cloudflare challenge pages or 403 errors.
If you encounter CF errors or cannot access a site:

1. **DO NOT use the blocked content** - it's unreliable
2. **Try alternative official sources**:
   - Search "site:gov.mt {topic}" for other Malta government pages
   - Search for the official Legal Notice or Government Gazette (legislation.mt)
   - Use budget.gov.mt for budget-related tax information
   - Try the Times of Malta (timesofmalta.com) or Malta Independent as reliable secondary sources
3. **Use these trusted secondary sources** when official sites are blocked:
   - PwC Malta tax summaries (pwc.com/mt)
   - Deloitte Malta tax guides (deloitte.com/mt)
   - KPMG Malta tax insights (kpmg.com/mt)
   - Grant Thornton Malta (grantthornton.com.mt)
   - EY Malta (ey.com/en_mt)
4. **Always cite the actual source** - never invent data or use uncited information
5. If a critical fact cannot be verified from ANY reliable source, mark it with "**[Verify]**" in the content

### Research Process

1. Search for the latest Malta-specific information about the topic
2. Gather data from at least 3 different sources (prefer official, then Big4, then news)
3. Cross-reference key numbers (tax rates, thresholds, deadlines) across sources
4. Note the source URL for every fact used
5. Focus on 2026 data; if 2026 data isn't available, use latest available and note the year

---

## Step 3: Create the Blog Post

Follow the exact workflow from the project's `/new-blog` skill:

### 3a. Create the blog directory

```bash
mkdir -p src/app/blog/{slug}/_components
```

Use a descriptive, SEO-friendly slug (e.g., `malta-{topic}-guide-2026`).

### 3b. Create page.tsx

Read an existing blog post for reference (e.g., `src/app/blog/malta-tax-rates-2026-complete-guide/page.tsx`) to match the exact style and structure.

The blog post MUST include:

- Metadata with title (< 60 chars), description (150-160 chars), keywords (5-10)
- Canonical URL
- ArticleJsonLd, BreadcrumbJsonLd, CustomFAQJsonLd
- Header with category badge, date, read time
- Table of Contents with anchor links
- Well-structured H2/H3 sections with comprehensive content
- Data tables where appropriate (with actual numbers from official sources)
- Info boxes for important notes
- Internal links to relevant calculators on maltacalculator.com
- CTA box linking to the most relevant calculator
- Related guides section linking to other blog posts
- External source links with rel="noopener noreferrer" (MUST link to actual official sources)
- `export const revalidate = false;` and `export const dynamic = "force-static";`

Content requirements:

- Write entirely in English
- Malta tax / financial calculation focused content ONLY
- Professional, informative tone
- 1500-2500 words of actual content
- Include practical calculation examples (step-by-step with real numbers)
- At least 3 FAQ items with proper JSON-LD matching the CustomFAQJsonLd component
- Use today's date for datePublished
- Every tax rate, threshold, and calculation must have a cited source

### 3c. Add to Blog Index

Edit `src/app/blog/page.tsx`:

- Add the new blog post to the `blogPosts` array
- Match the exact format of existing entries
- Set the correct category, date, readTime

### 3d. Update Sitemap

Edit `src/app/sitemap.ts`:

- Add the new blog URL to the blogPages array
- Use priority 0.8 and changeFrequency "yearly"

---

## Step 4: Final Duplicate Verification

Before building, verify one more time:

1. The new slug does NOT exist in the blogPosts array (except the one you just added)
2. The content does not substantially overlap with any existing blog post
3. All internal links point to existing calculators and blog posts

---

## Step 5: Build Verification

Run `npm run build` to verify everything compiles correctly.

If the build fails:

1. Read the error message carefully
2. Fix the issue
3. Run `npm run build` again
4. Repeat until the build succeeds

---

## Step 6: Summary

After completion, output a structured summary:

```
BLOG_GENERATED:
- Title: {title}
- Slug: {slug}
- Category: {category}
- Related Calculator: {calculator or "none"}
- Sources Used:
  1. {source_url_1}
  2. {source_url_2}
  3. {source_url_3}
- Duplicate Check: PASSED
- Build Status: PASSED
- CF Errors Encountered: {yes/no, which sites}
- Alternative Sources Used: {list if any}
```

---

## Important Rules

- DO NOT skip the build verification step
- DO NOT create placeholder content - all information must be researched and accurate
- DO NOT duplicate existing blog topics - always check first
- DO NOT use data from Cloudflare-blocked pages - find alternative sources
- DO NOT invent tax rates or financial figures - every number needs a source
- ALWAYS use the exact same component structure as existing blog posts
- ALWAYS include JSON-LD structured data
- ALWAYS add the post to both the blog listing AND sitemap
- ALWAYS focus on Malta tax, SSC, and financial calculation topics
- ALWAYS link to relevant calculators on the site when applicable
