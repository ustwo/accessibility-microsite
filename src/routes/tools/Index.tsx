import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";
import {
  fetchAccessibilityTools,
  type AccessibilityTool,
  getToolsFilterOptions,
} from "../../utils/googleSheets";
import LoadingSpinner from "../../components/LoadingSpinner";

// ScrollToTop component that uses React Router's useLocation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function ToolsIndex() {
  const [tools, setTools] = useState<AccessibilityTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDiscipline, setFilterDiscipline] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<{
    disciplines: string[];
    sources: string[];
  }>({ disciplines: [], sources: [] });

  useEffect(() => {
    async function loadTools() {
      try {
        console.log("Starting to fetch accessibility tools...");
        setLoading(true);
        const toolsData = await fetchAccessibilityTools();
        console.log("Tools data received:", toolsData);
        setTools(toolsData);

        // Extract available filter options
        const filterOptions = getToolsFilterOptions(toolsData);
        console.log("Filter options:", filterOptions);
        setAvailableFilters(filterOptions);
      } catch (err) {
        console.error("Error loading tools:", err);
        setError("Failed to load tools. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadTools();
  }, []);


  // Apply filters to tools
  const filteredTools = tools.filter((tool) => {
    if (filterDiscipline && !tool.discipline.includes(filterDiscipline)) {
      return false;
    }
    return true;
  });

  // Debug output
  console.log("Current tools state:", tools);
  console.log("Filtered tools:", filteredTools);
  console.log("Loading:", loading, "Error:", error);

  return (
    <Layout title="Accessibility Tools">
      <ScrollToTop />
      <Helmet>
        <title>Accessibility Tools - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="A collection of accessibility testing and development tools recommended by ustwo."
        />
      </Helmet>
      {/* Filters */}
      <div className="filters-bar">
        <div className="container container-content">
          <div className="filters-container">
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="disciplineFilter">Discipline:</label>
                <select
                  id="disciplineFilter"
                  value={filterDiscipline || ""}
                  onChange={(e) => setFilterDiscipline(e.target.value || null)}
                >
                  <option value="">All Disciplines</option>
                  {availableFilters.disciplines.map((discipline) => (
                    <option key={discipline} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="button button-secondary"
                onClick={() => {
                  setFilterDiscipline(null);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="content-section" aria-labelledby="tools-heading">
        <div className="container container-content">
          <p className="intro-text">
            These are the tools we recommend for testing and developing
            accessible digital products.
          </p>

          {/* Loading and error states */}
          {loading && <LoadingSpinner message="Loading tools..." />}
          {error && <p className="error">{error}</p>}
        </div>
        
        {/* Tool listings - now outside the constraining container */}
        {!loading && !error && (
          <>
            <div className="container container-content">
              <div className="tools-count mb-3">
                <p>
                  Showing {filteredTools.length} of {tools.length} tools
                </p>
              </div>
            </div>
            
            {/* Use the patterns-by-section class to go full width */}
            <div className="patterns-by-section">
              <div className="pattern-section mb-6">
                <div className="patterns-grid">
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                      <div key={tool.id} className="card pattern-card">
                        <h3 className="tool-name">{tool.name}</h3>
                        <p className="tool-description">{tool.description}</p>

                        {tool.url &&
                          tool.url !== "Link" &&
                          tool.url !== "WIP" && (
                            <a
                              href={
                                tool.url.startsWith("http")
                                  ? tool.url
                                  : `https://${tool.url}`
                              }
                              className="tool-link button"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Tool
                            </a>
                          )}

                        <div className="tool-meta">
                          {tool.discipline.length > 0 && (
                            <div className="tool-disciplines">
                              <strong>For:</strong> {tool.discipline.join(", ")}
                            </div>
                          )}
                          {tool.source && (
                            <div className="tool-source">
                              <strong>Source:</strong> {tool.source}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="container container-content">
                      <p>No tools match the selected filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
