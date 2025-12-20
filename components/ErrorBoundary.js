import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 1. You could send this to your server or Sentry here
    console.error('CRITICAL_UI_ERROR:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    // 2. Clear state and try to re-render
    this.setState({ hasError: false, error: null });
    
    // Optional: Force a hard refresh if the app is stuck
    // window.location.reload(); 
  };

  render() {
    if (this.state.hasError) {
      // 3. Check if a custom fallback UI was passed as a prop
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 4. Improved Default Fallback UI
      return (
        <div className="error-boundary-container" style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>Oops! Something went wrong.</h2>
            <p style={styles.text}>
              {this.state.error?.message || "We encountered an unexpected error while loading this section."}
            </p>
            
            <div style={styles.buttonGroup}>
              <button onClick={this.handleReset} style={styles.buttonPrimary}>
                Try Again
              </button>
              
              <button 
                onClick={() => window.location.href = '/'} 
                style={styles.buttonSecondary}
              >
                Back to Home
              </button>
            </div>

            {/* Only show technical details in development mode */}
            {process.env.NODE_ENV === 'development' && (
              <details style={styles.details}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Clean, organized styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    padding: '20px',
  },
  card: {
    maxWidth: '500px',
    width: '100%',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    border: '1px solid #eee'
  },
  icon: { fontSize: '48px', marginBottom: '10px' },
  title: { color: '#333', fontSize: '24px', margin: '10px 0' },
  text: { color: '#666', marginBottom: '25px' },
  buttonGroup: { display: 'flex', gap: '10px', justifyContent: 'center' },
  buttonPrimary: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  buttonSecondary: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  details: {
    marginTop: '20px',
    textAlign: 'left',
    fontSize: '12px',
    color: 'red',
    backgroundColor: '#fff5f5',
    padding: '10px'
  }
};

export default ErrorBoundary;