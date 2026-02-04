# New Blog Post Workflow

Yeni bir blog yazısı oluşturmak için bu workflow'u takip et.

## Kullanıcıdan alınacak bilgiler:

- Blog konusu
- Hedef anahtar kelimeler
- İlişkili hesaplayıcı (varsa)

## Adımlar

### 1. Blog Post Sayfası Oluştur

Dosya: `src/app/blog/{{slug}}/page.tsx`

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
    title: "{{Title}} | Malta Calculator",
    description: "{{Description 150-160 karakter}}",
    keywords: ["malta", "{{keyword1}}", "{{keyword2}}", "guide", "2026"],
    alternates: { canonical: `${SITE_URL}/blog/{{slug}}` },
    openGraph: {
        ...ogMetadata,
        title: "{{Title}}",
        url: `${SITE_URL}/blog/{{slug}}`,
        type: "article",
    },
    twitter: {
        ...twitterMetadata,
        title: "{{Title}}",
    },
};

export default function BlogPostPage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="{{Title}}"
                description="{{Description}}"
                slug="{{slug}}"
                datePublished="{{YYYY-MM-DD}}"
            />
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: SITE_URL },
                    { name: "Blog", url: `${SITE_URL}/blog` },
                    { name: "{{Title}}", url: `${SITE_URL}/blog/{{slug}}` },
                ]}
            />
            <main role="main" aria-label="{{Topic}}">
                <Shell className="max-w-4xl py-12">
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        {/* Header */}
                        <header className="not-prose mb-12">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    {{Category}}
                                </span>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {{Month Year}}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {{X}} min read
                                    </span>
                                </div>
                            </div>
                            <h1 className="font-cal text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                {{Title}}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {{Subtitle/Lead}}
                            </p>
                        </header>

                        {/* Table of Contents */}
                        <nav className="not-prose p-6 rounded-2xl bg-muted/50 mb-12">
                            <h2 className="font-semibold mb-4">Table of Contents</h2>
                            <ol className="space-y-2 text-muted-foreground">
                                <li>
                                    <a href="#section-1" className="hover:text-foreground">1. Section 1</a>
                                </li>
                                <li>
                                    <a href="#section-2" className="hover:text-foreground">2. Section 2</a>
                                </li>
                            </ol>
                        </nav>

                        {/* Content Sections */}
                        <section id="section-1">
                            <h2>Section 1 Title</h2>
                            <p>Content...</p>
                        </section>

                        <section id="section-2">
                            <h2>Section 2 Title</h2>
                            <p>Content...</p>
                        </section>

                        {/* CTA Box */}
                        <div className="not-prose p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 mt-12">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <Calculator className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Try Our {{Calculator}} Calculator</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Use our free calculator to...
                                    </p>
                                    <Link
                                        href="/calculators/{{calculator-slug}}"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                    >
                                        Calculate Now
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = 'force-static';
```

### 2. Blog Listesine Ekle

Dosya: `src/app/blog/page.tsx`

`blogPosts` array'ine ekle:

```typescript
{
    slug: "{{slug}}",
    title: "{{Title}}",
    description: "{{Short description for card}}",
    date: "{{Month Year}}",
    readTime: "{{X}} min read",
    category: "{{Category}}",
},
```

### 3. Sitemap'e Ekle

Dosya: `src/app/sitemap.ts`

`blogPages` array'ine ekle:

```typescript
{ url: `${baseUrl}/blog/{{slug}}`, priority: 0.8, changeFrequency: "yearly" as const },
```

### 4. Build Kontrolü

```bash
npm run build
```

## İçerik Yapısı

### Standart Blog Bölümleri:

1. **Header**: Badge, tarih, okuma süresi, başlık, lead
2. **Table of Contents**: Anchor linkli içindekiler
3. **Ana İçerik**: H2/H3 başlıklarla bölümler
4. **Tablolar/Listeler**: Bilgi sunumu
5. **Info Boxes**: Önemli bilgiler
6. **CTA**: İlgili hesaplayıcıya yönlendirme
7. **External Links**: Resmi kaynaklara (noopener noreferrer)

### İçerik Kuralları:

- Tamamen İngilizce yaz
- Malta odaklı içerik
- 2026 güncel bilgiler
- Resmi kaynaklara referans ver (CFR, Social Security)
- İlgili hesaplayıcılara internal link ekle

## SEO Checklist

- [ ] Title < 60 karakter
- [ ] Description 150-160 karakter
- [ ] 5-10 keyword
- [ ] Canonical URL
- [ ] ArticleJsonLd (datePublished zorunlu)
- [ ] BreadcrumbJsonLd
- [ ] H1 title ile eşleşiyor
- [ ] Internal links (hesaplayıcılar, diğer bloglar)
- [ ] External links (resmi kaynaklar)
- [ ] Blog listesine eklendi
- [ ] Sitemap güncellendi
