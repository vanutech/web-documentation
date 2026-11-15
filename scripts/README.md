# Scripts

## extract-integrations-metadata.js

This script extracts metadata from integration markdown files and generates a TypeScript file with the data.

### Usage

```bash
npm run extract:integrations
```

or

```bash
node scripts/extract-integrations-metadata.js
```

### What it does

- Reads all `.md` files in `/docs/integrations/`
- Extracts frontmatter metadata (title, labels, sidebar_position, etc.)
- Generates `/src/generated/integrations-data.ts` with TypeScript interfaces and data

### When to run

Run this script whenever you:
- Add a new integration markdown file
- Modify the frontmatter (labels, title, etc.) of an existing integration
- Want to update the generated integration data

### Generated File

The script generates `/src/generated/integrations-data.ts` which contains:
- `IntegrationMetadata` interface
- `INTEGRATIONS_METADATA` array with all integration data
- Helper functions to access the data

This file is used by the `useIntegrations` hook to provide integration data to components.

### Note

The generated file should be committed to git so that the build works without running the extraction script. The extraction script is run automatically before builds via the `build` script in package.json.
