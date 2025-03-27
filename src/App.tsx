import './App.css'
import { Timer } from '@/components'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>ポモドーロタイマー</h1>
      </header>
      <main className="app-main">
        <Timer />
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 ポモドーロタイマー</p>
      </footer>
    </div>
  )
}

export default App
