/**
 * Application entry point — wires modules together, sets up event listeners,
 * and attaches functions to window for HTML onclick handlers.
 */

import { state } from './state.js';
import { parseOntology } from './ontology-parser.js';
import { renderGraph, focusNode, focusNodes, togglePhysics, changeLayout, fitGraph, resetGraph } from './graph-renderer.js';
import { exportAuditFile, exportPNG, downloadOntologyForOAA } from './export.js';
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

// File loading
window.loadFromGitHub = loadFromGitHub;
window.loadTestDataFile = loadTestDataFile;

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
