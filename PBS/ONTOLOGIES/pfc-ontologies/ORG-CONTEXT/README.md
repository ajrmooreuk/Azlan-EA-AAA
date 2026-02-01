# ORG-CONTEXT (Organization Context Hub)

**Status:** In Development
**OAA Schema Version:** 5.0.0

## Overview

The Organization Context hub serves as the central connection point for organizational ontologies. It provides the OrganizationContext entity that bridges ORG-ONT to domain-specific ontologies including VE-Series, VSOM, CL-ONT, and others.

## Architecture

```
ORG-ONT
┌─────────────────┐
│   Organization  │
│        │        │
│   hasContext    │
│        ▼        │
│ OrganizationContext ──────────┬──► VE-Series-ONT (hasValueEngineering)
│                 │              ├──► VSOM-ONT (hasStrategicContext)
│                 │              ├──► CL-ONT (hasCompetitiveLandscape)
│                 │              ├──► PE-Series-ONT (hasProcessEngineering)
│                 │              └──► ORG-MAT-ONT (hasMaturityProfile)
└─────────────────┘
```

## Directory Structure

```
ORG-CONTEXT/
├── README.md                    # This file
├── ORG-MAT-ONT/                 # Organization Maturity (migrated)
│   ├── README.md
│   └── org-maturity-v1.0.0-oaa-v5.json
└── ont-competitor-ref-files/    # Competitive Analysis reference files
    ├── pf-competitive-analysis-ontology (1).json
    ├── pf-competitive-analysis-glossary (1).md
    └── ...
```

## Contents

### ORG-MAT-ONT (Organization Maturity)

Located in `ORG-MAT-ONT/`:

| File | Version | Description |
|------|---------|-------------|
| `org-maturity-v1.0.0-oaa-v5.json` | 1.0.0 | Organization maturity ontology (19 dimensions) |

Provides structured assessment framework covering size, sector, geography, technology, marketing, digital transformation, data, process, talent, innovation, governance, security, sustainability, and ecosystem maturity.

### Competitive Analysis Reference Files

Located in `ont-competitor-ref-files/`:

| File | Description |
|------|-------------|
| `pf-competitive-analysis-ontology (1).json` | Competitive analysis ontology schema |
| `pf-competitive-analysis-glossary (1).md` | Terminology glossary |
| `pf-competitive-analysis-implementation-guide (1).md` | Implementation guide |
| `pf-competitive-analysis-registry-entry (1).json` | Registry entry |
| `pf-competitive-analysis-test-data (1).json` | Test data for validation |
| `pf-competitive-analysis-validation-report (1).md` | Validation report |
| `pmf_comprehensive_docs.md` | PMF comprehensive documentation |

## Key Relationships

| Relationship | Domain | Range | Description |
|--------------|--------|-------|-------------|
| hasContext | org:Organization | OrganizationContext | Organization to context bridge |
| hasValueEngineering | OrganizationContext | VE-* | Bridge to VE Series |
| hasStrategicContext | OrganizationContext | vsom:VSOMFramework | Bridge to VSOM |
| hasCompetitiveLandscape | OrganizationContext | cl:CompetitiveLandscape | Bridge to CL-ONT |
| hasProcessEngineering | OrganizationContext | pe:Process | Bridge to PE Series |
| hasMaturityProfile | OrganizationContext | mat:MaturityProfile | Bridge to ORG-MAT-ONT |

## Dependencies

- **ORG-ONT** - Parent organization ontology
- **VE-Series-ONT** - Value Engineering series (6 ontologies)
- **VSOM-ONT** - Vision-Strategy-Objectives-Metrics (within VE-VSOM-ONT)
- **CL-ONT** - Competitive Landscape
- **PE-Series-ONT** - Process Engineering series
- **ORG-MAT-ONT** - Organization Maturity (within ORG-CONTEXT)

## Migration Notes

- Competitive analysis files migrated from `PF-Core-BAIV/PBS/ONTOLOGIES/pfc-ontologies/pfc-ont-competitive-analysis/` on Feb 2026
- ORG-MAT-ONT migrated from standalone folder to ORG-CONTEXT on Feb 2026
- ORG-CONTEXT serves as the hub connecting organizational context to domain ontologies
- Files to be converted to OAA v5.0.0 JSON-LD format

---

*Part of PFC Ontologies | OAA Ontology Workbench*
