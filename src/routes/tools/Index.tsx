import { useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";
import { getToolsFilterOptions } from "../../utils/googleSheets";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useData } from "../../context/DataContext";
import Section from "../../components/Section";
import Grid, { Col } from "../../components/Grid";

export default function ToolsIndex() {
  const { tools, isLoadingTools, error } = useData();
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
    <Layout
      title="Recommended tools"
      introText="Our first inclusivity principle is to level-up your gear. These are the tools we recommend for testing and developing
      accessible digital products."
      theme="tools"
    >
      <Helmet>
        <title>Recommended tools - ustwo Accessibility</title>
        <meta
          name="description"
          content="A collection of accessibility testing and development tools recommended by ustwo."
        />
      </Helmet>
      {/* Filters */}
      <Section className="light-background">
        <Grid>
          <Col start={1} span={12}>
            <div className="filters-bar">
              <div className="filters-container">
                <h2 id="filters-heading" className="sr-only">
                  Filter tools
                </h2>
                <div className="filters-row">
                  <div className="filter-group smallBodyText">
                    <label htmlFor="disciplineFilter">Filter by discipline:</label>
                    <select
                      id="disciplineFilter"
                      value={filterDiscipline || ""}
                      onChange={(e) => setFilterDiscipline(e.target.value || null)}
                      aria-label="Select a discipline to filter tools"
                    >
                      <option value="">All Disciplines</option>
                      {availableFilters.disciplines.map((discipline) => (
                        <option key={discipline} value={discipline}>
                          {discipline}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="smallBodyText">
                    Showing {filteredTools.length} of {tools.length} tools
                  </span>

                  <button
                    className="button-link"
                    onClick={() => {
                      setFilterDiscipline(null);
                    }}
                    aria-label="Clear discipline filter"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Grid>
      </Section>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            {/* Loading and error states */}
            {isLoadingTools && <LoadingSpinner message="Loading tools..." />}
            {error && <p className="error">{error}</p>}

            {/* Tool listings - now outside the constraining container */}
            {!isLoadingTools && !error && (
              <>
                {/* Use the patterns-by-section class to go full width */}
                <div className="patterns-by-section">
                  <div className="pattern-section mb-6">
                    <div className="patterns-grid tools-grid">
                      {filteredTools.length > 0 ? (
                        filteredTools.map((tool) => (
                          tool.url ? (
                            <a
                              key={tool.id}
                              href={
                                tool.url.startsWith("http")
                                  ? tool.url
                                  : `https://${tool.url}`
                              }
                              className="card pattern-card tool-card-link"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit ${tool.name} - ${tool.description}`}
                            >
                              <div className="tool-header">
                                <img 
                                  src={`https://icons.duckduckgo.com/ip3/${
                                    // Special case for HMRC tools - use gov.uk domain
                                    tool.name.toLowerCase().includes('hmrc') || tool.name.toLowerCase().includes('virtual') 
                                      ? 'gov.uk' 
                                      : tool.url.replace(/^https?:\/\//, '').split('/')[0]
                                  }.ico`}
                                  alt=""
                                  className="tool-favicon"
                                  aria-hidden="true"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <h3>{tool.name}</h3>
                              </div>
                              <p className="smallBodyText">{tool.description}</p>
                              <div className="tool-meta">
                                {tool.discipline.length > 0 && (
                                  <div className="tool-disciplines">
                                    <strong className="sr-only">For:</strong>{" "}
                                    {tool.discipline.map((d) => (
                                      <span key={d}>{d}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="external-link-icon" aria-hidden="true">
                                <svg fill="#666666" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M19,14 L19,19 C19,20.1045695 18.1045695,21 17,21 L5,21 C3.8954305,21 3,20.1045695 3,19 L3,7 C3,5.8954305 3.8954305,5 5,5 L10,5 L10,7 L5,7 L5,19 L17,19 L17,14 L19,14 Z M18.9971001,6.41421356 L11.7042068,13.7071068 L10.2899933,12.2928932 L17.5828865,5 L12.9971001,5 L12.9971001,3 L20.9971001,3 L20.9971001,11 L18.9971001,11 L18.9971001,6.41421356 Z"/>
                                </svg>
                              </div>
                            </a>
                          ) : (
                            <div key={tool.id} className="card pattern-card">
                              <h3 className="tool-name">{tool.name}</h3>
                              <p className="tool-description">{tool.description}</p>
                              <div className="tool-meta">
                                {tool.discipline.length > 0 && (
                                  <div className="tool-disciplines">
                                    <strong className="sr-only">For:</strong>{" "}
                                    {tool.discipline.map((d) => (
                                      <span key={d}>{d}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        ))
                      ) : (
                        <p>No tools match the selected filters.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
}
