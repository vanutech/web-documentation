// This file is auto-generated from integration markdown files
// Run 'node scripts/extract-integrations-metadata.js' to update

export interface IntegrationMetadata {
  id: string;
  title: string;
  labels: string[];
  sidebar_position: number;
  sidebar_custom_props: {
    img?: string;
  };
}

export const INTEGRATIONS_METADATA: IntegrationMetadata[] = [
  {
    "id": "huawei",
    "title": "Huawei SUN2000",
    "labels": [
      "Inverter",
      "Solar",
      "Huawei",
      "RS485"
    ],
    "sidebar_position": 1,
    "sidebar_custom_props": {}
  },
  {
    "id": "goodwe",
    "title": "Goodwe",
    "labels": [
      "Inverter",
      "Solar",
      "Goodwe"
    ],
    "sidebar_position": 2,
    "sidebar_custom_props": {}
  },
  {
    "id": "solis",
    "title": "Solis",
    "labels": [
      "Inverter",
      "Solar",
      "Solis",
      "RS485"
    ],
    "sidebar_position": 3,
    "sidebar_custom_props": {}
  },
  {
    "id": "growattSPH",
    "title": "Growatt SPH",
    "labels": [
      "Inverter",
      "Solar",
      "Growatt",
      "RS485"
    ],
    "sidebar_position": 4,
    "sidebar_custom_props": {}
  },
  {
    "id": "p1-port",
    "title": "P1 Port Integrations",
    "labels": [
      "Meter",
      "Digital Meter",
      "P1",
      "Energy Monitoring"
    ],
    "sidebar_position": 4,
    "sidebar_custom_props": {}
  },
  {
    "id": "s1-port",
    "title": "S1 Port mainmeter",
    "labels": [
      "Meter",
      "Digital Meter",
      "S1",
      "Energy Monitoring"
    ],
    "sidebar_position": 5,
    "sidebar_custom_props": {}
  },
  {
    "id": "eastron_meter",
    "title": "Eastron Meter",
    "labels": [
      "Meter",
      "Energy Monitoring",
      "RS485",
      "Eastron"
    ],
    "sidebar_position": 6,
    "sidebar_custom_props": {}
  }
];

// Helper to get integration by ID
export function getIntegrationMetadata(id: string): IntegrationMetadata | undefined {
  return INTEGRATIONS_METADATA.find(i => i.id === id);
}

// Get all integrations sorted by sidebar position
export function getAllIntegrationsMetadata(): IntegrationMetadata[] {
  return [...INTEGRATIONS_METADATA].sort((a, b) => a.sidebar_position - b.sidebar_position);
}
