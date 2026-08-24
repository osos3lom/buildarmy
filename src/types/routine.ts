export interface RoutineExerciseConfig {
  id: string                // exercise id
  sets?: number
  reps?: number
  time?: number
  w?: number
  minReps?: number
  maxReps?: number
  restSec?: number
  prog?: string
  progConfig?: Record<string, any>
  superset?: string | null
  [key: string]: any
}

export interface Routine {
  id: string
  name: string
  emoji?: string
  color?: string
  policy?: string
  notes?: string
  ex: RoutineExerciseConfig[]
  [key: string]: any
}

export type WeekSchedule = Record<number | string, string | null>
export type DayPlanOverride = Record<string, string | null>
