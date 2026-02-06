# PFC-Ontologies — Platform Foundation Core Ontologies

Reusable ontologies that provide foundational capabilities across all Platform Foundation Instances (PFIs).

## Purpose

- Core domain models reusable across platform instances
- Foundation ontologies for common business concepts
- Standardized schemas for cross-instance interoperability

## Series Architecture

| Series | Directory | Ontologies | Description |
|--------|-----------|------------|-------------|
| **VE-Series** | `VE-Series-ONT/` | VSOM, OKR, VP, RRR, PMF, KPI | Value Engineering — strategic value definition and measurement |
| **PE-Series** | `PE-Series-ONT/` | PPM, PE, EFS | Process Engineering — execution and process management |
| **RCSG-Series** | `RCSG-ONT/`, `EA-ONT/EA-RCSG-Gov-PII/` | GDPR, PII, MCSB, MCSB2, Az-ALZ | Risk, Compliance, Security & Governance |
| **Foundation** | `ORG-ONT/`, `ORG-CONTEXT/` | ORG, ORG-CONTEXT, ORG-MAT | Organization and context hub |
| **Competitive** | `CA-ONT/`, `CL-ONT/`, `GA-ONT/` | CA, CL, GA | Market and competitive intelligence |
| **Orchestration** | `EMC-ONT/` | EMC | Model composition and integration |

## Ontology Catalog (24 total)

| Ontology | Version | OAA | Status | Series |
|----------|---------|-----|--------|--------|
| EMC-ONT | v1.0.0 | v5.0.0 | Compliant | Orchestration |
| ORG-ONT | v2.1.0 | v5.0.0 | Compliant | Foundation |
| ORG-CONTEXT | v1.0.1 | v5.0.0 | Compliant | Foundation |
| ORG-MAT-ONT | v1.0.0 | v5.0.0 | Compliant | Foundation |
| CA-ONT | v2.1.0 | v5.0.0 | Compliant | Competitive |
| CL-ONT | v1.0.0 | v5.0.0 | Compliant | Competitive |
| GA-ONT | v1.0.0 | v5.0.0 | Compliant | Competitive |
| VE-VSOM-ONT | v2.1.0 | v5.0.0 | Compliant | VE-Series |
| VE-OKR-ONT | v2.0.0 | v6.1.0 | Compliant | VE-Series |
| VE-VP-ONT | v1.2.3 | v6.1.0 | Compliant | VE-Series |
| VE-RRR-ONT | v3.1.0 | v5.0.0 | Compliant | VE-Series |
| VE-PMF-ONT | v1.0.0 | v5.0.0 | Compliant | VE-Series |
| VE-KPI-ONT | - | - | Placeholder | VE-Series |
| PE-PPM-ONT | v3.0.0 | v5.0.0 | Compliant | PE-Series |
| PE-Process-Engr-ONT | v2.0.0 | v5.0.0 | Compliant | PE-Series |
| PE-EFS-ONT | v1.0.0 | v5.0.0 | Compliant | PE-Series |
| EA-ONT | - | - | Compliant | PE-Series |
| SA-ONT | v1.0.0 | v6.1.0 | Compliant | PE-Series |
| GDPR-ONT | v1.0.0 | v6.1.0 | Compliant | RCSG-Series |
| PII-GOV-ONT | v3.3.0 | v6.1.0 | Compliant | RCSG-Series |
| MCSB-ONT | v1.0.0 | v5.0.0 | Compliant | RCSG-Series |
| MCSB2-ONT | - | - | Placeholder | RCSG-Series |
| AIR-ONT | - | - | Placeholder | Foundation |
| Az-ALZ-ONT | - | - | Placeholder | RCSG-Series |

## OAA Compliance

All PFC ontologies target OAA compliance. Base level is v5.0.0 (7 gates); upgraded ontologies use v6.1.0 (8 gates):

| Gate | Name | Description |
|------|------|-------------|
| G1 | Schema Structure | Namespace, context, `hasDefinedTerm` format (v6.1.0) |
| G2 | Relationship Cardinality | Typed relationships with cardinality notation |
| G2B | Entity Connectivity | >80% entities connected (meta-nodes excluded) |
| G2C | Graph Connectivity | Single connected component |
| G3 | Business Rules | IF-THEN rules with severity levels |
| G4 | Documentation | All entities have descriptions |
| G5 | Edge-to-Node Ratio | Minimum relationship density |
| G6 | Registry Registration | Entry in unified registry |
| G7 | Cross-Ontology References | Declared bridges to other ontologies (v6.1.0) |
| G8 | Version History | Tracked version lineage (v6.1.0) |

## Related

- Unified Registry: `PBS/ONTOLOGIES/unified-registry/`
- PFI Instance Ontologies: `PBS/ONTOLOGIES/pfi-BAIV-AIV-ONT/`
- Architecture Overview: `PBS/ONTOLOGIES/ONTOLOGY-ARCHITECTURE.md`
- Migration Plan: `PBS/ONTOLOGIES/MIGRATION-PLAN-OAA-v6.1.md`
