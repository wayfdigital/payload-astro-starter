import type { ComponentType, JSX } from 'react'

interface SectionBase {
  id?: string | null
  blockType: string
}

/**
 * Maps every `blockType` to a component that accepts the full section union and
 * self-narrows (each section entry does `if (props.blockType === '…')`). This keeps
 * the lookup type-safe without any assertions.
 */
type SectionMap<TSection extends SectionBase> = Record<string, ComponentType<TSection>>

interface LayoutBuilderProps<TSection extends SectionBase> {
  sections?: TSection[] | null
}

export function createLayoutBuilder<TSection extends SectionBase>(
  sectionMap: SectionMap<TSection>,
): ComponentType<LayoutBuilderProps<TSection>> {
  function LayoutBuilder({ sections }: LayoutBuilderProps<TSection>): JSX.Element | null {
    if (!sections || sections.length === 0) {
      return null
    }

    return (
      <>
        {sections.map((section, index) => {
          const SectionComponent = sectionMap[section.blockType]
          if (!SectionComponent) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[LayoutBuilder] Unknown blockType: "${section.blockType}"`)
            }
            return null
          }
          const key = section.id ?? `${section.blockType}-${index}`

          return <SectionComponent key={key} {...section} />
        })}
      </>
    )
  }

  LayoutBuilder.displayName = 'LayoutBuilder'

  return LayoutBuilder
}
