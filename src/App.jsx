import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-500 to-white">
      {/* Header with Indian pattern */}
      <header className="bg-saffron-500 text-white py-4 shadow-lg relative">
        <div className="absolute inset-0 opacity-10" 
             style={{backgroundImage: "url('/src/assets/patterns/mandala-bg.svg')"}}>
        </div>
        <div className="container mx-auto px-4 relative">
          <h1 className="font-heading text-3xl md:text-4xl text-center">
            Budget<span className="text-turmeric-300">Bandhan</span>
          </h1>
          <p className="text-center text-sm mt-1 italic">
            "Bandhan budget ka, sukoon dil ka"
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-decorative text-4xl md:text-5xl text-saffron-600 mb-4">
              AI-Powered Wedding Budget Estimator
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Plan your dream Indian wedding with data-driven insights
            </p>
            <button className="btn-primary text-lg px-8 py-3">
              Start Planning
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="card text-center">
              <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-heading text-xl text-saffron-600 mb-2">Smart Budget</h3>
              <p className="text-gray-600">Data-driven estimates based on city, venue & guest count</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-heading text-xl text-emerald-600 mb-2">Decor Library</h3>
              <p className="text-gray-600">Browse Indian wedding decor with real cost insights</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-turmeric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-heading text-xl text-turmeric-600 mb-2">Guest Manager</h3>
              <p className="text-gray-600">RSVP tracking with automatic food cost updates</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with mehendi pattern */}
      <footer className="bg-saffron-800 text-white mt-12 py-6 relative">
        <div className="absolute inset-0 opacity-5" 
             style={{backgroundImage: "url('/src/assets/patterns/mehendi-border.svg')"}}>
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p>© 2026 BudgetBandhan. All rights reserved.</p>
          <p className="text-sm mt-2 text-saffron-200">
            Made with ❤️ for Indian Weddings
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App