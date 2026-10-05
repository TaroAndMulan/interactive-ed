import { Link } from 'react-router'
import { Tex } from '@/components/math/Tex'
import { colors } from '@/curriculum/math/shared/colors'

interface Rule {
  name: string
  topic: string
  lesson: string
  tex: string
}

const rules: Rule[] = [
  { name: 'Definition', topic: '2.2', lesson: 'derivative-definition-notation', tex: String.raw`f'(x) = \lim_{h\to 0}\frac{f(x+h) - f(x)}{h}` },
  { name: 'Tangent line', topic: '2.2', lesson: 'derivative-definition-notation', tex: String.raw`y - f(a) = f'(a)(x - a)` },
  { name: 'Estimate from data', topic: '2.3', lesson: 'estimating-derivatives', tex: String.raw`f'(c) \approx \frac{f(b) - f(a)}{b - a},\ a < c < b` },
  { name: 'Differentiable ⇒ continuous', topic: '2.4', lesson: 'differentiability-continuity', tex: String.raw`\text{fails at corners, cusps, vertical tangents, jumps}` },
  { name: 'Power rule', topic: '2.5', lesson: 'power-rule', tex: String.raw`\frac{d}{dx}x^n = n x^{n-1}` },
  { name: 'Constant', topic: '2.6', lesson: 'basic-derivative-rules', tex: String.raw`\frac{d}{dx}c = 0` },
  { name: 'Constant multiple', topic: '2.6', lesson: 'basic-derivative-rules', tex: String.raw`\frac{d}{dx}\big[k f\big] = k f'` },
  { name: 'Sum and difference', topic: '2.6', lesson: 'basic-derivative-rules', tex: String.raw`\frac{d}{dx}\big[f \pm g\big] = f' \pm g'` },
  { name: 'Sine and cosine', topic: '2.7', lesson: 'trig-exp-log-derivatives', tex: String.raw`(\sin x)' = \cos x,\ \ (\cos x)' = -\sin x` },
  { name: 'Exponential and log', topic: '2.7', lesson: 'trig-exp-log-derivatives', tex: String.raw`(e^x)' = e^x,\ \ (\ln x)' = \frac{1}{x}` },
  { name: 'Product rule', topic: '2.8', lesson: 'product-rule', tex: String.raw`(fg)' = f'g + fg'` },
  { name: 'Quotient rule', topic: '2.9', lesson: 'quotient-rule', tex: String.raw`\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}` },
  { name: 'tan and cot', topic: '2.10', lesson: 'other-trig-derivatives', tex: String.raw`(\tan x)' = \sec^2 x,\ \ (\cot x)' = -\csc^2 x` },
  { name: 'sec and csc', topic: '2.10', lesson: 'other-trig-derivatives', tex: String.raw`(\sec x)' = \sec x\tan x,\ \ (\csc x)' = -\csc x\cot x` },
]

/** Every Unit 2 rule as a card that links back to the lesson where it was introduced. */
export function RulesReference() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rules.map((rule) => (
        <Link
          key={rule.name}
          to={`../${rule.lesson}`}
          relative="path"
          className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-semibold text-slate-900 group-hover:underline">{rule.name}</span>
            <span className="font-mono text-xs text-slate-400">{rule.topic}</span>
          </div>
          <div className="mt-2 overflow-x-auto">
            <Tex>{`\\textcolor{${colors.curve}}{${rule.tex}}`}</Tex>
          </div>
        </Link>
      ))}
    </div>
  )
}
