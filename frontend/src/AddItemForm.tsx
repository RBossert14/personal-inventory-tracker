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
    <form onSubmit={handleSubmit}>
      <select value={categoryName} onChange={(e) => handleCategoryChange(e.target.value)} required>
        <option value="">Select a category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>

      {fields.map((field) => (
        <input
          key={field}
          placeholder={field}
          value={attributes[field] ?? ''}
          onChange={(e) => setAttributes((prev) => ({ ...prev, [field]: e.target.value }))}
          required
        />
      ))}

      <button type="submit" disabled={!categoryName}>Add item</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

export default AddItemForm
