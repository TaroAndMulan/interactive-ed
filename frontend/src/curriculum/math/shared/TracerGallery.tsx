import { useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { DerivativeTracer } from './DerivativeTracer'
import type { MathFunction } from './functions'

/** Pick one of a few functions and trace its slope graph. */
export function TracerGallery({ functions, pi = false }: { functions: MathFunction[]; pi?: boolean }) {
  const [id, setId] = useState(functions[0].id)
  const fn = functions.find((f) => f.id === id)!
  return (
    <div className="space-y-4">
      <SegmentedControl
        ariaLabel="Function"
        value={id}
        onChange={setId}
        options={functions.map((f) => ({ value: f.id, label: <Tex>{f.tex}</Tex> }))}
      />
      <DerivativeTracer key={id} fn={fn} pi={pi} />
    </div>
  )
}
