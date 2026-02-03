# OAA System Prompt v6.2.0

**Version:** 6.2.0
**Date:** 2026-02-03
**Status:** Production Ready
**Registry Entry:** PF-CORE-agent-ontology-architect-v6.2.0

## Overview

This folder contains the Ontology Architect Agent (OAA) System Prompt v6.2.0 for use with Claude Code and other AI agents. This version adds Gate 6 (Metadata Completeness) requirements.

## Files

| File | Description |
|------|-------------|
| `OAA_System_Prompt_v6.2.0.md` | Main system prompt for OAA agent |
| `OAA_Test_Suite_v6.2.0.md` | Comprehensive test cases for validation |
| `test-cases/` | Example ontologies for testing |

## What's New in v6.2.0

### Gate 6: Metadata Completeness (NEW)

All ontologies must now include:

| Field | Format | Description |
|-------|--------|-------------|
| `version` | Semantic (1.0.0) | Must match `oaa:moduleVersion` |
| `author` | String | Creator name/organization for display |
| `dateCreated` | ISO 8601 | When ontology was first created |
| `dateModified` | ISO 8601 | When ontology was last modified |
| `creator` | Object | JSON-LD structured creator with `@type` and `name` |

### Enhanced Ontology Header Template

```json
{
  "@context": {...},
  "@id": "https://oaa-ontology.org/v6/{domain}/schema",
  "@type": "owl:Ontology",
  "name": "{Ontology Name}",
  "oaa:schemaVersion": "6.2.0",
  "oaa:moduleVersion": "1.0.0",
  "oaa:previousVersion": null,
  "oaa:domain": "{Business Domain}",
  "oaa:status": "Production",
  "version": "1.0.0",
  "author": "Azlan EA-AAA",
  "dateCreated": "2026-02-03",
  "dateModified": "2026-02-03",
  "creator": {
    "@type": "Organization",
    "name": "PFC Core Capability Framework"
  }
}
```

## Integration with Azlan Repository

This system prompt is the authoritative source for OAA in the Azlan-EA-AAA repository. The OAA Visualiser uses these specifications for validation.

### Visualiser Integration

The browser-viewer.html validates against:
- Gates G1-G5 (OAA v5.0.0/v6.1.0 base)
- Gate G6 (Metadata Completeness - v6.2.0)

### Registry Integration

The OAA system prompt works with:
- `PBS/ONTOLOGIES/unified-registry/` - Ontology registry
- `PBS/TOOLS/ontology-visualiser/` - Browser-based validation

## Usage

### With Claude Code

```bash
# Load the system prompt
cat PBS/ONTOLOGIES/pfc-foundation-ont/oaa-system-prompts/oaa-v6.2.0-sys-prompt/OAA_System_Prompt_v6.2.0.md
```

### With Custom Agents

Reference the system prompt path in your agent configuration:
```
PBS/ONTOLOGIES/pfc-foundation-ont/oaa-system-prompts/oaa-v6.2.0-sys-prompt/OAA_System_Prompt_v6.2.0.md
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 6.2.0 | 2026-02-03 | Added Gate 6 metadata requirements |
| 6.1.0 | 2026-02-01 | Entity Property Format, Output Format section |
| 6.0.0 | 2026-01-13 | TDD framework, 60-20-10-10 test data |
| 5.0.0 | 2025-12-15 | Initial OAA v5.0.0 schema format |

## Related Documentation

- [OAA Architecture Guide](../../tools/ontology-visualiser/OAA-ARCHITECTURE-GUIDE.md)
- [OAA Workbench Guide](../../tools/ontology-visualiser/OAA-WORKBENCH-GUIDE.md)
- [Unified Registry Index](../unified-registry/ont-registry-index.json)
