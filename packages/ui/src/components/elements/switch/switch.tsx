export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export function Switch({ checked, onChange, label, className = '' }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      ].join(' ')}
      style={{
        backgroundColor: checked ? 'var(--primary)' : 'var(--card)',
        borderColor: checked ? 'var(--primary)' : 'var(--border)',
      }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full shadow-sm transition-transform duration-200"
        style={{
          backgroundColor: checked ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
          transform: checked ? 'translateX(1.375rem)' : 'translateX(0.25rem)',
        }}
      />
    </button>
  )
}
