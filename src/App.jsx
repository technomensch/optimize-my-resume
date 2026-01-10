import { useState } from 'react'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import { AlertCircle } from 'lucide-react'

function App() {
  const [ollamaAvailable, setOllamaAvailable] = useState(null)

  // Check Ollama availability on mount
  useState(() => {
    const checkOllama = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags')
        setOllamaAvailable(response.ok)
      } catch (error) {
        setOllamaAvailable(false)
      }
    }
    checkOllama()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {ollamaAvailable === false && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-yellow-900/40 border border-yellow-700 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-semibold">Ollama Not Running</p>
              <p className="text-yellow-200 text-sm">
                Make sure Ollama is running with: <code className="bg-slate-900/50 px-2 py-1 rounded">ollama serve</code>
              </p>
            </div>
          </div>
        </div>
      )}
      <ResumeAnalyzer />
    </div>
  )
}

export default App
