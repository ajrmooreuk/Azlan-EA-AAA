# PE-Process-Engr-ONT (Process Engineering Core)

**Current Version:** 2.0.0
**OAA Schema Version:** 5.0.0
**Status:** Production
**Part of:** PE-Series-ONT

## Overview

Core Process Engineering ontology. Provides comprehensive definitions for designing, orchestrating, and optimizing business processes with agentic AI augmentation. Supports cradle-to-grave process management from vision through execution and continuous improvement.

## Files

| File | Version | Format | Description |
|------|---------|--------|-------------|
| `process-engineering-v2.0.0-oaa-v5.json` | 2.0.0 | OAA v5.0.0 JSON-LD | Current production ontology |
| `archive/process-engineering-v1.0.0-legacy.json` | 1.0.0 | Legacy format | Archived pre-OAA format |

## Entities

| Entity | Schema.org Base | Description |
|--------|-----------------|-------------|
| Process | Action | Structured sequence of activities |
| ProcessPhase | Action | Distinct stage within a process |
| ProcessArtifact | CreativeWork | Deliverables produced by phases |
| ProcessGate | Action | Quality checkpoints |
| ProcessMetric | PropertyValue | Performance indicators |
| AIAgent | SoftwareApplication | AI process augmentation |
| ProcessInstance | Event | Specific execution of process |
| Hypothesis | Claim | Testable assumptions |
| ValueChain | Thing | End-to-end value delivery |
| ProcessPattern | HowTo | Reusable process templates |

## Key Relationships

| Relationship | Domain | Range | Description |
|--------------|--------|-------|-------------|
| hasPhase | Process | ProcessPhase | Process contains phases |
| produces | ProcessPhase | ProcessArtifact | Phases produce artifacts |
| hasGate | ProcessPhase | ProcessGate | Phases have quality gates |
| measures | Process | ProcessMetric | Processes track metrics |
| augmentedBy | ProcessPhase | AIAgent | AI augmentation |
| dependsOn | ProcessPhase | ProcessPhase | Phase dependencies |
| instantiates | Process | ProcessInstance | Process executions |
| validates | Process | Hypothesis | Hypothesis testing |
| partOfValueChain | Process | ValueChain | Value chain membership |
| implementsPattern | Process | ProcessPattern | Pattern implementation |

## Business Rules

- Dependency phases must complete before dependent phases
- Blocking gates must pass for phase completion
- Mandatory artifacts required before phase completion
- Supervised AI agents require human review
- Circular dependencies are rejected

## Validation

Load in [Ontology Visualiser](https://ajrmooreuk.github.io/Azlan-EA-AAA/) to verify OAA v5.0.0 compliance.

## Change History

| Version | Date | Change |
|---------|------|--------|
| 2.0.0 | 2026-02-01 | Upgraded to OAA v5.0.0 JSON-LD format |
| 1.0.0 | 2026-01-18 | Initial creation in legacy format |

## Migration Notes

- Moved from PE-Series-ONT root to PE-Process-Engr-ONT subfolder on Feb 2026
- Core process engineering ontology remains at v2.0.0
- Now parallel to PE-PPM-ONT within PE-Series-ONT

---

*Part of PE-Series-ONT | OAA Ontology Workbench*
