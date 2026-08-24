// WebAudio beeps + haptics. `enabled` gates sound.
let audioCtx: any = null

export function beep(enabled: boolean, freq: number = 880, dur: number = 0.18, when: number = 0) {
  if (!enabled) return
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    audioCtx = audioCtx || new AudioContextClass()
    const o = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    o.connect(g)
    g.connect(audioCtx.destination)
    o.frequency.value = freq || 880
    o.type = 'sine'
    const t0 = audioCtx.currentTime + (when || 0)
    g.gain.setValueAtTime(0.001, t0)
    g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + (dur || 0.18))
    o.start(t0)
    o.stop(t0 + (dur || 0.18) + 0.05)
  } catch (e) { /* */ }
}

export function vibrate(p: number | number[]) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(p)
    }
  } catch (e) { /* */ }
}
