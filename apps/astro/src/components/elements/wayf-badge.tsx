import './wayf-badge.css'

export interface WayfBadgeProps {
  /**
   * `floating` pins it to the bottom centre of the viewport as site-wide chrome;
   * the default sits in normal flow, for use inside a hero's actions row.
   */
  placement?: 'inline' | 'floating'
}

/**
 * "Built by WAYF" credit. At rest the mark sits on the right, bleeding a few
 * pixels past the pill's edge; on hover/focus it travels to the left and the
 * label swaps to an invitation to visit wayf.ai.
 *
 * React rather than Astro so it can be passed into a hydrated island (the hero).
 * It ships no JavaScript of its own — the whole interaction is CSS, and the mark
 * moves on `transform` alone, so nothing reflows under the cursor.
 */
export function WayfBadge({ placement = 'inline' }: WayfBadgeProps) {
  const className = [
    'wayf-badge',
    placement === 'floating' && 'wayf-badge--floating',
    placement === 'floating' && import.meta.env.DEV && 'wayf-badge--above-toolbar',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={className}
      href="https://wayf.ai"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Built by WAYF — visit wayf.ai"
    >
      <svg
        className="wayf-badge__mark"
        viewBox="0 0 800 800"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="800" height="800" fill="#FC0396" />
        <path
          d="M228.182 499.455H342.728V423.091H380.909V614H190V575.818H342.728V537.637H190V423.091H228.182V499.455ZM610 461.272H457.272V499.455H610V537.637H457.272V614H419.091V423.091H610V461.272ZM228.182 346.728H266.363V194H304.546V346.728H342.728V194H380.909V384.909H190V194H228.182V346.728ZM610 384.909H571.818V308.546H457.272V384.909H419.091V194H610V384.909ZM457.272 270.363H571.818V232.182H457.272V270.363Z"
          fill="#111111"
        />
      </svg>
      <span className="wayf-badge__label wayf-badge__label--rest">Built by WAYF</span>
      <span className="wayf-badge__label wayf-badge__label--hover" aria-hidden="true">
        Check us out &rarr;
      </span>
    </a>
  )
}

export default WayfBadge
