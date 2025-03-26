interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div 
      className="loading-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        opacity: 1,
        animation: 'fadeIn 0.3s ease-in-out'
      }}
      role="status"
      aria-live="polite"
    >
      <div 
        className="spinner"
        style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f1f1f1',
          borderTop: '5px solid #0066cc',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} 
        aria-hidden="true"
      />
      <p style={{ 
        fontSize: '1.2rem',
        color: '#555',
        margin: '0',
        fontWeight: 500
      }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 