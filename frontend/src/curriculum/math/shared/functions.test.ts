import { describe, expect, it } from 'vitest'
import { detectBreaks, onCurve, periodicBreaks } from './functions'

describe('periodicBreaks', () => {
  it('lists the asymptotes of tan x inside the window', () => {
    const breaks = periodicBreaks(Math.PI / 2, Math.PI, 5)
    expect(breaks.map((b) => Number(b.toFixed(4)))).toEqual([-4.7124, -1.5708, 1.5708, 4.7124])
  })
})

describe('detectBreaks', () => {
  it('finds vertical asymptotes but not ordinary steep slopes', () => {
    expect(detectBreaks((x) => 1 / x, -5, 5)).toHaveLength(1)
    expect(detectBreaks(Math.tan, -5, 5)).toHaveLength(4)
    expect(detectBreaks((x) => x ** 3, -5, 5)).toHaveLength(0)
  })
})

describe('onCurve', () => {
  it('snaps x and keeps points where f is undefined in place', () => {
    const constrain = onCurve(Math.sqrt, 0.5, [1, 1])
    expect(constrain([2.3, 0])).toEqual([2.5, Math.sqrt(2.5)])
    expect(constrain([-2, 0])).toEqual([1, 1])
  })
})
