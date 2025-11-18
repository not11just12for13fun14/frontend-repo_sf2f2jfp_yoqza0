import Header from './components/Header'
import Converter from './components/Converter'
import RatesTable from './components/RatesTable'
import History from './components/History'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.10),transparent_30%)]" aria-hidden="true"></div>

      <Header />

      <main className="relative z-0 pt-10 pb-20 px-4">
        <section className="mx-auto max-w-4xl text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Instant Currency Exchange</h1>
          <p className="mt-4 text-blue-200">Convert between major currencies and view live market rates. Simple, fast, and accurate.</p>
        </section>

        <Converter />
        <RatesTable />
        <History />

        <footer className="text-center mt-14 text-blue-300/60">
          Rates by exchangerate.host • Demo only
        </footer>
      </main>
    </div>
  )
}

export default App
