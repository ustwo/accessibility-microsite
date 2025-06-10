import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function Error() {
  const error = useRouteError();
  console.error(error);

  // Generate an appropriate error message based on the error type
  let errorMessage = "An unknown error occurred";
  
  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
  } else {
    errorMessage = String(error);
  }

  return (
    <div className="error-container" role="alert">
      <div className="container container-content">
        <h1 id="error-heading">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <strong>Error details:</strong> {errorMessage}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="button"
          aria-describedby="error-heading"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
} 