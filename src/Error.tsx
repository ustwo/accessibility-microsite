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
    <div className="error-container">
      <div className="container container-content">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{errorMessage}</i>
        </p>
        <button onClick={() => window.location.href = '/'}>
          Return to Home
        </button>
      </div>
    </div>
  );
} 