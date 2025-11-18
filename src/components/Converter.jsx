import { useEffect, useMemo, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function CurrencySelect({ label, value, onChange, options }) {
  return (
    <div className="w-full">
      <label className="block text-sm text-blue-200 mb-1">{label}</label>
      <select
        className="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}

function Converter() {
  const [symbols, setSymbols] = useState(["USD","EUR","GBP","JPY","AUD","CAD","CHF","CNY","INR","BRL"])
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [amount, setAmount] = useState(100)
  const [rate, setRate] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Preload latest rates for the default selection
    fetchRates()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchRates = async () => {
    try {
      setError('')
      const params = new URLSearchParams({ base: from, symbols: to })
      const res = await fetch(`${BACKEND}/api/rates?${params.toString()}`)
      const data = await res.json()
      setRate(data.rates?.[to] ?? null)
    } catch (e) {
      setError('Failed to load rates')
    }
  }

  const convert = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${BACKEND}/api/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_currency: from, to_currency: to, amount: Number(amount) })
      })
      if (!res.ok) throw new Error('Conversion failed')
      const data = await res.json()
      setRate(data.rate)
      setResult(data.result)
      // Refresh history implicitly by emitting event
      document.dispatchEvent(new CustomEvent('exchange:updated'))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const swapped = () => {
    const f = from
    setFrom(to)
    setTo(f)
    setResult(null)
    setRate(null)
  }

  const preview = useMemo(() => {
    if (rate == null || amount === '') return null
    return (Number(amount) * rate).toFixed(2)
  }, [rate, amount])

  return (
    <section id="convert" className="relative">
      <div className="mx-auto max-w-4xl p-6 bg-slate-900/60 border border-white/10 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <CurrencySelect label="From" value={from} onChange={setFrom} options={symbols} />
          <button onClick={swapped} className="h-10 px-4 rounded-lg bg-blue-600 text-white mt-6">Swap</button>
          <CurrencySelect label="To" value={to} onChange={setTo} options={symbols} />
          <div className="w-full">
            <label className="block text-sm text-blue-200 mb-1">Amount</label>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button onClick={convert} disabled={loading} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white">
            {loading ? 'Converting...' : 'Convert'}
          </button>
          <button onClick={fetchRates} className="px-4 py-2 rounded-lg bg-slate-800 text-blue-200 border border-white/10">Refresh Rate</button>
          {rate != null && (
            <p className="text-blue-200">Rate: 1 {from} = {rate.toFixed(4)} {to}</p>
          )}
        </div>

        {error && <p className="mt-3 text-red-300">{error}</p>}

        {(result != null || preview != null) && (
          <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-white/10 text-white">
            <p className="text-sm text-blue-200">Converted amount</p>
            <p className="text-3xl font-semibold">{(result ?? preview)} {to}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Converter
