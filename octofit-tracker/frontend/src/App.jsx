import { NavLink, Route, Routes } from 'react-router-dom'

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
  return (
    <>
      <div className="bg-primary-subtle rounded-4 p-4 mb-4">
        <h1 className="display-5 fw-bold mb-3">Welcome to OctoFit Tracker</h1>
        <p className="lead mb-0">
          Track workouts, manage teams, and keep your fitness goals on pace.
        </p>
      </div>

      <div className="row">
        <StatsCard label="Active Members" value="1,284" />
        <StatsCard label="Workouts Logged" value="8,472" />
        <StatsCard label="Current Streak" value="21 days" />
      </div>
    </>
  )
}

function LeaderboardPage() {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="mb-3">Leaderboard</h2>
        <ul className="list-group list-group-flush">
          {['Ava', 'Marcus', 'Priya', 'Leah', 'Jordan'].map((name, index) => (
            <li key={name} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <span className="fw-semibold me-3">#{index + 1}</span>
                {name}
              </span>
              <span className="badge bg-dark rounded-pill">{120 - index * 12} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TeamsPage() {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="mb-3">Teams</h2>
        <div className="row g-3">
          {[
            ['Momentum Crew', '12 members'],
            ['Iron Circuit', '9 members'],
            ['Trail Blazers', '14 members'],
          ].map(([name, members]) => (
            <div key={name} className="col-md-4">
              <div className="border rounded-3 p-3 h-100">
                <h5>{name}</h5>
                <p className="text-muted mb-0">{members}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/teams', label: 'Teams' },
  ]

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">OctoFit Tracker</span>
          <div className="navbar-nav ms-auto">
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
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/teams" element={<TeamsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
