import { useState } from 'react'
import { supabase } from '../lib/supabase'

function OfferForm({ listingId, onSubmitted }) {
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { error: insertError } = await supabase.from('offers').insert({
      listing_id: listingId,
      price: Number(price),
      message,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setPrice('')
    setMessage('')
    setSaving(false)
    onSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-lg font-semibold">Send Offer</h3>
      <input
        type="number"
        min="1"
        required
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (USD)"
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Message"
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        disabled={saving}
        className="rounded-md bg-fixora-red px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
      >
        {saving ? 'Sending...' : 'Submit offer'}
      </button>
    </form>
  )
}

export default OfferForm
