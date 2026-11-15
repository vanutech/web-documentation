/**
 * Custom hook to work with integration documents
 * Uses auto-generated metadata from markdown files
 */

import type {IntegrationMetadata} from '../generated/integrations-data';
import {INTEGRATIONS_METADATA} from '../generated/integrations-data';

// Type for the full integration data used in components
export interface IntegrationItem {
  id: string;
  title: string;
  logo: string;
  link: string;
  labels: string[];
  description?: string;
}

/**
 * Map from integration ID to description
 * These descriptions are used in the integrations browse page
 */
const DESCRIPTION_MAP: Record<string, string> = {
  'huawei': 'Huawei SUN2000 single and three phase inverters',
  'goodwe': 'Goodwe solar inverters',
  'solis': 'Solis RHI and RAI series inverters',
  'growattSPH': 'Growatt SPH single and three phase inverters',
  'eastron_meter': 'Eastron single and three phase energy meters',
  'p1-port': 'Digital meter P1 port integration for electricity, gas, and water',
  's1-port': 'Digital meter S1 port integration for main meter',
  'Solis_zatobox_meter': 'Solis zatobox meter for energy monitoring'
};

/**
 * Convert IntegrationMetadata to IntegrationItem
 * Uses sidebar_custom_props.img for the logo path
 */
function metadataToIntegrationItem(metadata: IntegrationMetadata): IntegrationItem {
  const id = metadata.id;
  
  // Use the img from sidebar_custom_props, or fall back to a default
  let logo = metadata.sidebar_custom_props?.img;
  if (logo) {
    // The img in sidebar_custom_props is just the filename, prepend /img/
    logo = `/img/logos/${logo}`;
  }
  
  return {
    id,
    title: metadata.title,
    logo: logo || '/img/logos/default.png',
    link: `/docs/integrations/${id}`,
    labels: metadata.labels || [],
    description: DESCRIPTION_MAP[id]
  };
}

/**
 * Get all integrations from the auto-generated metadata
 * This reads from the generated file which is created from markdown frontmatter
 */
export function getAllIntegrations(): IntegrationItem[] {
  return INTEGRATIONS_METADATA
    .sort((a, b) => a.sidebar_position - b.sidebar_position)
    .map(metadataToIntegrationItem);
}

/**
 * Get integration by ID
 */
export function getIntegrationById(id: string): IntegrationItem | undefined {
  const metadata = INTEGRATIONS_METADATA.find(m => m.id === id);
  if (!metadata) return undefined;
  return metadataToIntegrationItem(metadata);
}

/**
 * Label categories for organized filtering
 */
export const LABEL_CATEGORIES = {
  'Type': ['Inverter', 'Meter'],
  'Brand': ['Huawei', 'Goodwe', 'Solis', 'Growatt', 'Eastron'],
  'Technology': ['Solar', 'Energy Monitoring', 'RS485'],
  'Port': ['P1', 'S1']
};

/**
 * Get all unique labels from all integrations
 */
export function getAllLabels(): string[] {
  return Array.from(
    new Set(getAllIntegrations().flatMap(integration => integration.labels))
  ).sort();
}

/**
 * Filter integrations by selected labels
 */
export function filterIntegrationsByLabels(
  integrations: IntegrationItem[],
  selectedLabels: string[]
): IntegrationItem[] {
  if (selectedLabels.length === 0) {
    return integrations;
  }
  return integrations.filter(integration =>
    selectedLabels.some(selectedLabel => integration.labels.includes(selectedLabel))
  );
}

/**
 * Custom hook to use integrations with filtering
 */
export function useIntegrations(selectedLabels: string[] = []): {
  integrations: IntegrationItem[];
  allLabels: string[];
  filteredIntegrations: IntegrationItem[];
} {
  const allIntegrations = getAllIntegrations();
  const allLabels = getAllLabels();
  const filteredIntegrations = filterIntegrationsByLabels(allIntegrations, selectedLabels);

  return {
    integrations: allIntegrations,
    allLabels,
    filteredIntegrations
  };
}
