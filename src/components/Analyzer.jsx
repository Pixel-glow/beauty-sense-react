import React, { useState, useRef } from 'react';

export default function Analyzer({ onAnalyze, loading, error }) {
  const [reviewText, setReviewText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedReviews, setUploadedReviews] = useState([]);
  const fileInputRef = useRef(null);

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploadedFile(file.name);

  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    const lines = text.split('\n').filter(line => line.trim());

    // Skip header row
    const dataLines = lines.slice(1);
    
    // Parse CSV properly - find the review column
    const reviews = dataLines.map(line => {
      // Split by comma but respect quotes
      const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      
      // Remove quotes and find longest text (likely the review)
      const cleaned = parts.map(p => p.replace(/^"|"$/g, '').trim());
      
      // Take the longest part (reviews are usually the longest column)
      const review = cleaned.reduce((a, b) => a.length > b.length ? a : b, '');
      
      return review;
    }).filter(review => review.length > 10);

    setUploadedReviews(reviews);
    console.log('Parsed reviews:', reviews.slice(0, 3));
  };
  
  reader.readAsText(file);
};

  const handleAnalyze = () => {
    const textReviews = reviewText
      .split('\n')
      .filter(line => line.trim().length > 0);

    const allReviews = [...uploadedReviews, ...textReviews];

    if (allReviews.length === 0) {
      alert('Please paste reviews or upload a CSV file first! 💕');
      return;
    }

    onAnalyze(allReviews);
  };

  const clearAll = () => {
    setReviewText('');
    setUploadedFile(null);
    setUploadedReviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="analyzer-section" className="relative py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Analyze Customer Sentiment
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Paste reviews or upload a CSV to unlock deep insights about what your customers truly feel about your products.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              <span className="text-white font-medium">AI Sentiment Analyzer</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Real-time Analysis</span>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6">
            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Paste Customer Reviews
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="6"
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none text-gray-700 placeholder-gray-400"
                placeholder="Paste your beauty product reviews here... (e.g., 'This lipstick is amazing! The color lasts all day and feels so moisturizing.')"
              />
            </div>

            {/* CSV Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📄 Or Upload CSV File
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 cursor-pointer transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-medium">Choose File</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploadedFile && (
                  <span className="text-sm text-green-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {uploadedFile} ({uploadedReviews.length} reviews)
                  </span>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-800 mb-1">Analysis Error</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Analyze Reviews</span>
                  </>
                )}
              </button>

              {(reviewText || uploadedReviews.length > 0) && !loading && (
                <button
                  onClick={clearAll}
                  className="px-6 py-4 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-all"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
