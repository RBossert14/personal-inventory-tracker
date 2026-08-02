import { useState, type SubmitEvent } from 'react'

type Category = {
  id: number
  name: string
}

// mirrors CATEGORY_ATTRIBUTE_SCHEMAS on the backend — the expected fields per category
const CATEGORY_FIELDS: Record<string, string[]> = {
  'baseball card': ['player', 'year', 'grade'],
  shirt: ['size', 'brand'],
}

function AddItemForm({
  categories,
  onItemCreated,
}: {
  categories: Category[]
  onItemCreated: () => void
}) {
  const [categoryName, setCategoryName] = useState('')
  const [attributes, setAttributes] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const fields = CATEGORY_FIELDS[categoryName] ?? []

  function handleCategoryChange(name: string) {
    setCategoryName(name)
    setAttributes({}) // clear old fields when category changes
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const res = await fetch('http://localhost:8000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: categoryName, attributes }),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(JSON.stringify(body.detail))
      return
    }

    setCategoryName('')
    setAttributes({})
    onItemCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded border border-gray-300 px-3 py-1.5"
          value={categoryName}
          onChange={(e) => handleCategoryChange(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        {fields.map((field) => (
          <input
            key={field}
            className="rounded border border-gray-300 px-3 py-1.5"
            placeholder={field}
            value={attributes[field] ?? ''}
            onChange={(e) => setAttributes((prev) => ({ ...prev, [field]: e.target.value }))}
            required
          />
        ))}

        <button
          type="submit"
          disabled={!categoryName}
          className="rounded bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add item
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}

export default AddItemForm
