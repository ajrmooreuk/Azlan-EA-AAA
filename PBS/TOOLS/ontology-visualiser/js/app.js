/**
 * Application entry point — wires modules together, sets up event listeners,
 * and attaches functions to window for HTML onclick handlers.
 */

import { state } from './state.js';
import { parseOntology } from './ontology-parser.js';
import { renderGraph, renderMultiGraph, renderTier0, renderTier1, renderConnectionMap, focusNode, focusNodes, togglePhysics, changeLayout, fitGraph, resetGraph } from './graph-renderer.js';
import { exportAuditFile, exportPNG, downloadOntologyForOAA } from './export.js';
import { loadFullRegistry, buildMergedGraph, detectCrossReferences, buildCrossSeriesEdges, detectBridgeNodes } from './multi-loader.js';
import {
  toggleSidebar, toggleAudit, loadTestDataFile, navigateToNode, switchTab,
  runOAAUpgrade, showOAAModal, closeOAAModal, copyOAACommand, copyPath,
  showSaveToLibrary, closeSaveLibraryModal, showVersionHistory,
  escapeHtml, renderDataTab
} from './ui-panels.js';
import {
  initLibraryDB, saveOntologyToLibrary, loadOntologyFromLibrary,
  getAllOntologies, deleteFromLibrary, getVersionById,
  exportLibraryData, importLibraryData
} from './library-manager.js';

// ========================================
// FILE INPUT & DRAG-DROP
// ========================================

document.getElementById('file-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) loadFile(file);
});

const dropArea = document.getElementById('drop-area');
const dropZone = document.getElementById('drop-zone');

['dragenter', 'dragover'].forEach(evt => {
  dropArea.addEventListener(evt, e => { e.preventDefault(); dropArea.classList.add('dragover'); });
});
['dragleave', 'drop'].forEach(evt => {
  dropArea.addEventListener(evt, e => { e.preventDefault(); dropArea.classList.remove('dragover'); });
});
dropArea.addEventListener('drop', e => {
  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
});

function loadFile(file) {
  document.getElementById('file-name').textContent = file.name;
  state.viewMode = 'single';
  resetNavigation();
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      state.currentData = data;
      const parsed = parseOntology(data, file.name);
      if (parsed.nodes.length === 0) {
        alert('No nodes parsed from this file. Keys found: ' + Object.keys(data).join(', '));
        return;
      }
      renderGraph(parsed);
      dropZone.classList.add('hidden');
    } catch (err) {
      alert('Failed to parse JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ========================================
// GITHUB API LOADING
// ========================================

function loadFromGitHub() {
  let pat = sessionStorage.getItem('gh_pat');
  if (!pat) {
    pat = prompt('Enter GitHub Personal Access Token (stored in session only):');
    if (!pat) return;
    sessionStorage.setItem('gh_pat', pat);
  }
  const path = prompt('Enter repo path: owner/repo/path/to/file.json\nExample: ajrmooreuk/PF-Core-BAIV/PBS/ONTOLOGIES/my-ontology.json');
  if (!path) return;

  const parts = path.split('/');
  if (parts.length < 3) { alert('Format: owner/repo/path/to/file.json'); return; }
  const owner = parts[0];
  const repo = parts[1];
  const filePath = parts.slice(2).join('/');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  state.viewMode = 'single';
  resetNavigation();
  document.getElementById('file-name').textContent = `Loading ${filePath}...`;
  fetch(url, { headers: { 'Authorization': `token ${pat}`, 'Accept': 'application/vnd.github.v3.raw' } })
    .then(res => {
      if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      state.currentData = data;
      document.getElementById('file-name').textContent = filePath;
      const parsed = parseOntology(data, filePath.split('/').pop());
      if (parsed.nodes.length === 0) {
        alert('No nodes parsed. Keys: ' + Object.keys(data).join(', '));
        return;
      }
      renderGraph(parsed);
      dropZone.classList.add('hidden');
    })
    .catch(err => {
      if (err.message.includes('401')) { sessionStorage.removeItem('gh_pat'); }
      alert('GitHub load failed: ' + err.message);
      document.getElementById('file-name').textContent = '';
    });
}

// ========================================
// LIBRARY ORCHESTRATION (needs renderGraph + library CRUD)
// ========================================

function toggleLibrary() {
  const panel = document.getElementById('library-panel');
  const isOpen = panel.classList.toggle('open');
  if (isOpen) {
    refreshLibraryPanel();
  }
}

async function refreshLibraryPanel() {
  const content = document.getElementById('library-content');

  try {
    const grouped = await getAllOntologies();
    let html = '';
    let hasAny = false;

    for (const [category, ontologies] of Object.entries(grouped)) {
      if (ontologies.length === 0) continue;
      hasAny = true;

      const displayCategory = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      html += `<div class="library-category">
        <h4>${displayCategory} (${ontologies.length})</h4>`;

      ontologies.forEach(ont => {
        const date = new Date(ont.updated).toLocaleDateString();
        const complianceClass = ont.compliance === 'pass' ? 'ok' : (ont.compliance === 'warn' ? 'warn' : 'fail');
        html += `
          <div class="library-item" onclick="loadFromLibrary(${ont.id})">
            <div class="library-item-header">
              <span class="library-item-name">${escapeHtml(ont.name)}</span>
              <span class="library-item-version">v${ont.version}</span>
            </div>
            <div class="library-item-meta">
              <span class="audit-badge ${complianceClass}">${ont.compliance}</span>
              <span>${date}</span>
            </div>
            <div class="library-item-actions" onclick="event.stopPropagation()">
              <button class="oaa-btn oaa-btn-secondary" onclick="showVersionHistory(${ont.id}, '${escapeHtml(ont.name)}')">History</button>
              <button class="oaa-btn oaa-btn-secondary" onclick="downloadOntology(${ont.id})">Download</button>
              <button class="oaa-btn oaa-btn-secondary" onclick="deleteOntology(${ont.id})" style="color:#fca5a5;">Delete</button>
            </div>
          </div>`;
      });

      html += '</div>';
    }

    if (!hasAny) {
      html = '<p class="library-empty">No ontologies saved yet.<br>Load an ontology and click "Save to Library" when it passes OAA v6.1.0 compliance.</p>';
    }

    content.innerHTML = html;
  } catch (err) {
    content.innerHTML = `<p class="library-empty" style="color:#fca5a5;">Error loading library: ${err.message}</p>`;
  }
}

async function loadFromLibrary(id) {
  try {
    const ontology = await loadOntologyFromLibrary(id);
    if (!ontology) {
      alert('Ontology not found in library');
      return;
    }

    state.viewMode = 'single';
    resetNavigation();
    state.currentData = ontology.data;
    document.getElementById('file-name').textContent = `${ontology.name} (v${ontology.version})`;

    const parsed = parseOntology(ontology.data, ontology.name);
    if (parsed.nodes.length === 0) {
      alert('No nodes parsed from saved ontology');
      return;
    }

    renderGraph(parsed);
    document.getElementById('drop-zone').classList.add('hidden');
    toggleLibrary();

  } catch (err) {
    alert('Error loading from library: ' + err.message);
  }
}

async function doSaveToLibrary() {
  const name = document.getElementById('save-ont-name').value.trim();
  const category = document.getElementById('save-ont-category').value;
  const version = document.getElementById('save-ont-version').value.trim();
  const notes = document.getElementById('save-ont-notes').value.trim();
  const resultDiv = document.getElementById('save-result');

  if (!name) {
    resultDiv.innerHTML = '<p style="color:#fca5a5; font-size:12px;">Name is required</p>';
    return;
  }

  try {
    const result = await saveOntologyToLibrary(state.currentData, name, category, version, notes);

    resultDiv.innerHTML = `
      <div class="save-success">
        \u2713 Saved ${result.isUpdate ? 'updated' : 'new'} ontology: <strong>${name}</strong> v${result.version}
        ${result.isUpdate ? `<br><small>Previous version ${result.previousVersion} archived</small>` : ''}
      </div>
    `;

    document.getElementById('file-name').textContent = `${name} (v${result.version})`;

    if (document.getElementById('library-panel').classList.contains('open')) {
      refreshLibraryPanel();
    }

    setTimeout(() => {
      closeSaveLibraryModal();
    }, 1500);

  } catch (err) {
    resultDiv.innerHTML = `<p style="color:#fca5a5; font-size:12px;">Error saving: ${err.message}</p>`;
  }
}

async function restoreVersion(versionId) {
  try {
    const version = await getVersionById(versionId);
    if (version) {
      state.currentData = version.data;
      document.getElementById('file-name').textContent = `Restored v${version.version}`;

      const parsed = parseOntology(version.data, `Restored v${version.version}`);
      renderGraph(parsed);
      document.getElementById('drop-zone').classList.add('hidden');
      closeSaveLibraryModal();
      toggleLibrary();
    }
  } catch (err) {
    alert('Error restoring version: ' + err.message);
  }
}

async function downloadOntology(id) {
  try {
    const ontology = await loadOntologyFromLibrary(id);
    const blob = new Blob([JSON.stringify(ontology.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ontology.name}-v${ontology.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Error downloading: ' + err.message);
  }
}

async function deleteOntology(id) {
  if (!confirm('Delete this ontology and its version history?')) return;

  try {
    await deleteFromLibrary(id);
    refreshLibraryPanel();
  } catch (err) {
    alert('Error deleting: ' + err.message);
  }
}

async function exportLibrary() {
  try {
    const exportData = await exportLibraryData();

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ontology-library-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

  } catch (err) {
    alert('Error exporting library: ' + err.message);
  }
}

function importLibrary() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const importData = JSON.parse(evt.target.result);
        const imported = await importLibraryData(importData);
        alert(`Imported ${imported} ontologies`);
        refreshLibraryPanel();
      } catch (err) {
        alert('Error importing library: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

// ========================================
// MULTI-ONTOLOGY REGISTRY LOADING (Phase 1 + Phase 2)
// ========================================

async function loadRegistry() {
  const fileNameEl = document.getElementById('file-name');
  const statsEl = document.getElementById('stats');

  fileNameEl.textContent = 'Loading unified registry...';
  statsEl.textContent = 'Loading...';

  try {
    const { loadedOntologies, seriesData, namespaceRegistry, stats } =
      await loadFullRegistry((msg, current, total) => {
        statsEl.textContent = msg;
      });

    state.loadedOntologies = loadedOntologies;
    state.seriesData = seriesData;
    state.viewMode = 'multi';

    const mergedGraph = buildMergedGraph(loadedOntologies);
    state.mergedGraph = mergedGraph;

    const crossEdges = detectCrossReferences(loadedOntologies, mergedGraph);
    state.crossEdges = crossEdges;

    // Build series-level edges for Tier 0
    state.crossSeriesEdges = buildCrossSeriesEdges(crossEdges, loadedOntologies);

    // Detect bridge nodes (entities referenced by 3+ ontologies)
    state.bridgeNodes = detectBridgeNodes(crossEdges, loadedOntologies, 3);
    console.log(`Bridge nodes detected: ${state.bridgeNodes.size}`);

    // Hide drop zone before navigation so errors don't leave it blocking the graph
    dropZone.classList.add('hidden');

    fileNameEl.textContent = `Unified Registry (${stats.total} ontologies, ${stats.placeholders} placeholders)`;

    // Start at Tier 0 (series rollup) instead of flat entity view
    navigateToTier0();

    console.log('Registry loaded:', stats);

  } catch (err) {
    alert('Failed to load registry: ' + err.message);
    fileNameEl.textContent = '';
    statsEl.textContent = '';
    console.error('Registry load error:', err);
  }
}

// ========================================
// TIER NAVIGATION (Phase 2)
// ========================================

function resetNavigation() {
  state.currentTier = -1;
  state.currentSeries = null;
  state.currentOntology = null;
  state.navigationStack = [];
  state.highlightedSeries.clear();
  state.crossEdgeFilterActive = false;
  document.getElementById('breadcrumb').style.display = 'none';
  const toggle = document.getElementById('tier0-toggle');
  if (toggle) toggle.style.display = 'none';
  showSeriesControls(false);
}

function setActiveToggle(viewName) {
  const buttons = document.querySelectorAll('#tier0-toggle .tier-toggle');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
}

function navigateToTier0() {
  state.currentTier = 0;
  state.currentSeries = null;
  state.currentOntology = null;
  state.viewMode = 'multi';
  state.bridgeFilterActive = false;
  state.navigationStack = [{ tier: 0, label: 'Library' }];

  renderTier0(state.seriesData, state.crossSeriesEdges);
  updateBreadcrumb();

  document.getElementById('tier0-toggle').style.display = 'inline-flex';
  setActiveToggle('series');
  document.getElementById('bridge-filter').style.display = 'none';
  document.getElementById('btn-run-oaa').style.display = 'none';
  document.getElementById('btn-save-library').style.display = 'none';
  document.getElementById('btn-export-audit').style.display = 'none';
  showSeriesControls(true);
  updateSeriesToggleUI();
  updateCrossEdgeFilterUI();
}

function drillToSeries(seriesKey) {
  state.currentTier = 1;
  state.currentSeries = seriesKey;
  state.currentOntology = null;
  state.viewMode = 'multi';
  state.navigationStack = [
    { tier: 0, label: 'Library' },
    { tier: 1, series: seriesKey, label: seriesKey }
  ];

  renderTier1(seriesKey, state.loadedOntologies, state.seriesData);
  updateBreadcrumb();

  document.getElementById('tier0-toggle').style.display = 'none';
  showSeriesControls(true);
  updateSeriesToggleUI();
  updateCrossEdgeFilterUI();
}

function drillToOntology(namespace) {
  const record = state.loadedOntologies.get(namespace);
  if (!record || !record.parsed || record.isPlaceholder) return;

  state.currentTier = 2;
  state.currentOntology = namespace;
  state.navigationStack = [
    { tier: 0, label: 'Library' },
    { tier: 1, series: state.currentSeries, label: state.currentSeries },
    { tier: 2, ontology: namespace, label: record.name }
  ];

  // Use single-ontology renderer for the entity graph
  state.currentData = record.rawData;
  state.viewMode = 'single';
  renderGraph(record.parsed);
  state.viewMode = 'multi';

  updateBreadcrumb();

  document.getElementById('tier0-toggle').style.display = 'none';
  document.getElementById('file-name').textContent = record.name;
  showSeriesControls(false);
}

function navigateBack(targetTier) {
  if (targetTier === 0) {
    navigateToTier0();
  } else if (targetTier === 1 && state.currentSeries) {
    drillToSeries(state.currentSeries);
  }
}

// Navigate to an ontology by namespace (handles both loaded and placeholder)
function navigateToOntology(namespace) {
  if (!state.loadedOntologies) return;

  // Try direct namespace match
  let record = state.loadedOntologies.get(namespace);

  // If not found, try to find by entry ID
  if (!record) {
    for (const [ns, r] of state.loadedOntologies) {
      if (r.registryEntry && r.registryEntry['@id'] === namespace) {
        record = r;
        namespace = ns;
        break;
      }
    }
  }

  if (!record) {
    console.warn('Ontology not found:', namespace);
    return;
  }

  // Find the series for this ontology
  const targetSeries = record.series;

  if (record.isPlaceholder) {
    // Navigate to series then show placeholder details
    if (targetSeries && targetSeries !== state.currentSeries) {
      drillToSeries(targetSeries);
    }
    setTimeout(() => showPlaceholderDetails(namespace), 100);
  } else {
    // Navigate to series first if different
    if (targetSeries && targetSeries !== state.currentSeries) {
      state.currentSeries = targetSeries;
    }
    drillToOntology(namespace);
  }
}

// Show placeholder details in a modal
function showPlaceholderDetails(namespace) {
  const record = state.loadedOntologies?.get(namespace);
  if (!record) return;

  const entry = record.registryEntry || {};
  const modal = document.getElementById('oaa-modal');
  const body = document.getElementById('oaa-modal-body');

  let html = `<div class="placeholder-details">`;
  html += `<div class="placeholder-badge">PLACEHOLDER</div>`;
  html += `<h4>${entry.name || record.name}</h4>`;

  if (entry.description) {
    html += `<p class="placeholder-desc">${entry.description}</p>`;
  }

  if (entry.plannedComponents && Object.keys(entry.plannedComponents).length > 0) {
    html += `<div class="placeholder-section"><h5>Planned Components</h5><ul>`;
    for (const [key, value] of Object.entries(entry.plannedComponents)) {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    html += `</ul></div>`;
  }

  if (entry.dependencies && entry.dependencies.length > 0) {
    html += `<div class="placeholder-section"><h5>Dependencies</h5><div class="dependency-links">`;
    entry.dependencies.forEach(depId => {
      const depNs = findNamespaceForEntryId(depId);
      const depRecord = depNs ? state.loadedOntologies.get(depNs) : null;
      const depName = depRecord?.name || depId.replace('Entry-ONT-', '').replace('-001', '');
      const isPlaceholder = depRecord?.isPlaceholder;
      html += `<span class="dep-link ${isPlaceholder ? 'placeholder' : ''}"
        onclick="closeOAAModal(); navigateToOntology('${depNs || depId}')">${depName}</span>`;
    });
    html += `</div></div>`;
  }

  if (entry.notes) {
    html += `<div class="placeholder-section"><h5>Notes</h5><p>${entry.notes}</p></div>`;
  }

  html += `<div class="placeholder-actions">
    <p style="color:#888; font-size:12px; margin-top:16px;">This ontology is a placeholder. The full ontology files have not yet been created.</p>
  </div>`;
  html += `</div>`;

  body.innerHTML = html;
  modal.style.display = 'flex';
}

// Helper to find namespace for entry ID
function findNamespaceForEntryId(entryId) {
  if (!state.loadedOntologies) return null;
  for (const [ns, record] of state.loadedOntologies) {
    if (record.registryEntry && record.registryEntry['@id'] === entryId) {
      return ns;
    }
  }
  return null;
}

function showAllOntologies() {
  state.currentTier = 0;
  state.currentSeries = null;
  state.viewMode = 'multi';
  state.bridgeFilterActive = false;
  state.navigationStack = [{ tier: 0, label: 'All Ontologies' }];

  renderMultiGraph(state.mergedGraph, state.crossEdges, state.seriesData);
  updateBreadcrumb();

  document.getElementById('tier0-toggle').style.display = 'inline-flex';
  setActiveToggle('ontologies');
  updateBridgeFilterUI();
  document.getElementById('bridge-filter').style.display = 'block';
  document.getElementById('btn-run-oaa').style.display = 'none';
  document.getElementById('btn-save-library').style.display = 'none';
  document.getElementById('btn-export-audit').style.display = 'none';
  showSeriesControls(true);
  updateSeriesToggleUI();
  updateCrossEdgeFilterUI();
}

function showConnectionMap() {
  state.currentTier = 0;
  state.currentSeries = null;
  state.viewMode = 'multi';
  state.navigationStack = [{ tier: 0, label: 'Connection Map' }];

  renderConnectionMap(state.loadedOntologies, state.crossEdges, state.seriesData);
  updateBreadcrumb();

  document.getElementById('tier0-toggle').style.display = 'inline-flex';
  setActiveToggle('connections');
  document.getElementById('bridge-filter').style.display = 'none';
  document.getElementById('btn-run-oaa').style.display = 'none';
  document.getElementById('btn-save-library').style.display = 'none';
  document.getElementById('btn-export-audit').style.display = 'none';
  showSeriesControls(true);
  updateSeriesToggleUI();
  updateCrossEdgeFilterUI();
}

function toggleBridgeFilter() {
  state.bridgeFilterActive = !state.bridgeFilterActive;
  updateBridgeFilterUI();
  // Re-render the graph with the filter applied
  renderMultiGraph(state.mergedGraph, state.crossEdges, state.seriesData);
}

function updateBridgeFilterUI() {
  const btn = document.getElementById('btn-bridge-filter');
  const countEl = document.getElementById('bridge-count');
  const bridgeCount = state.bridgeNodes?.size || 0;

  countEl.textContent = bridgeCount;
  btn.classList.toggle('active', state.bridgeFilterActive);
}

function updateBreadcrumb() {
  const bar = document.getElementById('breadcrumb');
  bar.style.display = state.navigationStack.length > 0 ? 'flex' : 'none';

  let html = '';
  state.navigationStack.forEach((item, i) => {
    const isLast = i === state.navigationStack.length - 1;
    if (isLast) {
      html += `<span class="breadcrumb-current">${item.label}</span>`;
    } else {
      html += `<span class="breadcrumb-link" onclick="navigateBack(${item.tier})">${item.label}</span>`;
      html += `<span class="breadcrumb-sep">\u203A</span>`;
    }
  });
  document.getElementById('breadcrumb-path').innerHTML = html;
}

// ========================================
// SERIES HIGHLIGHT + CROSS-EDGE FILTER (Phase 2/4)
// ========================================

function toggleSeriesHighlight(seriesKey) {
  if (state.highlightedSeries.has(seriesKey)) {
    state.highlightedSeries.delete(seriesKey);
  } else {
    state.highlightedSeries.add(seriesKey);
  }
  updateSeriesToggleUI();
  rerenderCurrentView();
}

function toggleCrossEdgeFilter() {
  state.crossEdgeFilterActive = !state.crossEdgeFilterActive;
  updateCrossEdgeFilterUI();
  rerenderCurrentView();
}

function rerenderCurrentView() {
  if (state.currentTier === 0) {
    // Check which Tier 0 view is active
    const activeToggle = document.querySelector('#tier0-toggle .tier-toggle.active');
    const view = activeToggle?.dataset.view;
    if (view === 'ontologies') showAllOntologies();
    else if (view === 'connections') showConnectionMap();
    else navigateToTier0();
  } else if (state.currentTier === 1) {
    drillToSeries(state.currentSeries);
  }
  // Tier 2 (entity graph) doesn't have lineage highlighting
}

function updateSeriesToggleUI() {
  document.querySelectorAll('.series-toggle').forEach(btn => {
    const series = btn.dataset.series;
    btn.classList.toggle('active', state.highlightedSeries.has(series));
  });
}

function updateCrossEdgeFilterUI() {
  const btn = document.getElementById('btn-cross-edge-filter');
  if (btn) btn.classList.toggle('active', state.crossEdgeFilterActive);
}

function showSeriesControls(show) {
  const seriesToggle = document.getElementById('series-toggle');
  const crossEdgeFilter = document.getElementById('cross-edge-filter');
  if (seriesToggle) seriesToggle.style.display = show ? 'inline-flex' : 'none';
  if (crossEdgeFilter) crossEdgeFilter.style.display = show ? 'block' : 'none';
}

// ========================================
// MODAL EVENT LISTENERS
// ========================================

document.addEventListener('click', (e) => {
  const modal = document.getElementById('oaa-modal');
  if (e.target === modal) closeOAAModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOAAModal();
    closeSaveLibraryModal();
  }
});

// ========================================
// WINDOW BINDINGS (for HTML onclick handlers)
// ========================================

// Graph controls
window.togglePhysics = togglePhysics;
window.changeLayout = changeLayout;
window.fitGraph = fitGraph;
window.resetGraph = resetGraph;
window.exportPNG = exportPNG;

// Panel toggles
window.toggleSidebar = toggleSidebar;
window.toggleAudit = toggleAudit;
window.toggleLibrary = toggleLibrary;

// Navigation
window.focusNode = focusNode;
window.focusNodes = focusNodes;
window.navigateToNode = navigateToNode;
window.switchTab = switchTab;

// Tier navigation (Phase 2)
window.navigateToTier0 = navigateToTier0;
window.drillToSeries = drillToSeries;
window.drillToOntology = drillToOntology;
window.navigateBack = navigateBack;
window.navigateToOntology = navigateToOntology;
window.showPlaceholderDetails = showPlaceholderDetails;
window.showAllOntologies = showAllOntologies;
window.showConnectionMap = showConnectionMap;
window.toggleBridgeFilter = toggleBridgeFilter;
window.toggleSeriesHighlight = toggleSeriesHighlight;
window.toggleCrossEdgeFilter = toggleCrossEdgeFilter;

// File loading
window.loadFromGitHub = loadFromGitHub;
window.loadTestDataFile = loadTestDataFile;
window.loadRegistry = loadRegistry;

// OAA Upgrade
window.runOAAUpgrade = runOAAUpgrade;
window.closeOAAModal = closeOAAModal;
window.copyOAACommand = copyOAACommand;
window.copyPath = copyPath;
window.downloadOntologyForOAA = downloadOntologyForOAA;

// Library operations
window.loadFromLibrary = loadFromLibrary;
window.showSaveToLibrary = showSaveToLibrary;
window.closeSaveLibraryModal = closeSaveLibraryModal;
window.doSaveToLibrary = doSaveToLibrary;
window.showVersionHistory = showVersionHistory;
window.restoreVersion = restoreVersion;
window.downloadOntology = downloadOntology;
window.deleteOntology = deleteOntology;
window.exportLibrary = exportLibrary;
window.importLibrary = importLibrary;

// Audit export
window.exportAuditFile = exportAuditFile;

// ========================================
// INITIALISATION
// ========================================

initLibraryDB().catch(err => console.error('Failed to init library DB:', err));
