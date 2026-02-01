# CA Ontology (Competitive Analysis) - OAA v5.0.0 Compliant

**Current Version:** 2.0.0
**OAA Schema Version:** 5.0.0
**Status:** Production

## Overview

Generalized ontology for analyzing competitors across any market domain. Configurable for specific organizations, sectors, and competitive contexts. Enables AI agents to reason about competitive positioning, market opportunities, and strategic intelligence.

## Files

| File | Version | Format | Description |
|------|---------|--------|-------------|
| `competitive-analysis-v2.0.0-oaa-v5.json` | 2.0.0 | OAA v5.0.0 JSON-LD | Current production ontology |
| `archive/competitive-analysis-v1.0.0-legacy.json` | 1.0.0 | Legacy format | Archived pre-OAA format |

## Entities

- **TargetOrganization** - Client organization for analysis (schema:Organization)
- **CompetitorOrganization** - Competing organizations (schema:Organization)
- **MarketOffering** - Products/services offered (schema:Product)
- **MarketSegment** - Market segments (schema:Intangible)
- **CompetitivePosition** - Market positioning (schema:Intangible)
- **CompetitiveAnalysis** - Analysis reports (schema:CreativeWork)
- **BlueOceanOpportunity** - Untapped opportunities (schema:Intangible)

## Key Relationships

| Relationship | Description |
|--------------|-------------|
| competesWith | Target to competitor relationship |
| offersSolution | Org to market offering |
| operatesInSegment | Org to market segment |
| hasPosition | Org to competitive position |
| analyzesCompetitor | Analysis to competitor |
| identifiesOpportunity | Analysis to blue ocean opportunity |

## Business Rules

- Target must have 3-5 direct competitors
- Blue ocean opportunities require low/no barriers
- Competitors must operate in at least one segment
- Direct competitors must have threat level assigned

## Validation

Load in [Ontology Visualiser](https://ajrmooreuk.github.io/Azlan-EA-AAA/) to verify OAA v5.0.0 compliance.

## Change History

| Version | Date | Change |
|---------|------|--------|
| 2.0.0 | 2026-02-01 | Upgraded to OAA v5.0.0 JSON-LD format |
| 1.0.0 | 2025-10-08 | Initial creation in legacy format |

---

*Part of PFC Ontologies | OAA Ontology Workbench*
