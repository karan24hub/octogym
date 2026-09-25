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
    const candidateKeys = ['results', 'data', 'items', 'activities']

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

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchActivities = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${getApiBaseUrl()}/api/activities/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setActivities(normalizeCollection(payload))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Unable to load activities right now.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchActivities()

    return () => controller.abort()
  }, [])

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="mb-3">Activities</h2>

        {loading && <div className="text-muted">Loading activities…</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Minutes</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-muted text-center py-4">
                      No activities found.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id ?? `${activity.type}-${activity.date}`}>
                      <td>{activity.type ?? 'Workout'}</td>
                      <td>{activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}</td>
                      <td>{activity.durationMinutes ?? 0} min</td>
                      <td>{activity.caloriesBurned ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
