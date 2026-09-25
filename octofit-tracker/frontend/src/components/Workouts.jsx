import { useEffect, useState } from 'react'

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  return codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'
}

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const candidateKeys = ['results', 'data', 'items', 'workouts']

    for (const key of candidateKeys) {
      if (Array.isArray(payload[key])) {
        return payload[key]
      }
    }

    for (const value of Object.values(payload)) {
      if (Array.isArray(value)) {
        return value
      }
    }
  }

  return []
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchWorkouts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${getApiBaseUrl()}/api/workouts/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setWorkouts(normalizeCollection(payload))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Unable to load workouts.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchWorkouts()

    return () => controller.abort()
  }, [])

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="mb-3">Workouts</h2>

        {loading && <div className="text-muted">Loading workouts…</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-3">
            {workouts.length === 0 ? (
              <div className="col-12 text-muted text-center py-4">No workouts found.</div>
            ) : (
              workouts.map((workout) => (
                <div key={workout.id ?? workout.title} className="col-md-4">
                  <div className="border rounded-3 p-3 h-100">
                    <h5>{workout.title ?? 'Workout'}</h5>
                    <p className="text-muted mb-2">Focus: {workout.focus ?? 'General'}</p>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>{workout.difficulty ?? 'Beginner'}</span>
                      <span>{workout.durationMinutes ?? 0} min</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
