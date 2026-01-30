# DS-E2E Prototype — Azlan Test Environment

Isolated Design System E2E testing environment for PFI-BAIV-Product-Azlan.

## Purpose

- **Isolated testing** of DS-E2E workflow without affecting PF-Core-BAIV
- **Brand switching** capability (BAIV → W4M → Azlan-PFC)
- **Validation** before production deployment to BAIV

## Quick Start

```bash
# 1. Create free Supabase project at supabase.com
# 2. Copy .env.example to .env.local and fill in credentials
# 3. Run migrations from baiv-production-architecture-consolidated.md
# 4. Seed tokens from tokens/baiv-tokens.css
# 5. Test with DS_ACTIVE_BRAND=baiv
```

## Directory Contents

| File | Description |
|------|-------------|
| `azlan-ds-config.json` | Azlan deployment configuration |
| `ds-e2e-implementation-plan-azlan.md` | Azlan-specific implementation plan |
| `ds-e2e-implementation-plan.md` | Original BAIV plan (reference) |
| `baiv-design-system-e2e-to-production.md` | Full E2E guide |
| `baiv-production-architecture-consolidated.md` | DB schema & SQL |
| `design-system-ontology-v1.0.0.json` | Design system ontology |
| `tokens/` | CSS + TSX token files |

## Brand Switching

```bash
# Default: BAIV
DS_ACTIVE_BRAND=baiv npm run dev

# Test W4M (when tokens added)
DS_ACTIVE_BRAND=w4m npm run dev

# Test Azlan-PFC (when tokens added)
DS_ACTIVE_BRAND=azlan-pfc npm run dev
```

## Architecture

```
PFC (Platform Foundation Core)
└── PFI-BAIV (Platform Foundation Instance)
    └── Product: Azlan (this test environment)
        └── Design System: BAIV tokens
            └── Brand variants: BAIV / W4M / Azlan-PFC
```

## Related

- Source: [TeamBAIV/ds-e2e-prototype](https://github.com/TeamBAIV/ds-e2e-prototype)
- Production target: [TeamBAIV/PF-Core-BAIV](https://github.com/TeamBAIV/PF-Core-BAIV)
