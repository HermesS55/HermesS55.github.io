import { Link } from 'react-router-dom'

function ListingCard({ listing }) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{listing.title}</h3>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs uppercase text-zinc-300">{listing.status}</span>
      </div>
      <p className="mb-3 text-sm text-zinc-400">{listing.description}</p>
      <p className="text-sm text-zinc-300">
        {listing.vehicle_brand} {listing.vehicle_model} · {listing.city}
      </p>
      <Link
        to={`/listing/${listing.id}`}
        className="mt-4 inline-block rounded-md bg-fixora-red px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
      >
        View details
      </Link>
    </article>
  )
}

export default ListingCard
