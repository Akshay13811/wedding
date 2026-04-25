export type Theme = {
  name: string
  background: {
    navy: string
    navy2: string
    card: string
  }
  ink: {
    primary: string
    muted: string
  }
  accent: {
    gold: string
    gold2: string
  }
  ornaments: {
    corners: {
      topLeft?: string
      topRight?: string
      bottomLeft?: string
      bottomRight?: string
    }
  }
}

import cornerTopLeft from '../../assets/themes/default/corner-top-left.png'
import cornerTopRight from '../../assets/themes/default/corner-top-right.png'
import cornerBottomLeft from '../../assets/themes/default/corner-bottom-left.png'
import cornerBottomRight from '../../assets/themes/default/corner-bottom-right.png'

export const defaultTheme: Theme = {
  name: 'default',
  background: {
    navy: 'var(--color-navy)',
    navy2: 'var(--color-navy-2)',
    card: 'var(--color-card)',
  },
  ink: {
    primary: 'var(--color-ink)',
    muted: 'var(--color-ink-muted)',
  },
  accent: {
    gold: 'var(--color-gold)',
    gold2: 'var(--color-gold-2)',
  },
  ornaments: {
    corners: {
      topLeft: cornerTopLeft,
      topRight: cornerTopRight,
      bottomLeft: cornerBottomLeft,
      bottomRight: cornerBottomRight,
    },
  },
}

