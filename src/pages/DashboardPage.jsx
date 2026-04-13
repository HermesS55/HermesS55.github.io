import { useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import { supabase } from '../lib/supabase'

function DashboardPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true)
      const { data, error: queryError } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })

      if (queryError) {
        setError(queryError.message)
      } else {
        setListings(data ?? [])
      }
      setLoading(false)
    }

    loadListings()
  }, [])

  if (loading) return <p className="text-zinc-400">Loading listings...</p>

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Open Listings</h1>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {!listings.length ? (
        <p className="text-zinc-400">No open listings right now.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}

export default DashboardPage
