# VSOM Ontology - OAA v5.0.0 Compliant

**Current Version:** 2.0.0
**OAA Schema Version:** 5.0.0
**Status:** Production

## Overview

Comprehensive ontology for Vision, Strategy, Objectives, and Metrics (VSOM) framework integrated with W4M Core Capability and Business Framework.

**Core Principle:** Business Impact is the Driver, Outcomes the Goal, and Value the Measure.

## Files

| File | Version | Format | Description |
|------|---------|--------|-------------|
| `vsom-ontology-v2.0.0-oaa-v5.json` | 2.0.0 | OAA v5.0.0 JSON-LD | Current production ontology |
| `archive/vsom-ontology-v1.0.0-legacy.json` | 1.0.0 | W4M Legacy format | Archived pre-OAA format |

## Entities

| Entity | Schema.org Base | Description |
|--------|-----------------|-------------|
| Organization | Organization | Business entity implementing VSOM |
| VSOMFramework | Intangible | Complete V-S-O-M framework |
| VisionComponent | Thing | Long-term aspirational direction (3-10 years) |
| StrategyComponent | Action | Multi-layer strategic approach (1-3 years) |
| ObjectivesComponent | Thing | SMART goals (quarterly/annual) |
| MetricsComponent | PropertyValue | KPIs and performance indicators |
| Market | Place | Vertical/horizontal market classification |
| BusinessModel | CreativeWork | Business model patterns |
| BusinessImpact | Thing | Driver - business effects |
| Outcome | Thing | Goal - desired end states |
| ValueMeasure | PropertyValue | Measure - value delivered |

## Framework Structure

```
Organization
    └── implements → VSOMFramework
                        ├── hasVision → VisionComponent
                        │                   └── derivesFromVision ←
                        ├── hasStrategy → StrategyComponent
                        │                   └── alignedToStrategy ←
                        ├── hasObjective → ObjectivesComponent
                        │                   └── trackedByMetric →
                        └── hasMetric → MetricsComponent

BusinessImpact → drivesOutcome → Outcome → measuresValue → ValueMeasure
```

## Key Relationships

| Relationship | Description |
|--------------|-------------|
| implementsVSOM | Org → Framework |
| hasVision/Strategy/Objective/Metric | Framework → Components |
| derivesFromVision | Strategy → Vision |
| alignedToStrategy | Objective → Strategy |
| trackedByMetric | Objective → Metric |
| drivesOutcome | Impact → Outcome |
| measuresValue | Outcome → Value |
| operatesInMarket | Org → Market |

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
| 2.0.0 | 2026-02-01 | Upgraded to OAA v5.0.0 JSON-LD format |
| 1.0.0 | 2025-11-14 | Initial W4M VSOM ontology |

---

*Part of PFC Ontologies | OAA Ontology Workbench*
