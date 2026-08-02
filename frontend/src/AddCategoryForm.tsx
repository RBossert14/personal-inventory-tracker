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
    <form onSubmit={handleSubmit}>
      <input
        placeholder="New category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Add category</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

export default AddCategoryForm
