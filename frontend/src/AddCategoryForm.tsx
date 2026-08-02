import { useState, type SubmitEvent } from 'react'

function AddCategoryForm({ onCategoryCreated }: { onCategoryCreated: () => void }) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const res = await fetch('http://localhost:8000/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(JSON.stringify(body.detail))
      return
    }

    setName('')
    onCategoryCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-gray-300 px-3 py-1.5"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700"
        >
          Add category
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}

export default AddCategoryForm
