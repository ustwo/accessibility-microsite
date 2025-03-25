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

  // Group patterns by category
  const patternsByCategory = patterns.reduce((acc, pattern) => {
    const category = pattern.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pattern);
    return acc;
  }, {} as Record<string, typeof patterns>);

  // Get sorted categories
  const categories = Object.keys(patternsByCategory).sort();

  return (
    <Layout title="Accessibility Patterns">
      <section className="content-section">
        <div className="container container-content">
          <p className="mb-6 subtitle">
            Discover reusable accessibility patterns that solve common design
            challenges. Each pattern includes guidance on where and how to apply them.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="container container-full">
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{category}</h2>
              <div className="grid grid-cols-1 patterns-grid gap-8">
                {patternsByCategory[category].map((pattern) => (
                  <div key={pattern.id} className="card">
                    <h3>{pattern.name}</h3>
                    {pattern.where && (
                      <div className="mt-2 mb-4">
                        <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                          Where: {pattern.where}
                        </span>
                      </div>
                    )}
                    <p>{pattern.description}</p>

                    {/* Display LinkyDinks if available */}
                    {pattern.linkyDinks && pattern.linkyDinks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Linky Dinks:</h4>
                        <ul className="list-disc pl-4">
                          {pattern.linkyDinks.map((link, index) => (
                            <li key={index} className="mb-1">
                              <a 
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-primary hover:text-secondary"
                              >
                                {link.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
