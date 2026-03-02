# Blog Post Generator

Malta Calculator için blog yazısı oluşturur. Konu otomatik seçilir ya da parametre olarak verilebilir.

**Kullanım:**

- `/generate-blog` — `blog-topics.json`'dan otomatik konu seçer
- `/generate-blog malta crypto tax guide` — belirli bir konuyla üretir

---

You are generating a blog post for the Malta Calculator website (maltacalculator.com).
Follow ALL steps carefully and in order.

$ARGUMENTS içinde bir konu belirtilmişse onu kullan. Yoksa Step 1'deki otomatik seçimi uygula.

---

## Step 1: Determine the Topic & Check for Duplicates

1. Read `.github/blog-topics.json` to get the list of candidate topics
2. Read `src/app/blog/page.tsx` to see ALL existing blog posts (the `blogPosts` array)
3. List ALL existing directories under `src/app/blog/` to get every slug
4. Pick the FIRST topic from `blog-topics.json` that does NOT have an exact slug match or identical title already in the blog list
5. If `$ARGUMENTS` is provided, use that as the topic instead of auto-selecting

**Duplicate rules:**

- Only skip a topic if the EXACT SAME subject is already covered with the SAME angle
- Related topics or different angles are NOT duplicates — when in doubt, write the post
- If ALL topics have exact slug matches, stop and report: "All topics already published."

---

## Step 2: Research from Official Sources

Search these Malta government and trusted sources for authoritative data:

| Source                         | URL                   | Content                |
| ------------------------------ | --------------------- | ---------------------- |
| Commissioner for Revenue (CFR) | cfr.gov.mt            | Tax rates, FSS rules   |
| Social Security                | socialsecurity.gov.mt | SSC rates, pensions    |
| Malta Government               | gov.mt                | Legislation, gazette   |
| MFSA                           | mfsa.mt               | Financial regulations  |
| Malta Budget                   | budget.gov.mt         | Annual budget measures |
| Jobsplus                       | jobsplus.gov.mt       | Employment rules       |

**If cfr.gov.mt is blocked by Cloudflare:** use PwC Malta (pwc.com/mt), Deloitte Malta (deloitte.com/mt), KPMG Malta (kpmg.com/mt), or Times of Malta as fallback. Always cite the actual source used. Mark unverified facts with `**[Verify]**`.

Research process:

1. Search for the latest 2026 Malta-specific data on the topic
2. Gather from at least 3 sources (official first, then Big4, then news)
3. Cross-reference key numbers (tax rates, thresholds, deadlines)
4. Note the source URL for every fact

---

## Step 3: Create the Blog Post

### 3a. Create directory

```bash
mkdir -p src/app/blog/{slug}/_components
```

Use a descriptive, SEO-friendly slug (e.g. `malta-{topic}-guide-2026`).

### 3b. Create `page.tsx`

Read an existing blog post first for reference style (e.g. `src/app/blog/malta-tax-rates-2026-complete-guide/page.tsx`).

Required elements:

- Metadata: title (< 60 chars), description (150–160 chars), keywords (5–10), canonical URL
- `ArticleJsonLd`, `BreadcrumbJsonLd`, `CustomFAQJsonLd`
- Header: category badge, date, read time, H1, lead paragraph
- Table of Contents with anchor links
- H2/H3 sections: 1500–2500 words of real content
- Data tables with actual numbers from official sources
- Info boxes for important notes
- Internal links to at least 3 blog posts and 2 calculators on the site
- CTA box linking to the most relevant calculator
- Related Guides section with 3–4 links to existing blog posts
- External source links: `rel="noopener noreferrer"`
- At least 5 FAQ items (JSON-LD must match `CustomFAQJsonLd` component)
- `export const revalidate = false;` and `export const dynamic = "force-static";`

SEO content rules:

- Primary keyword in the first 100 words
- Include ALL keywords from `blog-topics.json` for this topic throughout content
- H2 headings in question format (e.g. "How Is Malta Income Tax Calculated?")
- Comparison or summary table in every post
- "Key Takeaways" box near the top
- Use today's date for `datePublished`
- Every tax rate and number must have a cited source

### 3c. Add to Blog Index

Edit `src/app/blog/page.tsx` — add to `blogPosts` array matching existing format.

### 3d. Update Sitemap

Edit `src/app/sitemap.ts` — add to `blogPages` array:

```typescript
{ url: `${baseUrl}/blog/{slug}`, priority: 0.8, changeFrequency: "yearly" as const },
```

---

## Step 4: Final Verification

Before building, confirm:

1. New slug does NOT already exist in `blogPosts` (except the entry just added)
2. All internal links point to real pages
3. No substantial content overlap with existing posts

---

## Step 5: Build

```bash
npm run build
```

Fix any errors and re-run until build passes.

---

## Step 6: Summary

Output a structured summary:

```
BLOG_GENERATED:
- Title: {title}
- Slug: {slug}
- Category: {category}
- Related Calculator: {calculator or "none"}
- Sources Used:
  1. {url}
  2. {url}
  3. {url}
- Duplicate Check: PASSED
- Build Status: PASSED
- CF Errors: {yes/no}
- Fallback Sources Used: {list if any}
```

---

**Rules:**

- NEVER publish placeholder content — all info must be researched and accurate
- NEVER duplicate existing blog topics
- NEVER invent tax rates or financial figures — every number needs a source
- ALWAYS match the exact component structure of existing blog posts
- ALWAYS include JSON-LD structured data
- ALWAYS add the post to blog listing AND sitemap
- ALWAYS focus on Malta tax, SSC, and financial calculation topics
