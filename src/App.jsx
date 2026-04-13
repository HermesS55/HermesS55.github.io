import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import CreateListingPage from './pages/CreateListingPage'
import ListingDetailPage from './pages/ListingDetailPage'
import MyListingsPage from './pages/MyListingsPage'

export const AuthContext = ({ children, value }) => children(value)

function App() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error(error)
      return null
    }

    return data
  }

  useEffect(() => {
    const bootstrap = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      setSession(currentSession)
      if (currentSession?.user) {
        const nextProfile = await fetchProfile(currentSession.user.id)
        setProfile(nextProfile)
      }
      setLoading(false)
    }

    bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession)
      if (currentSession?.user) {
        const nextProfile = await fetchProfile(currentSession.user.id)
        setProfile(nextProfile)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const authValue = useMemo(
    () => ({
      session,
      profile,
      loading,
      refreshProfile: async () => {
        if (!session?.user) return
        const nextProfile = await fetchProfile(session.user.id)
        setProfile(nextProfile)
      },
      logout: async () => {
        await supabase.auth.signOut()
        navigate('/auth')
      },
    }),
    [session, profile, loading, navigate],
  )

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Fixora...</div>
  }

  return (
    <AuthContext value={authValue}>
      {(auth) => (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          {auth.session && <Navbar auth={auth} />}
          <main className="mx-auto max-w-5xl px-4 py-6">
            <Routes>
              <Route path="/auth" element={auth.session ? <Navigate to="/" replace /> : <AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute auth={auth}>
                    <DashboardPage auth={auth} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-listing"
                element={
                  <ProtectedRoute auth={auth} role="owner">
                    <CreateListingPage auth={auth} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listing/:id"
                element={
                  <ProtectedRoute auth={auth}>
                    <ListingDetailPage auth={auth} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <ProtectedRoute auth={auth} role="owner">
                    <MyListingsPage auth={auth} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to={auth.session ? '/' : '/auth'} replace />} />
            </Routes>
          </main>
        </div>
      )}
    </AuthContext>
  )
}

export default App
