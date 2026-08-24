// Backend + WebAuthn helpers.
export const IS_APPLE = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)
export const IS_ANDROID = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent)
export const BIO = IS_APPLE ? 'Face ID / Touch ID' : IS_ANDROID ? 'fingerprint or face unlock' : 'your fingerprint, face or PIN'
export const VAULT = IS_APPLE ? 'iCloud Keychain' : IS_ANDROID ? 'Google Password Manager' : 'your password manager'
export const webauthnOK = () => typeof window !== 'undefined' && !!(window.PublicKeyCredential && navigator.credentials)

export async function api(path: string, opts: RequestInit | any = {}) {
  const r = await fetch(path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts))
  const data = await r.json().catch(() => ({}))
  if (!r.ok) {
    const e: any = new Error(data.error || ('HTTP ' + r.status))
    e.status = r.status
    throw e
  }
  return data
}

const bufToB64u = (buf: ArrayBuffer | ArrayBufferView) => {
  const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf as ArrayBuffer)
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const b64uToBuf = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)).buffer

function toCreationOptions(o: any) {
  o.challenge = b64uToBuf(o.challenge)
  o.user.id = b64uToBuf(o.user.id)
  ;(o.excludeCredentials || []).forEach((c: any) => { c.id = b64uToBuf(c.id) })
  return o
}
function toRequestOptions(o: any) {
  o.challenge = b64uToBuf(o.challenge)
  ;(o.allowCredentials || []).forEach((c: any) => { c.id = b64uToBuf(c.id) })
  return o
}
function credToJSON(cred: any) {
  const r = cred.response
  const out: any = {
    id: cred.id, rawId: bufToB64u(cred.rawId), type: cred.type,
    clientExtensionResults: cred.getClientExtensionResults ? cred.getClientExtensionResults() : {},
    authenticatorAttachment: cred.authenticatorAttachment || null,
    response: { clientDataJSON: bufToB64u(r.clientDataJSON) }
  }
  if (r.attestationObject) {
    out.response.attestationObject = bufToB64u(r.attestationObject)
    out.response.transports = r.getTransports ? r.getTransports() : ['internal']
  }
  if (r.authenticatorData) out.response.authenticatorData = bufToB64u(r.authenticatorData)
  if (r.signature) out.response.signature = bufToB64u(r.signature)
  if (r.userHandle) out.response.userHandle = bufToB64u(r.userHandle)
  return out
}

export async function passkeyRegister(name: string, invite_code?: string) {
  const opts = await api('/api/auth/register-options', { method: 'POST', body: JSON.stringify({ name, invite_code }) })
  const cred: any = await navigator.credentials.create({ publicKey: toCreationOptions(opts) })
  return api('/api/auth/register-verify', { method: 'POST', body: JSON.stringify(credToJSON(cred)) })
}
export async function passkeyLogin() {
  const opts = await api('/api/auth/login-options', { method: 'POST', body: '{}' })
  const cred: any = await navigator.credentials.get({ publicKey: toRequestOptions(opts) })
  return api('/api/auth/login-verify', { method: 'POST', body: JSON.stringify(credToJSON(cred)) })
}
export async function passkeyAdd() {
  const opts = await api('/api/passkeys/add-options', { method: 'POST', body: '{}' })
  const cred: any = await navigator.credentials.create({ publicKey: toCreationOptions(opts) })
  return api('/api/passkeys/add-verify', { method: 'POST', body: JSON.stringify(credToJSON(cred)) })
}
