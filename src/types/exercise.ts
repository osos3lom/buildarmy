export interface Exercise {
  id: string
  name: string
  bodyPart: string
  target: string
  secondaryMuscles?: string[]
  equipment: string
  instructions?: string[]
  description?: string
  custom?: boolean
  bw?: boolean
  perSide?: boolean
  timed?: boolean
  cardio?: boolean
  gifUrl?: string
  imgUrl?: string
}

export interface CustomExercise {
  id: string
  name: string
  bodyPart: string
  target?: string
  equipment?: string
  description?: string
  bw?: boolean
  perSide?: boolean
  timed?: boolean
  cardio?: boolean
}
