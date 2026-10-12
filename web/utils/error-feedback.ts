const reportedErrors = new WeakSet<object>()

/** Keep one failure's feedback with its first owner, even if it is rethrown. */
export function reportErrorOnce<T>(error: unknown, report: () => T): T | undefined {
  if (error instanceof Error && error.name === 'AbortError') return
  if (typeof error === 'object' && error !== null) {
    if (reportedErrors.has(error)) return
    reportedErrors.add(error)
  }
  return report()
}
