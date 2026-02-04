/**
 * Shared application state and constants.
 * All modules import from here to avoid circular dependencies.
 */

export const state = {
  network: null,
  physicsEnabled: true,
  currentData: null,
  lastAudit: null,
  lastParsed: null,
  currentNodeId: null,
  registryIndex: null,
  currentRegistryEntry: null,
  lastValidation: null,
  libraryDB: null
};

export const TYPE_COLORS = {
  'class': '#4CAF50', 'core': '#4CAF50', 'framework': '#2196F3',
  'supporting': '#FF9800', 'agent': '#E91E63', 'external': '#9E9E9E',
  'layer': '#00BCD4', 'concept': '#9C27B0', 'default': '#017c75'
};

export const EDGE_COLORS = {
  'subClassOf': '#888', 'inheritance': '#888', 'relationship': '#4CAF50',
  'binding': '#FF9800', 'value_chain': '#2196F3', 'default': '#555'
};

export const REGISTRY_BASE_PATH = '../ONTOLOGIES/unified-registry/';

export const DB_NAME = 'OntologyLibrary';
export const DB_VERSION = 1;

export const DEFAULT_CATEGORIES = [
  'pfc-ontologies',
  'pfi-ontologies',
  'domain-ontologies',
  'custom'
];
