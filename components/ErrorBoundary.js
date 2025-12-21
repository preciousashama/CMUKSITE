'use client';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Senior Note: Class components are still mandatory for Error Boundaries.
 * This version adds automated telemetry, better recovery logic, and accessibility.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 1. Automated Telemetry
    // In production, integrate with Sentry, LogRocket, or a custom API route.
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = async (error, errorInfo) => {
    const errorLog = {
      message: error.message,
      stack: errorInfo.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      tags: {
        env: process.env.NODE_ENV,
        component: this.props.componentName || 'Unknown',
      }
    };

    // Replace with your logging endpoint
    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/v1/logs/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorLog),
        });
      } catch (e) {
        console.error('Failed to report error:', e);
      }
    } else {
      console.group('🔴 CRITICAL_UI_ERROR');
      console.table(errorLog.tags);
      console.error(error, errorInfo.componentStack);
      console.groupEnd();
    }
  };

  handleReset = () => {
    // 2. Exponential backoff/safety logic
    // If it crashes more than twice, we force a refresh to clear memory/state.
    if (this.state.errorCount >= 2) {
      window.location.reload();
    } else {
      this.setState((prev) => ({ 
        hasError: false, 
        error: null,
        errorCount: prev.errorCount + 1 
      }));
    }
  };

  render() {
    if (this.state.hasError) {
      // 3. Custom Fallback Override
      if (this.props.fallback) return this.props.fallback;

      const isWebGL = this.state.error?.message?.toLowerCase().includes('webgl') || 
                      this.state.error?.message?.toLowerCase().includes('three');

      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="flex flex-col items-center justify-center p-8 md:p-12 min-h-[400px] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center"
        >
          {/* Icon Section */}
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mb-6 animate-pulse">
            ⚠️
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
            Visualizer Encountered a Snag
          </h2>
          
          <p className="text-slate-600 max-w-md mb-10 leading-relaxed">
            {isWebGL 
              ? "Your graphics driver or browser struggled to render the 3D Studio. Try updating your browser or disabling battery-saver mode."
              : "Something unexpected happened. Our team has been notified, and we're working on a fix."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={this.handleReset}
              className="px-10 py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-200"
            >
              {this.state.errorCount > 0 ? 'Retry Loading' : 'Try Again'}
            </button>
            
            <button
              onClick={() => window.location.href = '/support'}
              className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 active:scale-95 transition-all"
            >
              Contact Support
            </button>
          </div>

          {/* Dev Debugging - Strictly filtered */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-10 p-6 bg-slate-900 text-red-400 text-left text-xs font-mono rounded-2xl overflow-auto max-w-3xl w-full border border-slate-800 shadow-2xl">
              <summary className="cursor-pointer font-bold uppercase mb-2 text-slate-400">Stack Trace</summary>
              <pre className="whitespace-pre-wrap">{this.state.error?.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// 4. Prop Validation for Scalability
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  componentName: PropTypes.string, // Used for identifying which part of the site crashed in logs
};

export default ErrorBoundary;