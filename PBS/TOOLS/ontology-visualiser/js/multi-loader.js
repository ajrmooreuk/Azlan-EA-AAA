/**
 * Multi-Ontology Loader — Phase 1
 * Loads the full unified registry, resolves artifact files, builds a merged
 * graph, and detects cross-ontology edges.
 */

import { state, REGISTRY_BASE_PATH, SERIES_COLORS, LINEAGE_CHAINS } from './state.js';
import { parseOntology } from './ontology-parser.js';
import { loadRegistryIndex } from './github-loader.js';

// ========================================
// SERIES RESOLUTION
// ========================================

/**
 * Resolve which series an ontology belongs to using the registry's
 * seriesRegistry map.  Falls back to 'Foundation' if not found.
 */
export function resolveSeriesForOntology(entryName, seriesRegistry) {
  if (!seriesRegistry) return 'Foundation';

  // entryName is like "EMC Ontology (Enterprise Model Composition)"
  // seriesRegistry keys map to arrays of short names like ["VSOM","OKR",...]
  // We need to match the short name extracted from the entry's @id or name.
  const shortName = extractShortName(entryName);

  for (const [seriesKey, seriesInfo] of Object.entries(seriesRegistry)) {
    if (seriesInfo.ontologies && seriesInfo.ontologies.some(o =>
      o.toUpperCase() === shortName.toUpperCase() ||
      o.toUpperCase().replace(/-/g, '') === shortName.toUpperCase().replace(/-/g, '')
    )) {
      return seriesKey;
    }
  }

  return 'Foundation';
}

/**
 * Extract short ontology name from the full entry name or @id.
 * "EMC Ontology (Enterprise Model Composition)" → "EMC"
 * "Entry-ONT-EMC-001" → "EMC"
 */
function extractShortName(nameOrId) {
  // Try @id pattern: Entry-ONT-XXX-001
  const idMatch = nameOrId.match(/Entry-ONT-([A-Z0-9-]+)-\d+/i);
  if (idMatch) return idMatch[1];

  // Try name pattern: "XXX Ontology (...)"
  const nameMatch = nameOrId.match(/^([A-Z0-9-]+)\s+Ontology/i);
  if (nameMatch) return nameMatch[1];

  // Try MCSB special case: "MCSB Ontology (...)" or "MCSB v2 Ontology"
  const mcsbMatch = nameOrId.match(/^(MCSB\s*v?\d*)\s/i);
  if (mcsbMatch) return mcsbMatch[1].replace(/\s+/g, '');

  return nameOrId;
}

// ========================================
// ARTIFACT PATH RESOLUTION
// ========================================

/**
 * Resolve an artifact path to a fetch-able URL relative to the visualiser page.
 *
 * After the ontology-library merge, entries are co-located with their artifacts.
 * Artifact paths in entries are relative to the entry's own directory:
 *   "./vsom-ontology-v2.1.0-oaa-v5.json"     → same dir as entry
 *   "../../unified-glossary-v2.0.0.json"      → library root
 *   "../../validation-reports/..."             → library root
 *
 * @param {string} artifactRelPath - path from the entry's artifacts object
 * @param {string} entryPath - the entry's path from the registry index (e.g. "./VE-Series/VSOM-ONT/Entry-ONT-VSOM-001.json")
 */
export function resolveArtifactPath(artifactRelPath, entryPath) {
  if (!artifactRelPath) return null;

  // Strip leading './' if present
  let cleaned = artifactRelPath.replace(/^\.\//, '');

  // Resolve relative to the entry's directory
  if (entryPath) {
    const entryDir = entryPath.replace(/^\.\//, '').replace(/\/[^/]+$/, '');
    return REGISTRY_BASE_PATH + entryDir + '/' + cleaned;
  }

  // Fallback: resolve from library root
  return REGISTRY_BASE_PATH + cleaned;
}

// ========================================
// PLACEHOLDER RECORDS
// ========================================

export function createPlaceholderRecord(entrySummary, fullEntry, series) {
  return {
    id: entrySummary['@id'],
    namespace: entrySummary.namespace,
    name: entrySummary.name,
    series: series,
    status: 'placeholder',
    isPlaceholder: true,
    registryEntry: fullEntry || entrySummary,
    rawData: null,
    parsed: {
      nodes: [{
        id: entrySummary.namespace?.replace(/:$/, '') || entrySummary['@id'],
        label: extractShortName(entrySummary.name),
        entityType: 'placeholder',
        description: fullEntry?.description || entrySummary.description || 'Placeholder — ontology not yet developed'
      }],
      edges: [],
      name: entrySummary.name,
      diagnostics: { format: 'placeholder' }
    },
    audit: null,
    validation: null
  };
}

// ========================================
// FULL REGISTRY LOADING
// ========================================

/**
 * Load the full registry index, then load every entry and its artifact.
 * Returns { loadedOntologies: Map, seriesData, stats }.
 */
export async function loadFullRegistry(progressCallback) {
  // Step 1: Load registry index
  const registry = await loadRegistryIndex();
  if (!registry || !registry.entries) {
    throw new Error('Failed to load registry index or no entries found');
  }

  const seriesRegistry = registry.seriesRegistry || {};
  const namespaceRegistry = registry.namespaceRegistry || {};
  const loadedOntologies = new Map();
  const stats = { total: registry.entries.length, loaded: 0, placeholders: 0, failed: 0 };

  if (progressCallback) progressCallback(`Loading ${stats.total} ontology entries...`, 0, stats.total);

  // Step 2: Load all entries in parallel
  const entryPromises = registry.entries.map(async (entrySummary) => {
    const series = resolveSeriesForOntology(entrySummary.name, seriesRegistry);
    const ns = entrySummary.namespace || entrySummary['@id'];

    // Declare outside try so catch can access the entry data for bridge detection
    let fullEntry = null;

    try {
      // Load the full registry entry JSON
      const entryPath = entrySummary.path?.replace('./', '') || '';
      const entryResponse = await fetch(REGISTRY_BASE_PATH + entryPath);
      if (!entryResponse.ok) throw new Error(`Entry fetch failed: ${entryResponse.status}`);
      fullEntry = await entryResponse.json();

      // Check if this is a placeholder (no artifact)
      const artifactPath = fullEntry.artifacts?.ontology;
      if (!artifactPath || entrySummary.status === 'placeholder') {
        const record = createPlaceholderRecord(entrySummary, fullEntry, series);
        loadedOntologies.set(ns, record);
        stats.placeholders++;
        stats.loaded++;
        return;
      }

      // Load the actual ontology artifact
      const resolvedPath = resolveArtifactPath(artifactPath, entrySummary.path);
      const artResponse = await fetch(resolvedPath);
      if (!artResponse.ok) throw new Error(`Artifact fetch failed: ${artResponse.status} for ${resolvedPath}`);
      const rawData = await artResponse.json();

      // Parse the ontology
      const parsed = parseOntology(rawData, extractShortName(entrySummary.name));

      loadedOntologies.set(ns, {
        id: entrySummary['@id'],
        namespace: ns,
        name: entrySummary.name,
        series: series,
        status: entrySummary.status,
        isPlaceholder: false,
        registryEntry: fullEntry,
        rawData: rawData,
        parsed: parsed,
        audit: null,
        validation: null
      });

      stats.loaded++;

    } catch (err) {
      console.warn(`Failed to load ${entrySummary.name}:`, err.message);
      // Preserve fullEntry (if loaded) so bridge data is available for cross-ref detection
      const record = createPlaceholderRecord(entrySummary, fullEntry, series);
      record.status = 'load-failed';
      record.loadError = err.message;
      loadedOntologies.set(ns, record);
      stats.failed++;
      stats.loaded++;
    }

    if (progressCallback) progressCallback(`Loaded ${stats.loaded}/${stats.total}`, stats.loaded, stats.total);
  });

  await Promise.allSettled(entryPromises);

  // Step 3: Build series data from the registry
  const seriesData = {};
  for (const [seriesKey, seriesInfo] of Object.entries(seriesRegistry)) {
    seriesData[seriesKey] = {
      name: seriesInfo.name,
      description: seriesInfo.description,
      color: SERIES_COLORS[seriesKey] || SERIES_COLORS.placeholder,
      ontologies: seriesInfo.ontologies || [],
      count: 0
    };
  }

  // Count ontologies per series
  for (const [, record] of loadedOntologies) {
    if (seriesData[record.series]) {
      seriesData[record.series].count++;
    }
  }

  return { loadedOntologies, seriesData, namespaceRegistry, stats };
}

// ========================================
// MERGED GRAPH BUILDING
// ========================================

/**
 * Build a single merged graph from all loaded ontologies.
 * Prefixes node IDs with namespace to avoid collisions.
 */
export function buildMergedGraph(loadedOntologies) {
  const mergedNodes = [];
  const mergedEdges = [];
  const nodeIndex = new Map(); // track all node IDs for edge validation

  for (const [ns, record] of loadedOntologies) {
    if (!record.parsed) continue;

    const prefix = ns.replace(/:$/, '');

    // Add nodes with namespace-prefixed IDs
    for (const node of record.parsed.nodes) {
      const prefixedId = `${prefix}::${node.id}`;
      mergedNodes.push({
        ...node,
        id: prefixedId,
        originalId: node.id,
        sourceNamespace: ns,
        sourceName: record.name,
        series: record.series,
        isPlaceholder: record.isPlaceholder
      });
      nodeIndex.set(prefixedId, true);
      // Also index by original ID for cross-ref matching
      nodeIndex.set(node.id, prefixedId);
    }

    // Add edges with namespace-prefixed endpoints
    for (const edge of record.parsed.edges) {
      mergedEdges.push({
        ...edge,
        from: `${prefix}::${edge.from}`,
        to: `${prefix}::${edge.to}`,
        sourceNamespace: ns,
        isCrossOntology: false
      });
    }
  }

  return {
    nodes: mergedNodes,
    edges: mergedEdges,
    nodeIndex: nodeIndex,
    name: 'Unified Registry',
    diagnostics: { format: 'multi-registry' }
  };
}

// ========================================
// CROSS-REFERENCE DETECTION
// ========================================

/**
 * Detect cross-ontology edges using three passes:
 * 1. Registry-declared bridges from entry.relationships (keyBridges or crossOntology)
 * 2. Namespace-prefix scan on node references (rangeIncludes/domainIncludes)
 * 3. Registry dependency declarations (entry.dependencies array)
 */
export function detectCrossReferences(loadedOntologies, mergedGraph) {
  const crossEdges = [];
  const addedEdgeKeys = new Set();

  // Pass 1: Registry-declared bridges
  // Include load-failed records — they may have valid registryEntry with bridge data
  // even though their artifact couldn't be loaded
  for (const [ns, record] of loadedOntologies) {
    if (!record.registryEntry) continue;

    // Read both property names — entries use keyBridges (VP) or crossOntology (VSOM, OKR, etc.)
    const keyBridges = record.registryEntry.relationships?.keyBridges;
    const crossOntology = record.registryEntry.relationships?.crossOntology;
    const bridges = (Array.isArray(keyBridges) ? keyBridges : [])
      .concat(Array.isArray(crossOntology) ? crossOntology : []);
    for (const bridge of bridges) {
      if (!bridge.from || !bridge.to) continue;

      // Parse "vp:ValueProposition" → { prefix: "vp", entity: "ValueProposition" }
      const fromParts = parsePrefixedRef(bridge.from);
      const toParts = parsePrefixedRef(bridge.to);

      if (!fromParts || !toParts) {
        console.warn(`[CrossRef] Parse failed: from="${bridge.from}" to="${bridge.to}"`);
        continue;
      }

      // Resolve to prefixed node IDs in the merged graph
      const fromId = resolveNodeInMergedGraph(fromParts, mergedGraph.nodeIndex);
      const toId = resolveNodeInMergedGraph(toParts, mergedGraph.nodeIndex);

      if (!fromId || !toId) {
        console.warn(`[CrossRef] Resolve failed: "${bridge.from}" → ${fromId || 'NULL'}, "${bridge.to}" → ${toId || 'NULL'} (bridge: ${bridge.name})`);
      }

      if (fromId && toId) {
        const edgeKey = `${fromId}->${toId}:${bridge.name}`;
        if (!addedEdgeKeys.has(edgeKey)) {
          crossEdges.push({
            from: fromId,
            to: toId,
            label: bridge.name || 'cross-ref',
            edgeType: 'crossOntology',
            purpose: bridge.purpose || '',
            sourceNamespace: ns,
            isCrossOntology: true
          });
          addedEdgeKeys.add(edgeKey);
        }
      }
    }
  }
  // Pass 2: Namespace-prefix scan on node IDs that reference other ontologies
  const knownPrefixes = new Set();
  for (const [ns] of loadedOntologies) {
    knownPrefixes.add(ns.replace(/:$/, ''));
  }

  for (const node of mergedGraph.nodes) {
    // Check if the original node ID references another ontology's namespace
    // e.g., a node with rangeIncludes containing "vsom:ObjectivesComponent"
    const rawData = findRawNodeData(node, loadedOntologies);
    if (!rawData) continue;

    const refsToCheck = [
      ...(Array.isArray(rawData.rangeIncludes) ? rawData.rangeIncludes : rawData.rangeIncludes ? [rawData.rangeIncludes] : []),
      ...(Array.isArray(rawData.domainIncludes) ? rawData.domainIncludes : rawData.domainIncludes ? [rawData.domainIncludes] : [])
    ];

    for (const ref of refsToCheck) {
      const refStr = typeof ref === 'string' ? ref : ref?.['@id'] || ref?.id || '';
      const parts = parsePrefixedRef(refStr);
      if (!parts) continue;

      // Only add if the prefix belongs to a different ontology
      const nodePrefix = node.sourceNamespace?.replace(/:$/, '');
      if (parts.prefix === nodePrefix) continue;
      if (!knownPrefixes.has(parts.prefix)) continue;

      const targetId = resolveNodeInMergedGraph(parts, mergedGraph.nodeIndex);
      if (targetId) {
        const edgeKey = `${node.id}->${targetId}:range-ref`;
        if (!addedEdgeKeys.has(edgeKey)) {
          crossEdges.push({
            from: node.id,
            to: targetId,
            label: 'references',
            edgeType: 'crossOntology',
            purpose: 'namespace-prefix reference',
            sourceNamespace: node.sourceNamespace,
            isCrossOntology: true
          });
          addedEdgeKeys.add(edgeKey);
        }
      }
    }
  }

  // Pass 3: Generate edges from registry dependency declarations
  // Build lookup: entry ID (e.g., "Entry-ONT-VSOM-001") → namespace prefix (e.g., "vsom:")
  const entryIdToNs = new Map();
  for (const [ns, record] of loadedOntologies) {
    if (record.registryEntry && record.registryEntry['@id']) {
      entryIdToNs.set(record.registryEntry['@id'], ns);
    }
  }

  for (const [ns, record] of loadedOntologies) {
    if (record.isPlaceholder || !record.registryEntry) continue;

    const deps = record.registryEntry.dependencies;
    if (!Array.isArray(deps) || deps.length === 0) continue;

    for (const depEntryId of deps) {
      const targetNs = entryIdToNs.get(depEntryId);
      if (!targetNs || targetNs === ns) continue;

      // Create synthetic edge from this ontology to the dependency
      // Format: sourcePrefix::_dependency → targetPrefix::_dependency
      const sourcePrefix = ns.replace(/:$/, '');
      const targetPrefix = targetNs.replace(/:$/, '');
      const fromId = `${sourcePrefix}::_dependency`;
      const toId = `${targetPrefix}::_dependency`;
      const edgeKey = `${ns}->${targetNs}:dependency`;

      if (!addedEdgeKeys.has(edgeKey)) {
        crossEdges.push({
          from: fromId,
          to: toId,
          label: 'depends-on',
          edgeType: 'dependency',
          purpose: 'declared dependency in registry entry',
          sourceNamespace: ns,
          targetNamespace: targetNs,
          isCrossOntology: true
        });
        addedEdgeKeys.add(edgeKey);
      }
    }
  }

  return crossEdges;
}

// ========================================
// HELPERS
// ========================================

/**
 * Parse a prefixed reference like "vp:ValueProposition"
 * into { prefix: "vp", entity: "ValueProposition" }
 */
function parsePrefixedRef(ref) {
  if (!ref || typeof ref !== 'string') return null;
  const match = ref.match(/^([a-z][a-z0-9-]*):(.+)$/i);
  if (!match) return null;
  return { prefix: match[1].toLowerCase(), entity: match[2] };
}

/**
 * Resolve a { prefix, entity } to a merged graph node ID.
 * Tries namespace-prefixed ID first, then original ID with prefix,
 * then case-insensitive fallback.
 */
function resolveNodeInMergedGraph(parts, nodeIndex) {
  // Try double-colon prefixed form: "vsom::ObjectivesComponent"
  const prefixedId = `${parts.prefix}::${parts.entity}`;
  if (nodeIndex.has(prefixedId)) return prefixedId;

  // Entity IDs in ontology artifacts often already include the namespace prefix
  // (e.g., "@id": "vsom:ObjectivesComponent"), so the merged graph node becomes
  // "vsom::vsom:ObjectivesComponent". Check the original-ID index for "vsom:ObjectivesComponent".
  const originalRef = `${parts.prefix}:${parts.entity}`;
  const mapped = nodeIndex.get(originalRef);
  if (mapped && typeof mapped === 'string') return mapped;

  // Try case-insensitive match
  const targetLower = prefixedId.toLowerCase();
  const originalLower = originalRef.toLowerCase();
  for (const [key, value] of nodeIndex) {
    const keyLower = key.toLowerCase();
    if (keyLower === targetLower) return key;
    if (keyLower === originalLower && typeof value === 'string') return value;
  }

  // Fallback: ontology may use a different internal prefix (e.g., pfc:Vision under kpi: namespace).
  // Scan for any node in the target namespace whose entity name matches.
  const nsPrefix = parts.prefix + '::';
  const entitySuffix = ':' + parts.entity;
  for (const [key] of nodeIndex) {
    if (key.startsWith(nsPrefix) && (key.endsWith(entitySuffix) || key === nsPrefix + parts.entity)) {
      return key;
    }
  }

  return null;
}

/**
 * Find the raw node data from the loaded ontology for cross-ref scanning.
 */
function findRawNodeData(node, loadedOntologies) {
  if (!node.sourceNamespace) return null;
  const record = loadedOntologies.get(node.sourceNamespace);
  if (!record || !record.rawData) return null;

  // Look in hasDefinedTerm array (OAA v6 pattern)
  const terms = record.rawData.hasDefinedTerm || record.rawData.hasPart || [];
  const termArray = Array.isArray(terms) ? terms : [terms];
  return termArray.find(t =>
    (t.name === node.originalId) ||
    (t['@id'] === node.originalId) ||
    (t.termCode === node.originalId)
  ) || null;
}

// ========================================
// SERIES-LEVEL AGGREGATION (Phase 2)
// ========================================

/**
 * Aggregate cross-ontology edges into cross-series edges.
 * Groups by source series → target series and returns counts.
 */
export function buildCrossSeriesEdges(crossEdges, loadedOntologies) {
  const seriesEdgeMap = new Map(); // 'VE-Series->PE-Series' → { count, bridges }

  for (const edge of crossEdges) {
    // Find source and target series from the node namespaces
    const fromNs = edge.sourceNamespace;
    const fromRecord = loadedOntologies.get(fromNs);
    if (!fromRecord) continue;

    // Determine target namespace from the edge.to ID (prefix::entity)
    const toPrefix = edge.to.split('::')[0];
    let toSeries = null;
    for (const [ns, record] of loadedOntologies) {
      if (ns.replace(/:$/, '') === toPrefix) {
        toSeries = record.series;
        break;
      }
    }
    if (!toSeries) continue;

    const fromSeries = fromRecord.series;
    if (fromSeries === toSeries) continue; // skip intra-series

    // Normalise edge direction (alphabetical) to avoid A→B and B→A duplicates
    const key = fromSeries < toSeries
      ? `${fromSeries}->${toSeries}`
      : `${toSeries}->${fromSeries}`;

    if (!seriesEdgeMap.has(key)) {
      const [from, to] = key.split('->');
      seriesEdgeMap.set(key, { from, to, count: 0, bridges: [] });
    }
    const entry = seriesEdgeMap.get(key);
    entry.count++;
    entry.bridges.push(edge.label);
  }

  return Array.from(seriesEdgeMap.values());
}

/**
 * Filter loaded ontologies to those belonging to a specific series.
 */
export function getOntologiesForSeries(seriesKey, loadedOntologies) {
  const filtered = new Map();
  for (const [ns, record] of loadedOntologies) {
    if (record.series === seriesKey) {
      filtered.set(ns, record);
    }
  }
  return filtered;
}

// ========================================
// BRIDGE NODE DETECTION (Phase 4 — Feature #40)
// ========================================

/**
 * Detect bridge nodes — entities referenced by 3+ ontologies.
 * These are critical integration points in the architecture.
 *
 * @param {Array} crossEdges - Cross-ontology edges from detectCrossReferences()
 * @param {Map} loadedOntologies - Loaded ontology records
 * @param {number} threshold - Minimum referencing ontologies to be a bridge (default: 3)
 * @returns {Map} entityId → { refCount, referencingOntologies: Set<string>, entityLabel, series }
 */
export function detectBridgeNodes(crossEdges, loadedOntologies, threshold = 3) {
  const entityRefs = new Map(); // entityId → { referencingOntologies: Set, ... }

  // Count incoming references per entity from different ontologies
  for (const edge of crossEdges) {
    const targetId = edge.to;
    const sourceNs = edge.sourceNamespace;

    if (!entityRefs.has(targetId)) {
      // Extract entity info from target ID (prefix::entity)
      const parts = targetId.split('::');
      const prefix = parts[0];
      const entityName = parts[1] || targetId;

      // Find the target ontology to get series info
      let targetSeries = null;
      let targetOntologyName = null;
      for (const [ns, record] of loadedOntologies) {
        if (ns.replace(/:$/, '') === prefix) {
          targetSeries = record.series;
          targetOntologyName = record.name;
          break;
        }
      }

      entityRefs.set(targetId, {
        id: targetId,
        entityLabel: entityName,
        prefix: prefix,
        series: targetSeries,
        ontologyName: targetOntologyName,
        referencingOntologies: new Set(),
        referencingNamespaces: new Set(),
        refCount: 0
      });
    }

    const entry = entityRefs.get(targetId);
    // Only count unique ontologies (not multiple refs from same ontology)
    if (!entry.referencingNamespaces.has(sourceNs)) {
      entry.referencingNamespaces.add(sourceNs);
      // Get ontology name for display
      const sourceRecord = loadedOntologies.get(sourceNs);
      const sourceName = sourceRecord?.name?.replace(/\s+Ontology.*$/i, '') || sourceNs;
      entry.referencingOntologies.add(sourceName);
      entry.refCount++;
    }
  }

  // Filter to only bridge nodes (>= threshold referencing ontologies)
  const bridgeNodes = new Map();
  for (const [entityId, data] of entityRefs) {
    if (data.refCount >= threshold) {
      bridgeNodes.set(entityId, {
        ...data,
        referencingOntologies: Array.from(data.referencingOntologies),
        referencingNamespaces: Array.from(data.referencingNamespaces)
      });
    }
  }

  return bridgeNodes;
}

// ========================================
// LINEAGE CLASSIFICATION (Phase 2/4 — Issue #39)
// ========================================

/**
 * Classify a cross-edge as VE lineage, PE lineage, or general cross-ontology.
 * Accepts namespace strings (e.g., "vsom:", "okr:") and checks if they represent
 * consecutive steps in VE or PE lineage chains.
 *
 * @param {string} fromNs - Source namespace (e.g., "vsom:" or "vsom")
 * @param {string} toNs - Target namespace (e.g., "okr:" or "okr")
 * @returns {{ isVE: boolean, isPE: boolean, isConvergence: boolean }}
 */
export function classifyLineageEdge(fromNs, toNs) {
  const fromPrefix = fromNs.replace(/:$/, '').toUpperCase();
  const toPrefix = toNs.replace(/:$/, '').toUpperCase();

  // Check if from→to is consecutive in VE chain
  const veIdxFrom = LINEAGE_CHAINS.VE.indexOf(fromPrefix);
  const isVE = veIdxFrom >= 0 && LINEAGE_CHAINS.VE[veIdxFrom + 1] === toPrefix;

  // Check reverse direction too (to→from)
  const veIdxTo = LINEAGE_CHAINS.VE.indexOf(toPrefix);
  const isVEReverse = veIdxTo >= 0 && LINEAGE_CHAINS.VE[veIdxTo + 1] === fromPrefix;

  // Check if from→to is consecutive in PE chain
  const peIdxFrom = LINEAGE_CHAINS.PE.indexOf(fromPrefix);
  const isPE = peIdxFrom >= 0 && LINEAGE_CHAINS.PE[peIdxFrom + 1] === toPrefix;

  // Check reverse direction
  const peIdxTo = LINEAGE_CHAINS.PE.indexOf(toPrefix);
  const isPEReverse = peIdxTo >= 0 && LINEAGE_CHAINS.PE[peIdxTo + 1] === fromPrefix;

  const veMatch = isVE || isVEReverse;
  const peMatch = isPE || isPEReverse;

  // EFS is convergence point (appears in both chains)
  const isConvergence = (fromPrefix === 'EFS' || toPrefix === 'EFS') && (veMatch || peMatch);

  return { isVE: veMatch, isPE: peMatch, isConvergence };
}

/**
 * Look up the series a namespace belongs to.
 * @param {string} namespace - e.g., "vsom:" or "org:"
 * @param {Map} loadedOntologies - the loaded ontologies map
 * @returns {string|null} series key like 'VE-Series' or null
 */
export function getNodeSeries(namespace, loadedOntologies) {
  const record = loadedOntologies?.get(namespace);
  return record?.series || null;
}

/**
 * Check if a namespace belongs to a lineage chain.
 * @param {string} namespace - e.g., "vsom:" or "efs"
 * @returns {{ inVE: boolean, inPE: boolean, isConvergence: boolean }}
 */
export function getNodeLineageRole(namespace) {
  const prefix = namespace.replace(/:$/, '').toUpperCase();
  const inVE = LINEAGE_CHAINS.VE.includes(prefix);
  const inPE = LINEAGE_CHAINS.PE.includes(prefix);
  const isConvergence = inVE && inPE; // EFS appears in both
  return { inVE, inPE, isConvergence };
}
