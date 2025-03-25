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
          <div className="grid grid-cols-1 tools-grid gap-6">
            {tools.map((tool) => (
              <div key={tool.id} className="card light-background">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="mt-4">
                  <a
                    href={tool.url}
                    className="button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                    Category: {tool.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                    Cost: {tool.cost}
                  </span>
                  {tool.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 bg-gray-200 rounded text-sm"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-secondary text-light rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
