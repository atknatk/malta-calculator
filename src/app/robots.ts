import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://maltacalculator.com";

  // Explicit allow blocks for AI assistants. While most honor the wildcard
  // rule, naming them removes ambiguity and signals that this site welcomes
  // citation in generative answers (GPT, Claude, Perplexity, Gemini, Apple
  // Intelligence). The wildcard rule still applies to every other crawler.
  const aiBots = [
    "GPTBot", // OpenAI / ChatGPT
    "ChatGPT-User", // OpenAI on-demand fetches (user-initiated)
    "OAI-SearchBot", // OpenAI search
    "ClaudeBot", // Anthropic Claude crawl
    "Claude-Web", // Anthropic on-demand fetches
    "anthropic-ai", // Anthropic legacy agent
    "PerplexityBot", // Perplexity crawl
    "Perplexity-User", // Perplexity on-demand
    "Google-Extended", // Gemini training opt-in
    "Applebot-Extended", // Apple Intelligence training
    "Bytespider", // ByteDance / Doubao
    "Amazonbot", // Amazon Alexa / generative
    "CCBot", // Common Crawl (training corpus)
    "Meta-ExternalAgent", // Meta AI fetches
    "FacebookBot", // Meta crawl
    "DuckAssistBot", // DuckDuckGo AI answers
    "YouBot", // You.com
    "cohere-ai", // Cohere
    "Diffbot", // Diffbot AI
    "Timpibot", // Timpi
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/public/"],
        disallow: ["/api/"],
      },
      ...aiBots.map((userAgent) => ({
        userAgent,
        allow: ["/", "/api/public/"],
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
