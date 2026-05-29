import { Container, Text } from '@/ui-template'
import type { FormBlockSectionProps } from '../index'

export const DefaultFormBlockVariant = ({ enableIntro, introContent }: FormBlockSectionProps) => {
  return (
    <section className="py-16">
      <Container size="sm">
        {enableIntro && introContent ? (
          <div className="mb-8">
            <Text>Form intro content</Text>
          </div>
        ) : null}
        <div
          className="rounded-lg border p-8"
          style={{
            borderColor: 'var(--template-color-border)',
            backgroundColor: 'var(--template-color-surface)',
          }}
        >
          <Text className="text-center">
            Form will be rendered here when fully configured.
          </Text>
        </div>
      </Container>
    </section>
  )
}
