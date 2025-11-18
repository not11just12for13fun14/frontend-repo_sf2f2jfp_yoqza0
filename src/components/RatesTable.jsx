import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function RatesTable() {
  const [base, setBase] = useState('USD')
  const [symbols] = useState(['EUR','GBP','JPY','AUD','CAD','CHF','CNY','INR','BRL'])
  const [rates, setRates] = useState({})
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams({ base, symbols: symbols.join(',') })
    const res = await fetch(`${BACKEND}/api/rates?${params.toString()}`)
    const data = await res.json()
    setRates(data.rates || {})
    setLoading(false)
  }

  useEffect(() => { load() // eslint-disable-next-line
  }, [base])

  return (
    <section id="rates" className="mx-auto max-w-4xl p-6 mt-10 bg-slate-900/60 border border-white/10 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Live Rates</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm text-blue-200">Base</label>
          <select value={base} onChange={e=>setBase(e.target.value)} className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-white">
            {['USD','EUR','GBP','JPY','AUD','CAD','CHF'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={load} className="px-3 py-2 rounded-lg bg-slate-800 text-blue-200 border border-white/10">Refresh</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-blue-200">
          <thead className="text-xs uppercase text-blue-300">
            <tr>
              <th className="py-2 px-3 border-b border-white/10">Currency</th>
              <th className="py-2 px-3 border-b border-white/10">Rate</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="2" className="py-4 text-center">Loading...</td></tr>
            ) : (
              symbols.map(sym => (
                <tr key={sym} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 border-b border-white/5">{sym}</td>
                  <td className="py-2 px-3 border-b border-white/5">{rates?.[sym]?.toFixed ? rates[sym].toFixed(4) : rates?.[sym] ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RatesTable
