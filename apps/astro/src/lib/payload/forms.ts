/** One answered field in a form submission. */
export interface FormSubmissionValue {
  field: string
  value: string
}

interface FormSubmissionResponse {
  doc?: { id: string }
}

/**
 * Submits a form to Payload's form-builder endpoint (`POST /api/form-submissions`).
 *
 * `apiUrl` is passed explicitly (not read from `import.meta.env`) because this runs
 * in the browser inside the FormBlock island, where non-`PUBLIC_` env vars are not
 * available — the Astro page reads `PAYLOAD_API_URL` server-side and hands it down.
 *
 * `recaptchaToken` is the reCAPTCHA v3 token; it's sent as the top-level `recaptcha`
 * field, which the form-builder validates server-side when the form has
 * `requireRecaptcha` enabled. Omit it for forms that don't require a captcha.
 * Throws on a non-2xx response.
 */
export const submitForm = async (
  apiUrl: string,
  formId: string,
  submissionData: FormSubmissionValue[],
  recaptchaToken?: string,
): Promise<FormSubmissionResponse> => {
  const res = await fetch(`${apiUrl}/api/form-submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      form: formId,
      submissionData,
      ...(recaptchaToken ? { recaptcha: recaptchaToken } : {}),
    }),
  })

  if (!res.ok) {
    throw new Error(`Form submission failed (${res.status})`)
  }

  return (await res.json()) as FormSubmissionResponse
}
