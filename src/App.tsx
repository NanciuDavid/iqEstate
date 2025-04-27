import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-500">
        <Routes>
          <Route path="/" element={
            <div className="p-4">
              <h1 className="text-2xl font-semibold">Welcome to React + Tailwind + Router</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
