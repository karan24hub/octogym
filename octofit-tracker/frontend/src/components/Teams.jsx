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
    const candidateKeys = ['results', 'data', 'items', 'teams']

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

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchTeams = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${getApiBaseUrl()}/api/teams/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setTeams(normalizeCollection(payload))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Unable to load teams.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchTeams()

    return () => controller.abort()
  }, [])

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="mb-3">Teams</h2>

        {loading && <div className="text-muted">Loading teams…</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-3">
            {teams.length === 0 ? (
              <div className="col-12 text-muted text-center py-4">No teams found.</div>
            ) : (
              teams.map((team) => (
                <div key={team.id ?? team.name} className="col-md-4">
                  <div className="border rounded-3 p-3 h-100">
                    <h5>{team.name ?? 'Unnamed team'}</h5>
                    <p className="text-muted mb-2">Captain: {team.captain ?? 'TBD'}</p>
                    <p className="text-muted mb-2">Members: {Array.isArray(team.members) ? team.members.length : 0}</p>
                    <span className="badge bg-primary">{team.points ?? 0} pts</span>
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
