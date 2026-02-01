# Ontology Migration Plan: Consolidate to Azlan under OAA v6.1.0

**Version:** 2.1.0
**Date:** 2026-02-01
**Status:** Phases 1-4 Complete | PR #19 Merged

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
| ORG-ONT | v2.0.0 | ✅ Production | [ORG-ONT/org-ontology-v2.0.0-oaa-v5.json](pfc-ontologies/ORG-ONT/) |
| CA-ONT | v2.0.0 | ✅ Production | [CA-ONT/competitive-analysis-v2.0.0-oaa-v5.json](pfc-ontologies/CA-ONT/) |
| PE-ONT | v2.0.0 | ✅ Production | [PE-ONT/process-engineering-v2.0.0-oaa-v5.json](pfc-ontologies/PE-ONT/) |
| VSOM-ONT | v2.0.0 | ✅ Production | [VSOM-ONT/vsom-ontology-v2.0.0-oaa-v5.json](pfc-ontologies/VSOM-ONT/) |

---

## Current State (Post-Migration)

### Azlan-EA-AAA/PBS/ONTOLOGIES/pfc-ontologies/

| Folder | Status | OAA v5.0.0 Compliant? |
|--------|--------|----------------------|
| ALZ-ONT | Existing | ⚠️ Has registry entry only (MCSB) |
| CA-ONT | **NEW** v2.0.0 | ✅ Yes |
| CE-ONT | Placeholder | ❌ Empty (readme only) |
| OKR-ONT | Existing | ⚠️ Glossary only |
| ORG-ONT | **NEW** v2.0.0 | ✅ Yes |
| PE-ONT | **NEW** v2.0.0 | ✅ Yes |
| PMF-ONT | Existing | ⚠️ Docs only |
| PPM-ONT | v3.0.0 | ✅ Yes |
| RRR-ONT | Existing | ⚠️ Glossary only |
| VE-ONT | Existing | ⚠️ Mermaid/docs only |
| VSOM-ONT | **UPGRADED** v2.0.0 | ✅ Yes |

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

### Future Ontology Development
These folders need OAA v5.0.0 compliant ontology files created:
- ALZ-ONT (has MCSB registry, needs main ontology)
- CE-ONT (needs Customer Experience ontology)
- OKR-ONT (has glossary, needs main ontology)
- PMF-ONT (has docs, needs ontology)
- RRR-ONT (has glossary, needs main ontology)
- VE-ONT (has diagrams, needs ontology)
- DS-ONT (needs Design System ontology from BAIV)
- GA-ONT (needs Gap Analysis ontology from BAIV)

---

## Final Structure

```
PBS/ONTOLOGIES/
├── pfc-ontologies/           # Platform Foundation Core ontologies
│   ├── ALZ-ONT/              # Azure Landing Zone
│   ├── CA-ONT/               # Competitive Analysis ✅ NEW
│   ├── CE-ONT/               # Customer Experience
│   ├── OKR-ONT/              # Objectives & Key Results
│   ├── ORG-ONT/              # Organisation ✅ NEW
│   ├── PE-ONT/               # Process Engineering ✅ NEW
│   ├── PMF-ONT/              # Product-Market Fit
│   ├── PPM-ONT/              # Portfolio Program Project ✅
│   ├── RRR-ONT/              # Roles RACI RBAC
│   ├── VE-ONT/               # Value Engineering
│   ├── VSOM-ONT/             # Vision Strategy Objectives Metrics ✅ UPGRADED
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
