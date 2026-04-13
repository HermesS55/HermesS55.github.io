import { Link, NavLink } from 'react-router-dom'

function Navbar({ auth }) {
  const isOwner = auth.profile?.role === 'owner'

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold text-white">
          Fix<span className="text-fixora-red">ora</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className="text-zinc-300 hover:text-white">
            Dashboard
          </NavLink>
          {isOwner && (
            <>
              <NavLink to="/create-listing" className="text-zinc-300 hover:text-white">
                Create Listing
              </NavLink>
              <NavLink to="/my-listings" className="text-zinc-300 hover:text-white">
                My Listings
              </NavLink>
            </>
          )}
          <button
            onClick={auth.logout}
            className="rounded-md bg-fixora-red px-3 py-1.5 font-medium text-white hover:bg-red-500"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
