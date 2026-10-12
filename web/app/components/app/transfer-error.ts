export async function getAppTransferErrorMessage(error: unknown): Promise<string | undefined> {
  return error instanceof Error ? error.message || undefined : undefined
}
