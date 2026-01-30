# Azlan Ontology Architecture

**Version:** 3.0.0
**Date:** 2026-01-28
**Status:** APPROVED

---

## 1. Architecture Principles

### 1.1 OAA v5.0.0 Compliance Requirement

> **MANDATORY CONDITION:** All ontologies in the Azlan repository MUST be OAA v5.0.0 compliant before integration into the production ontology ecosystem.

**Compliance Gates (OAA v5.0.0):**

| Gate | Requirement | Status |
|------|-------------|--------|
| G1 | Entity Descriptions ≥20 chars | Required |
| G2 | Relationship Cardinality defined | Required |
| G2B | Entity Connectivity 100% | Required |
| G2C | Graph Connectivity (single component) | Required |
| G3 | Business Rules in IF-THEN format | Required |
| G4 | Schema.org Property Mappings | Required |
| G5 | Test Data Coverage (60-20-10-10) | Required |
| G6 | UniRegistry Entry | Required |

**Non-compliant ontologies:**
- MUST be flagged with `[OAA-PENDING]` status
- MUST have a remediation plan documented
- MUST NOT be used in production integrations until compliant

---

## 2. Ontology Ecosystem Structure

### 2.1 Foundation Ontologies

```
PBS/ONTOLOGIES/
├── foundation-ont/                    # Core foundation ontologies
│   ├── vsom-ont/                      # Vision-Strategy-Objectives-Measures
│   ├── rrr-ont/                       # Roles, RACI, RBAC (v3.0.0)
│   ├── okr-ont/                       # Objectives & Key Results
│   ├── pmf-ont/                       # Product-Market Fit / GTM
│   ├── value-proposition-ont/         # Value Proposition
│   └── oaa-system-prompts/            # OAA System Prompts
│
├── VE-ONT/                            # Value Engineering ontologies
├── CE-ONT/                            # Customer Experience ontologies
│
└── process-mngt-ONT/                  # Process Management ontologies
    └── PPM-ONT/                       # Product Portfolio Management
        └── EPICS-FEATURES-STORIES-ont/ # EFS Ontology (v3.0.0)
```

### 2.2 Ontology Lineage Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ONTOLOGY ECOSYSTEM LINEAGE (v3.0.0)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   LAYER 1: STRATEGY (foundation-ont/vsom-ont)                               │
│   ─────────────────────────────────────────────                             │
│   VSOM / VSEM: Vision → Strategy → Objectives → Measures                    │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│   LAYER 2: CONTEXT (foundation-ont/okr-ont)                                 │
│   ──────────────────────────────────────────                                │
│   OKR / KPI: Objectives & Key Results → KPIs                                │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│   LAYER 3: VALUE DEFINITION (foundation-ont/value-proposition-ont)          │
│   ────────────────────────────────────────────────────────────────          │
│   Value Proposition                                                         │
│   ├── IC (Ideal Customer)                                                   │
│   ├── RRR (Roles, RACI, RBAC) ← foundation-ont/rrr-ont                     │
│   └── ORG Context → (back to VSOM)                                          │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│   LAYER 4: CUSTOMER DEFINITION (foundation-ont/pmf-ont)                     │
│   ─────────────────────────────────────────────────────                     │
│   ICP → Personas → Pains → Gains → Benefits                                 │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│   LAYER 5: SPECIFICATION (process-mngt-ONT/PPM-ONT/EFS)                     │
│   ─────────────────────────────────────────────────────                     │
│   Epics → Features → Stories → Tasks                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. RRR Ontology Definition

> **IMPORTANT:** RRR = **Roles, RACI, RBAC** (NOT Revenue/Retention/Referral)

### 3.1 RRR Components

| Component | Definition | Purpose |
|-----------|------------|---------|
| **Roles** | Functional business roles (C-Suite, Line Managers, etc.) | Define WHO is involved |
| **RACI** | Responsible, Accountable, Consulted, Informed matrix | Define accountability |
| **RBAC** | Role-Based Access Control | Define permissions |

### 3.2 C-Suite Role Modelling

The RRR ontology includes pre-defined models for:
- CEO, COO, CFO, CMO, CTO, CIO, CHRO
- Line Manager roles
- Cross-functional team roles

See: `foundation-ont/rrr-ont/pf-roles-raci-rbac-ontology-v3.0.0.jsonld`

---

## 4. OAA v5.0.0 Compliance Status

### 4.1 Current Ontology Status

| Ontology | Location | OAA Status | Action Required |
|----------|----------|------------|-----------------|
| EFS | process-mngt-ONT/PPM-ONT/EFS | Partial | Complete G5, G6 |
| VSOM | foundation-ont/vsom-ont | Pending Review | Full validation |
| RRR | foundation-ont/rrr-ont | v3.0.0 Compliant | None |
| OKR | foundation-ont/okr-ont | Pending Review | Full validation |
| PMF/GTM | foundation-ont/pmf-ont | Pending Review | Full validation |
| Value Prop | foundation-ont/value-proposition-ont | Pending Review | Full validation |

### 4.2 Required Actions

1. **Run OAA v5.0.0 WORKFLOW D** (Validation) on each ontology
2. **Create UniRegistry entries** for all ontologies
3. **Generate test data** (60-20-10-10 distribution)
4. **Document business rules** in IF-THEN format
5. **Verify entity connectivity** (100% required)

---

## 5. Unified Ontology Registry

### 5.1 Registry Location

```
PBS/ONTOLOGIES/unified-registry/
├── ont-registry-index.json           # Master registry index
├── entries/                          # Individual registry entries
│   ├── Entry-ONT-VSOM-001.json
│   ├── Entry-ONT-RRR-001.json
│   ├── Entry-ONT-OKR-001.json
│   ├── Entry-ONT-PMF-001.json
│   ├── Entry-ONT-VP-001.json
│   └── Entry-ONT-EFS-001.json
└── validation-reports/               # OAA validation reports
```

### 5.2 Registry Entry Schema

Each ontology MUST have a UniRegistry entry following OAA v5.0.0 format:

```json
{
  "@context": "https://platformcore.io/ontology/registry/",
  "@type": "OntologyRegistryEntry",
  "@id": "Entry-ONT-{CODE}-{SEQ}",
  "name": "Ontology Name",
  "version": "x.y.z",
  "oaaVersion": "5.0.0",
  "status": "draft | review | approved | deprecated",
  "complianceStatus": {
    "gate1": "pass | fail | pending",
    "gate2": "pass | fail | pending",
    "gate2b": "pass | fail | pending",
    "gate2c": "pass | fail | pending",
    "gate3": "pass | fail | pending",
    "gate4": "pass | fail | pending",
    "gate5": "pass | fail | pending",
    "gate6": "pass | fail | pending"
  },
  "artifacts": {
    "ontology": "path/to/ontology.jsonld",
    "documentation": "path/to/README.md",
    "testData": "path/to/test-data.json",
    "glossary": "path/to/glossary.json",
    "visualGuide": "path/to/visual-guide.md"
  }
}
```

---

## 6. Integration Requirements

### 6.1 Cross-Ontology Connections

All ontology connections MUST be documented with:

1. **Source ontology** and entity
2. **Target ontology** and entity
3. **Relationship type** and cardinality
4. **Namespace prefix** mapping

### 6.2 Namespace Registry

| Prefix | Namespace | Ontology |
|--------|-----------|----------|
| `vsom:` | https://platformcore.io/ontology/vsom/ | VSOM |
| `rrr:` | https://platformcore.io/ontology/rrr/ | RRR |
| `okr:` | https://platformcore.io/ontology/okr/ | OKR |
| `kpi:` | https://platformcore.io/ontology/kpi/ | KPI |
| `vp:` | https://platformcore.io/ontology/vp/ | Value Proposition |
| `pmf:` | https://platformcore.io/ontology/pmf/ | PMF |
| `gtm:` | https://platformcore.io/ontology/gtm/ | GTM |
| `efs:` | https://platformcore.io/ontology/efs/ | EFS |

---

## 7. Next Steps (Roadmap)

### Phase 1: OAA v5.0.0 Compliance (Current)
- [ ] Validate all foundation ontologies against OAA v5.0.0
- [ ] Create UniRegistry entries for all ontologies
- [ ] Generate missing test data and glossaries
- [ ] Complete entity connectivity validation

### Phase 2: Integration Testing
- [ ] Validate cross-ontology relationships
- [ ] Test lineage traceability end-to-end
- [ ] Verify namespace resolution

### Phase 3: Production Readiness
- [ ] Final OAA v5.0.0 compliance certification
- [ ] Documentation review
- [ ] Stakeholder sign-off

---

## 8. Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 3.0.0 | 2026-01-28 | OAA v5.0.0 | Initial architecture document with OAA compliance requirement |

---

*Architecture Version: 3.0.0 | OAA v5.0.0 Required | Azlan Ontology Ecosystem*
