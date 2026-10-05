import type { ReactNode } from 'react'
import { Tex } from '@/components/math/Tex'

function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-white px-3 py-1 text-sm shadow-sm ring-1 ring-slate-200">{children}</span>
}

/** Differentiable ⊂ continuous ⊂ all functions (at a point), with examples in each ring. */
export function NestedSets() {
  return (
    <div className="rounded-2xl border-2 border-slate-300 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-500">All functions, at x = c</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip>jump</Chip>
        <Chip>hole or misplaced point</Chip>
        <Chip>vertical asymptote</Chip>
      </div>
      <div className="mt-4 rounded-2xl border-2 border-violet-300 bg-violet-50 p-4">
        <p className="text-sm font-semibold text-violet-700">Continuous at c</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip>
            corner <Tex>|x|</Tex>
          </Chip>
          <Chip>
            cusp <Tex>{'x^{2/3}'}</Tex>
          </Chip>
          <Chip>
            vertical tangent <Tex>{String.raw`\sqrt[3]{x}`}</Tex>
          </Chip>
        </div>
        <div className="mt-4 rounded-2xl border-2 border-blue-300 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700">Differentiable at c</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip>polynomials</Chip>
            <Chip>
              <Tex>{String.raw`\sin x,\ \cos x`}</Tex>
            </Chip>
            <Chip>
              <Tex>{'e^x'}</Tex>
            </Chip>
          </div>
        </div>
      </div>
    </div>
  )
}
