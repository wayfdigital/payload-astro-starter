import type { Field, FieldBase, StaticLabel } from 'payload'

interface LinkFieldOptions {
  /** Field name (default `link`). Use to place several links on one document. */
  name?: string
  /** Admin label for the group. */
  label?: StaticLabel
  /**
   * Show the visual `variant` select (Button / text-link styles). Pass `false`
   * for links that always render the same way (e.g. footer nav, cookie banner).
   */
  appearances?: boolean
  /** Admin overrides for the group (e.g. a `condition` to show/hide the link). */
  admin?: FieldBase['admin']
}

/**
 * Reusable link field. One source of truth for every CMS-driven link or button:
 * the editor picks a custom URL **or** a reference to an internal document, plus a
 * visual `variant` mirroring the design-system `Button`. The frontend resolves it
 * with `resolveLink()` and renders it with `<CmsLink>` (same variants as `Button`).
 *
 * Always use this helper — never inline a link `group` in a block/global.
 */
export function linkField(options: LinkFieldOptions = {}): Field {
  const variantField: Field = {
    name: 'variant',
    type: 'select',
    label: 'Appearance',
    defaultValue: 'primary',
    options: [
      { label: 'Button – Primary', value: 'primary' },
      { label: 'Button – Secondary', value: 'secondary' },
      { label: 'Button – Outline', value: 'outline' },
      { label: 'Button – Ghost', value: 'ghost' },
      { label: 'Text link', value: 'link' },
      { label: 'Text link – underlined', value: 'link-underline' },
    ],
  }

  return {
    name: options.name ?? 'link',
    label: options.label,
    type: 'group',
    ...(options.admin ? { admin: options.admin } : {}),
    fields: [
      {
        name: 'type',
        type: 'select',
        defaultValue: 'custom',
        options: [
          { label: 'Custom URL', value: 'custom' },
          { label: 'Reference', value: 'reference' },
        ],
      },
      { name: 'label', type: 'text', localized: true },
      {
        name: 'url',
        type: 'text',
        localized: true,
        admin: {
          condition: (_data, siblingData) => siblingData?.type === 'custom',
        },
      },
      {
        name: 'reference',
        type: 'relationship',
        label: 'Document to link to',
        // Polymorphic array form even with one collection, so resolveLink() always
        // receives `{ relationTo, value }`. Add routable collections here as they appear.
        relationTo: ['pages'],
        admin: {
          condition: (_data, siblingData) => siblingData?.type === 'reference',
        },
      },
      ...(options.appearances === false ? [] : [variantField]),
      {
        name: 'newTab',
        type: 'checkbox',
        label: 'Open in new tab',
        admin: { width: '100%' },
      },
    ],
  }
}
