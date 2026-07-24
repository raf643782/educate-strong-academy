/**
 * Sanity schema — `pathway`.
 *
 * A pathway is one of the Knowledge Hub's topic clusters (Beginner, Event,
 * Competition, Coaching, Comparison, and any future grouping such as
 * Trust & Safety), used to order and group `knowledgeArticle` documents.
 */

import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'pathway',
  title: 'Knowledge Hub Pathway',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short internal/editorial description of what this pathway covers.',
    }),
    defineField({
      name: 'orderedArticles',
      title: 'Ordered Articles',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'knowledgeArticle' }] })],
      description: 'Articles in this pathway, in the order they should appear.',
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
