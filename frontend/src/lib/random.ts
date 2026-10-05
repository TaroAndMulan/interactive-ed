/** Random integer in [min, max], optionally excluding some values. */
export function randomInt(min: number, max: number, exclude: number[] = []): number {
  let n: number
  do n = min + Math.floor(Math.random() * (max - min + 1))
  while (exclude.includes(n))
  return n
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
