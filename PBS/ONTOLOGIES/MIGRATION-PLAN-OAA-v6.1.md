# Ontology Migration Plan: Consolidate to Azlan under OAA v6.1.0

**Version:** 2.5.0
**Date:** 2026-02-01
**Status:** Phases 1-4 Complete | VE-Series-ONT Structure Added

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
| GA-ONT | v1.0.0 | ✅ Production | [GA-ONT/gap-analysis-v1.0.0-oaa-v5.json](pfc-ontologies/GA-ONT/) |

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
| GA-ONT | **NEW** v1.0.0 | ✅ Yes (CGA Agent support, 18 entities) |
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
| Medium | RRR-ONT | Glossary only | Create Roles/RACI/RBAC ontology (see detailed scope below) |
| Low | ALZ-ONT | MCSB registry only | Create Azure Landing Zone ontology |
| Future | DS-ONT | Not created | Design System ontology from BAIV |
| ✅ Done | GA-ONT | v1.0.0 Production | Gap Analysis ontology (CGA Agent support) |
| ON HOLD | EA-ONT | Instance data | PPM-ONT population data (not separate ontology) |

### VE-Series-ONT (Value Engineering Series)

**Location:** `pfc-ontologies/VE-Series-ONT/`

VE is a **series of 5 interconnected ontologies** organized under a single parent folder. All connect via ORG-Context.

| Order | Folder | Description | Status | Dependencies |
|-------|--------|-------------|--------|--------------|
| 1 | `VE-VSOM-ONT/` | Value Engineering for VSOM | Planned | ORG-Context, VSOM-ONT |
| 2 | `VE-OKR-ONT/` | Value Engineering for OKR | Planned | ORG-Context, OKR-ONT, VE-VSOM |
| 3 | `VE-KPI-ONT/` | Value Engineering for KPIs | Planned | ORG-Context, VE-OKR |
| 4 | `VE-VP-ONT/` | Value Engineering for Value Proposition | Planned | ORG-Context, CL-ONT |
| 5 | `VE-PMF-ONT/` | Value Engineering for Product-Market Fit | Planned | ORG-Context, PMF-ONT, VE-VP |

**VE Series Architecture:**
```
ORG-Context (hub)
    └── hasValueEngineering
            │
            ├── VE-VSOM ──────► VSOM-ONT
            │       └── VE-OKR ──► OKR-ONT
            │               └── VE-KPI
            │
            └── VE-VP ────────► CL-ONT
                    └── VE-PMF ──► PMF-ONT
```

**Directory Structure:**
```
VE-Series-ONT/
├── README.md
├── VE-VSOM-ONT/
├── VE-OKR-ONT/
├── VE-KPI-ONT/
├── VE-VP-ONT/
├── VE-PMF-ONT/
└── archive/          # Legacy VE content
```

### RRR-ONT Scope (Roles/RACI/RBAC)

RRR is a **3-component ontology** for determining contextual authority: **What, Why, When, Who**

#### Component 1: Business Roles (WHO)

Organizational hierarchy from C-Suite to Individual Contributors:

```
C-Suite (CEO, CFO, CTO, CMO, etc.)
    └── Senior Management (VPs, Directors)
            └── Line Managers (Department Heads, Team Leads)
                    └── Teams (Functional Teams, Squads)
                            └── Individual Contributors
```

| Entity | Description |
|--------|-------------|
| Role | Named position with authority scope |
| RoleHolder | Person/entity occupying a role |
| RoleHierarchy | Parent-child role relationships |
| RoleScope | Boundaries of role authority (org unit, geography, function) |

#### Component 2: RACI (WHAT + WHY)

Responsibility assignment for processes and decisions:

| Assignment | Meaning | Contextual Question |
|------------|---------|---------------------|
| **R** - Responsible | Does the work | **WHAT** must be done |
| **A** - Accountable | Owns the outcome | **WHY** authority exists |
| **C** - Consulted | Provides input | **WHAT** expertise needed |
| **I** - Informed | Kept updated | **WHAT** visibility required |

| Entity | Description |
|--------|-------------|
| RACIMatrix | Assignment grid for a process/project |
| RACIAssignment | Role-to-task assignment with RACI type |
| ProcessOwnership | Links RACI to PE-ONT processes |
| ProjectOwnership | Links RACI to PPM-ONT projects |

#### Component 3: RBAC (WHEN + Access Control)

Role-Based Access Control for systems and data:

| Entity | Description | Contextual Question |
|--------|-------------|---------------------|
| Permission | System/data access right | **WHAT** can be accessed |
| PermissionSet | Grouped permissions for a role | **WHO** has access |
| AccessContext | Conditions for access (time, location, state) | **WHEN** access applies |
| AccessAudit | Log of access events | **WHEN** access occurred |

#### RRR Contextual Framework

```
         WHO              WHAT              WHY              WHEN
          │                │                │                │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │  Business │    │   RACI    │    │   RACI    │    │   RBAC    │
    │   Roles   │───►│    R/C/I  │───►│     A     │───►│  Context  │
    └───────────┘    └───────────┘    └───────────┘    └───────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                    │
                            ┌───────▼───────┐
                            │  RRR-ONT v1.0 │
                            │   via ORG-    │
                            │    Context    │
                            └───────────────┘
```

#### RRR-ONT Connections

- `ORG-Context` → hasRolesStructure → RRR-ONT (Business Roles)
- `ORG-Context` → hasRACIFramework → RRR-ONT (RACI)
- `ORG-Context` → hasAccessControl → RRR-ONT (RBAC)
- `ORG-MAT-ONT.OrgStructureProfile` → informsRoles → RRR-ONT
- RRR-ONT → appliesTo → PPM-ONT (project roles/RACI)
- RRR-ONT → appliesTo → PE-ONT (process ownership/RACI)

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
│   ├── GA-ONT/               # Gap Analysis ✅ NEW (CGA Agent support)
│   ├── OKR-ONT/              # Objectives & Key Results
│   ├── ORG-ONT/              # Organisation ✅ UPGRADED v2.1.0
│   ├── ORG-MAT-ONT/          # Organization Maturity ✅ NEW (19 dimensions)
│   ├── PE-ONT/               # Process Engineering ✅
│   ├── PMF-ONT/              # Product-Market Fit
│   ├── PPM-ONT/              # Portfolio Program Project ✅
│   ├── RRR-ONT/              # Roles RACI RBAC
│   ├── VE-Series-ONT/        # Value Engineering Series (5 ontologies)
│   │   ├── VE-VSOM-ONT/      # VE for VSOM
│   │   ├── VE-OKR-ONT/       # VE for OKR
│   │   ├── VE-KPI-ONT/       # VE for KPIs
│   │   ├── VE-VP-ONT/        # VE for Value Proposition
│   │   ├── VE-PMF-ONT/       # VE for Product-Market Fit
│   │   └── archive/          # Legacy VE content
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
