interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div 
      className="loading-container"
      role="status"
      aria-live="polite"
    >
      <div 
        className="spinner"
        aria-hidden="true"
      />
      <p className="loading-message">
        {message}
      </p>
    </div>
  );
} 