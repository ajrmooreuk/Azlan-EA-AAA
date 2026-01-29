# OAA System Prompt v5.0.0 - Comprehensive Test Suite

**Version:** 5.0.0
**Date:** 2026-01-28
**Purpose:** Complete test coverage for OAA System Prompt v5.0.0, with focus on Entity Connectivity fixes
**Test Count:** 89+ test cases across 10 suites
**Delta from v4.0.1:** +30 new tests (TS8: Entity Connectivity, TS9: Graph Connectivity & Density, TS10: Cross-Artifact & UniRegistry)

---

## Test Suite Summary

| Suite | Test Count | Pass Rate Required | Status |
|-------|------------|-------------------|--------|
| TS1: Backward Compatibility | 10 | ≥95% | ⬜ Not Run |
| TS2: New Features (from v4.0.1) | 17 | ≥90% | ⬜ Not Run |
| TS3: Competency Questions | 12 | ≥90% | ⬜ Not Run |
| TS4: Quality Gates (G1-G5) | 5 | 100% | ⬜ Not Run |
| TS5: Error Handling (ET1-ET4) | 6 | 100% | ⬜ Not Run |
| TS6: Workflow Integration | 3 | 100% | ⬜ Not Run |
| TS7: Visual Output Validation | 6 | 100% | ⬜ Not Run |
| **TS8: Entity Connectivity (NEW — GATE 2B)** | **10** | **100%** | **⬜ Not Run** |
| **TS9: Graph Connectivity & Density (NEW — GATE 2C + Density)** | **10** | **100%** | **⬜ Not Run** |
| **TS10: Cross-Artifact & UniRegistry (NEW — GATE 6 + Workflow E)** | **10** | **100%** | **⬜ Not Run** |
| **TOTAL** | **89** | **≥93%** | **⬜ Not Run** |

---

## Suites TS1–TS7: Inherited from v4.0.1

All test cases from TS1–TS7 in `OAA_Test_Suite_v4.0.1.md` are carried forward unchanged. The following gate numbering updates apply:

- References to "5 gates" become "8 gates" (G1, G2, G2B, G2C, G3, G4, G5, G6)
- TC2.4 (ALL PASS) now requires G2B, G2C, and G6 to also pass
- TC6.1 (Workflow A) now includes Step 5 connectivity pre-check

See `OAA_Test_Suite_v4.0.1.md` for full TS1–TS7 definitions. Updated pass criteria for affected tests are noted inline below.

### TC2.4 Update: 8-Gate Validation (ALL PASS)

**Additional Expected Output** (appended to v4.0.1 definition):
```json
{
  "gate2b_entityConnectivity": {
    "required": 10,
    "connected": 10,
    "orphaned": [],
    "percentage": 100,
    "status": "pass"
  },
  "gate2c_graphConnectivity": {
    "components": 1,
    "largestComponent": 10,
    "status": "pass"
  },
  "gate6_crossArtifactConsistency": {
    "status": "pass"
  }
}
```

---

## TEST SUITE 8: Entity Connectivity — GATE 2B (NEW)

**Objective**: Prove that GATE 2B catches orphaned/siloed entities that v4.0.1 missed

---

### TC8.1: 4-of-5 Entities Siloed (Original Bug — MUST FAIL)

**Purpose**: This is the exact scenario that triggered v5.0.0 — a colleague's ontology had 4/5 entities with zero edges.

**Input**:
```json
{
  "entities": [
    {"@id": "Customer", "description": "A customer account"},
    {"@id": "Product", "description": "A product offering"},
    {"@id": "Order", "description": "A purchase order"},
    {"@id": "Invoice", "description": "A billing invoice"},
    {"@id": "Subscription", "description": "A recurring subscription"}
  ],
  "relationships": [
    {
      "name": "hasSubscription",
      "source": "Customer",
      "target": "Subscription",
      "cardinality": "1..*"
    }
  ]
}
```

**Expected GATE 2B Output**:
```json
{
  "gate": "GATE 2B: Entity Connectivity",
  "required": 5,
  "connected": 2,
  "orphaned": ["Invoice", "Order", "Product"],
  "percentage": 40.0,
  "status": "fail"
}
```

**Pass Criteria**:
- GATE 2B status: "fail": PASS/FAIL
- Orphaned list contains exactly ["Invoice", "Order", "Product"]: PASS/FAIL
- Connected count = 2 (Customer, Subscription): PASS/FAIL
- Percentage = 40%: PASS/FAIL
- Overall gate validation BLOCKS ontology completion: PASS/FAIL
- ET5 structured error emitted: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.2: All Entities Connected (MUST PASS)

**Input**:
```json
{
  "entities": [
    {"@id": "Customer", "description": "A customer account"},
    {"@id": "Product", "description": "A product offering"},
    {"@id": "Order", "description": "A purchase order"},
    {"@id": "Invoice", "description": "A billing invoice"},
    {"@id": "Subscription", "description": "A recurring subscription"}
  ],
  "relationships": [
    {"name": "places", "source": "Customer", "target": "Order", "cardinality": "1..*"},
    {"name": "contains", "source": "Order", "target": "Product", "cardinality": "1..*"},
    {"name": "generates", "source": "Order", "target": "Invoice", "cardinality": "1..1"},
    {"name": "hasSubscription", "source": "Customer", "target": "Subscription", "cardinality": "0..*"}
  ]
}
```

**Expected GATE 2B Output**:
```json
{
  "gate": "GATE 2B: Entity Connectivity",
  "required": 5,
  "connected": 5,
  "orphaned": [],
  "percentage": 100.0,
  "status": "pass"
}
```

**Pass Criteria**:
- GATE 2B status: "pass": PASS/FAIL
- Orphaned list empty: PASS/FAIL
- Percentage = 100%: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.3: Single Entity (Edge Case — MUST FAIL)

**Input**:
```json
{
  "entities": [{"@id": "Singleton", "description": "A lone entity"}],
  "relationships": []
}
```

**Expected GATE 2B Output**:
```json
{
  "gate": "GATE 2B: Entity Connectivity",
  "required": 1,
  "connected": 0,
  "orphaned": ["Singleton"],
  "percentage": 0.0,
  "status": "fail"
}
```

**Pass Criteria**:
- Single entity with zero relationships → FAIL: PASS/FAIL
- Orphaned list = ["Singleton"]: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.4: Entity Connected Only as Target (MUST PASS)

**Purpose**: Verify entity appearing only in `rangeIncludes` / `target` counts as connected.

**Input**:
```json
{
  "entities": [
    {"@id": "Manager", "description": "A people manager"},
    {"@id": "Report", "description": "A direct report"}
  ],
  "relationships": [
    {"name": "manages", "source": "Manager", "target": "Report", "cardinality": "1..*"}
  ]
}
```

**Expected**: Both entities connected. GATE 2B PASS at 100%.

**Pass Criteria**:
- "Report" counted as connected (target-only): PASS/FAIL
- GATE 2B status: "pass": PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.5: domainIncludes/rangeIncludes Array Format (MUST PASS)

**Purpose**: Verify GATE 2B handles Schema.org array format correctly.

**Input**:
```json
{
  "entities": [
    {"@id": "Person", "description": "A person"},
    {"@id": "Organization", "description": "An org"},
    {"@id": "Role", "description": "A role"}
  ],
  "relationships": [
    {
      "name": "memberOf",
      "domainIncludes": ["Person"],
      "rangeIncludes": ["Organization", "Role"],
      "cardinality": "0..*"
    }
  ]
}
```

**Expected**: All 3 entities connected via domainIncludes/rangeIncludes arrays. GATE 2B PASS.

**Pass Criteria**:
- All 3 entities resolved from array format: PASS/FAIL
- GATE 2B status: "pass": PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.6: 1-of-N Orphaned (Boundary — MUST FAIL)

**Purpose**: Even a single orphan should fail the gate.

**Input**: 10 entities, 9 connected via relationships, 1 orphaned ("AuditLog" has zero edges).

**Expected GATE 2B Output**:
```json
{
  "gate": "GATE 2B: Entity Connectivity",
  "required": 10,
  "connected": 9,
  "orphaned": ["AuditLog"],
  "percentage": 90.0,
  "status": "fail"
}
```

**Pass Criteria**:
- 90% connectivity still FAILS (100% required): PASS/FAIL
- Single orphan detected: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.7: Step 5 Early Catch — Orphan Detected Before Final Validation

**Purpose**: Prove the enhanced WORKFLOW A Step 5 flags orphans immediately, not deferred to gate validation.

**Input** (during ontology creation):
```
Step 4 output: 5 entities defined (Customer, Product, Order, Invoice, Subscription)
Step 5 input: Define relationships — user provides only: Customer → Subscription
```

**Expected Behavior**:
```
OAA detects 3 orphaned entities at Step 5:
"⚠ CONNECTIVITY CHECK: 3 entities (Product, Order, Invoice) have no relationships.
Every entity must participate in at least one relationship.
Please define relationships for these entities before proceeding."

[OAA does NOT proceed to Step 6]
```

**Pass Criteria**:
- Orphans detected at Step 5 (not deferred to GATE 2B): PASS/FAIL
- OAA halts workflow: PASS/FAIL
- User prompted to add missing relationships: PASS/FAIL
- Warning lists specific orphaned entities: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.8: ET5 Error Format — Connectivity Failure

**Purpose**: Verify the new ET5 structured error format for connectivity issues.

**Input**: Ontology failing GATE 2B with 3 orphaned entities.

**Expected Output**:
```json
{
  "errorType": "ET5",
  "errorName": "connectivity_failure",
  "severity": "blocker",
  "gate": "GATE 2B: Entity Connectivity",
  "orphanedEntities": ["Invoice", "Order", "Product"],
  "connectedEntities": ["Customer", "Subscription"],
  "connectivityPercentage": 40.0,
  "message": "3 entities have zero relationships. All entities must participate in at least one relationship.",
  "suggestion": "Define relationships connecting Invoice, Order, Product to existing entities.",
  "blockingProgress": true
}
```

**Pass Criteria**:
- ET5 format used: PASS/FAIL
- Severity = "blocker": PASS/FAIL
- All orphaned entities listed: PASS/FAIL
- Actionable suggestion provided: PASS/FAIL
- blockingProgress = true: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.9: Custom Domain Pattern — Uncovered Entity Rejection

**Purpose**: Prove custom domain competency validation rejects patterns where required entities lack relationship coverage.

**Input**:
```json
{
  "domainPattern": "custom",
  "customDomain": {
    "name": "fleet-management",
    "requiredEntities": [
      {"name": "Vehicle", "role": "core"},
      {"name": "Driver", "role": "core"},
      {"name": "Route", "role": "core"},
      {"name": "Maintenance", "role": "supporting"}
    ],
    "requiredRelationships": [
      {"source": "Driver", "target": "Vehicle", "predicate": "drives"},
      {"source": "Vehicle", "target": "Route", "predicate": "assignedTo"}
    ]
  }
}
```

**Expected Output**:
```json
{
  "valid": false,
  "uncoveredEntities": ["Maintenance"],
  "message": "Custom domain pattern invalid: entity 'Maintenance' is required but does not appear as source or target in any required relationship."
}
```

**Pass Criteria**:
- Detects "Maintenance" not covered: PASS/FAIL
- Pattern rejected (valid: false): PASS/FAIL
- Message identifies the specific uncovered entity: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.10: Custom Domain Pattern — All Entities Covered (MUST PASS)

**Input**: Same as TC8.9 but with added relationship:
```json
{"source": "Vehicle", "target": "Maintenance", "predicate": "requiresMaintenance"}
```

**Expected**: `{"valid": true}` — all 4 entities appear in at least one relationship.

**Pass Criteria**:
- Pattern accepted (valid: true): PASS/FAIL
- No uncoveredEntities field: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

## TEST SUITE 9: Graph Connectivity & Density — GATE 2C + Density Threshold (NEW)

**Objective**: Validate connected component analysis and edge-to-node ratio enforcement

---

### TC9.1: Single Connected Component (MUST PASS)

**Input**: 5 entities forming one connected graph (Customer→Order→Product, Customer→Subscription, Order→Invoice).

**Expected GATE 2C Output**:
```json
{
  "gate": "GATE 2C: Graph Connectivity",
  "components": 1,
  "largestComponent": 5,
  "totalEntities": 5,
  "status": "pass"
}
```

**Pass Criteria**:
- Components = 1: PASS/FAIL
- GATE 2C status: "pass": PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.2: Two Disconnected Clusters (MUST WARN)

**Input**:
```json
{
  "entities": [
    {"@id": "Customer"}, {"@id": "Order"}, {"@id": "Product"},
    {"@id": "Employee"}, {"@id": "Department"}
  ],
  "relationships": [
    {"source": "Customer", "target": "Order"},
    {"source": "Order", "target": "Product"},
    {"source": "Employee", "target": "Department"}
  ]
}
```

**Expected GATE 2C Output**:
```json
{
  "gate": "GATE 2C: Graph Connectivity",
  "components": 2,
  "clusters": [
    ["Customer", "Order", "Product"],
    ["Department", "Employee"]
  ],
  "status": "warning",
  "message": "2 disconnected clusters found. Provide justification or add bridging relationships."
}
```

**Pass Criteria**:
- Components = 2 detected: PASS/FAIL
- Status = "warning" (not blocker): PASS/FAIL
- Cluster membership correct: PASS/FAIL
- Justification requested: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.3: Three+ Disconnected Clusters (MUST WARN)

**Input**: 9 entities forming 3 isolated clusters of 3 each.

**Expected**: GATE 2C status: "warning", components = 3, all 3 clusters identified.

**Pass Criteria**:
- Components = 3: PASS/FAIL
- All clusters correctly identified: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.4: Density ≥ 0.8 (Production Ready — MUST PASS)

**Input**: 5 entities, 4 relationships (ratio = 4/5 = 0.8).

**Expected Density Output**:
```json
{
  "metric": "Relationship Density",
  "entities": 5,
  "relationships": 4,
  "ratio": 0.8,
  "threshold": 0.8,
  "status": "pass"
}
```

**Pass Criteria**:
- Ratio calculated as 0.8: PASS/FAIL
- Status: "pass": PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.5: Density 0.5–0.79 (WARNING)

**Input**: 10 entities, 6 relationships (ratio = 0.6).

**Expected**:
```json
{
  "metric": "Relationship Density",
  "ratio": 0.6,
  "status": "warning",
  "message": "Relationship density 0.6 below production threshold 0.8. Review for missing relationships."
}
```

**Pass Criteria**:
- Ratio = 0.6: PASS/FAIL
- Status: "warning": PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.6: Density < 0.5 (BLOCKER)

**Input**: 10 entities, 4 relationships (ratio = 0.4).

**Expected**:
```json
{
  "metric": "Relationship Density",
  "ratio": 0.4,
  "status": "fail",
  "severity": "blocker",
  "message": "Relationship density 0.4 below minimum 0.5. Ontology BLOCKED until additional relationships defined."
}
```

**Pass Criteria**:
- Ratio = 0.4: PASS/FAIL
- Status: "fail", severity: "blocker": PASS/FAIL
- Blocks ontology completion: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.7: Density Exactly 0.5 (Boundary — WARNING, Not Blocker)

**Input**: 10 entities, 5 relationships (ratio = 0.5).

**Expected**: Status: "warning" (not "fail"). Ratio 0.5 is at the boundary — above blocker, below production.

**Pass Criteria**:
- Ratio = 0.5 → "warning" not "fail": PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.8: Original Bug Scenario — Density Check

**Purpose**: The original 5-entity/1-relationship ontology should also fail density.

**Input**: 5 entities, 1 relationship (ratio = 0.2).

**Expected**: Status: "fail", severity: "blocker" (0.2 < 0.5).

**Pass Criteria**:
- Original bug scenario BLOCKED by density: PASS/FAIL
- Provides second independent catch (alongside GATE 2B): PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.9: BFS Traversal Correctness

**Purpose**: Verify the BFS algorithm correctly identifies components in a complex graph.

**Input**: 8 entities with a chain (A→B→C→D) and a triangle (E→F→G→E) plus isolated H.

**Expected**: 3 components: [A,B,C,D], [E,F,G], [H]. Note: H also fails GATE 2B (orphaned).

**Pass Criteria**:
- Component count = 3: PASS/FAIL
- Chain identified as single component: PASS/FAIL
- Triangle identified as single component: PASS/FAIL
- Isolated node in own component: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC9.10: Self-Referential Relationship (Entity→Same Entity)

**Purpose**: Verify self-referential relationships (e.g., Organization isSubsidiaryOf Organization) count toward connectivity.

**Input**:
```json
{
  "entities": [{"@id": "Organization"}, {"@id": "Department"}],
  "relationships": [
    {"source": "Organization", "target": "Organization", "name": "isSubsidiaryOf"},
    {"source": "Organization", "target": "Department", "name": "hasDepartment"}
  ]
}
```

**Expected**: Both entities connected. Self-referential edge counts. GATE 2B PASS. GATE 2C: 1 component.

**Pass Criteria**:
- Self-referential edge connects Organization: PASS/FAIL
- Both entities counted as connected: PASS/FAIL
- Single component: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

## TEST SUITE 10: Cross-Artifact & UniRegistry — GATE 6 + Workflow E (NEW)

**Objective**: Validate UniRegistry format, cross-artifact registration, and GATE 6 consistency checks

---

### TC10.1: GATE 6 — Cross-Artifact Consistency (ALL PASS)

**Input**: Complete ontology package with aligned ontology JSON, glossary, test data, visual guide, and registry entry — all referencing the same entities and relationships.

**Expected GATE 6 Output**:
```json
{
  "gate": "GATE 6: Cross-Artifact Consistency",
  "artifacts_checked": 5,
  "entity_alignment": 100,
  "relationship_alignment": 100,
  "inconsistencies": [],
  "status": "pass"
}
```

**Pass Criteria**:
- All artifacts checked: PASS/FAIL
- Zero inconsistencies: PASS/FAIL
- Status: "pass": PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.2: GATE 6 — Entity Mismatch Between Artifacts (MUST FAIL)

**Input**: Ontology JSON has 5 entities, glossary only covers 4 (missing "Invoice").

**Expected**:
```json
{
  "gate": "GATE 6: Cross-Artifact Consistency",
  "inconsistencies": [
    {
      "type": "entity_missing_from_artifact",
      "entity": "Invoice",
      "presentIn": ["ontology"],
      "missingFrom": ["glossary"]
    }
  ],
  "status": "fail"
}
```

**Pass Criteria**:
- Mismatch detected: PASS/FAIL
- Specific entity and artifact identified: PASS/FAIL
- Status: "fail": PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.3: Workflow E — Register New Artifact

**Input**:
```
User: "Register the fleet-management glossary in the UniRegistry"
[Provides glossary artifact]
```

**Expected Behavior**:
1. Artifact type detected: "glossary"
2. Parent ontology identified
3. Relationships extracted
4. Registry entry created in UniRegistry v1.0 format
5. Index updated

**Pass Criteria**:
- Artifact type correctly detected: PASS/FAIL
- UniRegistry v1.0 format used: PASS/FAIL
- Cross-references to parent ontology created: PASS/FAIL
- Index updated: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.4: UniRegistry Format Validation

**Input**: Registry entry in UniRegistry v1.0 format.

**Expected**: Entry validates against UniRegistry schema — all required fields present (entryId, name, version, artifactType, domain, entities, relationships, qualityMetrics, registryMetadata).

**Pass Criteria**:
- All required fields present: PASS/FAIL
- artifactType from valid set of 8: PASS/FAIL
- qualityMetrics includes all 8 gates: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.5: 8 Artifact Types Supported

**Purpose**: Verify all 8 artifact types can be registered.

**Input**: One artifact of each type: ontology, glossary, test-data, visual-guide, validation-report, registry-entry, changelog, business-rules.

**Expected**: All 8 register successfully with correct type classification.

**Pass Criteria**:
- All 8 types accepted: PASS/FAIL
- Each classified correctly: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.6: Registry Query Returns Connected Ontologies

**Input**: Query for ontologies in "marketing" domain.

**Expected**: Results include related artifacts, not just the ontology entry. Cross-references intact.

**Pass Criteria**:
- Related artifacts returned: PASS/FAIL
- Cross-references functional: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.7: GATE 6 Reports in Overall Gate Summary

**Purpose**: Verify GATE 6 appears alongside G1-G5, G2B, G2C in the overall completeness gate summary.

**Input**: Complete ontology validation run.

**Expected**: Gate summary includes all 8 gates with pass/fail status for each.

**Pass Criteria**:
- 8 gates listed in summary: PASS/FAIL
- GATE 6 result included: PASS/FAIL
- Overall status reflects all gates: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.8: Workflow E — Duplicate Artifact Detection

**Input**: Attempt to register a glossary that already exists for the same ontology version.

**Expected**: Warning with similarity score ≥90%, offer to update or create new version.

**Pass Criteria**:
- Duplicate detected: PASS/FAIL
- Similarity score provided: PASS/FAIL
- User prompted with options: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.9: v4.0.1 Ontology Upgrade Path to v5.0.0

**Input**: Ontology created with v4.0.1 (passes G1-G5) but has 2/5 entities siloed.

**Expected**:
- v5.0.0 validation detects the silos via GATE 2B
- Reports specific orphaned entities
- Status: "fail" with migration guidance
- Suggests adding relationships

**Pass Criteria**:
- v4.0.1-passing ontology correctly FAILS v5.0.0 GATE 2B: PASS/FAIL
- Migration guidance provided: PASS/FAIL
- No data loss during validation: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC10.10: Full End-to-End — Workflow A with All 8 Gates

**Purpose**: Complete creation workflow producing an ontology that passes ALL 8 gates.

**Input**:
```
User: "Create a fleet management ontology with vehicles, drivers, routes, maintenance, and fuel records"
```

**Expected Workflow**:
1. Pre-execution check passes
2. Registry queried
3. Domain pattern loaded (custom)
4. Custom domain pattern validates all entities covered by relationships
5. Step 5 connectivity pre-check passes (all entities have edges)
6. 12-step creation completes
7. GATE 1: Entity descriptions ✓
8. GATE 2: Relationship cardinality ✓
9. GATE 2B: Entity connectivity 100% ✓
10. GATE 2C: Single connected component ✓
11. GATE 3: Business rules IF-THEN ✓
12. GATE 4: Property mappings ✓
13. GATE 5: Test data coverage ✓
14. GATE 6: Cross-artifact consistency ✓
15. Density ≥ 0.8 ✓
16. UniRegistry entry generated

**Pass Criteria**:
- All 8 gates pass: PASS/FAIL
- Density ≥ 0.8: PASS/FAIL
- No orphaned entities: PASS/FAIL
- Single connected component: PASS/FAIL
- UniRegistry v1.0 format: PASS/FAIL
- All artifacts generated: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

## Test Results Summary

### Overall Test Results

| Suite | Tests Run | Passed | Failed | Pass Rate | Required | Status |
|-------|-----------|--------|--------|-----------|----------|--------|
| TS1 | __/10 | __ | __ | __% | ≥95% | ⬜ PASS ⬜ FAIL |
| TS2 | __/17 | __ | __ | __% | ≥90% | ⬜ PASS ⬜ FAIL |
| TS3 | __/12 | __ | __ | __% | ≥90% | ⬜ PASS ⬜ FAIL |
| TS4 | __/5 | __ | __ | __% | 100% | ⬜ PASS ⬜ FAIL |
| TS5 | __/6 | __ | __ | __% | 100% | ⬜ PASS ⬜ FAIL |
| TS6 | __/3 | __ | __ | __% | 100% | ⬜ PASS ⬜ FAIL |
| TS7 | __/6 | __ | __ | __% | 100% | ⬜ PASS ⬜ FAIL |
| **TS8** | **__/10** | **__** | **__** | **__%** | **100%** | **⬜ PASS ⬜ FAIL** |
| **TS9** | **__/10** | **__** | **__** | **__%** | **100%** | **⬜ PASS ⬜ FAIL** |
| **TS10** | **__/10** | **__** | **__** | **__%** | **100%** | **⬜ PASS ⬜ FAIL** |
| **TOTAL** | **__/89** | **__** | **__** | **__%** | **≥93%** | **⬜ PASS ⬜ FAIL** |

### Critical Fix Verification Matrix

| Bug Scenario | Gate(s) That Catch It | Test Case(s) | Expected Result |
|-------------|----------------------|-------------|-----------------|
| 4/5 entities siloed | GATE 2B + Density | TC8.1, TC9.8 | FAIL (double catch) |
| 1/N entity orphaned | GATE 2B | TC8.6 | FAIL |
| Disconnected clusters | GATE 2C | TC9.2, TC9.3 | WARNING |
| Ratio < 0.5 | Density | TC9.6 | BLOCKER |
| Custom domain uncovered entity | Pattern validation | TC8.9 | REJECT |
| Orphan at Step 5 | Early catch | TC8.7 | HALT workflow |
| v4.0.1 ontology with silos | GATE 2B upgrade path | TC10.9 | FAIL on v5.0.0 |

### Deployment Recommendation

Based on test results:

**Overall Status**: ⬜ READY FOR PRODUCTION ⬜ NEEDS FIXES ⬜ MAJOR ISSUES

**Justification**: ___________________________________________________________

**Conditions for Deployment**: All TS8 and TS9 tests must pass at 100% — these validate the core fix.

**Known Issues**: ____________________________________________________________

**Rollback Plan**: Revert to v4.0.2 system prompt if v5.0.0 introduces regressions in TS1–TS7.

---

**Test Execution Date**: __________
**Executed By**: __________
**Reviewed By**: __________
**Approved By**: __________

---

*OAA System Prompt v5.0.0 - Comprehensive Test Suite*
*NEW in v5.0.0: Entity Connectivity (TS8), Graph Connectivity & Density (TS9), Cross-Artifact & UniRegistry (TS10)*
*Carries forward all TS1–TS7 from v4.0.1*
