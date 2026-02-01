# VE-OKR-ONT (Value Engineering for OKR)

**Status:** Planned
**Order in Series:** 2 of 5
**Dependencies:** ORG-Context, OKR-ONT, VE-VSOM-ONT

## Overview

Value engineering for Objectives and Key Results. Receives value cascade from VE-VSOM and refines it to the OKR level.

## Planned Entities

| Entity | Description |
|--------|-------------|
| OKRValueScore | Composite value score for OKRs |
| KeyResultValueDriver | Value drivers per key result |
| OKRValueCascade | Value cascade through OKR hierarchy |
| ObjectiveValueWeight | Weighting of objectives by value |

## Key Relationships

| Relationship | Range | Description |
|--------------|-------|-------------|
| engineersOKRValue | okr:OKRFramework | Main bridge to OKR-ONT |
| receivesFrom | VE-VSOM-ONT | Receives value cascade |
| refinesTo | VE-KPI-ONT | Refines value to KPI layer |

## Prerequisites

- OKR-ONT must be created first (currently glossary only)
- VE-VSOM-ONT must be created first

## Files (Planned)

| File | Version | Status |
|------|---------|--------|
| `ve-okr-v1.0.0-oaa-v5.json` | 1.0.0 | Planned |

---

*Part of VE-Series-ONT | OAA Ontology Workbench*
