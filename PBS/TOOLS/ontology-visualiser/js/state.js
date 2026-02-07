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
  libraryDB: null,

  // Multi-ontology state (Phase 1)
  loadedOntologies: new Map(),
  mergedGraph: null,
  seriesData: null,
  viewMode: 'single',  // 'single' | 'multi'

  // Navigation state (Phase 2)
  currentTier: -1,          // -1 = single, 0 = series, 1 = ontologies, 2 = entities
  currentSeries: null,      // 'VE-Series' etc. when drilled into a series
  currentOntology: null,    // namespace when drilled into an ontology
  navigationStack: [],      // breadcrumb history [{tier, series, ontology, label}]
  crossEdges: [],           // cross-ontology edges from detectCrossReferences
  crossSeriesEdges: [],     // aggregated series-to-series edges

  // Lineage + cross-edge state (Phase 2/4)
  lineageHighlight: 'off',       // 'off' | 'VE' | 'PE' | 'both'
  crossEdgeFilterActive: false,  // show only cross-ontology edges
  bridgeFilterActive: false,     // bridge node filter
  bridgeNodes: null              // Map of bridge node IDs
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

export const REGISTRY_BASE_PATH = '../../ONTOLOGIES/unified-registry/';

export const SERIES_COLORS = {
  'VE-Series': '#2196F3',
  'PE-Series': '#4CAF50',
  'Foundation': '#FF9800',
  'Competitive': '#E91E63',
  'RCSG-Series': '#9C27B0',
  'Orchestration': '#00BCD4',
  'placeholder': '#616161'
};

export const LINEAGE_CHAINS = {
  VE: ['VSOM', 'OKR', 'VP', 'PMF', 'EFS'],
  PE: ['PPM', 'PE', 'EFS', 'EA']
};

export const LINEAGE_COLORS = {
  VE: '#cec528',          // Gold for Value Engineering chain
  PE: '#b87333',          // Copper for Product Engineering chain
  convergence: '#FF6B35'  // Orange-red for EFS convergence point
};

export const DB_NAME = 'OntologyLibrary';
export const DB_VERSION = 1;

export const DEFAULT_CATEGORIES = [
  'pfc-ontologies',
  'pfi-ontologies',
  'domain-ontologies',
  'custom'
];
