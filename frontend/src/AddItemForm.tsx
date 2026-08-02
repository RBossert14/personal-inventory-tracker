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

// mirrors CONDITION_OPTIONS on the backend
const CONDITION_OPTIONS = ['new', 'like new', 'good', 'fair', 'poor']

function AddItemForm({
  categories,
  onItemCreated,
}: {
  categories: Category[]
  onItemCreated: () => void
}) {
  const [categoryName, setCategoryName] = useState('')
  const [attributes, setAttributes] = useState<Record<string, string>>({})
  const [condition, setCondition] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0) // bumped to force the file input to remount/clear
  const [error, setError] = useState<string | null>(null)

  const fields = CATEGORY_FIELDS[categoryName] ?? []

  function handleCategoryChange(name: string) {
    setCategoryName(name)
    setAttributes({}) // clear old fields when category changes
  }

  async function handleSuggest() {
    if (!imageFile) return
    setError(null)

    const formData = new FormData()
    formData.append('file', imageFile)

    const res = await fetch('http://localhost:8000/classify', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      setError('Could not classify image')
      return
    }

    const result = await res.json()
    if (result.category[0]) {
      setCategoryName(result.category[0].label)
      setAttributes({})
    }
    if (result.condition[0]) {
      setCondition(result.condition[0].label)
    }
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const res = await fetch('http://localhost:8000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: categoryName, attributes, condition: condition || null }),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(JSON.stringify(body.detail))
      return
    }

    const createdItem = await res.json()

    if (imageFile) {
      const uploadData = new FormData()
      uploadData.append('file', imageFile)
      await fetch(`http://localhost:8000/items/${createdItem.id}/image`, {
        method: 'POST',
        body: uploadData,
      })
    }

    setCategoryName('')
    setAttributes({})
    setCondition('')
    setImageFile(null)
    setFileInputKey((k) => k + 1)
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

        <select
          className="rounded border border-gray-300 px-3 py-1.5"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="">Condition (optional)</option>
          {CONDITION_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!categoryName}
          className="rounded bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add item
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          key={fileInputKey}
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="text-gray-600 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-700"
        />
        <button
          type="button"
          onClick={handleSuggest}
          disabled={!imageFile}
          className="rounded bg-gray-600 px-3 py-1.5 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suggest
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}

export default AddItemForm
