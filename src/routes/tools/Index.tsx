import { useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";
import {
  getToolsFilterOptions,
} from "../../utils/googleSheets";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useData } from "../../context/DataContext";

export default function ToolsIndex() {
  const { tools, isLoadingTools, error, refreshData } = useData();
  const [filterDiscipline, setFilterDiscipline] = useState<string | null>(null);
  
  // Compute filter options directly from the tools data
  const availableFilters = getToolsFilterOptions(tools);

  // Apply discipline filter to tools
  const filteredTools = tools.filter((tool) => {
    if (filterDiscipline && !tool.discipline.includes(filterDiscipline)) {
      return false;
    }
    return true;
  });

  return (
    <Layout title="Accessibility Tools">
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
              
              <button 
                className="button button-secondary"
                onClick={() => refreshData()}
                aria-label="Refresh tools data"
              >
                ↻ Refresh
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
          {isLoadingTools && <LoadingSpinner message="Loading tools..." />}
          {error && <p className="error">{error}</p>}
        </div>
        
        {/* Tool listings - now outside the constraining container */}
        {!isLoadingTools && !error && (
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

                        {tool.url && (
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
                            Visit tool
                          </a>
                        )}

                        <div className="tool-meta">
                          {tool.discipline.length > 0 && (
                            <div className="tool-disciplines">
                              <strong>For:</strong> {tool.discipline.join(", ")}
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
