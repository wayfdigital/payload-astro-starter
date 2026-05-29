type LinkFieldOptions = {
  appearances?: boolean
}

export function linkField(options: LinkFieldOptions = {}) {
  return {
    name: 'link',
    type: 'group' as const,
    fields: [
      {
        name: 'type',
        type: 'select' as const,
        defaultValue: 'custom',
        options: [
          { label: 'Custom URL', value: 'custom' },
          { label: 'Reference', value: 'reference' },
        ],
      },
      { name: 'label', type: 'text' as const },
      { name: 'url', type: 'text' as const },
      { name: 'newTab', type: 'checkbox' as const },
      ...(options.appearances === false
        ? []
        : [
            {
              name: 'appearance',
              type: 'select' as const,
              options: [
                { label: 'Inline', value: 'inline' },
                { label: 'Default', value: 'default' },
                { label: 'Outline', value: 'outline' },
              ],
            },
          ]),
    ],
  }
}
