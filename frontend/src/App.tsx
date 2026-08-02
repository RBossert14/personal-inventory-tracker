import { useEffect, useState } from 'react'
import AddItemForm from './AddItemForm'

type Item = {
  id: number
  category_id: number
  status: string
  attributes: Record<string, unknown>
}

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    fetch('http://localhost:8000/items')
      .then((res) => res.json())
      .then(setItems)
  }, [refreshCount]) // re-fetch whenever refreshCount changes, e.g. after adding an item

  return (
    <div>
      <h1>Inventory</h1>
      <AddItemForm onItemCreated={() => setRefreshCount((c) => c + 1)} />
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            #{item.id} — category {item.category_id} — {item.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
