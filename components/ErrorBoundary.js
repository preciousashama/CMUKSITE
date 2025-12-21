'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a real handover, we'd log this to an API route
    console.error('SHIPPING_STUDIO_CRASH:', error, errorInfo);
    
    // Example: Log to your backend so Precious can see bugs in her dashboard
    // fetch('/api/logs/error', { method: 'POST', body: JSON.stringify({ error, errorInfo }) });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-6">
            !
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">
            Something glitched...
          </h2>
          
          <p className="text-slate-500 max-w-md mb-8">
            {this.state.error?.message?.includes('WebGL') 
              ? "Your browser had trouble loading the 3D Studio. Please check your internet or try a different browser."
              : "An unexpected error occurred in this section."}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-8 py-3 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
            >
              Refresh Page
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-50 text-red-500 text-left text-xs font-mono rounded-lg overflow-auto max-w-full">
              {this.state.error?.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;