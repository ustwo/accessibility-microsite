import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { testJwtGeneration } from "~/utils/edgeGoogleSheets";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { BackLink } from "~/components/BackLink";

export async function loader() {
  const result = await testJwtGeneration();
  return json(result);
}

export default function TestJwtRoute() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  
  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>JWT Generation Test</h1>
      
      <BackLink to="/sheets-debug" />
      
      {isLoading ? (
        <LoadingSpinner message="Testing JWT generation..." />
      ) : (
        <>
          <div style={{
            padding: '1rem',
            backgroundColor: data.success ? '#e6ffe6' : '#ffe6e6',
            border: `1px solid ${data.success ? 'green' : 'red'}`,
            borderRadius: '4px',
            marginTop: '1rem'
          }}>
            <h3>Status: {data.success ? 'Success' : 'Failed'}</h3>
            <p><strong>Message:</strong> {data.message}</p>
            {data.jwt && (
              <div>
                <p><strong>JWT Preview:</strong></p>
                <code>{data.jwt}</code>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h2>Debug Information</h2>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '1rem', 
              overflow: 'auto',
              maxHeight: '400px' 
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
} 