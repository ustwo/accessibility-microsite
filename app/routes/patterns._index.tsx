import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import { fetchAccessibilityPatterns } from "~/utils/edgeGoogleSheets";
import { getMockData } from "~/data/mockData";

export async function loader() {
  // Try to fetch from our Edge-compatible Google Sheets API, fall back to mock data
  try {
    const patterns = await fetchAccessibilityPatterns();
    
    // If we get an empty array (API error or no data), use mock data
    if (patterns.length === 0) {
      return json({ patterns: getMockData().patterns });
    }
    
    return json({ patterns });
  } catch (error) {
    console.error("Error loading patterns:", error);
    return json({ patterns: getMockData().patterns });
  }
}

export default function PatternsIndex() {
  const { patterns } = useLoaderData<typeof loader>();
  
  return (
    <Layout title="Accessibility Patterns">
      <div className="patterns-container">
        <p className="mb-6">
          Discover reusable accessibility patterns that solve common design challenges. Each pattern includes examples, code, and WCAG success criteria.
        </p>
        
        <div className="mb-8 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl mb-4">Filter Patterns</h2>
          <p>Search and filter functionality will be implemented here.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {patterns.map((pattern) => (
            <div key={pattern.id} className="card">
              <h3>{pattern.name}</h3>
              <p>{pattern.description}</p>
              
              <div className="mt-4">
                <h4>Example:</h4>
                <p>{pattern.example}</p>
              </div>
              
              <div className="mt-4">
                <h4>Code Sample:</h4>
                <pre className="p-4 bg-dark text-light overflow-x-auto rounded">
                  <code>{pattern.code}</code>
                </pre>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {pattern.wcagCriteria.map((criteria) => (
                  <span key={criteria} className="px-2 py-1 bg-primary text-light rounded text-sm">
                    WCAG {criteria}
                  </span>
                ))}
                {pattern.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-secondary text-light rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 