import { useState } from 'react'
import ResumeAnalyzer from './components/ResumeAnalyzer-local'
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
    <>
      {ollamaAvailable === false && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-900/95 border-b border-yellow-700">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-3 items-center">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-100 text-sm">
                <span className="font-semibold">Ollama Not Running:</span> Make sure Ollama is running with: <code className="bg-slate-900/50 px-2 py-1 rounded">ollama serve</code>
              </p>
            </div>
          </div>
        </div>
      )}
      <ResumeAnalyzer />
    </>
  )
}

export default App
