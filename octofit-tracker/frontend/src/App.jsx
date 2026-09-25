import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'

function StatsCard({ label, value }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="text-uppercase text-muted small fw-semibold">{label}</div>
          <div className="display-6 mt-2">{value}</div>
        </div>
      </div>
    </div>
  )
}

function HomePage() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME

  return (
    <>
      <div className="bg-primary-subtle rounded-4 p-4 mb-4">
        <h1 className="display-5 fw-bold mb-3">Welcome to OctoFit Tracker</h1>
        <p className="lead mb-0">
          Track workouts, manage teams, and keep your fitness goals on pace.
        </p>
        <div className="mt-3 small text-muted">
          API target:{' '}
          <code>
            {codespaceName
              ? `https://${codespaceName}-8000.app.github.dev/api/`
              : 'http://localhost:8000/api/'}
          </code>
        </div>
      </div>

      <div className="row">
        <StatsCard label="Active Members" value="1,284" />
        <StatsCard label="Workouts Logged" value="8,472" />
        <StatsCard label="Current Streak" value="21 days" />
      </div>
    </>
  )
}

function App() {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/teams', label: 'Teams' },
    { to: '/users', label: 'Users' },
    { to: '/activities', label: 'Activities' },
    { to: '/workouts', label: 'Workouts' },
  ]

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">OctoFit Tracker</span>
          <div className="navbar-nav ms-auto flex-wrap gap-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
