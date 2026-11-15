/**
 * Script to extract metadata from integration markdown files
 * This reads the frontmatter and generates a TypeScript file with the data
 * Run this script before building the site
 * 
 * Usage: node scripts/extract-integrations-metadata.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const INTEGRATIONS_DIR = path.join(__dirname, '..', 'docs', 'integrations');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'generated', 'integrations-data.ts');

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Simple YAML frontmatter parser
 * Extracts key-value pairs from frontmatter
 */
function parseFrontmatter(frontmatterText) {
  const result = {};
  const lines = frontmatterText.split('\n');
  
  let currentKey = null;
  let currentValue = null;
  let inMultiline = false;
  let indentLevel = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed || trimmed === '---') continue;
    
    // Check for key-value pairs
    const match = trimmed.match(/^([\w_][\w_-]*):\s*(.*)$/);
    
    if (match) {
      // Save previous key-value if exists
      if (currentKey) {
        result[currentKey] = currentValue;
      }
      
      currentKey = match[1];
      currentValue = match[2].trim();
      
      // Handle multiline values (like arrays)
      if (currentValue.startsWith('[') || currentValue.startsWith('{')) {
        inMultiline = true;
        indentLevel = line.search(/\S/); // Get indent level
      }
    } else if (inMultiline) {
      // Continue multiline value
      const lineIndent = line.search(/\S/);
      if (lineIndent <= indentLevel && trimmed) {
        // End of multiline
        result[currentKey] = currentValue;
        currentKey = null;
        currentValue = null;
        inMultiline = false;
      } else if (trimmed) {
        currentValue += '\n' + line.trimStart();
      }
    }
  }
  
  // Save last key-value
  if (currentKey) {
    result[currentKey] = currentValue;
  }
  
  return result;
}

/**
 * Parse labels array string to actual array
 */
function parseLabels(labelsValue) {
  if (!labelsValue) return [];
  
  // Remove brackets and split by commas
  const clean = labelsValue.replace(/^[\["]|\]"?$/g, '').replace(/"\s*,\s*"/g, ',').replace(/,\s*/g, ',');
  const items = clean.split(',').map(item => item.trim().replace(/^"|"$/g, ''));
  return items.filter(item => item);
}

/**
 * Extract metadata from a markdown file
 */
function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract frontmatter (between --- markers)
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  
  if (!frontmatterMatch) {
    console.warn(`No frontmatter found in ${filePath}`);
    return {
      id: path.basename(filePath, '.md'),
      title: path.basename(filePath, '.md').replace(/-/g, ' '),
      labels: [],
      sidebar_position: 0,
      sidebar_custom_props: {}
    };
  }
  
  const frontmatterText = frontmatterMatch[0].replace(/^---|---$/g, '').trim();
  const frontmatter = parseFrontmatter(frontmatterText);
  
  return {
    id: path.basename(filePath, '.md'),
    title: frontmatter.title || path.basename(filePath, '.md').replace(/-/g, ' '),
    labels: parseLabels(frontmatter.labels),
    sidebar_position: Number(frontmatter.sidebar_position) || 0,
    sidebar_custom_props: frontmatter.sidebar_custom_props || {}
  };
}

/**
 * Generate TypeScript file with integration data
 */
function generateTypeScriptFile(integrations) {
  const sorted = integrations.sort((a, b) => a.sidebar_position - b.sidebar_position);
  
  // Convert to proper TypeScript array format
  const integrationsArray = sorted.map(int => {
    return {
      id: int.id,
      title: int.title,
      labels: int.labels,
      sidebar_position: int.sidebar_position,
      sidebar_custom_props: int.sidebar_custom_props
    };
  });
  
  const tsContent = `// This file is auto-generated from integration markdown files
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

export const INTEGRATIONS_METADATA: IntegrationMetadata[] = ${JSON.stringify(integrationsArray, null, 2)};

// Helper to get integration by ID
export function getIntegrationMetadata(id: string): IntegrationMetadata | undefined {
  return INTEGRATIONS_METADATA.find(i => i.id === id);
}

// Get all integrations sorted by sidebar position
export function getAllIntegrationsMetadata(): IntegrationMetadata[] {
  return [...INTEGRATIONS_METADATA].sort((a, b) => a.sidebar_position - b.sidebar_position);
}
`;
  
  return tsContent;
}

// Main execution
try {
  console.log('Extracting integration metadata from markdown files...');
  
  const files = fs.readdirSync(INTEGRATIONS_DIR).filter(f => f.endsWith('.md'));
  const integrations = files.map(file => {
    const filePath = path.join(INTEGRATIONS_DIR, file);
    return extractMetadata(filePath);
  });
  
  const tsContent = generateTypeScriptFile(integrations);
  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
  
  console.log(`\nSuccessfully generated ${OUTPUT_FILE}`);
  console.log(`Found ${integrations.length} integrations:\n`);
  integrations.forEach(int => {
    console.log(`  ${int.sidebar_position}. ${int.id}`);
    console.log(`     Title: ${int.title}`);
    console.log(`     Labels: [${int.labels.join(', ')}]`);
    console.log('');
  });
  
} catch (error) {
  console.error('Error extracting integration metadata:', error);
  process.exit(1);
}
