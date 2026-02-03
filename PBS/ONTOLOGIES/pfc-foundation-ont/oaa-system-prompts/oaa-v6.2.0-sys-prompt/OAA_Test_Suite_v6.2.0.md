# OAA System Prompt v6.2.0 - Comprehensive Test Suite

**Version:** 6.2.0
**Date:** 2026-02-03
**Purpose:** Complete test coverage for OAA System Prompt v6.2.0 validation
**Test Count:** 72+ test cases across 8 suites (NEW: Gate 6 Metadata Validation)

---

## Test Suite Summary

| Suite | Test Count | Duration | Pass Rate Required | Status |
|-------|------------|----------|-------------------|--------|
| TS1: Backward Compatibility | 10 | 2 hours | ≥95% | ⬜ Not Run |
| TS2: OAA v6.x Features | 17 | 3 hours | ≥90% | ⬜ Not Run |
| TS3: Competency Questions | 12 | 4 hours | ≥90% | ⬜ Not Run |
| TS4: Quality Gates G1-G5 | 5 | 2 hours | 100% | ⬜ Not Run |
| TS5: Error Handling | 6 | 2 hours | 100% | ⬜ Not Run |
| TS6: Workflow Integration | 3 | 3 hours | 100% | ⬜ Not Run |
| TS7: Visual Output Validation | 6 | 2 hours | 100% | ⬜ Not Run |
| **TS8: Gate 6 Metadata Completeness (NEW)** | **8** | **2 hours** | **100%** | **⬜ Not Run** |
| **TOTAL** | **67** | **20 hours** | **≥93%** | **⬜ Not Run** |

---

## TEST SUITE 1: Backward Compatibility with v5.0.0/v6.1.0

**Objective**: Ensure v6.2.0 processes existing v5.0.0 and v6.1.0 ontologies without errors

### TC1.1: Load Existing OAA v5.0.0 Ontology

**Input**:
```json
{
  "@context": {
    "@vocab": "https://schema.org/",
    "oaa": "https://oaa-ontology.org/v5/"
  },
  "@id": "https://oaa-ontology.org/v5/test/schema",
  "@type": "owl:Ontology",
  "oaa:schemaVersion": "5.0.0",
  "oaa:moduleVersion": "1.0.0",
  "entities": [...]
}
```

**Expected Output**:
- ✓ Loads successfully without errors
- ✓ Recognizes as v5.0.0 format
- ✓ Validates structure
- ✓ Calculates quality metrics
- ✓ Warns about missing G6 metadata fields

**Pass Criteria**:
- No parsing errors: PASS/FAIL
- Structure validated: PASS/FAIL
- Quality metrics calculated: PASS/FAIL
- G6 warnings generated: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL
**Notes**: _____________

---

### TC1.2: Load OAA v6.1.0 Ontology

**Input**: VP Ontology v1.2.2 (pre-metadata fix)

**Expected Output**:
- ✓ Loads successfully
- ✓ Recognizes oaa:moduleVersion
- ✓ Warns about missing `version` and `author` string fields
- ✓ Suggests G6 compliance upgrade

**Pass Criteria**:
- Loads without error: PASS/FAIL
- G6 warning generated: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

## TEST SUITE 8: Gate 6 Metadata Completeness (NEW in v6.2.0)

**Objective**: Validate Gate 6 metadata requirements are enforced

### TC8.1: Complete Metadata - All Fields Present

**Input**:
```json
{
  "@context": {...},
  "@id": "test:schema",
  "@type": "owl:Ontology",
  "name": "Test Ontology",
  "oaa:schemaVersion": "6.2.0",
  "oaa:moduleVersion": "1.0.0",
  "version": "1.0.0",
  "author": "Test Author",
  "dateCreated": "2026-02-03",
  "dateModified": "2026-02-03",
  "creator": {
    "@type": "Organization",
    "name": "Test Organization"
  }
}
```

**Expected Output**:
- ✓ G6 status: PASS
- ✓ All 5 required fields validated
- ✓ version matches oaa:moduleVersion
- ✓ Dates in ISO 8601 format

**Pass Criteria**:
- G6 PASS status: PASS/FAIL
- All fields detected: PASS/FAIL
- Version consistency: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.2: Missing `version` Field

**Input**: Ontology with `oaa:moduleVersion` but no `version` field

**Expected Output**:
- ✓ G6 status: WARN (not FAIL for backward compatibility)
- ✓ Warning: "Missing version field"
- ✓ Suggestion: "Add version field matching oaa:moduleVersion"

**Pass Criteria**:
- Warning generated: PASS/FAIL
- Suggestion provided: PASS/FAIL
- Does not block validation: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.3: Missing `author` Field

**Input**: Ontology with `creator` object but no `author` string

**Expected Output**:
- ✓ G6 status: WARN
- ✓ Warning: "Missing author field"
- ✓ Suggestion: "Add author field for display purposes"

**Pass Criteria**:
- Warning generated: PASS/FAIL
- Suggestion provided: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.4: Missing `dateCreated` Field

**Input**: Ontology without dateCreated

**Expected Output**:
- ✓ G6 status: WARN
- ✓ Warning: "Missing dateCreated field"
- ✓ Suggestion: "Add ISO 8601 dateCreated"

**Pass Criteria**:
- Warning generated: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.5: Missing `dateModified` Field

**Input**: Ontology without dateModified

**Expected Output**:
- ✓ G6 status: WARN
- ✓ Warning: "Missing dateModified field"

**Pass Criteria**:
- Warning generated: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.6: Missing `creator` Object

**Input**: Ontology with `author` string but no `creator` object

**Expected Output**:
- ✓ G6 status: WARN
- ✓ Warning: "Missing creator object"
- ✓ Suggestion: "Add structured creator with @type and name"

**Pass Criteria**:
- Warning generated: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.7: Version Mismatch

**Input**:
```json
{
  "oaa:moduleVersion": "1.2.3",
  "version": "1.2.0"
}
```

**Expected Output**:
- ✓ G6 status: WARN
- ✓ Warning: "version (1.2.0) does not match oaa:moduleVersion (1.2.3)"
- ✓ Suggestion: "Update version to match oaa:moduleVersion"

**Pass Criteria**:
- Mismatch detected: PASS/FAIL
- Warning generated: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

### TC8.8: Invalid Date Format

**Input**:
```json
{
  "dateCreated": "02/03/2026",
  "dateModified": "February 3, 2026"
}
```

**Expected Output**:
- ✓ G6 status: WARN
- ✓ Warning: "dateCreated is not ISO 8601 format"
- ✓ Warning: "dateModified is not ISO 8601 format"
- ✓ Suggestion: "Use YYYY-MM-DD format"

**Pass Criteria**:
- Invalid format detected: PASS/FAIL
- Correct format suggested: PASS/FAIL

**Actual Result**: _____________
**Status**: ⬜ PASS ⬜ FAIL

---

## TEST SUITE 4: Quality Gates G1-G5

### TC4.1: G1 Schema Structure

**Input**: Malformed JSON-LD

**Expected Output**:
- ✓ G1 status: FAIL
- ✓ Error: "Invalid JSON-LD structure"

**Pass Criteria**:
- G1 failure detected: PASS/FAIL

---

### TC4.2: G2 Relationship Cardinality

**Input**: Ontology with object cardinality `{"min": 1, "max": 1}`

**Expected Output**:
- ✓ G2 status: WARN
- ✓ Warning: "Cardinality should use string notation: 1..1"

**Pass Criteria**:
- Object cardinality detected: PASS/FAIL
- String notation suggested: PASS/FAIL

---

### TC4.3: G3 Business Rules Format

**Input**: Business rule without IF-THEN structure

**Expected Output**:
- ✓ G3 status: FAIL
- ✓ Error: "Business rule missing condition/action format"

**Pass Criteria**:
- Invalid format detected: PASS/FAIL

---

### TC4.4: G5 Completeness

**Input**: Ontology with no test data

**Expected Output**:
- ✓ G5 status: WARN
- ✓ Warning: "No test data found"

**Pass Criteria**:
- Missing test data detected: PASS/FAIL

---

## Visualiser Integration Tests

### TC-VIS-1: Load Ontology from Azlan Registry

**Input**: VP Ontology v1.2.3 from Azlan unified-registry

**Expected Output**:
- ✓ Registry entry loaded
- ✓ Version info displayed
- ✓ Author info displayed
- ✓ All gates evaluated

**Pass Criteria**:
- Registry integration works: PASS/FAIL
- Audit export includes registry info: PASS/FAIL

---

### TC-VIS-2: Export Audit File

**Input**: Run validation on VP v1.2.3

**Expected Output**:
- ✓ Audit file downloads as JSON
- ✓ Filename format: `VP-Ontology-audit-1.2.3-2026-02-03.json`
- ✓ Contains all gate results
- ✓ Contains registry cross-reference

**Pass Criteria**:
- Export button visible: PASS/FAIL
- File downloads: PASS/FAIL
- Schema valid: PASS/FAIL

---

## Test Execution Log

| Date | Tester | Suite | Pass | Fail | Notes |
|------|--------|-------|------|------|-------|
| | | | | | |

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Test Lead | | | |
| OAA Owner | | | |
| Registry Admin | | | |
