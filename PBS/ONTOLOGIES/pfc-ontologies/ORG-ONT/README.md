# ORG Ontology - OAA v5.0.0 Compliant

**Current Version:** 2.1.0
**OAA Schema Version:** 5.0.0
**Status:** Production

## Overview

Core organization entity definition for identifying and managing organizations within the platform ecosystem. This ontology provides the foundational entity that all other ontologies reference.

## Files

| File | Version | Format | Description |
|------|---------|--------|-------------|
| `org-ontology-v2.1.0-oaa-v5.json` | 2.1.0 | OAA v5.0.0 JSON-LD | Current production ontology |
| `archive/org-ontology-v2.0.0-oaa-v5.json` | 2.0.0 | OAA v5.0.0 JSON-LD | Previous version |
| `archive/org-ontology-v1.0.0-legacy.json` | 1.0.0 | Legacy format | Archived pre-OAA format |

## Entities

- **Organization** - Core organization entity (schema:Organization)
- **OrganizationContext** - Rich context data (schema:Intangible)

## Relationships

| Relationship | Domain | Range | Description |
|--------------|--------|-------|-------------|
| hasContext | Organization | OrganizationContext | Links org to context data |
| contextBelongsTo | OrganizationContext | Organization | Inverse link back to org |
| isClientOf | Organization | Organization | Agency-client relationship |
| isCompetitorOf | Organization | Organization | Competitive relationship |
| isPartnerOf | Organization | Organization | Partnership relationship |
| isAffiliateOf | Organization | Organization | Affiliate relationship |

## Organization Types

- PFI (Platform Framework Instance)
- Agency
- Client
- Affiliate
- Partner
- Competitor

## Validation

Load in [Ontology Visualiser](https://ajrmooreuk.github.io/Azlan-EA-AAA/) to verify OAA v5.0.0 compliance.

## Change History

| Version | Date | Change |
|---------|------|--------|
| 2.1.0 | 2026-02-01 | G3 compliance: IF-THEN business rules, added contextBelongsTo relationship |
| 2.0.0 | 2026-02-01 | Upgraded to OAA v5.0.0 JSON-LD format |
| 1.0.0 | 2026-01-20 | Initial creation in legacy format |

---

*Part of PFC Ontologies | OAA Ontology Workbench*
