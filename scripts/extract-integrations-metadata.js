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
 * Parse YAML frontmatter with support for nested objects and arrays
 */
function parseYamlFrontmatter(frontmatterText) {
  const lines = frontmatterText.split('\n')
    .filter(l => l.trim() !== '' && l.trim() !== '---');
  
  return parseYamlLines(lines, 0, -1)[0];
}

/**
 * Recursively parse YAML lines starting at a given line index
 * baseIndent is the minimum indent level for this block
 * Returns [parsedObject, nextLineIndex]
 */
function parseYamlLines(lines, startIndex, baseIndent) {
  const result = {};
  let i = startIndex;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.search(/\S/) || 0;
    
    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }
    
    // If this line's indent is less than or equal to baseIndent and we're not at the start,
    // we've reached the end of this block
    if (indent <= baseIndent && i > startIndex) {
      break;
    }
    
    // Check if this is a key-value pair
    const match = trimmed.match(/^([\w_][\w_-]*):\s*(.*)$/);
    
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      
      // Check if there's a next line that's indented more than this line (nested content)
      const nextLine = lines[i + 1];
      if (nextLine) {
        const nextIndent = nextLine.search(/\S/) || 0;
        if (nextIndent > indent) {
          // This is an object - parse nested lines with new baseIndent
          const [nestedResult, nextI] = parseYamlLines(lines, i + 1, indent);
          result[key] = nestedResult;
          i = nextI;
          continue;
        }
      }
      
      // Parse the value (could be array, string, etc.)
      result[key] = parseYamlValue(value);
      i++;
      continue;
    }
    
    // If we get here without a match, skip the line
    i++;
  }
  
  return [result, i];
}

/**
 * Parse a YAML value (string, array, or primitive)
 */
function parseYamlValue(value) {
  if (!value) return value;
  
  // Check if it's an array
  if (value.startsWith('[') && value.endsWith(']')) {
    const arrayContent = value.slice(1, -1).trim();
    return parseYamlArray(arrayContent);
  }
  
  // Check if it's a quoted string
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  // Check if it's a boolean
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  
  // Check if it's a number
  if (!isNaN(value) && !isNaN(parseFloat(value))) {
    return Number(value);
  }
  
  // It's a plain string
  return value;
}

/**
 * Parse a YAML array string into an array
 * Handles: ["item1", "item2"] or [item1, item2]
 */
function parseYamlArray(arrayContent) {
  if (!arrayContent) return [];
  
  // Try JSON.parse first
  try {
    const parsed = JSON.parse('[' + arrayContent + ']');
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    // Continue with manual parsing
  }
  
  // Manual parsing
  const items = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = null;
  let depth = 0;
  
  for (let i = 0; i < arrayContent.length; i++) {
    const char = arrayContent[i];
    
    // Handle escape sequences
    if (char === '\\' && i + 1 < arrayContent.length) {
      current += arrayContent[i + 1];
      i++;
      continue;
    }
    
    // Handle quotes
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      continue;
    }
    
    if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = null;
      continue;
    }
    
    // Handle nested brackets
    if (char === '[' && !inQuotes) {
      depth++;
      current += char;
      continue;
    }
    if (char === ']' && !inQuotes) {
      if (depth > 0) {
        depth--;
        current += char;
        continue;
      }
    }
    
    // Handle comma separator
    if (char === ',' && !inQuotes && depth === 0) {
      items.push(cleanArrayItem(current));
      current = '';
      continue;
    }
    
    current += char;
  }
  
  if (current) {
    items.push(cleanArrayItem(current));
  }
  
  return items;
}

/**
 * Clean up an array item by removing quotes and trimming
 */
function cleanArrayItem(item) {
  if (!item) return item;
  let cleaned = item.trim();
  
  // Remove surrounding quotes
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1);
  }
  
  return cleaned;
}

/**
 * Extract metadata from a markdown file
 */
function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract frontmatter (between --- markers)
  const frontmatterMatch = content.match(/^---[\s\S]*?^---/m);
  
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
  
  const frontmatterText = frontmatterMatch[0];
  const frontmatter = parseYamlFrontmatter(frontmatterText);
  
  return {
    id: path.basename(filePath, '.md'),
    title: frontmatter.title || path.basename(filePath, '.md').replace(/-/g, ' '),
    labels: Array.isArray(frontmatter.labels) ? frontmatter.labels : [],
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
    console.log(`     Image: ${int.sidebar_custom_props.img || 'none'}`);
    console.log('');
  });
  
} catch (error) {
  console.error('Error extracting integration metadata:', error);
  console.error(error.stack);
  process.exit(1);
}
