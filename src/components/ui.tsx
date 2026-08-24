import React, { useRef, useState, useEffect, useCallback, forwardRef, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import Icon from './Icon'

/* ============================ text ============================ */

export interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | string | null
  onChange?: (val: number | null) => void
  decimal?: boolean
  nullable?: boolean
  className?: string
}

export function NumberField({ value, onChange, decimal = true, nullable = false, className = '', ...rest }: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const committed = useRef<number | null>(null)
  if (draft !== null && (committed.current ?? null) !== (value ?? null)) {
    setDraft(null)
    committed.current = null
  }
  const commit = (raw: string) => {
    let s = raw.replace(/,/g, '.').replace(/[^0-9.]/g, '')
    const i = s.indexOf('.')
    if (i !== -1) s = decimal ? s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, '') : s.slice(0, i)
    const n = s === '' || s === '.' ? (nullable ? null : 0) : Math.max(0, parseFloat(s))
    committed.current = n
    setDraft(s)
    if (onChange) onChange(n)
  }
  return (
    <input
      type="text"
      inputMode={decimal ? 'decimal' : 'numeric'}
      className={'num ' + className}
      value={draft ?? (value ?? '')}
      onFocus={e => e.target.select()}
      onChange={e => commit(e.target.value)}
      onBlur={() => { setDraft(null); committed.current = null }}
      {...rest}
    />
  )
}

export const TextField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextField({ className = '', ...rest }, ref) {
    return <input ref={ref} className={'field ' + className} {...rest} />
  }
)

export function TextArea({ className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={'field area ' + className} {...rest} />
}

export interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
}

export function SearchField({ value = '', onChange, onClear, ...rest }: SearchFieldProps) {
  return (
    <div className="searchf">
      <Icon name="magnifier" className="lead" />
      <input className="field" value={value} onChange={onChange} {...rest} />
      {!!value && (
        <button className="clear" onClick={onClear} aria-label="Clear">
          <Icon name="xmark" />
        </button>
      )}
    </div>
  )
}

/* ============================ switch ============================ */

export interface SwitchProps {
  checked?: boolean
  onChange?: (val: boolean) => void
  disabled?: boolean
}

export function Switch({ checked, onChange, disabled }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={!!checked}
      disabled={disabled}
      className={'sw' + (checked ? ' on' : '')}
      onClick={() => onChange && onChange(!checked)}
    >
      <span className="knob" />
    </button>
  )
}

/* ============================ segmented ============================ */

export interface SegmentOption<T = any> {
  value: T
  label?: string
  icon?: string
}

export interface SegmentedProps<T = any> {
  options: SegmentOption<T>[]
  value: T
  onChange: (val: T) => void
  className?: string
}

export function Segmented<T = any>({ options, value, onChange, className = '' }: SegmentedProps<T>) {
  const i = Math.max(0, options.findIndex(o => o.value === value))
  return (
    <div className={'seg ' + className} style={{ '--n': options.length, '--i': i } as any}>
      <span className="seg-sel" aria-hidden="true" />
      {options.map(o => (
        <button
          key={String(o.value)}
          className={o.value === value ? 'on' : ''}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.icon && <Icon name={o.icon} />}
          {o.label && <span>{o.label}</span>}
        </button>
      ))}
    </div>
  )
}

/* ============================ stepper ============================ */

export interface StepperProps {
  value?: number | string | null
  step?: number
  onChange?: (val: number) => void
  decimal?: boolean
  className?: string
  label?: string
  unit?: string
}

export function Stepper({ value, step = 1, onChange, decimal = true, className = '', label, unit }: StepperProps) {
  const set = (v: number) => onChange && onChange(Math.max(0, Math.round((v || 0) * 100) / 100))
  const inner = (
    <div className={'stp ' + className}>
      <button onClick={() => set((Number(value) || 0) - step)} aria-label="Decrease"><Icon name="minus" /></button>
      <span className="val">
        <NumberField value={value} decimal={decimal} onChange={v => onChange && onChange(v || 0)} />
        {unit && <i>{unit}</i>}
      </span>
      <button onClick={() => set((Number(value) || 0) + step)} aria-label="Increase"><Icon name="plus" /></button>
    </div>
  )
  if (!label) return inner
  return <div className="stp-w"><span className="stp-l">{label}</span>{inner}</div>
}

/* ============================ slider ============================ */

export interface SliderProps {
  value?: number
  min?: number
  max?: number
  step?: number
  onChange?: (val: number) => void
  className?: string
}

export function Slider({ value = 0, min = 0, max = 100, step = 1, onChange, className = '' }: SliderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState(false)
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  const posToValue = useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return value
    const r = el.getBoundingClientRect()
    const isRtl = window.getComputedStyle(el).direction === 'rtl'
    const f = isRtl
      ? Math.min(1, Math.max(0, (r.right - clientX) / r.width))
      : Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    const raw = min + f * (max - min)
    const snapped = Math.round(raw / step) * step
    return Math.min(max, Math.max(min, Math.round(snapped * 1000) / 1000))
  }, [min, max, step, value])

  useEffect(() => {
    if (!drag) return
    const move = (e: any) => {
      e.preventDefault()
      if (onChange) onChange(posToValue(e.touches ? e.touches[0].clientX : e.clientX))
    }
    const up = () => setDrag(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [drag, onChange, posToValue])

  const key = (e: React.KeyboardEvent) => {
    const isRtl = ref.current ? window.getComputedStyle(ref.current).direction === 'rtl' : false
    let d = 0
    if (e.key === 'ArrowUp') {
      d = step
    } else if (e.key === 'ArrowDown') {
      d = -step
    } else if (e.key === 'ArrowRight') {
      d = isRtl ? -step : step
    } else if (e.key === 'ArrowLeft') {
      d = isRtl ? step : -step
    }
    if (!d) return
    e.preventDefault()
    if (onChange) onChange(Math.min(max, Math.max(min, Math.round((value + d) * 1000) / 1000)))
  }

  const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
  const knobLeft = isRtl ? (100 - pct) : pct

  return (
    <div
      ref={ref}
      className={'sld' + (drag ? ' dragging' : '') + ' ' + className}
      role="slider"
      tabIndex={0}
      aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
      data-nodrag
      onKeyDown={key}
      onPointerDown={e => { (e.currentTarget as any).setPointerCapture?.(e.pointerId); setDrag(true); if (onChange) onChange(posToValue(e.clientX)) }}
    >
      <span className="sld-track"><span className="sld-fill" style={{ width: pct + '%' }} /></span>
      <span className="sld-knob" style={{ left: knobLeft + '%' }} />
    </div>
  )
}

/* ============================ checkbox ============================ */

export interface CheckProps {
  checked?: boolean
  onChange?: (val: boolean) => void
  className?: string
  size?: number | string
}

export function Check({ checked, onChange, className = '', size }: CheckProps) {
  return (
    <button
      role="checkbox"
      aria-checked={!!checked}
      className={'chk' + (checked ? ' on' : '') + ' ' + className}
      style={size ? { width: size, height: size } : undefined}
      onClick={() => onChange && onChange(!checked)}
    >
      <Icon name="check" />
    </button>
  )
}

/* ============================ grouped list ============================ */

export interface SectionProps {
  title?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
}

export function Section({ title, footer, children, className = '' }: SectionProps) {
  return (
    <section className={'sect ' + className}>
      {title && <h2 className="sect-t">{title}</h2>}
      <div className="sect-b">{children}</div>
      {footer && <p className="sect-f">{footer}</p>}
    </section>
  )
}

export interface RowProps {
  icon?: string
  iconTint?: string
  title?: ReactNode
  subtitle?: ReactNode
  value?: ReactNode
  accessory?: 'none' | 'chevron' | 'check' | string
  onClick?: (e: React.MouseEvent) => void
  danger?: boolean
  children?: ReactNode
  className?: string
}

export function Row({ icon, iconTint, title, subtitle, value, accessory = 'none', onClick, danger, children, className = '' }: RowProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={'lrow' + (onClick ? ' tap' : '') + (danger ? ' danger' : '') + ' ' + className} onClick={onClick}>
      {icon && <span className="lrow-i" style={iconTint ? ({ '--tint': iconTint } as any) : undefined}><Icon name={icon} /></span>}
      <span className="lrow-m">
        <span className="lrow-t">{title}</span>
        {subtitle && <span className="lrow-s">{subtitle}</span>}
      </span>
      {children}
      {value != null && <span className="lrow-v">{value}</span>}
      {accessory === 'chevron' && <Icon name="chevronRight" className="lrow-c" />}
      {accessory === 'check' && <Icon name="check" className="lrow-k" />}
    </Tag>
  )
}

/* ============================ picker ============================ */

export interface SelectRowProps<T = any> {
  icon?: string
  iconTint?: string
  title?: ReactNode
  value?: T
  options?: { value: T; label: string; subtitle?: string }[]
  onChange?: (val: T) => void
  sheetTitle?: string
}

export function SelectRow<T>({ icon, iconTint, title, value, options = [], onChange, sheetTitle }: SelectRowProps<T>) {
  const cur = options.find(o => o.value === value)
  const open = () => {
    const { openSheet } = require_ui()
    const h = openSheet(close => (
      <>
        <h3>{sheetTitle || title}</h3>
        <div className="sect-b">
          {options.map(o => (
            <button key={String(o.value)} className="lrow tap" onClick={() => { close(); if (onChange) onChange(o.value) }}>
              <span className="lrow-m"><span className="lrow-t">{o.label}</span>
                {o.subtitle && <span className="lrow-s">{o.subtitle}</span>}</span>
              {o.value === value && <Icon name="check" className="lrow-k" />}
            </button>
          ))}
        </div>
        <div style={{ height: 8 }} />
      </>
    ))
    return h
  }
  return (
    <Row icon={icon} iconTint={iconTint} title={title} value={cur ? cur.label : (value != null ? String(value) : '')} accessory="chevron" onClick={open} />
  )
}

let _ui: any = null
export function bindUI(store: any) { _ui = store }
function require_ui() {
  if (!_ui) throw new Error('ui store not bound — call bindUI(useUI) once at boot')
  return _ui.getState()
}

/* ============================ buttons ============================ */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'plain' | 'primary' | 'ghost' | 'danger' | 'accent' | string
  size?: 'sm' | 'lg' | string
  icon?: string
  trailingIcon?: string
  children?: ReactNode
  className?: string
}

export function Button({ variant = 'plain', size, icon, trailingIcon, children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`btn ${variant}${size ? ' ' + size : ''} ${className}`} {...rest}>
      {icon && <Icon name={icon} />}
      {children && <span>{children}</span>}
      {trailingIcon && <Icon name={trailingIcon} />}
    </button>
  )
}
