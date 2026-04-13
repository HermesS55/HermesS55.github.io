function OfferList({ offers }) {
  if (!offers.length) {
    return <p className="text-sm text-zinc-400">No offers yet.</p>
  }

  return (
    <div className="space-y-3">
      {offers.map((offer) => (
        <article key={offer.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-white">${offer.price}</p>
            <p className="text-xs text-zinc-400">{new Date(offer.created_at).toLocaleString()}</p>
          </div>
          <p className="text-sm text-zinc-300">{offer.message}</p>
        </article>
      ))}
    </div>
  )
}

export default OfferList
