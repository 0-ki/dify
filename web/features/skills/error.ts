import { ApiError } from '@/service/api-error'

export function isSkillErrorRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function getSkillErrorCode(error: unknown): string | undefined {
  if (!(error instanceof Error)) return undefined

  if (error instanceof ApiError && error.code) return error.code

  // Legacy package validation still reports these failures through message text.
  const message = error.message
  if (/must contain SKILL\.md/i.test(message)) return 'missing_skill_md'
  if (/skill name .+ already exists/i.test(message)) return 'skill_name_conflict'
  if (/skill limit/i.test(message)) return 'skill_limit_exceeded'

  return undefined
}

function getSkillErrorDetails(error: unknown): Record<string, unknown> | undefined {
  return error instanceof ApiError && isSkillErrorRecord(error.details) ? error.details : undefined
}

export function getSkillErrorDetailNumber(error: unknown, key: string): number | undefined {
  const value = getSkillErrorDetails(error)?.[key]
  return typeof value === 'number' ? value : undefined
}

export function getSkillErrorDetailString(error: unknown, key: string): string | undefined {
  const value = getSkillErrorDetails(error)?.[key]
  if (typeof value === 'string') return value
  if (key !== 'name' || !(error instanceof Error)) return undefined

  if (typeof error.message !== 'string') return undefined
  return error.message.match(/skill name ["']?(.+?)["']? already exists/i)?.[1]
}
