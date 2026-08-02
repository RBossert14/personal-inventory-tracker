import { useEffect, useState } from 'react'
import AddItemForm from './AddItemForm'
import AddCategoryForm from './AddCategoryForm'

type Item = {
  id: number
  category_id: number
  status: string
  attributes: Record<string, unknown>
}

type Category = {
  id: number
  name: string
}

const STATUS_OPTIONS = ['not listed', 'listed', 'sold']

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [refreshCount, setRefreshCount] = useState(0)

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryRefreshCount, setCategoryRefreshCount] = useState(0)

  useEffect(() => {
    fetch('http://localhost:8000/items')
      .then((res) => res.json())
      .then(setItems)
  }, [refreshCount]) // re-fetch whenever refreshCount changes, e.g. after adding an item

  useEffect(() => {
    fetch('http://localhost:8000/categories')
      .then((res) => res.json())
      .then(setCategories)
  }, [categoryRefreshCount])

  async function handleStatusChange(itemId: number, status: string) {
    await fetch(`http://localhost:8000/items/${itemId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setRefreshCount((c) => c + 1)
  }

  return (
    <div>
      <h1>Categories</h1>
      <AddCategoryForm onCategoryCreated={() => setCategoryRefreshCount((c) => c + 1)} />
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      <h1>Inventory</h1>
      <AddItemForm
        categories={categories}
        onItemCreated={() => setRefreshCount((c) => c + 1)}
      />
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            #{item.id} — category {item.category_id} —{' '}
            <select
              value={item.status}
              onChange={(e) => handleStatusChange(item.id, e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
