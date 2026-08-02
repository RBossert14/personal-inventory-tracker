import { useEffect, useState } from 'react'
import AddItemForm from './AddItemForm'

type Item = {
  id: number
  category_id: number
  status: string
  attributes: Record<string, unknown>
}

const STATUS_OPTIONS = ['not listed', 'listed', 'sold']

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    fetch('http://localhost:8000/items')
      .then((res) => res.json())
      .then(setItems)
  }, [refreshCount]) // re-fetch whenever refreshCount changes, e.g. after adding an item

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
      <h1>Inventory</h1>
      <AddItemForm onItemCreated={() => setRefreshCount((c) => c + 1)} />
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
