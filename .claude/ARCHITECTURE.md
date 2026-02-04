# Claude Code Architecture Guide

Bu dosya, Claude Code'un Malta Calculator projesinde nasıl yapılandırıldığını açıklar.

## Dizin Yapısı

```
.claude/
├── ARCHITECTURE.md          # Bu dosya
├── settings.json            # Proje ayarları ve izinler
├── agents/                  # Proje subagent'ları
│   ├── nextjs-expert/
│   ├── calculator-developer/
│   ├── blog-writer/
│   ├── seo-specialist/
│   ├── database-manager/
│   ├── code-reviewer/
│   └── git-guardian/
├── skills/                  # Proje skill'leri (komutlar)
│   ├── develop/            # Ana geliştirme workflow'u
│   ├── new-calculator/     # Yeni hesaplayıcı oluşturma
│   ├── new-blog/           # Yeni blog yazısı oluşturma
│   ├── build/              # Build ve doğrulama
│   ├── seo-check/          # SEO kontrolü
│   ├── payroll/            # Bordro kuralları referansı
│   └── quick-ref/          # Hızlı referans
├── hooks/                   # Hook scriptleri
│   └── validate-commit.sh  # Commit doğrulama
└── commands/               # Legacy (geriye uyumluluk)
```

## Subagent'lar

| Agent                  | Amaç                              | Tools                               |
| ---------------------- | --------------------------------- | ----------------------------------- |
| `nextjs-expert`        | Next.js App Router, SSR, metadata | Read, Write, Edit, Bash, Glob, Grep |
| `calculator-developer` | Yeni hesaplayıcı oluşturma        | Read, Write, Edit, Bash, Glob, Grep |
| `blog-writer`          | Blog yazısı oluşturma             | Read, Write, Edit, Glob, Grep       |
| `seo-specialist`       | SEO optimizasyonu                 | Read, Edit, Glob, Grep, WebFetch    |
| `database-manager`     | Supabase işlemleri                | Read, Write, Bash                   |
| `code-reviewer`        | Kod kalitesi kontrolü             | Read, Glob, Grep                    |
| `git-guardian`         | Git işlemleri                     | Bash                                |

## Skill'ler (Slash Commands)

| Skill          | Komut                    | Amaç                       |
| -------------- | ------------------------ | -------------------------- |
| develop        | `/develop <task>`        | Tam geliştirme workflow'u  |
| new-calculator | `/new-calculator <name>` | Yeni hesaplayıcı oluştur   |
| new-blog       | `/new-blog <title>`      | Yeni blog yazısı oluştur   |
| build          | `/build`                 | Build ve doğrula           |
| seo-check      | `/seo-check <path>`      | SEO kontrolü               |
| payroll        | `/payroll`               | Bordro kuralları referansı |
| quick-ref      | `/quick-ref`             | Hızlı referans             |

## MCP Sunucuları

Proje aşağıdaki MCP sunucularını kullanır (`.mcp.json`):

| Server   | Amaç                 |
| -------- | -------------------- |
| supabase | Veritabanı işlemleri |
| github   | GitHub entegrasyonu  |

## Hook'lar

| Event       | Hook             | Amaç                            |
| ----------- | ---------------- | ------------------------------- |
| PostToolUse | prettier         | Edit/Write sonrası kod formatla |
| PreToolUse  | validate-command | Tehlikeli komutları engelle     |

## Geliştirme Workflow'u

1. `/develop <task>` komutu ile başla
2. Git-guardian branch oluşturur
3. İlgili agent'lar görevi analiz eder
4. Task breakdown oluşturulur
5. Adım adım geliştirme yapılır
6. Build ve test kontrolü
7. Rapor oluşturulur

## Referanslar

- [Claude Code Docs](https://code.claude.com/docs)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Supabase MCP](https://supabase.com/docs/guides/getting-started/mcp)
