# Architecture Decision Record Log — Ontology Visualiser

**Living document** — append new ADRs as decisions are made during development.

Aligned to the `sa:ArchitectureDecisionRecord` entity in the Solution Architecture Ontology (SA-ONT v1.0.0) and the Solution Architect role definition in the RRR Ontology (VE-RRR-ONT v3.1.0).

| Property | Value |
|----------|-------|
| Product | OAA Ontology Visualiser |
| Repo | Azlan-EA-AAA |
| Created | 2026-02-04 |
| Last Updated | 2026-02-04 |
| VSOM Alignment | L3 (Technology Platform), P1 (Process Excellence) |

## Role Governance (from RRR Ontology)

Architecture decisions in this log are governed by the role hierarchy defined in `RRR-DATA-architectural-roles-v1.0.0.jsonld`:

```
CTO
└── Enterprise Architect (EA) — governance, standards, cross-cutting alignment
    └── Solution Architect (SA) — solution design, ADR ownership, implementation architecture
```

### RACI for ADRs

| Activity | SA | EA | CTO |
|----------|----|----|-----|
| Identify decision requiring ADR | **R** | C | I |
| Document context and alternatives | **R/A** | C | I |
| Make architecture decision | **R** | C (cross-cutting) | I |
| Approve decision (within SA scope) | **A** | I | I |
| Approve decision (cross-cutting / strategic) | R | **A** | I |
| Escalate decision (enterprise impact) | R | R | **A** |
| Maintain ADR log | **R/A** | I | I |
| Review ADRs at governance gate | C | **R/A** | I |

### SA Decision Authority (from RRR Ontology)

The Solution Architect has authority over:
- Solution component selection
- Integration approach and patterns
- Database schema design direction
- API contract definitions
- Performance optimisation approach
- Security control implementation (consulted by Security Architect)
- Agent handoff specifications
- Technology component selection (within EA guidelines)
- Build vs buy recommendations
- Solution testing approach

Decisions that cross enterprise architecture boundaries (e.g., ADR-001 storage architecture, ADR-005 multi-tenancy) require EA consultation.

### Source References

| Document | Path |
|----------|------|
| RRR Ontology Definition | `PBS/ONTOLOGIES/pfc-ontologies/VE-Series-ONT/VE-RRR-ONT/pf-RRR-ONT-v3.1.0.jsonld` |
| SA Role Data | `PBS/ONTOLOGIES/pfc-ontologies/VE-Series-ONT/VE-RRR-ONT/RRR-DATA-architectural-roles-v1.0.0.jsonld` |
| SA Ontology (SA-ONT) | `PBS/ONTOLOGIES/pfc-ontologies/VE-Series-ONT/VE-RRR-ONT/RRR-Sol-Architect-role-import/solution-architecture-ontology-v1.0.0-draft (2).json` |
| RRR Glossary | `PBS/ONTOLOGIES/pfc-ontologies/VE-Series-ONT/VE-RRR-ONT/pf-roles-raci-rbac-glossary-v3.0.0.json` |

---

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](#adr-001) | Storage Architecture: Supabase-First | Accepted | 2026-01-31 |
| [ADR-002](#adr-002) | Validation Location: Client + Server | Accepted | 2026-01-31 |
| [ADR-003](#adr-003) | Graph Library: Retain vis.js | Accepted | 2026-01-31 |
| [ADR-004](#adr-004) | Tier Navigation: Separate Views + Inline Expansion | Accepted | 2026-01-31 |
| [ADR-005](#adr-005) | Multi-Tenancy: Shared Supabase with RLS | Accepted | 2026-01-31 |
| [ADR-006](#adr-006) | Compliance Enforcement: Allow + Recommend | Accepted | 2026-01-31 |
| [ADR-007](#adr-007) | Branding Control: RBAC-Protected | Accepted | 2026-01-31 |
| [ADR-008](#adr-008) | Theming Source: Figma MCP Primary, CSS Fallback | Accepted | 2026-01-31 |
| [ADR-009](#adr-009) | Modularisation: Native ES Modules (No Build Step) | Accepted | 2026-02-04 |
| [ADR-010](#adr-010) | Rollup Default View: Series View (6 Nodes) | Proposed | 2026-02-04 |
| [ADR-011](#adr-011) | Cross-Ontology Detection: Namespace Prefix Scanning | Proposed | 2026-02-04 |
| [ADR-012](#adr-012) | Supabase Project: Dedicated (Not Shared with ds-e2e) | Proposed | 2026-02-04 |
| [ADR-013](#adr-013) | Placeholder Ontologies: Show with Badge | Proposed | 2026-02-04 |

---

## ADR-001

### Storage Architecture: Supabase-First

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-01-31 |
| Decision Maker | Solution Architect (human) |
| VSOM Alignment | L2-KR2.1 (Data Foundation), L3-KR3.1 (Technology Platform) |
| Source | HLD-VISUALISER-ENHANCED-v1.0.0.md, Decision D1 |

**Context:** The visualiser needs a persistent storage backend to replace file-by-file loading. Three options were evaluated for how ontologies are stored and retrieved.

**Decision:** Option A — Supabase-First. All ontologies stored in Supabase Postgres with JSONB. Visualiser fetches from DB as primary source.

**Alternatives Considered:**

| Option | Description | Why Not |
|--------|-------------|---------|
| B: Hybrid (Local + Sync) | Work offline with files, sync to Supabase when connected | Sync complexity, potential conflicts, duplicate storage |
| C: Registry-as-Service | Central PFC REST/GraphQL API | Single point of failure, cross-org access control complexity, higher infrastructure cost |

**Rationale:**
- Single source of truth for all PFI instances
- Real-time sync across instances without custom sync logic
- Version history built into Postgres
- Cross-ontology queries via SQL (critical for rollup and cross-reference detection)
- Supabase is already in the technology stack (ds-e2e-prototype)

**Consequences:**
- (+) Unified registry queryable from any client
- (+) Built-in auth, RLS, and Edge Functions
- (-) Requires Supabase project setup per PFI deployment
- (-) Network dependency for primary operations (mitigated by IndexedDB cache)

---

## ADR-002

### Validation Location: Client + Server

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-01-31 |
| Decision Maker | Solution Architect (human) |
| VSOM Alignment | P3 (Compliance) |
| Source | HLD-VISUALISER-ENHANCED-v1.0.0.md, Decision D2 |

**Context:** OAA v6.1.0 validation gates (G1-G6) can run in the browser, on the server (Edge Function), or both.

**Decision:** Both — client-side validation for immediate feedback, server-side validation as authoritative gate before database writes.

**Alternatives Considered:**

| Option | Why Not |
|--------|---------|
| Browser only | No enforcement on API uploads; non-compliant data could enter DB |
| Server only | Slow feedback loop; user must wait for round-trip to see issues |

**Rationale:**
- Client-side gives instant feedback during editing/upload
- Server-side prevents non-compliant data in production environment (enforced via `validate_for_environment()` trigger)
- Dev environment allows non-compliant with warnings; prod requires compliance

**Consequences:**
- (+) Fast UX with authoritative enforcement
- (-) Validation logic maintained in two places (JS + Edge Function)
- Mitigation: shared validation rules as JSON config consumed by both

---

## ADR-003

### Graph Library: Retain vis.js

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-01-31 |
| Decision Maker | Solution Architect (human) |
| VSOM Alignment | P1 (Process Excellence) |
| Source | HLD-VISUALISER-ENHANCED-v1.0.0.md, Decision D4 |

**Context:** The current visualiser uses vis-network (vis.js). Alternatives include D3.js and Cytoscape.js.

**Decision:** Retain vis.js (vis-network v9.1.2).

**Alternatives Considered:**

| Option | Why Not |
|--------|---------|
| D3.js | Lower-level — would require rewriting all graph rendering, physics, interaction from scratch. More flexible but far more effort. |
| Cytoscape.js | Better graph analysis APIs but would require rewriting all rendering code. Less mature community. |

**Rationale:**
- Already integrated and working
- Handles 500+ nodes with Barnes-Hut physics without performance issues
- Built-in hierarchical layout (useful for drill-through)
- Clustering API available if node count exceeds performance thresholds
- Avoids rewrite risk

**Consequences:**
- (+) No migration effort
- (+) Existing physics config and node styling preserved
- (-) vis.js has limited compound/nested node support — tiered navigation will use view switching rather than nested subgraphs
- (-) vis.js community is less active than D3 — acceptable given current feature set covers needs

**Revisit trigger:** If node count regularly exceeds 1,000 or if nested subgraph rendering becomes a hard requirement.

---

## ADR-004

### Tier Navigation: Separate Views + Inline Expansion

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-01-31 |
| Decision Maker | Solution Architect (human) |
| VSOM Alignment | C1 (Client Retention — usability) |
| Source | HLD-VISUALISER-ENHANCED-v1.0.0.md, Decision D5 |

**Context:** When drilling from Tier 0 (series) to Tier 1 (ontologies) to Tier 2 (entities), the navigation could replace the entire view, expand inline within the existing graph, or offer both.

**Decision:** Both — offer view replacement (click series → shows ontologies as new view) and inline expansion (click ontology → expands entities within current view, fading siblings).

**Rationale:**
- Separate views are cleaner for large graphs (prevents visual overload)
- Inline expansion preserves context (user can see sibling ontologies)
- Different users prefer different interaction patterns
- Breadcrumb navigation provides consistent wayfinding regardless of method

**Consequences:**
- (+) Flexible UX supporting different workflows
- (-) Two rendering paths to maintain
- Mitigation: both paths use the same `graph-renderer.js` module, just with different vis.js DataSet populations

---

## ADR-005

### Multi-Tenancy: Shared Supabase with RLS

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-01-31 |
| Decision Maker | Solution Architect (human) |
| VSOM Alignment | L3 (Technology Platform), F4 (Cost Reduction) |
| Source | HLD-VISUALISER-ENHANCED-v1.0.0.md, Decision D6 |

**Context:** Multiple PFI instances (BAIV, W4M, Azlan) may share the visualiser. Need to decide isolation strategy.

**Decision:** Shared Supabase instance with Row-Level Security (RLS) policies filtering by `pfi_id`.

**Alternatives Considered:**

| Option | Why Not |
|--------|---------|
| Per-PFI Supabase project | Higher infrastructure cost, harder to share ontologies cross-PFI |
| No isolation | Security risk — PFI data must be segregated |

**Rationale:**
- PFC distributes core config to PFIs; shared DB aligns with this model
- RLS provides row-level data isolation without separate infrastructure
- Enables cross-PFI ontology sharing where authorised
- Single deployment to manage

**Consequences:**
- (+) Cost-effective: one Supabase project
- (+) Cross-PFI ontology queries possible (with explicit access grants)
- (-) RLS policy complexity increases with PFI count
- (-) Single Supabase project is a shared dependency

---

## ADR-006

### Compliance Enforcement: Allow + Recommend

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-01-31 |
| Decision Maker | Solution Architect (human) |
| VSOM Alignment | P3 (Compliance) |
| Source | HLD-VISUALISER-ENHANCED-v1.0.0.md |

**Context:** When a user uploads a non-OAA-compliant ontology, should the system block storage or allow it?

**Decision:** Allow storage with `compliance_status = 'non-compliant'` flag. Show recommendation to run OAA v6.1.0 upgrade. Non-compliant ontologies visible but flagged in UI.

**Exception:** Production environment (`environment = 'prod'`) enforces compliance via database trigger — non-compliant ontologies are blocked from prod.

**Rationale:**
- Blocking in dev/test would prevent iterative development
- Many ontologies start as drafts and evolve toward compliance
- Flagging makes non-compliance visible without being obstructive
- Prod enforcement ensures quality at deployment boundary

**Consequences:**
- (+) Low friction for development workflow
- (+) Clear path to compliance via OAA Upgrade Assistant
- (-) Non-compliant ontologies may accumulate in dev — mitigated by periodic cleanup/reporting

---

## ADR-007

### Branding Control: RBAC-Protected

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-01-31 |
| Decision Maker | Solution Architect (human) |
| VSOM Alignment | C1 (Client Experience) |
| Source | HLD-VISUALISER-ENHANCED-v1.0.0.md, Decision D8 |

**Context:** PFI brand switching in the visualiser (changing Figma design tokens) needs access control.

**Decision:** RBAC-protected. Only admin role can switch PFI branding. Viewers and editors see the current PFI brand, no switcher visible.

**Rationale:**
- Brand consistency is important for client-facing deployments
- Accidental brand switching could confuse users
- Admins need switching for testing and configuration

---

## ADR-008

### Theming Source: Figma MCP Primary, CSS Fallback

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-01-31 |
| Decision Maker | Solution Architect (human) |
| VSOM Alignment | C1 (Client Experience), L3 (Technology Platform) |
| Source | HLD-VISUALISER-ENHANCED-v1.0.0.md, Decision D3 |

**Context:** The visualiser needs PFI-specific theming. Tokens can come from Figma (via MCP extraction) or pre-built CSS.

**Decision:** Figma MCP extraction as primary source, with CSS variable fallback for when Figma is unavailable or MCP not configured.

**Rationale:**
- Figma is the single source of truth for brand tokens
- MCP extraction keeps tokens in sync with design system
- CSS fallback ensures the visualiser works without Figma/MCP dependency
- `design_tokens` table in Supabase caches extracted tokens

---

## ADR-009

### Modularisation: Native ES Modules (No Build Step)

| Property | Value |
|----------|-------|
| Status | **Accepted** |
| Date | 2026-02-04 |
| Decision Maker | Solution Architect (AI-assisted) |
| VSOM Alignment | P1 (Process Excellence), L3 (Technology Platform) |
| Source | IMPLEMENTATION-PLAN-v1.0.0.md, Phase 0 |

**Context:** The `browser-viewer.html` is a 2,980-line monolithic HTML file with all CSS and JavaScript inline. Adding rollup, drill-through, cross-ontology detection, and Supabase integration would push it past 5,000+ lines, making it unmaintainable. The codebase needs to be split into separate modules.

**Decision:** Use native ES modules (`<script type="module">`, `import`/`export` syntax) to split into ~10 JavaScript files. No build tool (Webpack, Vite, Rollup, etc.). No TypeScript.

**Alternatives Considered:**

| Option | Why Not |
|--------|---------|
| Vite + TypeScript | Introduces Node.js dependency, `npm install`, build step. Breaks the zero-dependency deployment model. TypeScript adds compile step. |
| Webpack bundle | Same build-step concerns. Adds complexity for a team of one. |
| Keep monolith | 5,000+ lines is unmaintainable. No way to test individual modules. Merge conflicts on every change. |
| IIFE pattern (no modules) | Works without build step but no proper encapsulation. Global namespace pollution. No tree-shaking benefit even conceptually. |

**Rationale:**
- ES modules are natively supported in all evergreen browsers (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+)
- HTTP/2 handles parallel loading of ~10 small files efficiently
- No build tool dependency — `git push` to main still deploys directly to GitHub Pages
- Clean module boundaries enforce separation of concerns
- Each module is independently testable
- Future migration to Vite/TypeScript remains easy (ES modules are the standard)

**Consequences:**
- (+) Zero additional toolchain dependencies
- (+) GitHub Pages deployment unchanged
- (+) Clean module interfaces prevent global state leakage
- (-) No minification in production — acceptable for a private tool with ~10 users
- (-) No TypeScript type safety — mitigated by clear JSDoc annotations on module exports

**Revisit trigger:** If the tool becomes public-facing or if the team grows beyond 2-3 developers, consider adding Vite for bundling/minification and TypeScript for type safety.

---

## ADR-010

### Rollup Default View: Series View (6 Nodes)

| Property | Value |
|----------|-------|
| Status | **Proposed** |
| Date | 2026-02-04 |
| Decision Maker | Pending |
| VSOM Alignment | C1 (Client Experience) |
| Source | FEATURE-SPEC-Graph-Rollup-DrillThrough-v1.0.0.md, Open Question Q2 |

**Context:** When loading the full ontology library, the Tier 0 rollup can show either 6 series nodes (compact) or 23 individual ontology nodes (detailed).

**Decision (proposed):** Default to Series View (6 nodes). User can toggle to Ontology View (23 nodes) via UI control.

**Rationale:**
- 6 nodes is a clean, comprehensible entry point
- Shows the structural story (VE, PE, Foundation, Competitive, Security, Orchestration) before detail
- Users can always expand to 23 nodes with one click
- First-time users benefit from progressive disclosure

**Alternatives:**
- Default to 23-node view: more detail upfront but visually noisier
- No default / let user choose on load: adds friction

---

## ADR-011

### Cross-Ontology Detection: Namespace Prefix Scanning

| Property | Value |
|----------|-------|
| Status | **Proposed** |
| Date | 2026-02-04 |
| Decision Maker | Pending |
| VSOM Alignment | P1 (Process Excellence) |
| Source | FEATURE-SPEC-Graph-Rollup-DrillThrough-v1.0.0.md, Feature 3 |

**Context:** Cross-ontology relationships need to be detected automatically. The ontologies use namespace prefixes (e.g., `okr:Objective`, `efs:Service`) to reference entities in other ontologies.

**Decision (proposed):** Scan `rangeIncludes` and `crossOntologyReferences` in each ontology's relationship definitions. If a reference uses a namespace prefix registered in `ont-registry-index.json` but belonging to a different ontology, classify it as a cross-ontology edge.

**Rationale:**
- Namespace prefixes are already consistently used across all 23 ontologies
- The `namespaceRegistry` in `ont-registry-index.json` maps all 23 prefixes to IRIs
- No manual mapping required — detection is algorithmic
- Handles future ontologies automatically as long as they follow the namespace convention

**Risks:**
- Implicit references (shared entity names without namespace prefix) may be missed
- Mitigation: manual bridge node overrides for known cases (RoleContext, Service, OrganizationContext)

---

## ADR-012

### Supabase Project: Dedicated (Not Shared with ds-e2e)

| Property | Value |
|----------|-------|
| Status | **Proposed** |
| Date | 2026-02-04 |
| Decision Maker | Pending |
| VSOM Alignment | L3 (Technology Platform) |
| Source | FEATURE-SPEC-Graph-Rollup-DrillThrough-v1.0.0.md, Open Question Q4 |

**Context:** The ds-e2e-prototype already has a Supabase schema defined (10 tables for design system, conversations, etc.). The visualiser needs its own tables (ontologies, graph_nodes, graph_edges, cross_ontology_edges, design_tokens).

**Decision (proposed):** Create a dedicated Supabase project for the ontology visualiser, separate from the ds-e2e-prototype project.

**Rationale:**
- Ontology data is structurally distinct from design system/conversation data
- Separate projects allow independent scaling, backup, and access control
- Avoids schema collision and migration complexity
- `design_tokens` table exists in both schemas but serves different purposes (ds-e2e: full design system; visualiser: graph styling only)

**Alternatives:**
- Shared project with separate schemas: reduces Supabase project count but couples lifecycles
- Shared project, same schema: risk of table naming conflicts and migration entanglement

---

## ADR-013

### Placeholder Ontologies: Show with Badge

| Property | Value |
|----------|-------|
| Status | **Proposed** |
| Date | 2026-02-04 |
| Decision Maker | Pending |
| VSOM Alignment | P3 (Compliance) |
| Source | FEATURE-SPEC-Graph-Rollup-DrillThrough-v1.0.0.md, Open Question Q3 |

**Context:** 5 of the 23 ontologies are placeholders (KPI, MCSB2, AIR, GDPR, AZALZ) — they have registry entries but no definitions. Should they appear in the rollup view?

**Decision (proposed):** Yes, show them with a "Placeholder" badge (grey, dashed border). They count toward series totals but not compliance ratios.

**Rationale:**
- Shows the intended scope of the ontology library
- Makes gaps visible — users can see what's planned but not yet built
- Compliance ratios remain meaningful (5/6 compliant means "of the 6 defined, 5 pass")
- Clicking a placeholder node could show a "Not yet defined" panel with the registry entry metadata

**Alternatives:**
- Hide placeholders: cleaner view but hides planned scope
- Show as full nodes: misleading — implies definition exists

---

## Template for New ADRs

```markdown
## ADR-NNN

### [Title]

| Property | Value |
|----------|-------|
| Status | **Proposed** / **Accepted** / **Deprecated** / **Superseded by ADR-NNN** |
| Date | YYYY-MM-DD |
| Decision Maker | [SA / EA / CTO / AI-assisted] |
| Approval Required | [SA scope (SA approves) / Cross-cutting (EA approves) / Enterprise (CTO approves)] |
| VSOM Alignment | [BSC objectives] |
| Source | [document reference] |

**Context:** [What is the situation that requires a decision?]

**Decision:** [What was decided?]

**Alternatives Considered:**

| Option | Why Not |
|--------|---------|
| ... | ... |

**Rationale:** [Why was this option chosen over alternatives?]

**Consequences:**
- (+) [Positive outcomes]
- (-) [Negative outcomes / trade-offs]

**Revisit trigger:** [Under what conditions should this decision be reconsidered?]
```

### Approval Scope Guide (from RRR RACI)

**SA scope** — Solution Architect approves: component selection, API contracts, DB schema, testing approach, solution patterns

**Cross-cutting** — Enterprise Architect approves: storage architecture, multi-tenancy, enterprise standards, cross-PFI decisions

**Enterprise** — CTO approves: technology strategy changes, vendor commitments, security policy exceptions

---

*ADR Log — Ontology Visualiser*
*Aligned to SA-ONT ArchitectureDecisionRecord entity and RRR Ontology role governance (SA → EA → CTO)*
*Azlan-EA-AAA repo*
