export type SetPhase = 'work' | 'warmup'
export type WorkoutMode = 'reps' | 'time' | 'cardio'

export interface WorkoutSet {
  r?: number | string       // reps
  w?: number | string       // weight
  sec?: number | string     // duration in seconds
  min?: number | string     // duration in minutes (cardio)
  kmh?: number | string     // speed (cardio)
  done?: boolean
  warmup?: boolean
  phase?: SetPhase
  effort?: number | null    // RIR (0-5) or RPE (6-10)
  effortScale?: 'rir' | 'rpe'
  amrap?: boolean
  [key: string]: any
}

export interface WorkoutEntry {
  id: string
  ex: string                // exercise id
  target?: any              // target configuration
  sets: WorkoutSet[]
  superset?: string | null  // superset group id
  prog?: any
  notes?: string
  [key: string]: any
}

export interface Workout {
  id: string
  rid?: string | null       // routine id
  name: string
  start: number             // timestamp ms or ISO date
  end?: number              // timestamp ms
  durationSec?: number
  bw?: number | null        // bodyweight
  entries: WorkoutEntry[]
  notes?: string
  [key: string]: any
}

export interface ActiveWorkout extends Workout {
  cur?: number              // active exercise index
  historySeen?: boolean
  paused?: boolean
}
