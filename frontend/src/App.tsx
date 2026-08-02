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
    <div className="mx-auto max-w-2xl p-8 space-y-12">
      <h1 className="text-3xl font-bold">Inventory Tracker</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <AddCategoryForm onCategoryCreated={() => setCategoryRefreshCount((c) => c + 1)} />
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.id} className="rounded border border-gray-200 px-3 py-1.5">
              {c.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Items</h2>
        <AddItemForm
          categories={categories}
          onItemCreated={() => setRefreshCount((c) => c + 1)}
        />
        <ul className="space-y-2">
          {items.map((item) => {
            const category = categories.find((c) => c.id === item.category_id)
            return (
              <li
                key={item.id}
                className="flex items-center justify-between rounded border border-gray-200 px-4 py-2"
              >
                <div>
                  <p className="font-medium">
                    #{item.id} — {category?.name ?? 'unknown category'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {Object.entries(item.attributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </p>
                </div>
                <select
                  className="rounded border border-gray-300 px-2 py-1"
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export default App
