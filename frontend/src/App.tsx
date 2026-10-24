import { useState, useEffect } from 'react'
import { Activity, CheckCircle, Leaf, Server, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react'

interface BackendHealth {
  status: string
  service: string
  version: string
}

export default function App() {
  const [health, setHealth] = useState<BackendHealth | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const checkBackendHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/v1/health')
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }
      const data = (await response.json()) as BackendHealth
      setHealth(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect to backend'
      setError(message)
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkBackendHealth()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                EcoAction AI
              </span>
              <span className="text-xs text-slate-400 block -mt-1 font-mono">v0.1.0-alpha</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Dev Environment
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Phase 1 Scaffolding Initialized
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            Smart Waste Sorting & Civic Reporting
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            AI-powered waste identification, intelligent disposal guidance, and civic reporting platform.
          </p>
        </div>

        {/* Backend Connectivity Status Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-400" />
                Backend Connection Status
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Testing Vite reverse proxy connectivity to FastAPI (<code className="text-slate-300">/api/v1/health</code>)
              </p>
            </div>
            <button
              onClick={checkBackendHealth}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition duration-150 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Test Connection
            </button>
          </div>

          <div className="pt-6">
            {loading && (
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                Querying FastAPI health endpoint...
              </div>
            )}

            {!loading && health && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-200">
                      Backend Online & Responding
                    </h3>
                    <div className="mt-2 text-xs font-mono space-y-1 text-emerald-300/80">
                      <div>Service: <span className="text-white">{health.service}</span></div>
                      <div>Status: <span className="text-white">{health.status}</span></div>
                      <div>Version: <span className="text-white">{health.version}</span></div>
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs rounded-md bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  HTTP 200 OK
                </span>
              </div>
            )}

            {!loading && error && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
                <Activity className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-200">FastAPI Server Not Detected</h3>
                  <p className="text-xs text-amber-300/80 mt-1">
                    {error}. Start the backend server on port 8000 to enable communication.
                  </p>
                  <code className="inline-block mt-2 px-3 py-1 bg-black/40 rounded text-xs font-mono text-amber-200 border border-amber-900/50">
                    cd backend &amp;&amp; source venv/bin/activate &amp;&amp; uvicorn app.main:app --reload
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Architecture Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Frontend</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">React + Vite + TS</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configured with Tailwind CSS, TypeScript, and Vite proxy for seamless API requests.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">Backend</span>
              <span className="w-2 h-2 rounded-full bg-teal-400" />
            </div>
            <h3 className="font-semibold text-white">FastAPI &amp; Python</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modular structure with versioned endpoints (<code className="text-slate-300">/api/v1</code>), CORS middleware, and Pydantic schemas.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Next Phases</span>
              <ShieldCheck className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-300">Supabase &amp; Vision AI</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ready for Phase 2 (Supabase storage &amp; auth) and Phase 3 (pretrained vision classification model).
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        EcoAction AI • Open Source Civic Ecology Initiative
      </footer>
    </div>
  )
}
