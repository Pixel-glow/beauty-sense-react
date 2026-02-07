import React, { useState } from 'react';
import './App.css';
import Hero from './components/Hero';
import Analyzer from './components/Analyzer';
import Results from './components/Results';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (reviews) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('https://beauty-sense-react.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      setResults(data);
      
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (err) {
      setError(err.message || 'Could not connect to backend. Make sure it\'s running!');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Decorative gradients */}
      <div className="fixed left-0 top-0 w-32 h-full bg-gradient-to-r from-pink-200/40 to-transparent pointer-events-none" />
      <div className="fixed right-0 top-0 w-32 h-full bg-gradient-to-l from-purple-200/40 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-pink-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xl">💄</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Beauty Sense
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-pink-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-pink-600 transition-colors">About</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10">
        <Hero />
        <Analyzer onAnalyze={handleAnalyze} loading={loading} error={error} />
        {results && <Results data={results} />}
        <Features />
        <Footer />
      </div>
    </div>
  );
}

export default App;
