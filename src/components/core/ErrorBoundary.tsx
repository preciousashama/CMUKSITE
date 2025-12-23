'use client';

import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorCount: 0 }; // errorCount updated in handleReset
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    const errorLog = {
      message: error.message,
      stack: errorInfo.componentStack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
      tags: {
        env: process.env.NODE_ENV,
        component: this.props.componentName || 'Global_Wrapper',
      }
    };

    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/v1/logs/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorLog),
        });
      } catch (e) {
        console.error('Telemetry Failed:', e);
      }
    } else {
      console.group('🔴 CMUK_SYSTEM_GLITCH');
      console.table(errorLog.tags);
      console.error(error);
      console.groupEnd();
    }
  };

  handleReset = () => {
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
      if (this.props.fallback) return this.props.fallback;

      const isGraphicsError = this.state.error?.message?.toLowerCase().includes('webgl') || 
                              this.state.error?.message?.toLowerCase().includes('three');

      return (
        <div 
          role="alert" 
          className="flex flex-col items-center justify-center p-12 min-h-[500px] bg-white text-center border-4 border-brand-dark rounded-[3rem] m-4"
        >
          {/* Brand-Aligned Glitch Icon */}
          <div className="relative mb-8">
            <div className="text-8xl font-black italic text-brand-dark select-none">
              404<span className="text-brand-primary">!</span>
            </div>
            <div className="absolute inset-0 text-8xl font-black italic text-red-500 opacity-20 animate-pulse translate-x-1">
              404!
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-brand-dark mb-4">
            System <span className="text-brand-primary">Interrupted</span>
          </h2>
          
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] max-w-sm mb-12">
            {isGraphicsError 
              ? "The 3D Studio encountered a rendering conflict. Verify your hardware acceleration is active."
              : "Our digital archive has encountered a critical sync error. The dev team has been pinged."}
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={this.handleReset}
              className="px-12 py-5 bg-brand-dark text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-brand-primary transition-all shadow-2xl shadow-blue-100"
            >
              {this.state.errorCount > 0 ? 'Force Reboot' : 'Reset Interface'}
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-12 py-5 bg-slate-50 text-slate-400 font-black uppercase text-xs tracking-widest rounded-full hover:bg-slate-100 transition-all"
            >
              Return to Lobby
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 w-full max-w-2xl text-left overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-6">
               <p className="text-[10px] font-black text-red-500 uppercase mb-2">Internal_Trace_Log:</p>
               <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto">
                 {this.state.error?.message}
               </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;