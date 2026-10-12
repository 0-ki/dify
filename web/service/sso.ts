// The generated enterprise SSO contract does not expose invite_token yet.
import { get } from './base'

export const getUserSAMLSSOUrl = (invite_token?: string) => {
  const url = invite_token
    ? `/enterprise/sso/saml/login?invite_token=${invite_token}`
    : '/enterprise/sso/saml/login'
  return get<{ url: string }>(url, {}, { silent: true })
}

export const getUserOIDCSSOUrl = (invite_token?: string) => {
  const url = invite_token
    ? `/enterprise/sso/oidc/login?invite_token=${invite_token}`
    : '/enterprise/sso/oidc/login'
  return get<{ url: string; state: string }>(url, {}, { silent: true })
}

export const getUserOAuth2SSOUrl = (invite_token?: string) => {
  const url = invite_token
    ? `/enterprise/sso/oauth2/login?invite_token=${invite_token}`
    : '/enterprise/sso/oauth2/login'
  return get<{ url: string; state: string }>(url, {}, { silent: true })
}
