/**
 * Sanity Studio config — Knowledge Hub content only.
 *
 * Reads projectId/dataset from env vars rather than hardcoding them, so
 * connecting to a real project only ever requires setting sanity/.env —
 * this file itself never needs to change.
 *
 * Do NOT put any write token or private credential in this file or its env
 * vars. Studio auth is handled by `sanity login` (per-user browser login),
 * never a token baked into config.
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'Educate Strong Academy — Knowledge Hub',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
