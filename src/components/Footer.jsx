import React from 'react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-r from-pink-500 to-purple-500 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Beauty Business?
        </h2>
        <p className="text-white/90 mb-8 max-w-xl mx-auto">
          Join leading beauty brands using AI-powered sentiment analysis to understand their customers better.
        </p>
        <button
          onClick={scrollToTop}
          className="px-10 py-4 rounded-full bg-white text-pink-600 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          Try Now
        </button>
        
        <div className="mt-10 pt-8 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
          <span>© 2025 Beauty Sense</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
