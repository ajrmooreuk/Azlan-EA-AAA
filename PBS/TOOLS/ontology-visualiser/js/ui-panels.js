/**
 * UI panel management — sidebar, audit panel, modals, tab navigation.
 * Functions that need renderGraph (loadFromLibrary, restoreVersion) are in app.js.
 */

import { state, SERIES_COLORS } from './state.js';
import { validateOAAv5 } from './audit-engine.js';
import { getVersionHistory, loadOntologyFromLibrary } from './library-manager.js';
import { DEFAULT_CATEGORIES } from './state.js';

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function field(label, value) {
  return `<div class="field"><div class="field-label">${label}</div><div class="field-value">${value}</div></div>`;
}

export function renderAuditPanel(audit) {
  state.lastAudit = audit;
  const el = document.getElementById('audit-content');
  let html = '';

  html += `<div class="audit-section"><h4>Summary</h4>`;
  html += `<div class="audit-item">Format: <strong>${audit.format}</strong></div>`;
  html += `<div class="audit-item">${audit.totalNodes} nodes, ${audit.totalEdges} edges</div>`;
  html += `<div class="audit-item">Connected components: ${audit.components.length} `;
  html += audit.disconnectedCount === 0
    ? `<span class="audit-badge ok">Fully connected</span>`
    : `<span class="audit-badge warn">${audit.disconnectedCount} disconnected</span>`;
  html += `</div>`;
  html += `<div class="audit-item">Main component: ${audit.mainComponentSize} nodes</div>`;
  html += `</div>`;

  if (audit.stubNodes.length > 0) {
    html += `<div class="audit-section"><h4>Auto-created stubs <span class="audit-badge warn">${audit.stubNodes.length}</span></h4>`;
    audit.stubNodes.forEach(id => {
      html += `<div class="audit-item" onclick="focusNode('${id.replace(/'/g, "\\'")}')">${id}</div>`;
    });
    html += `</div>`;
  }

  if (audit.isolated.length > 0) {
    html += `<div class="audit-section"><h4>Isolated nodes (silos) <span class="audit-badge warn">${audit.isolated.length}</span></h4>`;
    audit.isolated.forEach(n => {
      html += `<div class="audit-item" onclick="focusNode('${n.id.replace(/'/g, "\\'")}')">${n.label} <span style="color:#666">(${n.entityType})</span></div>`;
    });
    html += `</div>`;
  }

  if (audit.components.length > 1) {
    html += `<div class="audit-section"><h4>Disconnected clusters</h4>`;
    audit.components.slice(1).forEach((comp, i) => {
      const preview = comp.slice(0, 3).join(', ') + (comp.length > 3 ? '...' : '');
      html += `<div class="audit-item" onclick="focusNodes(${JSON.stringify(comp)})">Cluster ${i + 1}: ${comp.length} nodes \u2014 ${preview}</div>`;
    });
    html += `</div>`;
  }

  if (audit.stubNodes.length === 0 && audit.isolated.length === 0 && audit.disconnectedCount === 0) {
    html += `<div class="audit-section"><div class="audit-item" style="color:#86efac;">Graph is fully connected with no issues.</div></div>`;
  }

  el.innerHTML = html;
}

export function showNodeDetails(node) {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.add('open');
  state.currentNodeId = node.id;

  document.getElementById('sidebar-title').textContent = node.label || node.id;

  let detailsHtml = '';
  detailsHtml += field('ID', node.id);
  detailsHtml += field('Label', node.label);
  detailsHtml += field('Type', node.entityType);
  if (node.description) detailsHtml += field('Description', node.description);

  // Multi-ontology provenance (Phase 1) + drill actions (Phase 2)
  if (state.viewMode === 'multi' && node.sourceNamespace) {
    const seriesColor = SERIES_COLORS[node.series] || SERIES_COLORS.placeholder;
    detailsHtml += field('Source Ontology', node.sourceName || node.sourceNamespace);
    detailsHtml += field('Series',
      `<span class="provenance-badge series" style="color:${seriesColor}; border-color:${seriesColor}">${node.series || 'Unknown'}</span>`);
    if (node.isPlaceholder) {
      detailsHtml += field('Status', '<span class="provenance-badge placeholder">Placeholder</span>');
    }
    if (node.originalId) {
      detailsHtml += field('Original ID', node.originalId);
    }
  }

  // Tier-aware drill actions (Phase 2)
  if (state.viewMode === 'multi' && state.currentTier === 0 && node.entityType === 'series') {
    detailsHtml += `<div style="margin-top:12px;">
      <button class="oaa-btn" onclick="drillToSeries('${node.id}')">View Ontologies in this Series</button>
    </div>`;
    if (node.ontologies && node.ontologies.length > 0) {
      detailsHtml += field('Ontologies', node.ontologies.join(', '));
    }
  } else if (state.viewMode === 'multi' && state.currentTier === 1 && node.entityType === 'ontology') {
    if (!node.isPlaceholder) {
      detailsHtml += `<div style="margin-top:12px;">
        <button class="oaa-btn" onclick="drillToOntology('${node.id}')">View Entity Graph</button>
      </div>`;
    }
    if (node.entityCount) {
      detailsHtml += field('Entities', node.entityCount);
    }
  } else if (state.viewMode === 'multi' && state.currentTier === 1 && node.entityType === 'series' && node.isContext) {
    detailsHtml += `<div style="margin-top:12px;">
      <button class="oaa-btn" onclick="drillToSeries('${node.id}')">Switch to this Series</button>
    </div>`;
  }

  if (node.properties && typeof node.properties === 'object') {
    for (const [k, v] of Object.entries(node.properties)) {
      if (['id', 'name', 'label', 'description', 'entityType', 'type', '@id', '@type', 'properties'].includes(k)) continue;
      const val = typeof v === 'object' ? JSON.stringify(v, null, 2) : v;
      detailsHtml += field(k, val);
    }
  }
  document.getElementById('tab-details').innerHTML = detailsHtml;

  renderConnectionsTab(node.id);
  renderSchemaTab(node);
  renderDataTab(node.id);

  switchTab('details');
}

export function renderConnectionsTab(nodeId) {
  if (!state.lastParsed) return;

  const incoming = state.lastParsed.edges.filter(e => e.to === nodeId);
  const outgoing = state.lastParsed.edges.filter(e => e.from === nodeId);

  let html = '';

  html += `<div class="conn-section"><h4>Outgoing (${outgoing.length})</h4>`;
  if (outgoing.length === 0) {
    html += '<p class="no-data">No outgoing connections</p>';
  } else {
    outgoing.forEach(e => {
      const targetNode = state.lastParsed.nodes.find(n => n.id === e.to);
      const targetLabel = targetNode ? targetNode.label : e.to;
      html += `<div class="connection-item" onclick="navigateToNode('${e.to.replace(/'/g, "\\'")}')">
        <span class="connection-arrow">\u2192</span>
        <span class="connection-label">${e.label || 'relates to'}</span>
        <span class="connection-node">${targetLabel}</span>
      </div>`;
    });
  }
  html += '</div>';

  html += `<div class="conn-section"><h4>Incoming (${incoming.length})</h4>`;
  if (incoming.length === 0) {
    html += '<p class="no-data">No incoming connections</p>';
  } else {
    incoming.forEach(e => {
      const sourceNode = state.lastParsed.nodes.find(n => n.id === e.from);
      const sourceLabel = sourceNode ? sourceNode.label : e.from;
      html += `<div class="connection-item" onclick="navigateToNode('${e.from.replace(/'/g, "\\'")}')">
        <span class="connection-arrow">\u2190</span>
        <span class="connection-label">${e.label || 'relates to'}</span>
        <span class="connection-node">${sourceLabel}</span>
      </div>`;
    });
  }
  html += '</div>';

  const total = incoming.length + outgoing.length;
  html += `<div class="conn-section"><h4>Summary</h4>`;
  html += `<div style="font-size:12px; color:#ccc;">Total connections: ${total}</div>`;
  if (total === 0) {
    html += `<div style="font-size:12px; color:#FF9800; margin-top:4px;">This node is isolated (no edges)</div>`;
  }
  html += '</div>';

  document.getElementById('tab-connections').innerHTML = html;
}

export function renderSchemaTab(node) {
  let html = '';
  const props = node.properties || {};

  const subClassOf = props['rdfs:subClassOf'] || props.subClassOf;
  if (subClassOf) {
    const parentId = typeof subClassOf === 'object' ? (subClassOf['@id'] || subClassOf.id) : subClassOf;
    if (parentId) {
      html += '<div class="conn-section"><h4>Inherits From</h4>';
      html += `<div class="connection-item" onclick="navigateToNode('${parentId.replace(/'/g, "\\'")}')">
        <span class="connection-arrow">\u2191</span>
        <span class="connection-node">${parentId.replace(/.*[:#]/, '')}</span>
      </div>`;
      html += '</div>';
    }
  }

  if (props.schemaOrgBase) {
    html += '<div class="conn-section"><h4>Schema.org Base</h4>';
    html += `<div style="font-size:12px; color:#9dfff5;">${props.schemaOrgBase}</div>`;
    html += '</div>';
  }

  const schemaProps = props['oaa:properties'] || props.properties || props.attributes || [];

  if (Array.isArray(schemaProps) && schemaProps.length > 0) {
    html += '<div class="conn-section"><h4>Data Properties</h4>';
    schemaProps.forEach(p => {
      const name = p.name || p['@id'] || p.id || 'unknown';
      const type = p.type || p.dataType || p['@type'] || p.range || 'any';
      const required = p.required || p.minCount > 0;
      const desc = p.description || '';
      const schemaOrg = p.schemaOrgMapping || '';
      html += `<div class="prop-row" title="${desc}${schemaOrg ? ' (' + schemaOrg + ')' : ''}">
        <span class="prop-name">${name}${required ? '<span class="prop-required">*</span>' : ''}</span>
        <span class="prop-type">${type}${p.enumValues ? ' [' + p.enumValues.slice(0,3).join('|') + (p.enumValues.length > 3 ? '...' : '') + ']' : ''}</span>
      </div>`;
    });
    html += '</div>';
  }

  if (state.lastParsed) {
    const nodeId = node.id;
    const asSource = state.lastParsed.edges.filter(e => e.from === nodeId);
    const asTarget = state.lastParsed.edges.filter(e => e.to === nodeId);

    if (asSource.length > 0 || asTarget.length > 0) {
      html += '<div class="conn-section"><h4>Relationship Participation</h4>';

      const relTypes = new Map();
      asSource.forEach(e => {
        const key = `\u2192 ${e.label || 'relates to'}`;
        if (!relTypes.has(key)) relTypes.set(key, []);
        relTypes.get(key).push(e.to);
      });
      asTarget.forEach(e => {
        const key = `\u2190 ${e.label || 'relates to'}`;
        if (!relTypes.has(key)) relTypes.set(key, []);
        relTypes.get(key).push(e.from);
      });

      relTypes.forEach((targets, rel) => {
        const targetLabels = targets.map(t => {
          const n = state.lastParsed.nodes.find(x => x.id === t);
          return n ? n.label : t.replace(/.*[:#]/, '');
        }).slice(0, 3);
        html += `<div style="font-size:11px; color:#888; margin:4px 0;">
          <span style="color:#9dfff5;">${rel}</span> ${targetLabels.join(', ')}${targets.length > 3 ? '...' : ''}
        </div>`;
      });
      html += '</div>';
    }
  }

  const inlineProps = [];
  const skipKeys = ['id', 'name', 'label', 'description', 'entityType', 'type', '@id', '@type',
                    'properties', 'attributes', 'schemaOrgBase', 'oaa:properties', 'oaa:description',
                    'rdfs:label', 'rdfs:comment', 'rdfs:subClassOf', 'subClassOf'];
  for (const [k, v] of Object.entries(props)) {
    if (skipKeys.includes(k)) continue;
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      inlineProps.push({ name: k, type: typeof v, value: v });
    }
  }

  if (inlineProps.length > 0) {
    html += '<div class="conn-section"><h4>Metadata</h4>';
    inlineProps.forEach(p => {
      html += `<div class="prop-row">
        <span class="prop-name">${p.name}</span>
        <span class="prop-type">${p.type}</span>
      </div>`;
    });
    html += '</div>';
  }

  if (!html) {
    html = '<p class="no-data">No schema information available for this entity</p>';
  }

  document.getElementById('tab-schema').innerHTML = html;
}

export function renderDataTab(nodeId) {
  let html = '';

  const testData = findTestData(nodeId);

  if (testData.length === 0) {
    html = '<p class="no-data">No data instances found for this entity.<br><br>Load an ontology with testData or instances to see sample values.</p>';
  } else {
    html += `<div style="font-size:11px; color:#888; margin-bottom:12px;">${testData.length} instance(s) found</div>`;
    testData.forEach((instance, idx) => {
      const instanceType = instance._dataType || 'typical';
      html += `<div class="data-instance">
        <div class="data-instance-header">
          <span class="data-instance-id">${instance.id || instance['@id'] || instance.name || 'Instance ' + (idx + 1)}</span>
          <span class="data-instance-type ${instanceType}">${instanceType}</span>
        </div>`;

      for (const [k, v] of Object.entries(instance)) {
        if (k === '_dataType' || k === '_entityType') continue;
        const displayVal = typeof v === 'object' ? JSON.stringify(v) : v;
        html += `<div class="data-row">
          <span class="data-key">${k}</span>
          <span class="data-value">${displayVal}</span>
        </div>`;
      }
      html += '</div>';
    });
  }

  document.getElementById('tab-data').innerHTML = html;
}

export function findTestData(entityId) {
  if (!state.currentData) return [];

  const results = [];

  const testDataSources = [
    state.currentData.testData,
    state.currentData.testInstances,
    state.currentData.instances,
    state.currentData.sampleData,
    state.currentData.data,
    state.currentData.ontologyDefinition?.testData,
    state.currentData.registryEntry?.testData
  ];

  for (const source of testDataSources) {
    if (!source) continue;

    if (typeof source === 'object' && !Array.isArray(source)) {
      for (const [key, instances] of Object.entries(source)) {
        if (key === entityId || key.toLowerCase() === entityId.toLowerCase() ||
            entityId.includes(key) || key.includes(entityId)) {
          if (Array.isArray(instances)) {
            instances.forEach(inst => {
              results.push({ ...inst, _entityType: key, _dataType: inst.testCategory || inst.dataType || 'typical' });
            });
          } else if (typeof instances === 'object') {
            results.push({ ...instances, _entityType: key, _dataType: instances.testCategory || 'typical' });
          }
        }
      }
    }

    if (Array.isArray(source)) {
      source.forEach(inst => {
        const instType = inst.entityType || inst['@type'] || inst.type || '';
        if (instType === entityId || instType.includes(entityId) || entityId.includes(instType)) {
          results.push({ ...inst, _dataType: inst.testCategory || inst.dataType || 'typical' });
        }
      });
    }
  }

  const distributions = ['typical', 'edge', 'boundary', 'invalid'];
  for (const dist of distributions) {
    const distData = state.currentData[dist] || state.currentData.testData?.[dist];
    if (distData && typeof distData === 'object') {
      for (const [key, instances] of Object.entries(distData)) {
        if (key === entityId || key.toLowerCase() === entityId.toLowerCase()) {
          if (Array.isArray(instances)) {
            instances.forEach(inst => results.push({ ...inst, _entityType: key, _dataType: dist }));
          }
        }
      }
    }
  }

  return results.slice(0, 10);
}

export function navigateToNode(nodeId) {
  if (!state.network || !state.lastParsed) return;

  const node = state.lastParsed.nodes.find(n => n.id === nodeId);
  if (!node) return;

  state.network.selectNodes([nodeId]);
  state.network.focus(nodeId, { scale: 1.5, animation: true });

  showNodeDetails(node);
}

export function switchTab(tabName) {
  document.querySelectorAll('.sidebar-tab').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === tabName);
  });

  ['details', 'connections', 'schema', 'data'].forEach(name => {
    const el = document.getElementById('tab-' + name);
    if (el) el.style.display = name === tabName ? 'block' : 'none';
  });
}

export function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

export function toggleAudit() {
  document.getElementById('audit-panel').classList.toggle('open');
}

export function loadTestDataFile() {
  if (!state.currentData) {
    alert('Load an ontology first, then add test data.');
    return;
  }

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const testData = JSON.parse(ev.target.result);

        if (testData.testData) {
          state.currentData.testData = { ...state.currentData.testData, ...testData.testData };
        } else if (testData.instances || testData.sampleData) {
          state.currentData.testData = testData.instances || testData.sampleData;
        } else if (Array.isArray(testData)) {
          state.currentData.testData = state.currentData.testData || {};
          testData.forEach(inst => {
            const entityType = inst.entityType || inst['@type'] || 'unknown';
            if (!state.currentData.testData[entityType]) state.currentData.testData[entityType] = [];
            state.currentData.testData[entityType].push(inst);
          });
        } else {
          state.currentData.testData = { ...state.currentData.testData, ...testData };
        }

        if (state.currentNodeId) {
          renderDataTab(state.currentNodeId);
        }

        alert('Test data loaded successfully! Click on entities to see their data in the Data tab.');
      } catch (err) {
        alert('Failed to parse test data: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// OAA Upgrade functions
export function extractOntologyDomain(data) {
  if (!data) return null;
  return data['oaa:domain'] ||
         data.domain ||
         (data['rdfs:label'] && data['rdfs:label'].split(' ')[0]) ||
         (data.name && data.name.split(' ')[0]) ||
         null;
}

export function runOAAUpgrade() {
  if (!state.currentData) {
    alert('Load an ontology first');
    return;
  }

  const validation = validateOAAv5(state.currentData, state.lastParsed);
  const fileName = document.getElementById('file-name').textContent || 'ontology';
  const baseName = fileName.replace(/\.json$/i, '');
  const outputName = `${baseName}-oaa-v6-upgraded.json`;
  const prompt = buildOAAPrompt(state.currentData, validation);
  showOAAModal(prompt, outputName);
}

export function buildOAAPrompt(ontology, validation) {
  const issues = [];
  const orphanedEntities = [];
  const missingDescriptions = [];

  validation.gates.forEach(g => {
    if (g.status === 'fail') {
      issues.push(`FAIL: ${g.gate} - ${g.detail}`);
      if (g.gate.includes('2B') && g.orphaned) {
        orphanedEntities.push(...g.orphaned);
      }
    }
    if (g.status === 'warn') {
      issues.push(`WARN: ${g.gate} - ${g.detail}`);
      if (g.gate.includes('G4') && g.warnings) {
        g.warnings.forEach(w => {
          if (w.includes('missing description')) {
            const match = w.match(/^([^:]+):/);
            if (match) missingDescriptions.push(match[1]);
          }
        });
      }
    }
  });

  let prompt = `You are the OAA (Ontology Architect Agent) v6.1.0.

Upgrade this ontology to pass ALL OAA v6.1.0 core compliance gates (G1-G4).

## OAA v6.1.0 Core Gates (REQUIRED - must pass at 100%)

| Gate | Requirement |
|------|-------------|
| G1 | Schema Structure: Valid JSON-LD with @context, @id, entities |
| G2 | Relationship Cardinality: All relationships have domainIncludes/rangeIncludes with cardinality |
| G2B | Entity Connectivity: EVERY entity must participate in \u22651 relationship |
| G2C | Graph Connectivity: All entities form a SINGLE connected component |
| G3 | Business Rules: IF-THEN format with severity levels |
| G4 | Semantic Consistency: All entities have descriptions (\u226520 chars) |

## Advisory Gates (Recommended but not required for compliance)

| Gate | Requirement |
|------|-------------|
| G5 | Completeness: Version, metadata, edge-to-node ratio \u22650.8 |
| G6 | UniRegistry Format: If applicable, valid registry structure |

## Current Compliance Status
${issues.length > 0 ? issues.filter(i => !i.includes('G5:') && !i.includes('G6:')).join('\n') : 'No critical issues, but validate and enhance.'}`;

  if (orphanedEntities.length > 0) {
    prompt += `

## CRITICAL: Orphaned Entities (G2B FAIL)
These entities have ZERO relationships and MUST be connected:
${orphanedEntities.map(e => `- ${e}`).join('\n')}

For EACH orphaned entity, add at least one relationship where it appears as:
- domainIncludes (source) OR
- rangeIncludes (target)`;
  }

  if (missingDescriptions.length > 0) {
    prompt += `

## Missing Descriptions (G4)
Add descriptions (\u226520 characters) for:
${missingDescriptions.slice(0, 10).map(e => `- ${e}`).join('\n')}${missingDescriptions.length > 10 ? `\n... and ${missingDescriptions.length - 10} more` : ''}`;
  }

  prompt += `

## Current Ontology
\`\`\`json
${JSON.stringify(ontology, null, 2)}
\`\`\`

## Required Output Format
Produce a compliant ontology with:
1. All entities connected via relationships (no orphans)
2. Relationships with proper domainIncludes/rangeIncludes arrays
3. Descriptions for all entities (\u226520 characters each)
4. Cardinality notation on relationships (e.g., "1..*", "0..1")
5. Single connected graph (all entities reachable from any other)

Output ONLY valid JSON. No explanations, no markdown, no code blocks.`;

  return prompt;
}

export function showOAAModal(prompt, outputName) {
  const modal = document.getElementById('oaa-modal');
  const body = document.getElementById('oaa-modal-body');

  const escapedPrompt = prompt.replace(/'/g, "'\\''");

  const domain = extractOntologyDomain(state.currentData);
  const domainFolder = domain ? domain.toUpperCase().replace(/\s+/g, '-') + '-ONT' : 'DOMAIN-ONT';
  const suggestedPath = `PBS/ONTOLOGIES/pfc-ontologies/${domainFolder}/${outputName}`;

  const command = `claude -p '${escapedPrompt}' > ${outputName}`;

  body.innerHTML = `
    <p style="color:#888; margin-bottom:16px;">Copy this command and run it in your terminal with Claude Code:</p>

    <div class="oaa-command" id="oaa-command">${escapeHtml(command)}</div>

    <div style="margin-bottom:16px;">
      <button class="oaa-btn" onclick="copyOAACommand()">Copy Command</button>
      <button class="oaa-btn oaa-btn-secondary" onclick="downloadOntologyForOAA()">Download Ontology JSON</button>
    </div>

    <details style="margin-top:16px;" open>
      <summary style="color:#9dfff5; cursor:pointer; font-weight:500;">Recommended file path</summary>
      <div style="background:#0d0f12; border:1px solid #3a3d47; border-radius:6px; padding:12px; margin-top:8px;">
        <code style="color:#9dfff5; font-size:12px; word-break:break-all;">${escapeHtml(suggestedPath)}</code>
        <button class="oaa-btn" style="margin-left:12px; padding:4px 8px; font-size:11px;" onclick="copyPath('${escapeHtml(suggestedPath)}', this)">Copy Path</button>
      </div>
      <p style="color:#666; margin-top:8px; font-size:11px;">
        Standard pattern: <code style="background:#0d0f12; padding:2px 6px; border-radius:3px;">PBS/ONTOLOGIES/pfc-ontologies/{DOMAIN}-ONT/{filename}</code>
      </p>
    </details>

    <details style="margin-top:12px;">
      <summary style="color:#888; cursor:pointer;">Alternative: Use file input</summary>
      <p style="color:#666; margin-top:8px; font-size:12px;">
        1. Download the ontology JSON using the button above<br>
        2. Run: <code style="background:#0d0f12; padding:2px 6px; border-radius:3px;">claude -p "Upgrade this ontology to OAA v6.1.0 compliance" &lt; ${outputName.replace('-upgraded', '-for-oaa')}</code>
      </p>
    </details>

    <div style="margin-top:20px; padding-top:16px; border-top:1px solid #3a3d47;">
      <p style="color:#888; font-size:12px;">After running, load the output file back into the Visualiser to verify compliance.</p>
    </div>
  `;

  modal.style.display = 'flex';
}

export function copyPath(path, btn) {
  navigator.clipboard.writeText(path).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = original, 2000);
  });
}

export function closeOAAModal() {
  document.getElementById('oaa-modal').style.display = 'none';
}

export function copyOAACommand() {
  const command = document.getElementById('oaa-command').textContent;
  navigator.clipboard.writeText(command).then(() => {
    const btn = event.target;
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = original, 2000);
  });
}

// Save to Library modal UI
export function showSaveToLibrary() {
  if (!state.currentData) {
    alert('Load an ontology first');
    return;
  }

  const modal = document.getElementById('save-library-modal');
  const body = document.getElementById('save-library-body');

  const currentName = document.getElementById('file-name').textContent || 'Untitled Ontology';
  const baseName = currentName.replace(/\.json$/i, '').replace(/ \(v[\d.]+\)$/, '');
  const currentVersion = state.currentData['owl:versionInfo'] || state.currentData.version || '1.0.0';

  let suggestedCategory = 'custom';
  if (baseName.toLowerCase().includes('pfc') || baseName.toLowerCase().includes('platform-foundation')) {
    suggestedCategory = 'pfc-ontologies';
  } else if (baseName.toLowerCase().includes('pfi')) {
    suggestedCategory = 'pfi-ontologies';
  }

  body.innerHTML = `
    <div class="library-form-group">
      <label>Ontology Name</label>
      <input type="text" id="save-ont-name" class="library-input" value="${escapeHtml(baseName)}" placeholder="e.g., ppm-schema">
    </div>

    <div class="library-form-group">
      <label>Category / Folder</label>
      <select id="save-ont-category" class="library-select">
        ${DEFAULT_CATEGORIES.map(cat =>
          `<option value="${cat}" ${cat === suggestedCategory ? 'selected' : ''}>${cat.replace(/-/g, ' ')}</option>`
        ).join('')}
      </select>
    </div>

    <div class="library-form-group">
      <label>Version</label>
      <input type="text" id="save-ont-version" class="library-input" value="${escapeHtml(currentVersion)}" placeholder="e.g., 1.0.0">
    </div>

    <div class="library-form-group">
      <label>Notes (optional)</label>
      <input type="text" id="save-ont-notes" class="library-input" placeholder="e.g., Upgraded to OAA v6.1.0 compliance">
    </div>

    <div id="save-result"></div>

    <div style="margin-top:16px; display:flex; gap:8px;">
      <button class="oaa-btn" onclick="doSaveToLibrary()">Save to Library</button>
      <button class="oaa-btn oaa-btn-secondary" onclick="closeSaveLibraryModal()">Cancel</button>
    </div>

    <p style="color:#666; font-size:11px; margin-top:12px;">
      Saving creates a versioned entry in your local browser storage with full audit trail.
      Export the library for backup or sharing across devices.
    </p>
  `;

  modal.style.display = 'flex';
}

export function closeSaveLibraryModal() {
  document.getElementById('save-library-modal').style.display = 'none';
}

export async function showVersionHistory(ontologyId, name) {
  try {
    const versions = await getVersionHistory(ontologyId);
    const ontology = await loadOntologyFromLibrary(ontologyId);

    const modal = document.getElementById('save-library-modal');
    const body = document.getElementById('save-library-body');

    let historyHtml = '';
    if (versions.length === 0) {
      historyHtml = '<p class="library-empty">No previous versions</p>';
    } else {
      historyHtml = '<div class="version-history">';
      versions.forEach(v => {
        const date = new Date(v.timestamp).toLocaleString();
        historyHtml += `
          <div class="version-item">
            <div class="version-item-info">
              <strong>v${v.version}</strong>
              <div class="version-item-date">${date}</div>
              ${v.notes ? `<div style="color:#888; font-size:10px;">${escapeHtml(v.notes)}</div>` : ''}
            </div>
            <button class="oaa-btn oaa-btn-secondary" onclick="restoreVersion(${v.id})" style="font-size:11px; padding:4px 8px;">Restore</button>
          </div>`;
      });
      historyHtml += '</div>';
    }

    body.innerHTML = `
      <h4 style="color:#e0e0e0; margin-bottom:12px;">${escapeHtml(name)}</h4>
      <p style="color:#888; font-size:12px; margin-bottom:12px;">Current version: v${ontology.version}</p>
      ${historyHtml}
      <div style="margin-top:16px;">
        <button class="oaa-btn oaa-btn-secondary" onclick="closeSaveLibraryModal()">Close</button>
      </div>
    `;

    modal.style.display = 'flex';

  } catch (err) {
    alert('Error loading version history: ' + err.message);
  }
}
