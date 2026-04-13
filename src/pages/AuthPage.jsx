import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AuthPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('owner')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isLogin) {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) {
        setError(loginError.message)
      } else {
        navigate('/')
      }
      setLoading(false)
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="mb-1 text-2xl font-bold text-white">Fixora</h1>
      <p className="mb-6 text-sm text-zinc-400">{isLogin ? 'Login to your account' : 'Create your account'}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />

        {!isLogin && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
          >
            <option value="owner">Owner</option>
            <option value="pro">Service Provider (Pro)</option>
          </select>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-md bg-fixora-red py-2 font-medium text-white hover:bg-red-500 disabled:opacity-60"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create account'}
        </button>
      </form>

      <button onClick={() => setIsLogin((v) => !v)} className="mt-4 text-sm text-zinc-400 hover:text-white">
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  )
}

export default AuthPage
