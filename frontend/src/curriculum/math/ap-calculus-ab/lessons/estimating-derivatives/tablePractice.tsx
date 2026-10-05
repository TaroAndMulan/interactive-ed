import { ValueTable } from '@/components/lesson/ValueTable'
import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { PracticeProblem } from '@/components/quiz/PracticeGenerator'
import { fmt } from '@/lib/format'
import { pick, randomInt } from '@/lib/random'

const CONTEXTS = [
  { name: 'W', input: 't', inputUnit: 'hours', output: 'water in a reservoir', outputUnit: 'thousand gallons', rate: 'thousand gallons per hour' },
  { name: 'T', input: 't', inputUnit: 'minutes', output: 'temperature of a pie', outputUnit: '°F', rate: '°F per minute' },
  { name: 'P', input: 'x', inputUnit: 'years', output: 'population of a town', outputUnit: 'hundred people', rate: 'hundred people per year' },
]

/** A random table with uneven spacing; estimate the derivative between two data points. */
export function generateTableProblem(): PracticeProblem {
  const c = pick(CONTEXTS)
  const xs = [0]
  while (xs.length < 5) xs.push(xs[xs.length - 1] + randomInt(2, 4))
  const ys = [randomInt(20, 60)]
  while (ys.length < 5) ys.push(ys[ys.length - 1] + randomInt(-12, 15, [0]))

  const i = randomInt(0, 3)
  const target = xs[i] + 1
  const answer = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i])
  const work = String.raw`${c.name}'(${target}) \approx \frac{${c.name}(${xs[i + 1]}) - ${c.name}(${xs[i]})}{${xs[i + 1]} - ${xs[i]}} = \frac{${ys[i + 1] - ys[i]}}{${xs[i + 1] - xs[i]}} \approx ${fmt(answer)}`

  return {
    prompt: (
      <div className="space-y-3">
        <p>
          <Tex>{`${c.name}(${c.input})`}</Tex> is the {c.output} ({c.outputUnit}) at time <Tex>{c.input}</Tex> (
          {c.inputUnit}). Use the table to estimate <Tex>{`${c.name}'(${target})`}</Tex>.
        </p>
        <ValueTable
          rows={[
            { label: c.input, values: xs },
            { label: `${c.name}(${c.input})`, values: ys },
          ]}
        />
      </div>
    ),
    inputPrefix: <Tex>{`${c.name}'(${target}) \\approx`}</Tex>,
    placeholder: c.rate,
    answer: (
      <>
        {fmt(answer)} {c.rate}
      </>
    ),
    check: numericAnswer(answer, 0.01),
    explanation: (
      <>
        <p>
          {target} lies between {xs[i]} and {xs[i + 1]}, the closest data points on either side:
        </p>
        <Tex block>{work}</Tex>
        <p>Units: {c.rate}.</p>
      </>
    ),
  }
}
