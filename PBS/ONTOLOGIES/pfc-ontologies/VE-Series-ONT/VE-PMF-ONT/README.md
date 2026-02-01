# VE-PMF-ONT (Value Engineering for Product-Market Fit)

**Status:** In Development
**Order in Series:** 5 of 5
**Dependencies:** ORG-Context, VE-VP-ONT

## Overview

Value engineering for Product-Market Fit. Terminal node in the market value track, validating value proposition against market fit indicators. This folder now contains the base PMF-ONT content including agent specifications, WTP (Willingness To Pay) models, and GTM (Go-To-Market) frameworks.

## Base PMF-ONT Content (Migrated)

The following files were migrated from the standalone pmf-ont folder:

### Agent Specifications
| File | Description |
|------|-------------|
| `PF-CORE_VE_ProdDev-PMF-GTM_Agent-0_Orchestrator (3).md` | PMF-GTM Orchestrator agent |
| `PF-CORE_VE_ProdDev-PMF-GTM_Agent-1_Ideation_Validation (3).md` | Ideation & Validation agent |
| `PF-CORE_VE_ProdDev-PMF-GTM_Agent-2_Technical_Architecture (3).md` | Technical Architecture agent |
| `PF-CORE_VE_ProdDev-PMF-GTM_Agent-3_GTM_Strategy (3).md` | GTM Strategy agent |
| `PF-CORE_VE_ProdDev-PMF-GTM_Agent-4_PMF_Iteration (3).md` | PMF Iteration agent |

### Architecture & Documentation
| File | Description |
|------|-------------|
| `PMF-GTM-README.md` | Main PMF-GTM documentation |
| `PMF-GTM-System-Architecture.md` | System architecture overview |
| `PF-CORE_VE_ProdDev-PMF-GTM_Visual_Guide.md` | Visual guide for PMF-GTM |

### WTP (Willingness To Pay) Framework
| File | Description |
|------|-------------|
| `wtp_ontology_schema (2).json` | WTP ontology schema (JSON) |
| `wtp_interview_process.md` | WTP interview methodology |
| `pmf_wtp_team_implementation.md` | Team implementation guide |
| `pricing_feedback_structure.md` | Pricing feedback structure |

### BAIV Examples
| File | Description |
|------|-------------|
| `baiv_executive_summary (3).md` | Executive summary |
| `baiv_expanded_framework (1).md` | Expanded framework |
| `baiv_pmf_example (2-4).md` | PMF example iterations |

### Process Documentation
| File | Description |
|------|-------------|
| `pmf_process_explanation (2-3).md` | PMF process explanation |
| `pmf_process_overview (3).mermaid` | Process overview diagram |

## Planned VE Entities

| Entity | Description |
|--------|-------------|
| PMFValueScore | Product-market fit value score |
| MarketValueOpportunity | Market value opportunity sizing |
| FitValueIndicator | Value indicators for fit assessment |
| ValueScaleReadiness | Readiness for value scaling |
| RetentionValueSignal | Value signals from retention |
| GrowthValuePotential | Value growth potential |

## Key Relationships

| Relationship | Range | Description |
|--------------|-------|-------------|
| engineersPMF | pmf:ProductMarketFit | Main bridge to base PMF content |
| receivesFrom | VE-VP-ONT | Receives validated value |
| validatesInMarket | cl:MarketSegment | Market validation |

## Prerequisites

- VE-VP-ONT must be created first

## Files

| File | Version | Status |
|------|---------|--------|
| `wtp_ontology_schema (2).json` | - | Base (migrated) |
| `ve-pmf-v1.0.0-oaa-v5.json` | 1.0.0 | Planned (VE extension) |

## Migration Notes

- PMF-ONT content moved from `/PBS/ONTOLOGIES/pfc-ontologies/pmf-ont/` on Feb 2026
- Contains 5 agent specifications for PMF-GTM workflow
- WTP ontology schema to be converted to OAA v5 JSON format
- VE extension will add value engineering entities and relationships

---

*Part of VE-Series-ONT | OAA Ontology Workbench*
