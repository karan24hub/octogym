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
    const candidateKeys = ['results', 'data', 'items', 'users']

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

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${getApiBaseUrl()}/api/users/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setUsers(normalizeCollection(payload))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Unable to load users.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchUsers()

    return () => controller.abort()
  }, [])

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="mb-3">Users</h2>

        {loading && <div className="text-muted">Loading users…</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Level</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-muted text-center py-4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id ?? user.email ?? user.name}>
                      <td>{user.name ?? 'Anonymous'}</td>
                      <td>{user.email ?? 'N/A'}</td>
                      <td className="text-capitalize">{user.fitnessLevel ?? 'beginner'}</td>
                      <td>{user.points ?? 0}</td>
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
