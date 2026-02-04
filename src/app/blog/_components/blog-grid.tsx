"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((post) => post.category)));
    return ["All", ...cats.sort()];
  }, [posts]);

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const featuredPost = filteredPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Filter by category
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                selectedCategory === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {category}
              {category !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({posts.filter((p) => p.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-muted-foreground">
        Showing {filteredPosts.length} of {posts.length} articles
        {selectedCategory !== "All" && ` in "${selectedCategory}"`}
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <Link href={`/blog/${featuredPost.slug}`} className="group block mb-12">
          <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border border-border/50 p-8 md:p-12 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-cal font-bold mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {featuredPost.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </article>
        </Link>
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="h-full p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col h-full">
                  <span className="text-xs font-semibold text-primary mb-3">
                    {post.category}
                  </span>
                  <h2 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No articles found in this category.
        </div>
      )}
    </div>
  );
}
