import type { ComponentType, JSX } from 'react'

interface SectionBase {
  id?: string | null
  blockType: string
}

type SectionMap<TSection extends SectionBase> = {
  [K in TSection['blockType']]: ComponentType<Extract<TSection, { blockType: K }>>
}

interface LayoutBuilderProps<TSection extends SectionBase> {
  sections?: TSection[] | null
}

export function createLayoutBuilder<TSection extends SectionBase>(
  sectionMap: SectionMap<TSection>,
): ComponentType<LayoutBuilderProps<TSection>> {
  const availableTypes = new Set(Object.keys(sectionMap))

  function LayoutBuilder({ sections }: LayoutBuilderProps<TSection>): JSX.Element | null {
    if (!sections || sections.length === 0) {
      return null
    }

    return (
      <>
        {sections.map((section, index) => {
          if (!availableTypes.has(section.blockType)) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[LayoutBuilder] Unknown blockType: "${section.blockType}"`)
            }
            return null
          }
          const blockType = section.blockType as TSection['blockType']
          const SectionComponent = sectionMap[blockType] as ComponentType<TSection>
          const key = section.id ?? `${section.blockType}-${index}`

          return <SectionComponent key={key} {...section} />
        })}
      </>
    )
  }

  LayoutBuilder.displayName = 'LayoutBuilder'

  return LayoutBuilder
}
