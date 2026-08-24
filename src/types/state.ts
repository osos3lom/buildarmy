import { WeightUnit, ThemeMode, AccentColor, BodyModel, EffortScale, GifSize, Language } from './common'
import { Workout, ActiveWorkout } from './workout'
import { Routine, WeekSchedule, DayPlanOverride } from './routine'
import { CustomExercise } from './exercise'

export interface BodyweightEntry {
  date?: string
  d?: string
  w?: number
  weight?: number
  t?: number
  note?: string
  [key: string]: any
}

export interface ReminderConfig {
  on: boolean
  time: string
  tz?: string | null
  [key: string]: any
}

export interface UserState {
  _ts?: number
  unit: WeightUnit
  restSec: number
  sound: boolean
  keepAwake: boolean
  lang: Language
  theme: ThemeMode
  accent: AccentColor
  body: BodyModel
  targetW: number | null
  bodyweight: BodyweightEntry[]
  routines: Routine[]
  week: WeekSchedule
  dayPlan: DayPlanOverride
  exWeights: Record<string, any>
  workouts: Workout[]
  active: ActiveWorkout | null
  customEx: CustomExercise[]
  gifSize: GifSize
  reminder: ReminderConfig
  effort: EffortScale
  showRir?: boolean
  [key: string]: any
}

export interface UserProfile {
  id: string
  name: string
  admin?: boolean
  [key: string]: any
}
