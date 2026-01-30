# Design System E2E Implementation Plan — Azlan Test Environment

## Overview

This is the **Azlan-specific** implementation plan for testing the DS-E2E workflow in isolation from PF-Core-BAIV.

| Context | Value |
|---------|-------|
| PFI Instance | PFI-BAIV |
| Product | Azlan |
| Repo | [ajrmooreuk/Azlan-EA-AAA](https://github.com/ajrmooreuk/Azlan-EA-AAA) |
| Design System | BAIV (with W4M/Azlan-PFC switch capability) |
| Purpose | Isolated E2E test before production deployment |

---

## 1. Azlan Test Environment Benefits

```mermaid
flowchart LR
    subgraph AZLAN["AZLAN (Isolated Test)"]
        direction TB
        A1["Own Supabase project
        Free tier sufficient"]
        A2["Full E2E workflow
        No blocking dependencies"]
        A3["Brand switching tests
        BAIV → W4M → Azlan-PFC"]
        A4["Safe experimentation
        Won't affect BAIV production"]
    end

    subgraph BAIV["PF-Core-BAIV (Production)"]
        B1["Production Supabase
        Team access required"]
        B2["Full BAIV deployment
        After Azlan validates"]
    end

    AZLAN -->|"Validated workflow"| BAIV

    style AZLAN fill:#fffad1,stroke:#cec528,stroke-width:3px
    style BAIV fill:#c5fff5,stroke:#019587,stroke-width:3px
```

---

## 2. E2E Workflow: Azlan Configuration

```mermaid
flowchart TB
    subgraph SOURCE["SOURCE OF TRUTH"]
        FIGMA["Figma Variables v3
        BAIV: bXCyfNwzc8Z9kEeFIeIB8C
        (or W4M/Azlan-PFC variant)"]
    end

    subgraph EXTRACT["EXTRACTION PIPELINE"]
        MCP["MCP get_variable_defs()
        Raw JSON extraction"]
        TRANSFORM["Transformer
        Figma vars → 3-tier schema"]
        VALIDATE["Validator
        Check palettes, scales, $refs"]
    end

    subgraph STORE["AZLAN SUPABASE (Test)"]
        DS_TABLE["design_system table
        primitives JSONB
        semantics JSONB
        components JSONB"]
        RESOLVE["resolve_token() SQL
        3-tier cascade resolution"]
        BRANDS["brand_variants table
        BAIV / W4M / Azlan-PFC"]
    end

    subgraph CONSUME["AZLAN CONSUMERS"]
        PROVIDER["DesignSystemProvider
        Fetch active DS on load"]
        CSS["CSS Variable Injection
        :root { --color-primary: value }"]
        HOOKS["useToken / useComponentTokens
        Runtime resolution in React"]
        SWITCH["Brand Switcher
        DS_ACTIVE_BRAND env var"]
    end

    FIGMA -->|"On publish"| MCP
    MCP --> TRANSFORM
    TRANSFORM --> VALIDATE
    VALIDATE -->|"Valid"| DS_TABLE
    DS_TABLE --> RESOLVE
    DS_TABLE --> PROVIDER
    DS_TABLE --> BRANDS
    PROVIDER --> CSS
    PROVIDER --> HOOKS
    BRANDS --> SWITCH
    SWITCH --> PROVIDER

    style SOURCE fill:#e2f7ff,stroke:#00a4bf,stroke-width:3px
    style EXTRACT fill:#feedeb,stroke:#e84e1c,stroke-width:3px
    style STORE fill:#c5fff5,stroke:#019587,stroke-width:3px
    style CONSUME fill:#f0e7fe,stroke:#6f0eb0,stroke-width:3px
```

---

## 3. Azlan Feature Breakdown

```mermaid
graph TD
    EPIC["Azlan DS-E2E Test
    Isolated E2E Validation"]

    F1["Feature 1
    Azlan Supabase Setup"]
    F2["Feature 2
    Token Extraction (BAIV)"]
    F3["Feature 3
    React Runtime Integration"]
    F4["Feature 4
    Brand Switching Tests"]
    F5["Feature 5
    Validate → Migrate to BAIV"]

    EPIC --> F1
    EPIC --> F2
    EPIC --> F3
    EPIC --> F4
    EPIC --> F5

    F1S1["Create free-tier
    Supabase project"]
    F1S2["Run migration SQL
    from baiv-production-architecture"]
    F1S3["Test resolve_token()
    locally"]

    F2S1["Extract BAIV tokens
    via MCP"]
    F2S2["Transform to 3-tier
    JSONB format"]
    F2S3["Seed Azlan Supabase
    with tokens"]

    F3S1["Configure Provider
    for Azlan repo"]
    F3S2["Build test page
    with token-driven components"]
    F3S3["Verify CSS injection
    works"]

    F4S1["Add W4M placeholder
    tokens"]
    F4S2["Implement brand
    switcher"]
    F4S3["Test switching
    BAIV ↔ W4M"]

    F5S1["Document validated
    workflow"]
    F5S2["Create migration
    script for BAIV"]
    F5S3["Hand off to
    BAIV production"]

    F1 --> F1S1 --> F1S2 --> F1S3
    F2 --> F2S1 --> F2S2 --> F2S3
    F3 --> F3S1 --> F3S2 --> F3S3
    F4 --> F4S1 --> F4S2 --> F4S3
    F5 --> F5S1 --> F5S2 --> F5S3

    style EPIC fill:#e2f7ff,stroke:#00a4bf,stroke-width:3px
    style F1 fill:#feedeb,stroke:#e84e1c,stroke-width:2px
    style F2 fill:#feedeb,stroke:#e84e1c,stroke-width:2px
    style F3 fill:#c5fff5,stroke:#019587,stroke-width:2px
    style F4 fill:#f0e7fe,stroke:#6f0eb0,stroke-width:2px
    style F5 fill:#fffad1,stroke:#cec528,stroke-width:2px
```

---

## 4. Quick Start: Azlan Setup

### Step 1: Create Supabase Project

```bash
# 1. Go to supabase.com and create free-tier project
# 2. Copy credentials to .env.local:

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
DS_ACTIVE_BRAND=baiv
```

### Step 2: Run Migrations

Use SQL from `baiv-production-architecture-consolidated.md` to create:
- `design_system` table
- `brand_variants` table
- `resolve_token()` function
- RLS policies

### Step 3: Seed Tokens

```bash
# Load BAIV tokens from tokens/baiv-tokens.css into Supabase
# Use extraction pipeline or manual seed script
```

### Step 4: Test Provider

```tsx
// In your Azlan test app:
import { BAIVTokenProvider } from './tokens/baiv-tokens';

export default function App({ children }) {
  return (
    <BAIVTokenProvider defaultMode="light">
      {children}
    </BAIVTokenProvider>
  );
}
```

---

## 5. Brand Switching Configuration

```json
{
  "DS_ACTIVE_BRAND": "baiv",
  "supportedBrands": {
    "baiv": {
      "tokens": "./tokens/baiv-tokens.css",
      "provider": "./tokens/baiv-tokens.tsx"
    },
    "w4m": {
      "tokens": "./tokens/w4m-tokens.css",
      "provider": "./tokens/w4m-tokens.tsx",
      "status": "placeholder"
    },
    "azlan-pfc": {
      "tokens": "./tokens/azlan-pfc-tokens.css",
      "provider": "./tokens/azlan-pfc-tokens.tsx",
      "status": "placeholder"
    }
  }
}
```

To test brand switching:
```bash
# Switch to W4M brand
DS_ACTIVE_BRAND=w4m npm run dev

# Switch back to BAIV
DS_ACTIVE_BRAND=baiv npm run dev
```

---

## 6. What This Validates

| Question | Validated By |
|----------|-------------|
| Does MCP extraction produce valid JSONB? | Feature 2 |
| Does resolve_token() cascade correctly? | Feature 1 |
| Do components render from DB tokens? | Feature 3 |
| Can we switch brands at runtime? | Feature 4 |
| Is the workflow portable to BAIV? | Feature 5 |

---

## 7. Files in This Directory

| File | Purpose |
|------|---------|
| `azlan-ds-config.json` | Azlan-specific configuration |
| `ds-e2e-implementation-plan-azlan.md` | This file |
| `ds-e2e-implementation-plan.md` | Original BAIV plan (reference) |
| `baiv-design-system-e2e-to-production.md` | Full E2E guide |
| `baiv-production-architecture-consolidated.md` | DB schema & architecture |
| `baiv-design-system-skills-plan.md` | Skills/capabilities plan |
| `design-system-ontology-v1.0.0.json` | DS ontology definition |
| `tokens/baiv-tokens.css` | BAIV CSS variables |
| `tokens/baiv-tokens.tsx` | BAIV React provider |

---

*Plan Version: 1.0.0*
*Created: 2026-01-30*
*Environment: Azlan (PFI-BAIV-Product Test)*
*Repo: ajrmooreuk/Azlan-EA-AAA*
