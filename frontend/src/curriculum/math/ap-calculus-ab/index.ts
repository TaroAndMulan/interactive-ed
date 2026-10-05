import { lazy } from 'react'
import type { Course } from '../../types'

// Units follow the College Board AP Calculus AB Course and Exam Description (CED).
export const apCalculusAB: Course = {
  slug: 'ap-calculus-ab',
  title: 'AP Calculus AB',
  level: 'AP',
  description:
    'Limits, derivatives, and integrals, built from interactive pictures first and formulas second.',
  units: [
    { number: 1, slug: 'limits-and-continuity', title: 'Limits and Continuity', lessons: [] },
    {
      number: 2,
      slug: 'differentiation-definition',
      title: 'Differentiation: Definition and Fundamental Properties',
      lessons: [
        {
          slug: 'average-vs-instantaneous-rate',
          title: 'Average vs. Instantaneous Rate of Change',
          summary:
            'From the slope of a secant line to the slope of a tangent line: shrink the interval and watch the average rate become an instantaneous one.',
          standard: 'CED 2.1',
          durationMinutes: 45,
          component: lazy(() => import('./lessons/average-vs-instantaneous-rate')),
        },
        {
          slug: 'derivative-definition-notation',
          title: 'Defining the Derivative and Derivative Notation',
          summary:
            "Trace the slope at every point to build the function f′, compare the two limit forms, and write tangent lines.",
          standard: 'CED 2.2',
          durationMinutes: 45,
          component: lazy(() => import('./lessons/derivative-definition-notation')),
        },
        {
          slug: 'estimating-derivatives',
          title: 'Estimating Derivatives at a Point',
          summary: 'Eyeball tangent slopes on a graph and estimate derivatives from tables of real data.',
          standard: 'CED 2.3',
          durationMinutes: 40,
          component: lazy(() => import('./lessons/estimating-derivatives')),
        },
        {
          slug: 'differentiability-continuity',
          title: 'Differentiability and Continuity',
          summary: 'Corners, cusps, vertical tangents, and jumps: zoom in to see when a derivative fails to exist.',
          standard: 'CED 2.4',
          durationMinutes: 45,
          component: lazy(() => import('./lessons/differentiability-continuity')),
        },
        {
          slug: 'power-rule',
          title: 'The Power Rule',
          summary: 'Discover the pattern, see why a growing square proves it, and extend it to any exponent.',
          standard: 'CED 2.5',
          durationMinutes: 40,
          component: lazy(() => import('./lessons/power-rule')),
        },
        {
          slug: 'basic-derivative-rules',
          title: 'Constant, Sum, Difference, and Constant Multiple Rules',
          summary: 'Shifts vanish, stretches scale slopes, and slopes add: differentiate any polynomial.',
          standard: 'CED 2.6',
          durationMinutes: 40,
          component: lazy(() => import('./lessons/basic-derivative-rules')),
        },
        {
          slug: 'trig-exp-log-derivatives',
          title: 'Derivatives of sin x, cos x, eˣ, and ln x',
          summary: 'Trace their slopes, prove sin′ = cos on the unit circle, and find the base whose slope is itself.',
          standard: 'CED 2.7',
          durationMinutes: 50,
          component: lazy(() => import('./lessons/trig-exp-log-derivatives')),
        },
        {
          slug: 'product-rule',
          title: 'The Product Rule',
          summary: 'Why (fg)′ ≠ f′g′: grow a rectangle and watch the area change.',
          standard: 'CED 2.8',
          durationMinutes: 40,
          component: lazy(() => import('./lessons/product-rule')),
        },
        {
          slug: 'quotient-rule',
          title: 'The Quotient Rule',
          summary: 'Derive it from the product rule, test the common mistakes, and know when to rewrite instead.',
          standard: 'CED 2.9',
          durationMinutes: 40,
          component: lazy(() => import('./lessons/quotient-rule')),
        },
        {
          slug: 'other-trig-derivatives',
          title: 'Derivatives of tan x, cot x, sec x, and csc x',
          summary: 'Build all four from sine and cosine, and see their slopes near the asymptotes.',
          standard: 'CED 2.10',
          durationMinutes: 35,
          component: lazy(() => import('./lessons/other-trig-derivatives')),
        },
        {
          slug: 'unit-2-review',
          title: 'Unit 2 Review: Derivative Rules Workshop',
          summary: 'Every rule on one page, a step-by-step differentiator for any function, and mixed practice.',
          standard: 'Review',
          durationMinutes: 45,
          component: lazy(() => import('./lessons/unit-2-review')),
        },
      ],
    },
    {
      number: 3,
      slug: 'composite-implicit-inverse',
      title: 'Differentiation: Composite, Implicit, and Inverse Functions',
      lessons: [],
    },
    { number: 4, slug: 'contextual-applications', title: 'Contextual Applications of Differentiation', lessons: [] },
    { number: 5, slug: 'analytical-applications', title: 'Analytical Applications of Differentiation', lessons: [] },
    { number: 6, slug: 'integration-accumulation', title: 'Integration and Accumulation of Change', lessons: [] },
    { number: 7, slug: 'differential-equations', title: 'Differential Equations', lessons: [] },
    { number: 8, slug: 'applications-of-integration', title: 'Applications of Integration', lessons: [] },
  ],
}
