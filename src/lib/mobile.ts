import { t } from './i18n-core'

export const MOBILE = (import.meta as any).env?.VITE_MOBILE === '1'

const FILE = 'buildarmy-state.json'

export async function nativeLoad() {
  try {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')
    const r = await Filesystem.readFile({ path: FILE, directory: Directory.Data, encoding: Encoding.UTF8 })
    const text = typeof r.data === 'string' ? r.data : await (r.data as Blob).text()
    return JSON.parse(text)
  } catch (e) { return null }
}

export async function nativeSave(state: any) {
  try {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')
    await Filesystem.writeFile({ path: FILE, directory: Directory.Data, data: JSON.stringify(state), encoding: Encoding.UTF8 })
  } catch (e) { /* keep the localStorage copy */ }
}

export async function syncReminder(S: any, interactive = false): Promise<boolean> {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    await LocalNotifications.cancel({ notifications: [0, 1, 2, 3, 4, 5, 6].map(d => ({ id: 100 + d })) }).catch(() => {})
    if (!S.reminder?.on) return true

    if (interactive) {
      const perm = await LocalNotifications.checkPermissions()
      if (perm.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions()
        if (req.display !== 'granted') return false
      }
    }

    const [hh, mm] = (S.reminder.time || '08:00').split(':').map(Number)
    const activeDays = Object.entries(S.week || {}).filter(([_, rid]) => !!rid).map(([d]) => Number(d))

    const notifs = activeDays.map(d => ({
      id: 100 + d,
      title: t('Time to work out!'),
      body: t("Today's routine is ready for you."),
      schedule: {
        on: { weekday: d === 0 ? 1 : d + 1, hour: hh, minute: mm },
        allowWhileIdle: true
      }
    }))
    if (notifs.length) await LocalNotifications.schedule({ notifications: notifs })
    return true
  } catch (e) {
    return false
  }
}

export async function shareExport(json: string, filename: string) {
  const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')
  const { Share } = await import('@capacitor/share')
  const path = `export-${Date.now()}-${filename}`
  await Filesystem.writeFile({ path, directory: Directory.Cache, data: json, encoding: Encoding.UTF8 })
  const uri = await Filesystem.getUri({ path, directory: Directory.Cache })
  await Share.share({ title: filename, url: uri.uri })
}
