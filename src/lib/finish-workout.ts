// The persisted boundary for a finished session.
export function buildCompletedWorkout(active: any, { end = Date.now(), prs = [], snapshotFor }: { end?: number; prs?: any[]; snapshotFor?: (entry: any) => any } = {}) {
  const entries = (active?.entries || []).map((entry: any) => {
    const completed: any = {
      id: entry.id,
      sets: entry.sets,
      topW: entry.topW || null,
      target: entry.target || null,
    }
    const snapshot = typeof snapshotFor === 'function' ? snapshotFor(entry) : null
    if (snapshot && typeof snapshot === 'object' && !Array.isArray(snapshot) && Object.keys(snapshot).length) {
      completed.muscleSnapshot = { ...snapshot }
    }
    return completed
  }).filter((entry: any) => entry.sets.some((set: any) => set.done))

  const workout: any = {
    id: active.id,
    d: active.d,
    start: active.start,
    end,
    routineId: active.routineId,
    name: active.name,
    bw: active.bw,
    entries,
    prs,
  }
  return workout
}
