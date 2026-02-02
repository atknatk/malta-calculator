---
description: how to write a new blog post with full SEO
---

# New Blog Post Workflow

This workflow guides you through creating a new SEO-optimized blog post for the Malta Calculator website.

## Prerequisites
- Understand the topic you're writing about
- Research the subject using official Malta sources

## Steps

### 1. Research Existing Structure
// turbo
View the existing blog structure to understand the pattern:
```
/src/app/blog/page.tsx          # Blog list with BlogPost[] array
/src/app/blog/[existing-post]/   # Existing blog post examples
```

### 2. Create Blog Post Directory and Page
Create a new directory and page.tsx file at:
```
/src/app/blog/[slug]/page.tsx
```

The page must include:
- **Metadata**: title, description, keywords, canonical URL
- **OpenGraph/Twitter**: Using `ogMetadata` and `twitterMetadata` from shared-metadata
- **JSON-LD**: `ArticleJsonLd` and `BreadcrumbJsonLd` from `/src/components/json-ld`
- **Layout**: Use `MarketingLayout` and `Shell` components
- **Content Structure**:
  - Header with category badge, date, read time
  - Table of contents with anchor links
  - Sections with proper headings (h2, h3)
  - CTA linking to relevant calculator

### 3. Update Blog List
Add new entry to `blogPosts` array in `/src/app/blog/page.tsx`:
```typescript
{
    slug: "malta-[topic]-guide-2026",
    title: "[Full Title]",
    description: "[Brief description for card]",
    date: "[Month Year]",
    readTime: "[X] min read",
    category: "[Category]",
},
```

### 4. Update Sitemap
Add blog URL to `/src/app/sitemap.ts` in the `blogPages` array:
```typescript
{ url: `${baseUrl}/blog/[slug]`, priority: 0.8, changeFrequency: "yearly" as const },
```

### 5. Verify
// turbo
```bash
npm run build
```

Then verify in browser:
- Blog list shows new post
- Blog post page loads correctly
- JSON-LD is present in page source
- All links work

## Template Structure

```tsx
import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "[Title] | Malta Calculator",
    description: "[Description 150-160 chars]",
    keywords: ["keyword1", "keyword2", ...],
    alternates: { canonical: `${SITE_URL}/blog/[slug]` },
    openGraph: { ...ogMetadata, title: "[Title]", url: `${SITE_URL}/blog/[slug]`, type: "article" },
    twitter: { ...twitterMetadata, title: "[Title]" },
};

export default function BlogPostPage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd title="[Title]" description="[Desc]" slug="[slug]" datePublished="YYYY-MM-DD" />
            <BreadcrumbJsonLd items={[...]} />
            <main role="main" aria-label="[Topic]">
                <Shell className="max-w-4xl py-12">
                    <Link href="/blog" className="..."><ArrowLeft /> Back to Blog</Link>
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        {/* Header, TOC, Sections, CTA */}
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = 'force-static';
```

## SEO Checklist
- [ ] Title tag < 60 characters
- [ ] Meta description 150-160 characters
- [ ] 5-10 relevant keywords
- [ ] Canonical URL set
- [ ] OpenGraph title and URL
- [ ] Twitter card metadata
- [ ] ArticleJsonLd with datePublished
- [ ] BreadcrumbJsonLd
- [ ] H1 matches title
- [ ] Internal links to related pages/calculators
- [ ] External links to official sources (noopener noreferrer)
