/**
 * Unified Registry integration — loads registry index and resolves ontology entries.
 * GitHub API loading (loadFromGitHub) is in app.js to avoid circular dependencies.
 */

import { state, REGISTRY_BASE_PATH } from './state.js';

export async function loadRegistryIndex() {
  try {
    const response = await fetch(REGISTRY_BASE_PATH + 'ont-registry-index.json');
    if (!response.ok) throw new Error(`Failed to load registry: ${response.status}`);
    state.registryIndex = await response.json();
    console.log('Registry index loaded:', state.registryIndex.entries?.length, 'entries');
    return state.registryIndex;
  } catch (err) {
    console.warn('Registry index not loaded:', err.message);
    return null;
  }
}

export function extractOntologyPrefix(ontologyData) {
  const id = ontologyData['@id'] || ontologyData.id;
  if (id) {
    const prefixMatch = id.match(/^([a-z-]+):/i) || id.match(/\/([a-z-]+)\/(?:schema|ontology)?$/i);
    if (prefixMatch) return prefixMatch[1].toLowerCase() + ':';
  }

  const altName = ontologyData.alternateName;
  if (altName) {
    const match = altName.match(/^([A-Z-]+)-ONT$/i);
    if (match) return match[1].toLowerCase() + ':';
  }

  return null;
}

export function findRegistryEntry(prefix) {
  if (!state.registryIndex || !state.registryIndex.entries) return null;

  const normalizedPrefix = prefix.toLowerCase().replace(/:$/, '') + ':';
  return state.registryIndex.entries.find(e => e.namespace?.toLowerCase() === normalizedPrefix);
}

export async function loadRegistryEntry(entryPath) {
  try {
    const relativePath = entryPath.replace('./', '');
    const response = await fetch(REGISTRY_BASE_PATH + relativePath);
    if (!response.ok) throw new Error(`Failed to load entry: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Failed to load registry entry:', err.message);
    return null;
  }
}

export async function lookupRegistry() {
  if (!state.currentData) return null;

  if (!state.registryIndex) await loadRegistryIndex();
  if (!state.registryIndex) {
    state.currentRegistryEntry = null;
    return null;
  }

  const prefix = extractOntologyPrefix(state.currentData);
  if (!prefix) {
    console.log('Could not extract prefix from ontology');
    state.currentRegistryEntry = null;
    return null;
  }

  console.log('Looking up registry entry for prefix:', prefix);
  const entrySummary = findRegistryEntry(prefix);

  if (entrySummary) {
    const fullEntry = await loadRegistryEntry(entrySummary.path);
    if (fullEntry) {
      state.currentRegistryEntry = {
        entryId: entrySummary['@id'],
        name: entrySummary.name,
        namespace: entrySummary.namespace,
        status: entrySummary.status,
        gatesPassed: entrySummary.gatesPassed,
        gatesFailed: entrySummary.gatesFailed,
        validatedDate: entrySummary.validatedDate,
        version: fullEntry.version,
        complianceStatus: fullEntry.complianceStatus,
        dependencies: fullEntry.dependencies || [],
        dependents: fullEntry.dependents || [],
        versionHistory: fullEntry.versionHistory || []
      };
      return state.currentRegistryEntry;
    }
  }

  state.currentRegistryEntry = null;
  return null;
}
