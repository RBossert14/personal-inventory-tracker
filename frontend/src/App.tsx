import { useEffect, useState } from 'react'

type Item = {
  id: number
  category_id: number
  status: string
  attributes: Record<string, unknown>
}

function App() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/items')
      .then((res) => res.json())
      .then(setItems)
  }, [])

  return (
    <div>
      <h1>Inventory</h1>
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
