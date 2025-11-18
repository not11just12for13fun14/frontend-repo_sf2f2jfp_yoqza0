import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function History() {
  const [items, setItems] = useState([])

  const load = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/transactions?limit=10`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setItems([])
    }
  }

  useEffect(() => {
    load()
    const fn = () => load()
    document.addEventListener('exchange:updated', fn)
    return () => document.removeEventListener('exchange:updated', fn)
  }, [])

  return (
    <section id="history" className="mx-auto max-w-4xl p-6 mt-10 bg-slate-900/60 border border-white/10 rounded-2xl">
      <h3 className="text-white text-lg font-semibold mb-4">Recent Exchanges</h3>
      {items.length === 0 ? (
        <p className="text-blue-200">No recent transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-blue-200">
            <thead className="text-xs uppercase text-blue-300">
              <tr>
                <th className="py-2 px-3 border-b border-white/10">From</th>
                <th className="py-2 px-3 border-b border-white/10">To</th>
                <th className="py-2 px-3 border-b border-white/10">Amount</th>
                <th className="py-2 px-3 border-b border-white/10">Rate</th>
                <th className="py-2 px-3 border-b border-white/10">Result</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id || `${t.from_currency}-${t.to_currency}-${t.created_at}`} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 border-b border-white/5">{t.from_currency}</td>
                  <td className="py-2 px-3 border-b border-white/5">{t.to_currency}</td>
                  <td className="py-2 px-3 border-b border-white/5">{t.amount}</td>
                  <td className="py-2 px-3 border-b border-white/5">{Number(t.rate).toFixed(4)}</td>
                  <td className="py-2 px-3 border-b border-white/5">{Number(t.result).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default History
