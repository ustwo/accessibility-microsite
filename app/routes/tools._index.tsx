import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import { fetchAccessibilityTools } from "~/utils/edgeGoogleSheets";
import { getMockData } from "~/data/mockData";

export async function loader() {
  // Try to fetch from our Edge-compatible Google Sheets API, fall back to mock data
  try {
    const tools = await fetchAccessibilityTools();

    // If we get an empty array (API error or no data), use mock data
    if (tools.length === 0) {
      return json({ tools: getMockData().tools });
    }

    return json({ tools });
  } catch (error) {
    console.error("Error loading tools:", error);
    return json({ tools: getMockData().tools });
  }
}

export default function ToolsIndex() {
  const { tools } = useLoaderData<typeof loader>();

  // Group tools by source for easier browsing
  const toolsBySource = tools.reduce((acc, tool) => {
    const source = tool.source || 'Other';
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  // Get sorted sources
  const sources = Object.keys(toolsBySource).sort();

  return (
    <Layout title="Accessibility Tools">
      <section className="content-section">
        <div className="container container-content">
          <p className="mb-6 subtitle">
            Discover tools that can help you evaluate, test, and improve the
            accessibility of your digital products. From automated testing tools
            to screen readers and more.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="container container-full">
          {sources.map((source) => (
            <div key={source} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                {source === 'ustwo' ? 'ustwo Tools' : source === 'external' ? 'External Tools' : source}
              </h2>
              <div className="grid grid-cols-1 tools-grid gap-6">
                {toolsBySource[source].map((tool) => (
                  <div key={tool.id} className="card light-background">
                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>
                    
                    {/* Tool info section */}
                    <div className="mt-4">
                      {tool.url && tool.url !== "Link" && tool.url !== "WIP" && (
                        <a
                          href={tool.url}
                          className="button"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                        </a>
                      )}
                      {(tool.url === "Link" || tool.url === "WIP") && (
                        <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                          {tool.url === "WIP" ? "Work in Progress" : "Internal Link"}
                        </span>
                      )}
                    </div>
                    
                    {/* Discipline tags */}
                    {tool.discipline && tool.discipline.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tool.discipline.map((disc) => (
                          <span
                            key={disc}
                            className="px-2 py-1 bg-secondary text-light rounded text-sm"
                          >
                            {disc}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Notes section (if available) */}
                    {tool.notes && (
                      <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-3 rounded">
                        <strong>Notes:</strong> {tool.notes}
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
