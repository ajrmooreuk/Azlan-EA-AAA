/**
 * Graph rendering with vis.js — renderGraph, layout controls, focus/zoom.
 */

import { state, TYPE_COLORS, EDGE_COLORS } from './state.js';
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
