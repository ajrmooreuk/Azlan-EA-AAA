# VSOM Ontology - OAA v5.0.0 Compliant

**Current Version:** 2.1.0
**OAA Schema Version:** 5.0.0
**Status:** Production

## Overview

Comprehensive ontology for Vision, Strategy, Objectives, and Metrics (VSOM) framework. Includes **StrategicReviewCycle** for iterative feedback from competitive landscape context.

**Core Principle:** Business Impact is the Driver, Outcomes the Goal, and Value the Measure.

## Bridge Pattern Architecture

VSOM connects to ORG-ONT via OrganizationContext (not directly to Organization):

```
ORG-ONT                                VSOM-ONT
┌─────────────────┐                    ┌─────────────────────────────┐
│   Organization  │                    │      VSOMFramework          │
│        │        │                    │           │                 │
│   hasContext    │                    │           ├── VisionComponent
│        ▼        │                    │           ├── StrategyComponent ◄──┐
│ OrganizationContext ───────────────► │           ├── ObjectivesComponent  │
│                 │  hasStrategicContext│          └── MetricsComponent     │
└─────────────────┘                    │                                    │
                                       │      StrategicReviewCycle ─────────┘
                                       │           │              (iteration)
                                       │           ▼
                                       │    reviewsLandscape → CL-ONT
                                       └─────────────────────────────┘
```

## Files

| File | Version | Format | Description |
|------|---------|--------|-------------|
| `vsom-ontology-v2.1.0-oaa-v5.json` | 2.1.0 | OAA v5.0.0 JSON-LD | Current production ontology |
| `archive/vsom-ontology-v2.0.0-oaa-v5.json` | 2.0.0 | OAA v5.0.0 JSON-LD | Previous version |
| `archive/vsom-ontology-v1.0.0-legacy.json` | 1.0.0 | W4M Legacy format | Archived pre-OAA format |

## Entities

| Entity | Schema.org Base | Description |
|--------|-----------------|-------------|
| VSOMFramework | Intangible | Complete V-S-O-M framework (references org:Organization) |
| VisionComponent | Thing | Long-term aspirational direction (3-10 years) |
| StrategyComponent | Action | Multi-layer strategic approach (1-3 years) |
| ObjectivesComponent | Thing | SMART goals (quarterly/annual) |
| MetricsComponent | PropertyValue | KPIs and performance indicators |
| **StrategicReviewCycle** | Event | **NEW** - Iteration hub linking CL-ONT to strategy updates |
| Market | Place | Vertical/horizontal market classification |
| BusinessModel | CreativeWork | Business model patterns |
| BusinessImpact | Thing | Driver - business effects |
| Outcome | Thing | Goal - desired end states |
| ValueMeasure | PropertyValue | Measure - value delivered |

## Strategic Iteration Pattern

StrategicReviewCycle enables feedback from competitive landscape to strategy:

```
Competitive Landscape (CL-ONT)
        │
        │ Market dynamics, competitor moves, opportunities
        ▼
StrategicReviewCycle ────────────────────────────┐
        │                                         │
        │ reviewsLandscape                        │ informsStrategy
        │ triggeredBy: Scheduled | MetricBreach   │ producesUpdatedStrategy
        │            | MarketEvent | CompetitorAction
        ▼                                         ▼
Vision → Strategy (v1) → Objectives → Metrics → Strategy (v2)
         └──────────────────────────────────────────┘
                        (cascade + feedback)
```

## Cross-Ontology Join Patterns

| Pattern | Path | Use Case |
|---------|------|----------|
| JP-VSOM-001 | Org→Context→VSOM | Full organizational strategic context |
| JP-VSOM-002 | ReviewCycle→Landscape | Competitive feedback informs strategy |
| JP-VSOM-003 | Metric→ReviewCycle | Performance-driven strategy iteration |

## Key Relationships

| Relationship | Domain | Range | Description |
|--------------|--------|-------|-------------|
| hasStrategicContext | OrganizationContext | VSOMFramework | Bridge from ORG-ONT |
| hasVision | VSOMFramework | VisionComponent | Framework cascade |
| hasStrategy | VSOMFramework | StrategyComponent | Framework cascade |
| hasReviewCycle | VSOMFramework | StrategicReviewCycle | Iteration tracking |
| reviewsLandscape | StrategicReviewCycle | cl:CompetitiveLandscape | Cross-ontology to CL-ONT |
| informsStrategy | StrategicReviewCycle | StrategyComponent | Review informs strategy |
| producesUpdatedStrategy | StrategicReviewCycle | StrategyComponent | New strategy version |
| triggeredByMetric | StrategicReviewCycle | MetricsComponent | Metric breach trigger |
| derivesFromVision | StrategyComponent | VisionComponent | Strategy derives from vision |
| alignedToStrategy | ObjectivesComponent | StrategyComponent | Objective alignment |
| trackedByMetric | ObjectivesComponent | MetricsComponent | Objective tracking |

## Dependencies

- **ORG-ONT** v2.1.0+ - Organization, OrganizationContext (required)
- **CL-ONT** v1.0.0+ - CompetitiveLandscape (for iteration)

## Strategy Types

- Corporate
- Marketing
- Operational
- Digital
- AIVisibility
- Growth
- Innovation

## Validation

Load in [Ontology Visualiser](https://ajrmooreuk.github.io/Azlan-EA-AAA/) to verify OAA v5.0.0 compliance.

## Change History

| Version | Date | Change |
|---------|------|--------|
| 2.1.0 | 2026-02-01 | Added StrategicReviewCycle, OrganizationContext bridge, CL-ONT integration, removed duplicate Organization entity |
| 2.0.0 | 2026-02-01 | Upgraded to OAA v5.0.0 JSON-LD format |
| 1.0.0 | 2025-11-14 | Initial W4M VSOM ontology |

---

*Part of PFC Ontologies | OAA Ontology Workbench*
