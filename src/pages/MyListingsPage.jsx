import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function MyListingsPage({ auth }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMyListings = async () => {
      const { data, error: queryError } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', auth.session.user.id)
        .order('created_at', { ascending: false })

      if (queryError) {
        setError(queryError.message)
      } else {
        setListings(data ?? [])
      }
      setLoading(false)
    }

    loadMyListings()
  }, [auth.session.user.id])

  if (loading) return <p className="text-zinc-400">Loading your listings...</p>

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">My Listings</h1>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {!listings.length ? (
        <p className="text-zinc-400">You have not created listings yet.</p>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700"
            >
              <h2 className="font-semibold text-white">{listing.title}</h2>
              <p className="text-sm text-zinc-400">
                {listing.vehicle_brand} {listing.vehicle_model} · {listing.city}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default MyListingsPage
