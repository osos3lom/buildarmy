import { useEffect, useRef } from 'react'
import { useUI, SheetEntry } from '../store/useUI'

// One bottom sheet (or centered dialog) with swipe-to-dismiss.
function Sheet({ sheet }: { sheet: SheetEntry }) {
  const { closeSheet } = useUI()
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startY: number | null; delta: number }>({ startY: null, delta: 0 })

  const onTouchStart = (e: React.TouchEvent) => {
    const el = ref.current
    if (!el) return
    const target = e.target as HTMLElement
    if (target.closest && target.closest('input[type=range], [data-nodrag]')) {
      drag.current = { startY: null, delta: 0 }
      return
    }
    drag.current = { startY: el.scrollTop <= 0 ? e.touches[0].clientY : null, delta: 0 }
  }
  const onTouchMove = (e: TouchEvent) => {
    const el = ref.current, d = drag.current
    if (!el || d.startY === null) return
    d.delta = e.touches[0].clientY - d.startY
    if (d.delta > 0 && el.scrollTop <= 0) {
      e.preventDefault()
      el.style.transition = 'none'
      el.style.transform = `translateY(${d.delta}px)`
    } else d.delta = 0
  }
  const onTouchEnd = () => {
    const el = ref.current, d = drag.current
    if (!el || d.startY === null) return
    el.style.transition = 'transform .2s'
    if (d.delta > 90 && !sheet.locked) {
      el.style.transform = 'translateY(110%)'
      setTimeout(() => closeSheet(sheet.id), 180)
    } else {
      el.style.transform = ''
    }
    d.startY = null
  }
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest && target.closest('input[type=range], [data-nodrag]')) {
      drag.current = { startY: null, delta: 0 }
      return
    }
    const el = ref.current
    if (!el) return
    drag.current = { startY: el.scrollTop <= 0 ? e.clientY : null, delta: 0 }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current, d = drag.current
    if (!el || d.startY === null) return
    d.delta = e.clientY - d.startY
    if (d.delta > 0 && el.scrollTop <= 0) {
      e.preventDefault()
      el.style.transition = 'none'
      el.style.transform = `translateY(${d.delta}px)`
    } else d.delta = 0
  }
  const onMouseUp = () => onTouchEnd()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      el.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const close = () => closeSheet(sheet.id)
  if (sheet.kind === 'center') {
    return (
      <div className="modal-wrap">
        <div className="mback" onClick={() => { if (!sheet.locked) close() }} />
        <div className="center">{sheet.render(close)}</div>
      </div>
    )
  }
  return (
    <div className="modal-wrap">
      <div className="mback" onClick={() => { if (!sheet.locked) close() }} />
      <div
        className="sheet"
        ref={ref}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="grab" />
        {sheet.render(close)}
      </div>
    </div>
  )
}

export default function Modals() {
  const sheets = useUI(s => s.sheets)
  const closeSheet = useUI(s => s.closeSheet)
  const prevLen = useRef(0)
  const suppressPop = useRef(false)
  const pushedEntries = useRef(0)
  const sheetEntries = useRef<any[]>([])

  useEffect(() => {
    const curLen = sheets.length
    const diff = curLen - prevLen.current

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        const sheet = sheets[prevLen.current + i]
        const stateKey = sheet ? sheet.id : `sheet-${Date.now()}-${i}`
        window.history.pushState({ __sheet: stateKey }, '')
        pushedEntries.current += 1
        sheetEntries.current.push(stateKey)
      }
    } else if (diff < 0) {
      const popCount = Math.min(-diff, pushedEntries.current)
      if (popCount > 0) {
        suppressPop.current = true
        pushedEntries.current -= popCount
        sheetEntries.current.splice(sheetEntries.current.length - popCount, popCount)
        window.history.go(-popCount)
        setTimeout(() => { suppressPop.current = false }, 50)
      }
    }
    prevLen.current = curLen
  }, [sheets.length])

  useEffect(() => {
    const onPop = () => {
      if (suppressPop.current) return
      if (pushedEntries.current > 0) {
        pushedEntries.current -= 1
        sheetEntries.current.pop()
        const curSheets = useUI.getState().sheets
        if (curSheets.length) {
          const top = curSheets[curSheets.length - 1]
          if (!top.locked) closeSheet(top.id)
        }
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [closeSheet])

  return (
    <>
      {sheets.map(s => <Sheet key={s.id} sheet={s} />)}
    </>
  )
}
