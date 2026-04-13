import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const defaultForm = {
  title: '',
  description: '',
  vehicle_brand: '',
  vehicle_model: '',
  city: '',
}

function CreateListingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { data: userData } = await supabase.auth.getUser()
    const ownerId = userData.user?.id

    const { data, error: insertError } = await supabase
      .from('listings')
      .insert({ ...form, owner_id: ownerId })
      .select('id')
      .single()

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    navigate(`/listing/${data.id}`)
  }

  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="mb-5 text-2xl font-semibold">Create Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ['title', 'Job title'],
          ['description', 'Describe required work'],
          ['vehicle_brand', 'Vehicle brand'],
          ['vehicle_model', 'Vehicle model'],
          ['city', 'City'],
        ].map(([key, label]) => (
          <input
            key={key}
            required
            value={form[key]}
            onChange={(e) => updateField(key, e.target.value)}
            placeholder={label}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
          />
        ))}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          disabled={saving}
          className="rounded-md bg-fixora-red px-4 py-2 font-medium text-white hover:bg-red-500 disabled:opacity-60"
        >
          {saving ? 'Creating...' : 'Create listing'}
        </button>
      </form>
    </section>
  )
}

export default CreateListingPage
