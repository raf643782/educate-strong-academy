/**
 * Sanity schema — `knowledgeArticle`.
 *
 * Stage 5A: the `sourceNotes` field (internal editorial source/claim
 * auditing) has been removed from this schema. It was never safe on this
 * public dataset — a frontend query projection excluding a field does not
 * make that field private, since anyone with the project id can query any
 * field on any document directly via Sanity's own API. Confirmed via a
 * live read-only query before this change that zero documents had the
 * field populated (10/10 knowledgeArticle documents, all published).
 * Source/claim auditing now belongs in a private internal document
 * outside Sanity — see docs/KNOWLEDGE_HUB_SOURCE_NOTES_POLICY.md.
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

    // --- Public references ---
    // Visible citations/sources shown publicly at the end of an article
    // (e.g. "Hindle et al., 2019"). This is explicitly NOT a replacement for
    // sourceNotes (removed in Stage 5A, must not be recreated) — it must
    // only ever contain what a reader could reasonably see in a normal
    // citation list. Never put private research notes, internal reasoning,
    // or anything unsafe/embarrassing if queried directly from the public
    // dataset in this field. See docs/KNOWLEDGE_HUB_SOURCE_NOTES_POLICY.md.
    defineField({
      name: 'publicReferences',
      title: 'Public References',
      type: 'array',
      description:
        'Publicly visible citations only — never private editorial notes, internal reasoning, or anything unsafe to publish. This dataset is public.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'publicReference',
          fields: [
            { name: 'authorsOrOrganisation', title: 'Author(s) or Organisation', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'publicationOrSource', title: 'Publication or Source', type: 'string' },
            { name: 'year', title: 'Year', type: 'string', description: 'Plain text, so values like "2009/2010" (an online-first vs. print year) can be recorded accurately.' },
            { name: 'doi', title: 'DOI (if applicable)', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
            { name: 'accessDate', title: 'Access Date', type: 'date' },
            {
              name: 'notesForDisplay',
              title: 'Notes for Display (public-safe only)',
              type: 'string',
              description: 'Optional short public-facing note (e.g. what this source specifically supports). Must be safe to publish as-is — not an editorial/private note.',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'authorsOrOrganisation' },
          },
        }),
      ],
    }),

    // --- Attribution ---
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'reviewedBy', title: 'Reviewed By', type: 'string' }),
    defineField({ name: 'lastReviewedDate', title: 'Last Reviewed Date', type: 'date' }),

    // --- Taxonomy ---
    defineField({ name: 'pathway', title: 'Pathway', type: 'reference', to: [{ type: 'pathway' }] }),
    defineField({ name: 'clusterOrder', title: 'Order Within Pathway', type: 'number' }),

    // --- Workflow ---
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'inReview', 'approved', 'published', 'archived'] },
      initialValue: 'draft',
      description:
        'Editorial workflow marker only — this is NOT the public exposure boundary. This dataset is public, so any document (regardless of status) is directly queryable by anyone with the project ID. The frontend decides what is actually publicly visible using its own explicit approved-slug allow-list (frontend/src/lib/approvedKnowledgeArticles.ts), not this field. Content on a sensitive topic (for example, anything involving health, safety, or medical claims about children) must not be treated as ready simply because this is set to "published" — it requires an explicit, separately-confirmed qualified review before the frontend allow-list is updated to include it.',
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
