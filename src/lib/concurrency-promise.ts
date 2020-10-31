const concurrecyPromise = async <T>(
  promises: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> => {
  const results: T[] = []
  let currentIndex = 0

  while (currentIndex < promises.length) {
    const chunks = promises.slice(currentIndex, currentIndex + concurrency)
    if (chunks.length === 0) {
      break
    }
    Array.prototype.push.apply(
      results,
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(chunks.map((c) => c()))
    )
    currentIndex += concurrency
  }
  return results
}

export default concurrecyPromise
