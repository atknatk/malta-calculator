---
name: new-blog
description: Create a new SEO-optimized blog post about Malta financial topics
argument-hint: <blog post title>
allowed-tools: Read Write Edit Bash Glob Grep WebSearch
---

# New Blog Post Workflow

Create a new blog post: **$ARGUMENTS**

## Step 1: Research

Before writing:

1. Search for relevant information
2. Find authoritative sources (Malta government sites)
3. Identify target keywords
4. Check existing related content

## Step 2: Create Blog Directory

```bash
mkdir -p src/app/blog/{slug}/_components
```

## Step 3: Create Page

File: `src/app/blog/{slug}/page.tsx`

```tsx
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "{Title} | Malta Calculator",
  description: "{150-160 character description}",
  keywords: ["malta", "{keyword1}", "{keyword2}", "{keyword3}"],
  alternates: { canonical: `${SITE_URL}/blog/{slug}` },
  openGraph: {
    ...ogMetadata,
    title: "{Title}",
    url: `${SITE_URL}/blog/{slug}`,
    type: "article",
  },
  twitter: {
    ...twitterMetadata,
    title: "{Title}",
  },
};

export default function BlogPost() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="{Title}"
        description="{Description}"
        slug="{slug}"
        datePublished="{YYYY-MM-DD}"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: "{Title}", url: `${SITE_URL}/blog/{slug}` },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          { question: "FAQ 1?", answer: "Answer 1" },
          { question: "FAQ 2?", answer: "Answer 2" },
          { question: "FAQ 3?", answer: "Answer 3" },
        ]}
      />
      <main role="main" aria-label="{Title}">
        <BackButton href="/blog" />
        <Shell className="max-w-4xl py-8">
          <article className="prose dark:prose-invert max-w-none">
            <h1>{Title}</h1>

            {/* Introduction */}
            <p className="lead">Introduction paragraph with target keyword.</p>

            {/* Main content with H2 sections */}
            <h2>Section 1</h2>
            <p>Content...</p>

            <h2>Section 2</h2>
            <p>Content...</p>

            {/* Internal links */}
            <h2>Related Tools</h2>
            <ul>
              <li>
                <a href="/calculators/{related}">Related Calculator</a>
              </li>
            </ul>

            {/* FAQ section */}
            <h2>Frequently Asked Questions</h2>
            {/* FAQ content matching JSON-LD */}
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
```

## Step 4: Add to Blog Index

File: `src/app/blog/page.tsx`

Add to blog posts array.

## Step 5: Update Sitemap

File: `src/app/sitemap.ts`

Add to blog posts array if needed.

## Step 6: Build Check

```bash
npm run build
```

## Content Guidelines

### Writing Style

- Professional, informative tone
- Clear explanations of Malta-specific terms
- Include dates for time-sensitive info
- Use authoritative sources

### Structure

- Compelling introduction
- Clear H2/H3 hierarchy
- Practical examples
- Internal links to calculators
- FAQ section at end

### SEO Requirements

- Title < 60 characters
- Description 150-160 characters
- Target keyword in first paragraph
- 3-5 FAQ items
- Internal links to calculators
- External links with rel="noopener"
