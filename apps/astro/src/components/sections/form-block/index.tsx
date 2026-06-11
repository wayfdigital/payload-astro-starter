import { useState, type CSSProperties, type FC } from 'react'
import { Container, Heading, Text, Button } from '@repo/ui'
import type { Form, FormBlock } from '@repo/payload-types'
import { submitForm, type FormSubmissionValue } from '../../../lib/payload/forms'
import { executeRecaptcha } from '../../../lib/recaptcha'
import { RichText } from './lexical'

/** A single field within a form-builder `Form`. */
type FormField = NonNullable<Form['fields']>[number]

interface FormBlockSectionProps extends FormBlock {
  /** Payload REST base URL, passed from the Astro page (browser can't read non-PUBLIC env). */
  apiUrl: string
  /** reCAPTCHA v3 site key, passed from the Astro page. Empty when not configured. */
  recaptchaSiteKey?: string
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  borderRadius: 'var(--radius, 0.5rem)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  fontSize: '0.875rem',
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '0.375rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--foreground)',
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Renders a form-builder form and submits it to Payload. Interactive — mount as a
 * React island (`client:load`). Shows loading / error / success states and honours
 * the form's confirmation type (inline message or redirect).
 */
export const FormBlockSection: FC<FormBlockSectionProps> = ({
  form,
  enableIntro,
  introContent,
  apiUrl,
  recaptchaSiteKey,
}) => {
  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  // At depth < 1 the relationship is just an id — nothing to render.
  if (typeof form === 'string') {
    return null
  }

  const setValue = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async () => {
    setStatus('submitting')
    setError(null)

    const submissionData: FormSubmissionValue[] = Object.entries(values).map(([field, value]) => ({
      field,
      value,
    }))

    // v3 is invisible: mint a token only when the form requires reCAPTCHA.
    let recaptchaToken: string | undefined
    if (form.requireRecaptcha) {
      if (!recaptchaSiteKey) {
        setError('reCAPTCHA is required but not configured. Please contact the site owner.')
        setStatus('error')
        return
      }
      try {
        recaptchaToken = await executeRecaptcha(recaptchaSiteKey)
      } catch {
        setError('Could not verify reCAPTCHA. Please try again.')
        setStatus('error')
        return
      }
    }

    try {
      await submitForm(apiUrl, form.id, submissionData, recaptchaToken)
      if (form.confirmationType === 'redirect' && form.redirect?.url) {
        globalThis.location.assign(form.redirect.url)
        return
      }
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="py-16">
        <Container size="sm">
          <div
            className="rounded-lg border p-8 text-center"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
          >
            {form.confirmationMessage ? (
              <RichText content={form.confirmationMessage} />
            ) : (
              <Text>Thank you — your submission has been received.</Text>
            )}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16">
      <Container size="sm">
        {enableIntro && introContent ? (
          <div className="mb-8">
            <RichText content={introContent} />
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault()
            void handleSubmit()
          }}
          className="rounded-lg border p-8"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
          {form.title ? (
            <Heading level={2} className="mb-6">
              {form.title}
            </Heading>
          ) : null}

          <div className="flex flex-col gap-5">
            {form.fields?.map((field) => (
              <FormFieldControl
                key={field.id ?? field.blockType}
                field={field}
                value={values[fieldName(field)] ?? ''}
                onChange={setValue}
              />
            ))}
          </div>

          {error ? (
            <Text variant="small" className="mt-4" style={{ color: 'var(--destructive)' }}>
              {error}
            </Text>
          ) : null}

          <div className="mt-6">
            <Button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting…' : (form.submitButtonLabel ?? 'Submit')}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  )
}

/** Reads the `name` off a field block (the `message` block has no name). */
const fieldName = (field: FormField): string => ('name' in field ? field.name : (field.id ?? ''))

interface FormFieldControlProps {
  field: FormField
  value: string
  onChange: (name: string, value: string) => void
}

/** Renders the right input for a form-builder field block. */
const FormFieldControl: FC<FormFieldControlProps> = ({ field, value, onChange }) => {
  // Display-only rich-text block.
  if (field.blockType === 'message') {
    return (
      <div>
        <RichText content={field.message} />
      </div>
    )
  }

  const name = field.name
  const label = field.label ?? name
  const required = 'required' in field ? Boolean(field.required) : false

  if (field.blockType === 'checkbox') {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...labelStyle }}>
        <input
          type="checkbox"
          name={name}
          required={required}
          checked={value === 'true'}
          onChange={(e) => onChange(name, e.target.checked ? 'true' : 'false')}
        />
        {label}
      </label>
    )
  }

  if (field.blockType === 'textarea') {
    return (
      <div>
        <label style={labelStyle} htmlFor={name}>
          {label}
        </label>
        <textarea
          id={name}
          name={name}
          required={required}
          rows={4}
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
        />
      </div>
    )
  }

  if (field.blockType === 'select') {
    return (
      <div>
        <label style={labelStyle} htmlFor={name}>
          {label}
        </label>
        <select
          id={name}
          name={name}
          required={required}
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
        >
          <option value="">{field.placeholder ?? 'Select…'}</option>
          {field.options?.map((opt) => (
            <option key={opt.id ?? opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  const inputTypes: Record<string, string> = { email: 'email', number: 'number' }
  const inputType = inputTypes[field.blockType] ?? 'text'

  return (
    <div>
      <label style={labelStyle} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={inputType}
        required={required}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  )
}

export default FormBlockSection
