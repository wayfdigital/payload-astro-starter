# Collections & fields

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'] },
  access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'content', type: 'richText' },                 // Lexical editor
    { name: 'hero', type: 'group', fields: [/* ... */] },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'blocks', type: 'blocks', blocks: [/* layout-builder blocks */] },
  ],
}
```

## Field notes
- **`localized: true`** stores a value per locale; reads resolve via the request
  `locale`. Slugs that must differ per locale should be localized too.
- **`unique` + `index`** on lookup fields (e.g. `slug`) — required for fast
  `where: { slug: { equals } }` reads.
- **Relationships**: `depth` controls population; for `hasMany` keep depth low and
  `select` only needed fields.
- **`blocks`** power the layout/page builder — define each block once and reuse.
- **Richtext** is Lexical; render with `@payloadcms/richtext-lexical` converters on
  the front end, don't hand-parse the JSON.
- After ANY field/collection change run `payload generate:types` so `@/payload-types`
  stays accurate — code should import those types, never redeclare doc shapes.

## Globals
Use globals for singletons (header/footer settings). Same field config; fetch with
`payload.findGlobal({ slug })` and cache/tag them like collections.
