# Malta Calculator - Required Subagents

## Analysis

Based on the project analysis, the following subagents are required:

## Subagents

### 1. nextjs-expert

**Purpose**: Next.js App Router development
**Model**: Sonnet
**Tools**: Read, Write, Edit, Bash, Glob, Grep

**Use Cases**:

- App Router patterns
- Server/Client components
- Metadata and SEO
- API routes
- Static generation

### 2. calculator-developer

**Purpose**: Create Malta-specific calculators
**Model**: Sonnet
**Tools**: Read, Write, Edit, Bash, Glob, Grep
**Skills**: new-calculator

**Use Cases**:

- Calculator logic implementation
- Malta-specific formulas
- Interactive UI components
- Result visualization

### 3. blog-writer

**Purpose**: SEO-optimized blog content
**Model**: Sonnet
**Tools**: Read, Write, Edit, Glob, Grep
**Skills**: new-blog

**Use Cases**:

- Malta financial guides
- Tax and employment articles
- SEO-optimized content
- Internal linking

### 4. seo-specialist

**Purpose**: Search engine optimization
**Model**: Sonnet
**Tools**: Read, Edit, Glob, Grep, WebFetch, WebSearch
**Skills**: seo-check

**Use Cases**:

- Metadata optimization
- JSON-LD structured data
- Content optimization
- SEO audits

### 5. database-manager

**Purpose**: Supabase database operations
**Model**: Sonnet
**Tools**: Read, Write, Bash

**Use Cases**:

- Schema management
- Query optimization
- Data operations
- Type generation

### 6. code-reviewer

**Purpose**: Code quality assurance
**Model**: Haiku (fast)
**Tools**: Read, Glob, Grep

**Use Cases**:

- Code review
- Pattern validation
- Security checks
- Best practices

### 7. git-guardian

**Purpose**: Git operations
**Model**: Haiku (fast)
**Tools**: Bash

**Use Cases**:

- Branch management
- Commit handling
- Safety checks
- Version control

## Agent Selection Matrix

| Task Type        | Primary Agent        | Supporting       |
| ---------------- | -------------------- | ---------------- |
| New calculator   | calculator-developer | seo-specialist   |
| New blog post    | blog-writer          | seo-specialist   |
| API development  | nextjs-expert        | database-manager |
| SEO improvement  | seo-specialist       | -                |
| Database changes | database-manager     | -                |
| Code review      | code-reviewer        | -                |
| Git operations   | git-guardian         | -                |
