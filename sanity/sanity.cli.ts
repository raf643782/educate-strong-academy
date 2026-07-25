/**
 * Sanity CLI config — used by `sanity dev`/`build`/`deploy` to know which
 * project/dataset to talk to. Same env vars as sanity.config.ts.
 */

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
