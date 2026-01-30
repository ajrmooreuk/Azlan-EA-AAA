# Init Design System Script Guide

## Overview

`init-design-system.sh` is a template script that bootstraps a new project with the full Design System E2E pipeline. It generates all structural files needed to run the Figma → Supabase → Next.js → Agent flow, with placeholder values for the new project's brand tokens.

**Location:** `ds-e2e-prototype/scripts/init-design-system.sh`
**Repo:** [TeamBAIV/ds-e2e-prototype](https://github.com/TeamBAIV/ds-e2e-prototype)

---

## Prerequisites

- GitHub CLI (`gh`) installed and authenticated
- Git configured
- Access to TeamBAIV GitHub org (or your own org)
- Figma file key for the new project's design system (optional at init)

---

## Usage

```bash
./scripts/init-design-system.sh \
  --repo <github-org/repo-name> \
  --figma-key <figma-file-key> \
  --project-name "<Display Name>"
```

### Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `--repo` | Yes | GitHub org and repo name | `TeamBAIV/my-project` |
| `--project-name` | Yes | Human-readable project name | `"My New Project"` |
| `--figma-key` | No | Figma file key for design system | `bXCyfNwzc8Z9kEeFIeIB8C` |

### Example

```bash
cd /Users/amandamoore/ds-e2e-prototype

# With Figma key
./scripts/init-design-system.sh \
  --repo TeamBAIV/viridian-platform \
  --figma-key abc123XYZ \
  --project-name "Viridian Platform"

# Without Figma key (add later)
./scripts/init-design-system.sh \
  --repo TeamBAIV/client-mvp \
  --project-name "Client MVP"
```

---

## What the Script Generates

### Directory Structure

```
new-project/
├── ds-config.json                       ← Project configuration
├── docs/
│   └── tokens/
│       └── seed-design-system.json      ← Token template with #TODO values
├── supabase/
│   ├── migrations/
│   │   └── 001_design_system.sql        ← Full schema (10 tables + RLS)
│   └── functions/
│       ├── agent-process/               ← Agent edge function (empty)
│       └── extract-design-system/       ← Extraction edge function (empty)
├── src/
│   ├── lib/design-system/
│   │   ├── provider.tsx                 ← DesignSystemProvider component
│   │   ├── types.ts                     ← TypeScript interfaces
│   │   └── index.ts                     ← Barrel exports
│   ├── components/ui/                   ← Token-driven components (empty)
│   └── app/                             ← Next.js pages (empty)
└── README.md                            ← Quick start guide
```

### File Details

#### `supabase/migrations/001_design_system.sql`

Full database schema including:

| Item | Count | Details |
|------|-------|---------|
| Tables | 10 | design_system, layouts, content, profiles, conversations, messages, tool_invocations, conversation_memory, prompt_templates, activity_log |
| RLS Policies | 10 | User-owned data, admin-managed data, audit data |
| Functions | 3 | search_memory (vector), update_conversation_summary (trigger), handle_new_user (trigger) |
| Indexes | 8 | Covering active DS, slugs, user lookups, vector search |
| Extensions | 2 | uuid-ossp, vector |

This SQL is **generic** — no project-specific values. Works with any token set.

#### `src/lib/design-system/provider.tsx`

React context provider that:

- Fetches the active design system from Supabase on load
- Injects CSS variables into `:root` for all primitive tokens
- Provides `resolveToken(path)` for 3-tier cascade resolution
- Follows `$ref` chains: component → semantic → primitive → value

**Exported hooks:**

| Hook | Purpose | Example |
|------|---------|---------|
| `useDesignSystem()` | Full context access | `const { designSystem, loading } = useDesignSystem()` |
| `useToken(path)` | Resolve single token | `const color = useToken('primary.surface.default')` |
| `useComponentTokens(component, variant)` | Get component bundle | `const btn = useComponentTokens('button', 'primary')` |

#### `src/lib/design-system/types.ts`

TypeScript interfaces for the 3-tier ontology:

| Type | Description |
|------|-------------|
| `PrimitivesSchema` | Colors (palettes × scales), typography, spacing, borderRadius |
| `SemanticsSchema` | Intent-based tokens (primary, secondary, etc.) with surface/border/text |
| `ComponentsSchema` | Component token bundles (button, card, input, alert, badge) |
| `SemanticTokenRef` | `{ ref: string, value: string }` — the $ref resolution unit |
| `DesignSystemDocument` | Top-level document combining all tiers |

#### `ds-config.json`

Project configuration:

```json
{
  "project": {
    "name": "Project Name",
    "repo": "org/repo",
    "created": "2026-01-27T..."
  },
  "figma": {
    "fileKey": "your-key-or-TODO",
    "extractionEndpoint": "get_variable_defs"
  },
  "supabase": {
    "projectRef": "TODO_ADD_SUPABASE_PROJECT_REF",
    "migrationFile": "supabase/migrations/001_design_system.sql"
  },
  "designSystem": {
    "ontologyVersion": "1.0.0",
    "tokenTiers": ["primitives", "semantics", "components"],
    "seedFile": "docs/tokens/seed-design-system.json"
  }
}
```

#### `docs/tokens/seed-design-system.json`

Token template following the 3-tier ontology with `#TODO` placeholders:

- **Primitives:** 3 palettes (primary, secondary, neutral) with scale steps, typography families/sizes, spacing, borderRadius
- **Semantics:** primary, secondary, neutral intents with surface/border/text mappings using `$ref` to primitives
- **Components:** button, card, input bundles with `$ref` to semantics

Replace all `#TODO` values with the new project's brand tokens.

---

## After Running the Script

### Step 1: Configure Supabase

```bash
cd new-project
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### Step 2: Fill Token Values

Edit `docs/tokens/seed-design-system.json` and replace all `#TODO` with actual values from:
- Figma Variables (via MCP `get_variable_defs()`)
- Or manually from brand guidelines

### Step 3: Seed the Database

Insert the token JSON into the `design_system` table with `is_active = true`.

### Step 4: Scaffold Next.js

```bash
npx create-next-app@latest src --typescript --tailwind --app
cd src && npm install @supabase/supabase-js
```

### Step 5: Wire Up Provider

```tsx
// src/app/layout.tsx
import { DesignSystemProvider } from '@/lib/design-system';

export default function RootLayout({ children }) {
  return (
    <DesignSystemProvider
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
      supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
    >
      {children}
    </DesignSystemProvider>
  );
}
```

---

## What's Generic vs Project-Specific

| File | Generic | Project-Specific |
|------|---------|-----------------|
| `001_design_system.sql` | ✅ | - |
| `provider.tsx` | ✅ | - |
| `types.ts` | ✅ | - |
| `index.ts` | ✅ | - |
| `ds-config.json` | - | ✅ Figma key, Supabase ref |
| `seed-design-system.json` | Structure ✅ | Values ❌ (brand tokens) |
| `README.md` | - | ✅ Project name |

---

## Related

- **Epic:** [#173](https://github.com/TeamBAIV/PF-Core-BAIV/issues/173) - Design System E2E to Production
- **Feature:** [#178](https://github.com/TeamBAIV/PF-Core-BAIV/issues/178) - Reusable Cross-Repo Template
- **Spec:** `PBS/DESIGN-SYSTEM/so-design-system-e2e/baiv-production-architecture-consolidated.md`
- **Plan:** `PBS/DESIGN-SYSTEM/so-design-system-e2e/ds-e2e-implementation-plan.md`

---

*Version: 1.0.0*
*Created: 2026-01-27*
