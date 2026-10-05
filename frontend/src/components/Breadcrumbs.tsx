import { Fragment } from 'react'
import { Link } from 'react-router'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mx-2 text-slate-300">/</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-slate-900 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
