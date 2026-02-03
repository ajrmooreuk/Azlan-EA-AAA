# OAA System Prompts - Test Suites & Archives

This folder contains **test suites and supporting artifacts** for the OAA System Prompt. The actual system prompt is maintained elsewhere (see below).

## Single Source of Truth

| What | Location |
|------|----------|
| **Active System Prompt** | `PBS/AGENTS/oaa-v6/system-prompt.md` |
| **Test Suites** | This folder (`oaa-system-prompts/`) |
| **Visualiser** | `PBS/TOOLS/ontology-visualiser/` |

## Folder Structure

```
oaa-system-prompts/
├── README.md                      # This file
└── oaa-v6.2.0-sys-prompt/
    ├── README.md                  # Points to active prompt
    └── OAA_Test_Suite_v6.2.0.md   # 72 test cases
```

## Why This Structure?

- **Single source of truth**: The system prompt lives in ONE place (`PBS/AGENTS/oaa-v6/`)
- **No duplication**: Avoids version drift between copies
- **Test suites here**: Supporting artifacts (test cases) stay with version folders
- **Clear separation**: Agents folder = active prompts, this folder = tests & archives

## Current Version

**v6.2.0** (2026-02-03) - Adds Gate 6 Metadata Completeness

## Component Relationships

```
┌─────────────────────────────────┐
│  PBS/AGENTS/oaa-v6/             │
│  └── system-prompt.md           │◄── SINGLE SOURCE OF TRUTH
└─────────────────────────────────┘
              │
              │ defines validation rules
              ▼
┌─────────────────────────────────┐
│  PBS/TOOLS/ontology-visualiser/ │
│  └── browser-viewer.html        │◄── Implements OAA rules in JS
└─────────────────────────────────┘
              │
              │ validates against
              ▼
┌─────────────────────────────────┐
│  PBS/ONTOLOGIES/unified-registry│
│  └── ont-registry-index.json    │◄── Ontology registry
└─────────────────────────────────┘
```

## Version History

| Version | Date | Test Suite |
|---------|------|------------|
| v6.2.0 | 2026-02-03 | 72 test cases (Gate 6 added) |
