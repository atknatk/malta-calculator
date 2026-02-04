# Malta Calculator - MCP Integrations

## Overview

Model Context Protocol (MCP) servers extend Claude Code with additional capabilities.

## Configured MCP Servers

### 1. Supabase MCP

**Purpose**: Database operations
**Type**: stdio
**Package**: `@supabase/mcp-server`

**Features**:

- Query tables directly
- Run migrations
- Inspect schema
- Generate types

**Configuration**:

```json
{
  "supabase": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server"],
    "env": {
      "SUPABASE_URL": "${NEXT_PUBLIC_SUPABASE_URL}",
      "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
    }
  }
}
```

### 2. GitHub MCP

**Purpose**: GitHub integration
**Type**: http
**URL**: `https://api.githubcopilot.com/mcp/`

**Features**:

- Repository management
- Issue tracking
- Pull request operations

### 3. Filesystem MCP

**Purpose**: File operations
**Type**: stdio
**Package**: `@modelcontextprotocol/server-filesystem`

**Features**:

- Advanced file operations
- Directory management
- File search

### 4. Stripe MCP

**Purpose**: Payment operations
**Type**: http
**URL**: `https://mcp.stripe.com`

**Features**:

- Subscription management
- Payment processing
- Invoice handling

## Security Considerations

1. **Use Development Environment**
   - MCP servers should connect to dev databases
   - Never use production credentials

2. **Environment Variables**
   - Store secrets in `.env.local`
   - Use `${VAR}` syntax for references

3. **Access Control**
   - Limit MCP permissions as needed
   - Review operations before execution

## References

- [Supabase MCP](https://supabase.com/docs/guides/getting-started/mcp)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Stripe MCP](https://mcp.stripe.com)
