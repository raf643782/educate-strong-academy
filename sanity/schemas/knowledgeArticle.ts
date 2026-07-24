/**
 * Sanity schema — `knowledgeArticle`.
 *
 * IMPORTANT: `sourceNotes` is internal editorial content only. It must never
 * be exposed to the public frontend. This is enforced at the query layer in
 * frontend/src/lib/sanity.ts (explicit field projections, no `sourceNotes`),
 * but the field is also marked clearly here so nobody adds it to a public
 * query later without noticing the warning.
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'knowledgeArticle',
  title: 'Knowledge Hub Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title (internal/admin)', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'h1', title: 'H1 (public heading)', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),

    // --- SEO ---
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'primaryKeyword', title: 'Primary Keyword', type: 'string' }),
    defineField({ name: 'secondaryKeywords', title: 'Secondary Keywords', type: 'array', of: [defineArrayMember({ type: 'string' })] }),

    // --- Body content ---
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [{ name: 'href', title: 'URL', type: 'url' }],
              },
            ],
          },
        }),
        defineArrayMember({ type: 'image' }), // reserved for future use — not expected in v1 content
      ],
    }),

    // --- FAQ ---
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' },
          ],
        }),
      ],
    }),

    // --- Internal linking ---
    defineField({
      name: 'internalLinks',
      title: 'Internal Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'internalLink',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            {
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Knowledge Hub article (Sanity)', value: 'knowledgeArticle' },
                  { title: 'Pathway page (Sanity)', value: 'pathwayPage' },
                  { title: 'Exercise Library entry (external — Prisma-backed)', value: 'exerciseLibraryEntry' },
                  { title: 'Event Library entry (external — Prisma-backed)', value: 'eventLibraryEntry' },
                  { title: 'Other site page (external URL)', value: 'externalUrl' },
                ],
              },
            },
            {
              name: 'reference',
              title: 'Reference (Sanity documents only)',
              type: 'reference',
              to: [{ type: 'knowledgeArticle' }, { type: 'pathway' }],
              hidden: ({ parent }) => !['knowledgeArticle', 'pathwayPage'].includes((parent as { linkType?: string })?.linkType ?? ''),
            },
            {
              name: 'url',
              title: 'URL (Exercise/Event Library or other external links)',
              type: 'url',
              description: 'Exercise Library and Event Library live in Prisma/Postgres, not Sanity — link to them as a plain URL (e.g. /exercises/farmers-walk), not a reference.',
              hidden: ({ parent }) => ['knowledgeArticle', 'pathwayPage'].includes((parent as { linkType?: string })?.linkType ?? ''),
            },
          ],
        }),
      ],
    }),

    // --- CTA ---
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        { name: 'ctaText', title: 'CTA Text', type: 'text' },
        { name: 'destinationUrl', title: 'Destination URL', type: 'string' },
      ],
    }),

    // --- Attribution ---
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'reviewedBy', title: 'Reviewed By', type: 'string' }),
    defineField({ name: 'lastReviewedDate', title: 'Last Reviewed Date', type: 'date' }),

    // --- Internal editorial record — NOT public ---
    defineField({
      name: 'sourceNotes',
      title: '⚠ Source Notes (internal only — never public)',
      type: 'array',
      description: 'Internal editorial record only. Must never be added to a public-facing GROQ query/projection. See frontend/src/lib/sanity.ts.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'sourceNote',
          fields: [
            { name: 'claim', title: 'Claim', type: 'string' },
            { name: 'source', title: 'Source', type: 'string' },
            {
              name: 'sourceType',
              title: 'Source Type',
              type: 'string',
              options: {
                list: ['peer-reviewed', 'official-federation', 'official-organisation', 'recognised-body', 'orientation-only'],
              },
            },
            { name: 'confidence', title: 'Confidence', type: 'string' },
          ],
        }),
      ],
    }),

    // --- Taxonomy ---
    defineField({ name: 'pathway', title: 'Pathway', type: 'reference', to: [{ type: 'pathway' }] }),
    defineField({ name: 'clusterOrder', title: 'Order Within Pathway', type: 'number' }),

    // --- Workflow ---
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'inReview', 'approved', 'published'] },
      initialValue: 'draft',
    }),
    defineField({ name: 'publishedDate', title: 'Published Date', type: 'datetime' }),

    // --- Future-proofing for other learning resources ---
    defineField({
      name: 'resourceType',
      title: 'Resource Type',
      type: 'string',
      options: { list: ['article', 'guide', 'comparison', 'faqHub'] },
      initialValue: 'article',
      description: 'Lets this same content type absorb future learning resources without a second schema migration.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status' },
  },
});
