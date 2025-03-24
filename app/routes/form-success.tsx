import { json, LoaderFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

/**
 * This is a special route that handles form submission redirects
 * It receives the actual destination as a URL parameter and immediately redirects browser-side
 */
export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const destination = url.searchParams.get("to");
  
  if (!destination) {
    return json({ destination: "/", error: "No destination provided" });
  }
  
  return json({ destination, error: null });
}

export default function FormSuccess() {
  const { destination, error } = useLoaderData<typeof loader>();
  
  // Use client-side navigation effect to redirect
  useEffect(() => {
    console.log("===== REDIRECTING TO:", destination);
    
    if (!error) {
      // Small delay to ensure this renders first
      const timer = setTimeout(() => {
        window.location.href = destination;
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [destination, error]);
  
  // Display a loading message briefly
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl mb-4">Submission Successful!</h1>
      <p>Redirecting you to the success page...</p>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
} 