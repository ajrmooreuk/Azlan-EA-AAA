/**
 * Graph rendering with vis.js — renderGraph, layout controls, focus/zoom.
 */

import { state, TYPE_COLORS, EDGE_COLORS, SERIES_COLORS, LINEAGE_CHAINS } from './state.js';
import { parseOntology } from './ontology-parser.js';
import { auditGraph, validateOAAv5 } from './audit-engine.js';
import { renderOAACompliancePanel } from './compliance-reporter.js';
import { lookupRegistry } from './github-loader.js';
import { renderAuditPanel, showNodeDetails, switchTab } from './ui-panels.js';

export function focusNode(id) {
  if (state.network) { state.network.selectNodes([id]); state.network.focus(id, { scale: 1.5, animation: true }); }
}

export function focusNodes(ids) {
  if (state.network) { state.network.selectNodes(ids); state.network.fit({ nodes: ids, animation: true }); }
}

export function renderGraph(parsed) {
  state.lastParsed = parsed;

  const audit = auditGraph(parsed);
  renderAuditPanel(audit);

  const validation = validateOAAv5(state.currentData, parsed);
  renderOAACompliancePanel(validation);

  lookupRegistry().then(regInfo => {
    if (regInfo) {
      console.log('Registry entry found:', regInfo.entryId, 'v' + regInfo.version);
    }
  }).catch(err => console.warn('Registry lookup failed:', err));

  const siloNodeIds = new Set();
  audit.isolated.forEach(n => siloNodeIds.add(n.id));
  if (audit.components.length > 1) {
    audit.components.slice(1).forEach(comp => comp.forEach(id => siloNodeIds.add(id)));
  }

  const visNodes = parsed.nodes.map(n => {
    const isSilo = siloNodeIds.has(n.id);
    return {
      id: n.id,
      label: n.label,
      color: {
        background: TYPE_COLORS[n.entityType] || TYPE_COLORS.default,
        border: isSilo ? '#FF9800' : '#222',
        highlight: { background: '#9dfff5', border: '#017c75' }
      },
      borderWidth: isSilo ? 3 : 2,
      borderWidthSelected: 4,
      shapeProperties: { borderDashes: isSilo ? [6, 3] : false },
      font: { color: '#e0e0e0', size: 13 },
      shape: n.entityType === 'agent' ? 'star' : n.entityType === 'layer' ? 'box' : 'dot',
      size: n.entityType === 'agent' ? 25 : n.entityType === 'core' ? 30 : 20,
      title: n.description || n.label,
      _data: n
    };
  });

  const visEdges = parsed.edges.map(e => ({
    from: e.from,
    to: e.to,
    label: e.label,
    color: { color: EDGE_COLORS[e.edgeType] || EDGE_COLORS.default, highlight: '#9dfff5' },
    font: { color: '#888', size: 10, strokeWidth: 2, strokeColor: '#0f1117' },
    arrows: 'to',
    dashes: e.edgeType === 'inheritance',
    width: e.edgeType === 'binding' ? 2.5 : 1.5,
    smooth: { type: 'continuous', roundness: 0.3 }
  }));

  const container = document.getElementById('network');
  const data = { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) };

  const options = {
    physics: {
      enabled: state.physicsEnabled,
      stabilization: { iterations: 200 },
      barnesHut: { gravitationalConstant: -3000, springLength: 150 }
    },
    interaction: { hover: true, tooltipDelay: 200 },
    nodes: { borderWidth: 2 },
    edges: { smooth: { type: 'continuous', roundness: 0.3 } },
    layout: {}
  };

  state.network = new vis.Network(container, data, options);

  state.network.once('stabilizationIterationsDone', function() {
    state.network.fit({ animation: true });
  });

  state.network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = visNodes.find(n => n.id === nodeId);
      if (node) showNodeDetails(node._data);
    }
  });

  state.network.on('doubleClick', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = visNodes.find(n => n.id === nodeId);
      if (node) {
        showNodeDetails(node._data);
        switchTab('connections');
      }
    }
  });

  document.getElementById('stats').textContent =
    `${parsed.nodes.length} nodes | ${parsed.edges.length} edges | ${parsed.name} [${parsed.diagnostics.format}]`;

  buildLegend(parsed.nodes);
}

export function buildLegend(nodes) {
  const types = [...new Set(nodes.map(n => n.entityType))];
  const legend = document.getElementById('legend');
  legend.style.display = 'block';
  legend.innerHTML = types.map(t =>
    `<div class="legend-item"><div class="legend-dot" style="background:${TYPE_COLORS[t] || TYPE_COLORS.default}"></div>${t}</div>`
  ).join('');
}

function buildSeriesLegend(seriesData) {
  const legend = document.getElementById('legend');
  legend.style.display = 'block';
  legend.innerHTML = Object.entries(seriesData)
    .filter(([, info]) => info.count > 0)
    .map(([key, info]) =>
      `<div class="legend-item"><div class="legend-dot" style="background:${info.color}"></div>${key} (${info.count})</div>`
    ).join('') +
    `<div class="legend-item"><div class="legend-dot legend-dot-placeholder" style="background:${SERIES_COLORS.placeholder}"></div>Placeholder</div>` +
    `<div class="legend-item"><div class="legend-dot legend-dot-crossref" style="background:#FFD700"></div>Cross-ontology</div>`;
}

/**
 * Render a merged multi-ontology graph with series-based colouring.
 * Bridge nodes (referenced by 3+ ontologies) get special styling.
 */
export function renderMultiGraph(mergedGraph, crossEdges, seriesData) {
  state.lastParsed = mergedGraph;

  // Hide single-ontology panels
  document.getElementById('compliance-status').style.display = 'none';
  document.getElementById('audit-panel').classList.remove('open');

  // Check for bridge nodes
  const bridgeNodes = state.bridgeNodes || new Map();
  const showOnlyBridges = state.bridgeFilterActive || false;

  const visNodes = mergedGraph.nodes
    .filter(n => !showOnlyBridges || bridgeNodes.has(n.id))
    .map(n => {
      const seriesColor = SERIES_COLORS[n.series] || SERIES_COLORS.placeholder;
      const isBridge = bridgeNodes.has(n.id);
      const bridgeInfo = isBridge ? bridgeNodes.get(n.id) : null;

      // Bridge nodes: 1.5x size, gold double-border effect, special tooltip
      const baseSize = n.isPlaceholder ? 18 : (n.entityType === 'core' ? 25 : 16);
      const nodeSize = isBridge ? Math.round(baseSize * 1.5) : baseSize;

      // Bridge nodes get gold border
      const borderColor = isBridge ? '#FFD700' : (n.isPlaceholder ? '#888' : '#222');
      const borderWidth = isBridge ? 4 : 2;

      // Build tooltip
      let tooltip = `${n.sourceName || ''}\n${n.description || n.label}`;
      if (isBridge) {
        tooltip = `🌉 BRIDGE NODE — referenced by ${bridgeInfo.refCount} ontologies:\n` +
          bridgeInfo.referencingOntologies.join(', ') + '\n\n' + tooltip;
      }

      return {
        id: n.id,
        label: n.label,
        color: {
          background: n.isPlaceholder ? SERIES_COLORS.placeholder : seriesColor,
          border: borderColor,
          highlight: { background: '#9dfff5', border: isBridge ? '#FFD700' : '#017c75' }
        },
        borderWidth: borderWidth,
        borderWidthSelected: isBridge ? 6 : 4,
        shapeProperties: { borderDashes: n.isPlaceholder ? [6, 3] : false },
        font: { color: '#e0e0e0', size: isBridge ? 14 : 13, bold: isBridge },
        shape: n.isPlaceholder ? 'diamond' : (n.entityType === 'agent' ? 'star' : n.entityType === 'layer' ? 'box' : 'dot'),
        size: nodeSize,
        title: tooltip,
        shadow: isBridge ? { enabled: true, color: '#FFD700', size: 10, x: 0, y: 0 } : false,
        _data: { ...n, isBridge, bridgeInfo }
      };
    });

  // Internal edges
  const visEdges = mergedGraph.edges.map(e => ({
    from: e.from,
    to: e.to,
    label: e.label,
    color: { color: EDGE_COLORS[e.edgeType] || EDGE_COLORS.default, highlight: '#9dfff5' },
    font: { color: '#888', size: 9, strokeWidth: 2, strokeColor: '#0f1117' },
    arrows: 'to',
    dashes: e.edgeType === 'inheritance',
    width: 1.2,
    smooth: { type: 'continuous', roundness: 0.3 }
  }));

  // Cross-ontology edges
  for (const ce of crossEdges) {
    visEdges.push({
      from: ce.from,
      to: ce.to,
      label: ce.label,
      color: { color: '#FFD700', highlight: '#FFF176' },
      font: { color: '#FFD700', size: 9, strokeWidth: 2, strokeColor: '#0f1117' },
      arrows: 'to',
      dashes: [8, 4],
      width: 2.5,
      smooth: { type: 'continuous', roundness: 0.4 }
    });
  }

  const container = document.getElementById('network');
  const data = { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) };

  const options = {
    physics: {
      enabled: state.physicsEnabled,
      stabilization: { iterations: 300 },
      barnesHut: { gravitationalConstant: -4000, springLength: 180, springConstant: 0.02 }
    },
    interaction: { hover: true, tooltipDelay: 200 },
    nodes: { borderWidth: 2 },
    edges: { smooth: { type: 'continuous', roundness: 0.3 } },
    layout: {}
  };

  state.network = new vis.Network(container, data, options);

  state.network.once('stabilizationIterationsDone', function() {
    state.network.fit({ animation: true });
  });

  state.network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = visNodes.find(n => n.id === nodeId);
      if (node) showNodeDetails(node._data);
    }
  });

  state.network.on('doubleClick', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = visNodes.find(n => n.id === nodeId);
      if (node) {
        showNodeDetails(node._data);
        switchTab('connections');
      }
    }
  });

  const totalEdges = mergedGraph.edges.length + crossEdges.length;
  const bridgeCount = state.bridgeNodes?.size || 0;
  const filterText = showOnlyBridges ? ' [bridges only]' : '';
  document.getElementById('stats').textContent =
    `${visNodes.length} nodes | ${totalEdges} edges | ${bridgeCount} bridge nodes | Unified Registry [multi]${filterText}`;

  buildSeriesLegend(seriesData);
}

// ========================================
// TIER 0: SERIES ROLLUP VIEW (Phase 2)
// ========================================

/**
 * Render 6 series super-nodes with cross-series edges.
 * Entry point for multi-ontology mode.
 */
export function renderTier0(seriesData, crossSeriesEdges) {
  // Hide single-ontology panels
  document.getElementById('compliance-status').style.display = 'none';
  document.getElementById('audit-panel').classList.remove('open');

  const visNodes = [];
  const tier0Nodes = []; // for state.lastParsed

  for (const [key, info] of Object.entries(seriesData)) {
    if (info.count === 0 && !info.ontologies?.length) continue;

    const node = {
      id: key,
      label: `${info.name}\n${info.count} ontologies`,
      color: {
        background: info.color,
        border: '#222',
        highlight: { background: '#9dfff5', border: '#017c75' }
      },
      borderWidth: 3,
      borderWidthSelected: 5,
      font: { color: '#e0e0e0', size: 16, multi: 'md' },
      shape: 'dot',
      size: 45,
      title: `${info.name}\n${info.description || ''}\n${info.count} ontologies`,
      _data: {
        id: key,
        label: info.name,
        entityType: 'series',
        description: info.description || '',
        series: key,
        ontologyCount: info.count,
        ontologies: info.ontologies
      }
    };
    visNodes.push(node);
    tier0Nodes.push(node._data);
  }

  const visEdges = [];
  const tier0Edges = [];

  // Cross-series edges
  for (const cse of crossSeriesEdges) {
    visEdges.push({
      from: cse.from,
      to: cse.to,
      label: `${cse.count} refs`,
      color: { color: '#FFD700', highlight: '#FFF176' },
      font: { color: '#FFD700', size: 11, strokeWidth: 2, strokeColor: '#0f1117' },
      arrows: 'to',
      dashes: [8, 4],
      width: 2,
      smooth: { type: 'continuous', roundness: 0.4 }
    });
    tier0Edges.push({
      from: cse.from, to: cse.to, label: `${cse.count} refs`,
      edgeType: 'crossSeries', isCrossOntology: true
    });
  }

  // Set lastParsed for sidebar compatibility
  state.lastParsed = {
    nodes: tier0Nodes,
    edges: tier0Edges,
    name: 'Unified Registry',
    diagnostics: { format: 'series-rollup' }
  };

  const container = document.getElementById('network');
  const data = { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) };

  const options = {
    physics: {
      enabled: true,
      stabilization: { iterations: 150 },
      barnesHut: { gravitationalConstant: -5000, springLength: 250, springConstant: 0.02 }
    },
    interaction: { hover: true, tooltipDelay: 200 },
    nodes: { borderWidth: 3 },
    edges: { smooth: { type: 'continuous', roundness: 0.3 } },
    layout: {}
  };

  state.network = new vis.Network(container, data, options);

  state.network.once('stabilizationIterationsDone', function() {
    state.network.fit({ animation: true });
  });

  state.network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = visNodes.find(n => n.id === nodeId);
      if (node) showNodeDetails(node._data);
    }
  });

  state.network.on('doubleClick', function(params) {
    if (params.nodes.length > 0) {
      const seriesKey = params.nodes[0];
      if (seriesData[seriesKey]) {
        window.drillToSeries(seriesKey);
      }
    }
  });

  document.getElementById('stats').textContent =
    `${visNodes.length} series | ${crossSeriesEdges.length} cross-series edges | Unified Registry [rollup]`;

  buildSeriesLegend(seriesData);
}

// ========================================
// TIER 1: SERIES DRILL-DOWN (Phase 2)
// ========================================

/**
 * Render ontology nodes for a single series, with faded context nodes
 * for other series.
 */
export function renderTier1(seriesKey, loadedOntologies, seriesData) {
  // Hide single-ontology panels
  document.getElementById('compliance-status').style.display = 'none';
  document.getElementById('audit-panel').classList.remove('open');

  const seriesInfo = seriesData[seriesKey];
  if (!seriesInfo) return;

  const visNodes = [];
  const tier1Nodes = [];

  // Primary nodes: ontologies in this series
  for (const [ns, record] of loadedOntologies) {
    if (record.series !== seriesKey) continue;

    const shortName = record.name.replace(/\s+Ontology.*$/i, '').replace(/\s*\(.*\)$/, '');
    const node = {
      id: ns,
      label: shortName,
      color: {
        background: record.isPlaceholder ? SERIES_COLORS.placeholder : seriesInfo.color,
        border: record.isPlaceholder ? '#888' : '#222',
        highlight: { background: '#9dfff5', border: '#017c75' }
      },
      borderWidth: 2,
      borderWidthSelected: 4,
      shapeProperties: { borderDashes: record.isPlaceholder ? [6, 3] : false },
      font: { color: '#e0e0e0', size: 14 },
      shape: record.isPlaceholder ? 'diamond' : 'dot',
      size: 30,
      title: `${record.name}\n${record.isPlaceholder ? 'Placeholder' : record.status || 'active'}\n${record.parsed?.nodes?.length || 0} entities`,
      _data: {
        id: ns,
        label: shortName,
        entityType: 'ontology',
        description: record.registryEntry?.description || record.name,
        series: seriesKey,
        sourceName: record.name,
        sourceNamespace: ns,
        isPlaceholder: record.isPlaceholder,
        entityCount: record.parsed?.nodes?.length || 0
      }
    };
    visNodes.push(node);
    tier1Nodes.push(node._data);
  }

  // Context nodes: other series as faded super-nodes
  for (const [key, info] of Object.entries(seriesData)) {
    if (key === seriesKey || info.count === 0) continue;

    visNodes.push({
      id: key,
      label: info.name.replace(' Series', '').replace(' Ontologies', ''),
      color: {
        background: info.color,
        border: '#333',
        highlight: { background: info.color, border: '#555' }
      },
      opacity: 0.3,
      borderWidth: 1,
      font: { color: '#666', size: 12 },
      shape: 'dot',
      size: 25,
      title: `${info.name} (${info.count} ontologies)\nClick to switch`,
      _data: {
        id: key,
        label: info.name,
        entityType: 'series',
        description: info.description || '',
        series: key,
        ontologyCount: info.count,
        isContext: true
      }
    });
    tier1Nodes.push({
      id: key, label: info.name, entityType: 'series',
      series: key, isContext: true
    });
  }

  // Edges: cross-ontology edges within and across this series
  const visEdges = [];
  const tier1Edges = [];

  for (const edge of (state.crossEdges || [])) {
    const fromPrefix = edge.from.split('::')[0];
    const toPrefix = edge.to.split('::')[0];

    // Find source and target namespaces
    let fromNs = null, toNs = null;
    for (const [ns] of loadedOntologies) {
      const prefix = ns.replace(/:$/, '');
      if (prefix === fromPrefix) fromNs = ns;
      if (prefix === toPrefix) toNs = ns;
    }

    if (!fromNs || !toNs) continue;
    const fromRecord = loadedOntologies.get(fromNs);
    const toRecord = loadedOntologies.get(toNs);
    if (!fromRecord || !toRecord) continue;

    // Show edges where at least one end is in this series
    const fromInSeries = fromRecord.series === seriesKey;
    const toInSeries = toRecord.series === seriesKey;
    if (!fromInSeries && !toInSeries) continue;

    // Map edge endpoints to ontology-level node IDs
    const edgeFrom = fromInSeries ? fromNs : fromRecord.series;
    const edgeTo = toInSeries ? toNs : toRecord.series;

    // Avoid self-loops and duplicate edges
    if (edgeFrom === edgeTo) continue;
    const edgeKey = `${edgeFrom}->${edgeTo}`;
    if (tier1Edges.some(e => `${e.from}->${e.to}` === edgeKey)) continue;

    visEdges.push({
      from: edgeFrom,
      to: edgeTo,
      label: edge.label,
      color: { color: '#FFD700', highlight: '#FFF176' },
      font: { color: '#FFD700', size: 9, strokeWidth: 2, strokeColor: '#0f1117' },
      arrows: 'to',
      dashes: [8, 4],
      width: 2,
      smooth: { type: 'continuous', roundness: 0.4 }
    });
    tier1Edges.push({
      from: edgeFrom, to: edgeTo, label: edge.label,
      edgeType: 'crossOntology', isCrossOntology: true
    });
  }

  // Set lastParsed for sidebar compatibility
  state.lastParsed = {
    nodes: tier1Nodes,
    edges: tier1Edges,
    name: `${seriesKey} — Ontologies`,
    diagnostics: { format: 'series-drill' }
  };

  const container = document.getElementById('network');
  const data = { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) };

  const options = {
    physics: {
      enabled: true,
      stabilization: { iterations: 150 },
      barnesHut: { gravitationalConstant: -3000, springLength: 200, springConstant: 0.03 }
    },
    interaction: { hover: true, tooltipDelay: 200 },
    nodes: { borderWidth: 2 },
    edges: { smooth: { type: 'continuous', roundness: 0.3 } },
    layout: {}
  };

  state.network = new vis.Network(container, data, options);

  state.network.once('stabilizationIterationsDone', function() {
    state.network.fit({ animation: true });
  });

  state.network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = visNodes.find(n => n.id === nodeId);
      if (node) showNodeDetails(node._data);
    }
  });

  state.network.on('doubleClick', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      // Check if it's a context series node (switch series)
      if (seriesData[nodeId] && nodeId !== seriesKey) {
        window.drillToSeries(nodeId);
        return;
      }
      // Otherwise drill into ontology entities
      const record = loadedOntologies.get(nodeId);
      if (record && !record.isPlaceholder) {
        window.drillToOntology(nodeId);
      }
    }
  });

  const ontCount = visNodes.filter(n => n._data.entityType === 'ontology').length;
  document.getElementById('stats').textContent =
    `${seriesInfo.name}: ${ontCount} ontologies | ${visEdges.length} cross-ref edges | Unified Registry [series-drill]`;

  buildSeriesLegend(seriesData);
}

// ========================================
// CONNECTION MAP MODE (Phase 4 — Feature #41)
// ========================================

/**
 * Render a Connection Map showing all ontologies as nodes with
 * cross-ontology edges weighted by reference count.
 * Each node is an ontology (not series, not entity).
 * Edge thickness and labels show cross-reference counts.
 */
export function renderConnectionMap(loadedOntologies, crossEdges, seriesData) {
  // Hide single-ontology panels
  document.getElementById('compliance-status').style.display = 'none';
  document.getElementById('audit-panel').classList.remove('open');

  const visNodes = [];
  const connectionMapNodes = [];

  // Build ontology-to-ontology edge counts
  const ontologyEdgeCounts = new Map(); // 'fromNs->toNs' => count

  for (const edge of crossEdges) {
    // Extract source namespace
    const fromNs = edge.sourceNamespace;
    if (!fromNs) continue;

    // Extract target namespace from edge.to (prefix::entity)
    const toPrefix = edge.to.split('::')[0];
    let toNs = null;
    for (const [ns] of loadedOntologies) {
      if (ns.replace(/:$/, '') === toPrefix) {
        toNs = ns;
        break;
      }
    }
    if (!toNs || fromNs === toNs) continue;

    // Normalise edge direction (alphabetical) to merge bidirectional refs
    const key = fromNs < toNs ? `${fromNs}->${toNs}` : `${toNs}->${fromNs}`;
    ontologyEdgeCounts.set(key, (ontologyEdgeCounts.get(key) || 0) + 1);
  }

  // Create one node per ontology
  for (const [ns, record] of loadedOntologies) {
    const seriesColor = SERIES_COLORS[record.series] || SERIES_COLORS.placeholder;
    const shortName = record.name
      .replace(/\s+Ontology.*$/i, '')
      .replace(/\s*\(.*\)$/, '')
      .trim();

    const node = {
      id: ns,
      label: shortName,
      color: {
        background: record.isPlaceholder ? SERIES_COLORS.placeholder : seriesColor,
        border: record.isPlaceholder ? '#888' : '#222',
        highlight: { background: '#9dfff5', border: '#017c75' }
      },
      borderWidth: 2,
      borderWidthSelected: 4,
      shapeProperties: { borderDashes: record.isPlaceholder ? [6, 3] : false },
      font: { color: '#e0e0e0', size: 12 },
      shape: record.isPlaceholder ? 'diamond' : 'dot',
      size: 25,
      title: `${record.name}\n${record.series}\n${record.parsed?.nodes?.length || 0} entities`,
      _data: {
        id: ns,
        label: shortName,
        entityType: 'ontology',
        description: record.registryEntry?.description || record.name,
        series: record.series,
        sourceName: record.name,
        sourceNamespace: ns,
        isPlaceholder: record.isPlaceholder,
        entityCount: record.parsed?.nodes?.length || 0
      }
    };
    visNodes.push(node);
    connectionMapNodes.push(node._data);
  }

  // Create edges with weighted thickness
  const visEdges = [];
  const connectionMapEdges = [];
  const maxCount = Math.max(...ontologyEdgeCounts.values(), 1);

  for (const [key, count] of ontologyEdgeCounts) {
    const [fromNs, toNs] = key.split('->');

    // Calculate edge width: 1 to 6 based on count
    const normalised = count / maxCount;
    const width = 1 + normalised * 5;

    visEdges.push({
      from: fromNs,
      to: toNs,
      label: `${count}`,
      color: { color: '#FFD700', highlight: '#FFF176' },
      font: { color: '#FFD700', size: 11, strokeWidth: 2, strokeColor: '#0f1117' },
      arrows: { to: { enabled: true, scaleFactor: 0.5 } },
      dashes: false,
      width: width,
      smooth: { type: 'continuous', roundness: 0.4 },
      title: `${count} cross-reference${count > 1 ? 's' : ''}`
    });

    connectionMapEdges.push({
      from: fromNs,
      to: toNs,
      label: `${count} refs`,
      count: count,
      edgeType: 'crossOntology',
      isCrossOntology: true
    });
  }

  // Set lastParsed for sidebar compatibility
  state.lastParsed = {
    nodes: connectionMapNodes,
    edges: connectionMapEdges,
    name: 'Connection Map',
    diagnostics: { format: 'connection-map' }
  };

  const container = document.getElementById('network');
  const data = { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) };

  const options = {
    physics: {
      enabled: true,
      stabilization: { iterations: 250 },
      barnesHut: { gravitationalConstant: -4000, springLength: 220, springConstant: 0.025 }
    },
    interaction: { hover: true, tooltipDelay: 200 },
    nodes: { borderWidth: 2 },
    edges: { smooth: { type: 'continuous', roundness: 0.3 } },
    layout: {}
  };

  state.network = new vis.Network(container, data, options);

  state.network.once('stabilizationIterationsDone', function() {
    state.network.fit({ animation: true });
  });

  state.network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = visNodes.find(n => n.id === nodeId);
      if (node) showNodeDetails(node._data);
    }
  });

  state.network.on('doubleClick', function(params) {
    if (params.nodes.length > 0) {
      const namespace = params.nodes[0];
      const record = loadedOntologies.get(namespace);
      if (record && !record.isPlaceholder) {
        window.drillToOntology(namespace);
      }
    }
  });

  const ontologyCount = visNodes.length;
  const edgeCount = visEdges.length;
  const totalRefs = Array.from(ontologyEdgeCounts.values()).reduce((a, b) => a + b, 0);

  document.getElementById('stats').textContent =
    `${ontologyCount} ontologies | ${edgeCount} connections (${totalRefs} refs) | Connection Map`;

  buildSeriesLegend(seriesData);
}

export function togglePhysics() {
  state.physicsEnabled = !state.physicsEnabled;
  document.getElementById('btn-physics').classList.toggle('active');
  if (state.network) state.network.setOptions({ physics: { enabled: state.physicsEnabled } });
}

export function changeLayout() {
  const layout = document.getElementById('layout-select').value;
  if (!state.network) return;
  const opts = { layout: {} };
  if (layout === 'hierarchical') {
    opts.layout = { hierarchical: { direction: 'UD', sortMethod: 'hubsize', levelSeparation: 120 } };
    opts.physics = { enabled: false };
  } else if (layout === 'circular') {
    opts.physics = { enabled: true, barnesHut: { gravitationalConstant: -1000, centralGravity: 0.8, springLength: 100 } };
    setTimeout(() => { if (state.network) state.network.setOptions({ physics: { enabled: false } }); }, 2000);
  } else {
    opts.physics = { enabled: state.physicsEnabled };
  }
  state.network.setOptions(opts);
}

export function fitGraph() {
  if (state.network) state.network.fit({ animation: true });
}

export function resetGraph() {
  if (!state.currentData) {
    document.getElementById('compliance-status').style.display = 'none';
    return;
  }

  const fileName = document.getElementById('file-name').textContent || 'reset';
  const parsed = parseOntology(state.currentData, fileName);

  renderGraph(parsed);

  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('audit-panel').classList.remove('open');

  state.physicsEnabled = true;
  document.getElementById('btn-physics').classList.add('active');
  document.getElementById('layout-select').value = 'physics';
}
