import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import OfferForm from '../components/OfferForm'
import OfferList from '../components/OfferList'
import { supabase } from '../lib/supabase'

function ListingDetailPage({ auth }) {
  const { id } = useParams()
  const [listing, setListing] = useState(null)
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isOwner = auth.profile?.role === 'owner'
  const isPro = auth.profile?.role === 'pro'

  const loadData = async () => {
    setLoading(true)
    setError('')

    const { data: listingData, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (listingError || !listingData) {
      setError(listingError?.message || 'Listing not found')
      setLoading(false)
      return
    }

    setListing(listingData)

    const ownerCanSeeOffers = isOwner && listingData.owner_id === auth.session.user.id
    if (ownerCanSeeOffers || isPro) {
      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .select('*')
        .eq('listing_id', id)
        .order('created_at', { ascending: false })

      if (offerError) {
        setError(offerError.message)
      } else {
        setOffers(offerData ?? [])
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, auth.profile?.role])

  if (loading) return <p className="text-zinc-400">Loading listing...</p>
  if (error) return <p className="text-red-400">{error}</p>

  const isOwnListing = listing.owner_id === auth.session.user.id

  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="mb-2 text-2xl font-semibold">{listing.title}</h1>
        <p className="mb-3 text-zinc-300">{listing.description}</p>
        <p className="text-sm text-zinc-400">
          {listing.vehicle_brand} {listing.vehicle_model} · {listing.city}
        </p>
      </article>

      {isPro && listing.status === 'open' && <OfferForm listingId={listing.id} onSubmitted={loadData} />}

      {isOwner && isOwnListing && (
        <div>
          <h2 className="mb-3 text-xl font-semibold">Received Offers</h2>
          <OfferList offers={offers} />
        </div>
      )}

      {isPro && (
        <div>
          <h2 className="mb-3 text-xl font-semibold">Existing Offers</h2>
          <OfferList offers={offers} />
        </div>
      )}
    </section>
  )
}

export default ListingDetailPage
