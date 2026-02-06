import React from 'react';

export default function Results({ data }) {
  if (!data) return null;

  const { positive, neutral, negative, themes, emotions, recommendation } = data;

  return (
    <section id="results-section" className="relative py-16 px-6 bg-gradient-to-b from-white to-pink-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Sentiment Analysis Results
        </h3>

        {/* Sentiment Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Positive */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-400 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">😊</span>
              <span className="text-5xl font-bold text-gray-900">{positive}%</span>
            </div>
            <h4 className="font-semibold text-gray-700 mb-2">Positive Sentiment</h4>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${positive}%` }}
              />
            </div>
          </div>

          {/* Neutral */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">😐</span>
              <span className="text-5xl font-bold text-gray-900">{neutral}%</span>
            </div>
            <h4 className="font-semibold text-gray-700 mb-2">Neutral Sentiment</h4>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000"
                style={{ width: `${neutral}%` }}
              />
            </div>
          </div>

          {/* Negative */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-400 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">😞</span>
              <span className="text-5xl font-bold text-gray-900">{negative}%</span>
            </div>
            <h4 className="font-semibold text-gray-700 mb-2">Negative Sentiment</h4>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-1000"
                style={{ width: `${negative}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-pink-100">
          <h4 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analysis</h4>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Themes */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
                Top Mentioned Themes
              </h5>
              <div className="space-y-3">
                {themes && Object.entries(themes)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([theme, count]) => (
                    <div key={theme} className="flex items-center justify-between">
                      <span className="capitalize text-gray-600">{theme}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-pink-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                            style={{ width: `${Math.min((count / data.total) * 100 * 2, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Emotions */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Emotional Breakdown
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {emotions && Object.entries(emotions).map(([emotion, count]) => {
                  const emojis = {
                    joy: '😊',
                    trust: '🤝',
                    disappointment: '😔',
                    satisfaction: '✨'
                  };
                  return (
                    <div key={emotion} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">{emojis[emotion] || '💕'}</div>
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-600 capitalize">{emotion}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          {recommendation && (
            <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                AI Recommendation
              </h5>
              <p className="text-gray-700 leading-relaxed">{recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
