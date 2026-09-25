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
    const candidateKeys = ['results', 'data', 'items', 'leaderboard']

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

export default function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${getApiBaseUrl()}/api/leaderboard/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setEntries(normalizeCollection(payload))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Unable to load leaderboard data.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchLeaderboard()

    return () => controller.abort()
  }, [])

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="mb-3">Leaderboard</h2>

        {loading && <div className="text-muted">Loading leaderboard…</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <ul className="list-group list-group-flush">
            {entries.length === 0 ? (
              <li className="list-group-item text-muted text-center py-4">No leaderboard entries found.</li>
            ) : (
              entries.map((entry) => (
                <li
                  key={entry.id ?? `${entry.name}-${entry.rank}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    <span className="fw-semibold me-3">#{entry.rank ?? 1}</span>
                    {entry.name ?? 'Athlete'}
                  </span>
                  <span className="badge bg-dark rounded-pill">{entry.points ?? 0} pts</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
