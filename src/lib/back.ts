// Android system back (the gesture and the hardware/nav button are the same event).
import { MOBILE } from './mobile'
import { useUI } from '../store/useUI'
import { t } from './i18n'

// How long a first back press stays armed as "press again to exit" (the toast shows 2.2s).
export const EXIT_WINDOW = 2000

// What a back press means, given what is on screen. Pure, so the table below is testable.
export function decideBack({ top, canGoBack, exitArmed }: { top?: any; canGoBack?: boolean; exitArmed?: boolean }) {
  if (top) return top.locked ? 'ignore' : 'sheet'
  if (canGoBack) return 'history'
  return exitArmed ? 'exit' : 'arm-exit'
}

export function makeBackHandler({ getSheets, closeSheet, toast, goBack, exit, now = Date.now }: any) {
  let armedAt = -Infinity
  return (ev: any = {}) => {
    const sheets = getSheets()
    const action = decideBack({
      top: sheets[sheets.length - 1],
      canGoBack: !!ev.canGoBack,
      exitArmed: now() - armedAt < EXIT_WINDOW,
    })
    if (action !== 'arm-exit') armedAt = -Infinity
    if (action === 'sheet') closeSheet(sheets[sheets.length - 1].id)
    else if (action === 'history') goBack()
    else if (action === 'arm-exit') { armedAt = now(); toast(t('Press back again to exit')) }
    else if (action === 'exit') exit()
    return action
  }
}

// Registers the listener for the native shell.
export async function initBackButton() {
  if (!MOBILE) return () => {}
  try {
    const { App } = await import('@capacitor/app')
    const handler = makeBackHandler({
      getSheets: () => useUI.getState().sheets,
      closeSheet: (id: string) => useUI.getState().closeSheet(id),
      toast: (msg: string) => useUI.getState().toast(msg),
      goBack: () => window.history.back(),
      exit: () => App.exitApp(),
    })
    const sub = await App.addListener('backButton', handler)
    return () => sub.remove()
  } catch (e) {
    return () => {}
  }
}
