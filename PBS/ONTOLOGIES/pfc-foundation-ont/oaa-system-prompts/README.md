# OAA System Prompts Archive

This folder contains versioned copies of the **Ontology Architect Agent (OAA) System Prompt** - the specification document that defines how AI agents should create, validate, and govern ontologies.

## Important Distinction

| Component | What It Is | Location |
|-----------|------------|----------|
| **OAA System Prompt** | Specification document defining validation rules, output formats, and workflows | This folder (versioned) |
| **Active System Prompt** | Current production prompt loaded by agents | `PBS/AGENTS/oaa-v6/system-prompt.md` |
| **OAA Visualiser** | Browser tool that validates ontologies using OAA rules | `PBS/TOOLS/ontology-visualiser/` |
| **OAA Agent Instance** | AI agent (Claude, etc.) that loads the system prompt | External (Claude Code, custom agents) |

## Folder Structure

```
oaa-system-prompts/
├── README.md                    # This file
├── oaa-v6.2.0-sys-prompt/       # Current version
│   ├── OAA_System_Prompt_v6.2.0.md
│   ├── OAA_Test_Suite_v6.2.0.md
│   ├── README.md
│   └── test-cases/
└── [future versions...]
```

## Current Version

**v6.2.0** (2026-02-03) - Adds Gate 6 Metadata Completeness

## How It Works

```
┌─────────────────────┐
│   User Request      │
│ "Create ontology"   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   AI Agent          │  ◄── Loads system prompt
│   (Claude Code)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  OAA System Prompt  │  ◄── Defines rules & formats
│     v6.2.0          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Output: Ontology   │
│  JSON-LD + Artifacts│
└─────────────────────┘
```

## Validation Flow

The OAA Visualiser provides browser-based validation that mirrors the OAA System Prompt rules:

```
┌─────────────────────┐     ┌─────────────────────┐
│  Load Ontology      │────►│  OAA Visualiser     │
│  (JSON-LD file)     │     │  (browser-viewer)   │
└─────────────────────┘     └──────────┬──────────┘
                                       │
                            ┌──────────▼──────────┐
                            │  Gate Validation    │
                            │  G1-G6 Checks       │
                            └──────────┬──────────┘
                                       │
                            ┌──────────▼──────────┐
                            │  Audit Report       │
                            │  Export JSON        │
                            └─────────────────────┘
```

## Syncing with PF-Core-BAIV

The OAA system prompts are maintained in both:
- **Azlan-EA-AAA** (this repo) - Primary development
- **PF-Core-BAIV** - Reference copy

To sync:
```bash
# Copy from Azlan to PF-Core-BAIV
cp -r PBS/ONTOLOGIES/pfc-foundation-ont/oaa-system-prompts/oaa-v6.2.0-sys-prompt \
      ~/Documents/PF-Core-BAIV/ontologies/pfc-foundation-ont/oaa-system-prompts/
```

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v6.2.0 | 2026-02-03 | Gate 6 Metadata Completeness |
| v6.1.0 | 2026-02-01 | Entity Property Format |
| v6.0.0 | 2026-01-13 | TDD Framework, Quality Gates |
| v5.0.0 | 2025-12-15 | Initial OAA v5.0.0 Schema |
| v4.0.x | 2026-01-20 | Legacy (PF-Core-BAIV) |
