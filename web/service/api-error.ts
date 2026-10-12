const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined

const nonEmptyString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined

/** An HTTP failure. Non-HTTP transport errors and cancellations are preserved separately. */
export class ApiError extends Error {
  readonly status: number
  readonly headers: Headers
  readonly code: string | undefined
  readonly reason: string | undefined
  readonly hint: string | undefined
  readonly details: unknown
  readonly data: Record<string, unknown> | undefined

  constructor(response: Pick<Response, 'status' | 'statusText' | 'headers'>, body?: unknown) {
    const data = asRecord(body)
    super(
      nonEmptyString(data?.message) ??
        nonEmptyString(data?.error) ??
        nonEmptyString(response.statusText) ??
        `HTTP ${response.status}`,
    )
    this.name = 'ApiError'
    // The HTTP status is authoritative even when the response body disagrees.
    this.status = response.status
    this.headers = new Headers(response.headers)
    this.code = nonEmptyString(data?.code)
    this.reason = nonEmptyString(data?.reason)
    this.hint = nonEmptyString(data?.hint)
    this.details = data?.details
    this.data = data
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let body: unknown
    try {
      body = await response.clone().json()
    } catch {
      // Empty, malformed JSON and proxy HTML errors still carry an HTTP status.
    }
    return new ApiError(response, body)
  }
}
