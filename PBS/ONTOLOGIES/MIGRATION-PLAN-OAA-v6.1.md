# Ontology Migration Plan: Consolidate to Azlan under OAA v6.1.0

**Version:** 2.3.0
**Date:** 2026-02-01
**Status:** Phases 1-4 Complete | CL-ONT + ORG-MAT-ONT Added

---

## Related Documentation

- [OAA-ARCHITECTURE-GUIDE.md](../TOOLS/ontology-visualiser/OAA-ARCHITECTURE-GUIDE.md) - Component relationships and process flows

---

## Migration Summary

### Completed Actions (2026-02-01)

| Phase | Status | Details |
|-------|--------|---------|
| Phase 1: Validation | ✅ Complete | Audited existing Azlan ontologies |
| Phase 2: Migration | ✅ Complete | Migrated ORG, CA, PE ontologies from BAIV |
| Phase 3: Prompts | ✅ Complete | Removed legacy oaa-system-prompts |
| Phase 4: Naming | ✅ Complete | All folders now UPPERCASE-ONT |

### New OAA v5.0.0 Compliant Ontologies

| Ontology | Version | Status | Location |
|----------|---------|--------|----------|
| PPM-ONT | v3.0.0 | ✅ Production | [PPM-ONT/ppm-module-v3.0.0-oaa-v5.json](pfc-ontologies/PPM-ONT/) |
| ORG-ONT | v2.1.0 | ✅ Production | [ORG-ONT/org-ontology-v2.1.0-oaa-v5.json](pfc-ontologies/ORG-ONT/) |
| CA-ONT | v2.1.0 | ✅ Production | [CA-ONT/competitive-analysis-v2.1.0-oaa-v5.json](pfc-ontologies/CA-ONT/) |
| CL-ONT | v1.0.0 | ✅ Production | [CL-ONT/competitive-landscape-v1.0.0-oaa-v5.json](pfc-ontologies/CL-ONT/) |
| PE-ONT | v2.0.0 | ✅ Production | [PE-ONT/process-engineering-v2.0.0-oaa-v5.json](pfc-ontologies/PE-ONT/) |
| VSOM-ONT | v2.1.0 | ✅ Production | [VSOM-ONT/vsom-ontology-v2.1.0-oaa-v5.json](pfc-ontologies/VSOM-ONT/) |
| ORG-MAT-ONT | v1.0.0 | ✅ Production | [ORG-MAT-ONT/org-maturity-v1.0.0-oaa-v5.json](pfc-ontologies/ORG-MAT-ONT/) |

---

## Current State (Post-Migration)

### Azlan-EA-AAA/PBS/ONTOLOGIES/pfc-ontologies/

| Folder | Status | OAA v5.0.0 Compliant? |
|--------|--------|----------------------|
| ALZ-ONT | Existing | ⚠️ Has registry entry only (MCSB) |
| CA-ONT | **UPGRADED** v2.1.0 | ✅ Yes (ORG-ONT + CL-ONT integration) |
| CE-ONT | Placeholder | ❌ Empty (readme only) |
| CL-ONT | **NEW** v1.0.0 | ✅ Yes (OrganizationContext bridge) |
| EA-ONT | ON HOLD | ⚠️ Instance data for PPM-ONT |
| OKR-ONT | Existing | ⚠️ Glossary only |
| ORG-ONT | **UPGRADED** v2.1.0 | ✅ Yes (G3 IF-THEN rules) |
| ORG-MAT-ONT | **NEW** v1.0.0 | ✅ Yes (19 maturity dimensions) |
| PE-ONT | **NEW** v2.0.0 | ✅ Yes |
| PMF-ONT | Existing | ⚠️ Docs only |
| PPM-ONT | v3.0.0 | ✅ Yes |
| RRR-ONT | Existing | ⚠️ Glossary only |
| VE-ONT | Existing | ⚠️ Mermaid/docs only |
| VSOM-ONT | **UPGRADED** v2.1.0 | ✅ Yes (StrategicReviewCycle + CL-ONT iteration) |

---

## Not Migrated (Per User Request)

- **Sierra Dreams test data** - Explicitly excluded from migration

## BAIV Cleanup (Completed)

- Removed duplicate PPM ontology files from PF-Core-BAIV (now consolidated here)
- Deleted empty `ds-e2e-prototype/` directory
- BAIV feature branch `feature/efs-templates-oaa-v5` merged and deleted

---

## Remaining Work (Phase 5+)

### Phase 5: Update Registry Entries
- [ ] Update unified-registry/entries/ with new paths
- [ ] Update ont-registry-index.json

### Phase 6: OrganizationContext Bridge Completion
- [ ] Add hasStrategicContext relationship from OrganizationContext → VSOM-ONT (currently in VSOM, needs ORG-ONT update)

### Future Ontology Development

| Priority | Ontology | Current State | Action Required |
|----------|----------|---------------|-----------------|
| High | CE-ONT | Empty placeholder | Create Customer Experience ontology (connects to ORG-MAT-ONT) |
| High | OKR-ONT | Glossary only | Create OKR ontology (connects to VSOM-ONT) |
| Medium | PMF-ONT | Docs only | Create Product-Market Fit ontology (connects to CL-ONT) |
| Medium | VE-ONT | Mermaid/docs | Create Value Engineering ontology (connects to VSOM-ONT) |
| Medium | RRR-ONT | Glossary only | Create Roles/RACI/RBAC ontology |
| Low | ALZ-ONT | MCSB registry only | Create Azure Landing Zone ontology |
| Future | DS-ONT | Not created | Design System ontology from BAIV |
| Future | GA-ONT | Not created | Gap Analysis ontology from BAIV |
| ON HOLD | EA-ONT | Instance data | PPM-ONT population data (not separate ontology) |

---

## Final Structure

```
PBS/ONTOLOGIES/
├── pfc-ontologies/           # Platform Foundation Core ontologies
│   ├── ALZ-ONT/              # Azure Landing Zone
│   ├── CA-ONT/               # Competitive Analysis ✅
│   ├── CE-ONT/               # Customer Experience
│   ├── CL-ONT/               # Competitive Landscape ✅ NEW (OrganizationContext bridge)
│   ├── EA-ONT/               # Enterprise Architecture (ON HOLD - PPM instance data)
│   ├── OKR-ONT/              # Objectives & Key Results
│   ├── ORG-ONT/              # Organisation ✅ UPGRADED v2.1.0
│   ├── ORG-MAT-ONT/          # Organization Maturity ✅ NEW (19 dimensions)
│   ├── PE-ONT/               # Process Engineering ✅
│   ├── PMF-ONT/              # Product-Market Fit
│   ├── PPM-ONT/              # Portfolio Program Project ✅
│   ├── RRR-ONT/              # Roles RACI RBAC
│   ├── VE-ONT/               # Value Engineering
│   ├── VSOM-ONT/             # Vision Strategy Objectives Metrics ✅
│   └── README.md
│
├── pfi-ontologies/           # Platform Foundation Instance ontologies
│   └── (future)
│
├── unified-registry/         # Registry entries
│   └── entries/
│
├── MIGRATION-PLAN-OAA-v6.1.md  # This document
└── README.md
```

---

## OAA v5.0.0 Compliance Checklist

Each upgraded ontology now has:
- [x] `@context` with schema.org, oaa, rdfs, owl namespaces
- [x] `@id` with proper namespace URL
- [x] `@type: owl:Ontology`
- [x] `oaa:schemaVersion: 5.0.0`
- [x] `oaa:moduleVersion` with semantic version
- [x] `entities` array with proper entity definitions
- [x] `relationships` array with domainIncludes/rangeIncludes
- [x] `businessRules` array with condition/action format
- [x] `changeControl` with version history
- [x] Archive folder with legacy versions

---

## Cross-Ontology Architecture

### OrganizationContext Bridge Pattern

Domain ontologies connect to ORG-ONT via OrganizationContext rather than directly to Organization:

```
org:Organization (core entity)
    └── org:hasContext → org:OrganizationContext (hub)
                              ├── cl:hasCompetitiveLandscape → CL-ONT
                              ├── mat:hasMaturityProfile → ORG-MAT-ONT
                              ├── (future) hasStrategicContext → VSOM-ONT
                              ├── (future) hasTransformationContext → EA data
                              └── (future) hasMarketContext → PMF-ONT
```

**Benefits:**
- ORG-ONT stays clean as foundational entity
- OrganizationContext becomes extensible hub
- Modular composition for PF-Core vs PFI graphs
- Clear separation of concerns

### Join Pattern Specifications

Each context ontology declares join patterns for graph composition:

| Pattern | Path | Use Case |
|---------|------|----------|
| JP-CL-001 | Org→Context→Landscape | Full competitive context |
| JP-CL-002 | Landscape→Analysis | CA-ONT integration |
| JP-CL-003 | Landscape→Strategy | VSOM-ONT integration |
| JP-MAT-001 | Org→Context→MaturityProfile | Organization maturity assessment |
| JP-MAT-002 | Profile→DimensionScores | Access all maturity dimensions |

### PF-Core vs PFI Graphs

- **PF-Core Graph:** Generic templates using core ontologies (ORG, PPM, VSOM)
- **PFI Instance Graph:** Specific org with full context joins (add CL, CA, EA data)

---

## Naming Convention (Enforced)

| Convention | Example |
|------------|---------|
| Folder | `PPM-ONT/` (uppercase, hyphenated) |
| Ontology file | `ppm-module-v3.0.0-oaa-v5.json` |
| Archive | `archive/ppm-module-v2.2.1-legacy.json` |
| README | `README.md` |
| Registry entry | `registry-entry-v1.0.0.jsonld` |

---

*OAA Ontology Workbench v1.1.0 | Be AI Visible Platform*
