import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import { 
  fetchAccessibilityTools, 
  type AccessibilityTool, 
  getToolsFilterOptions,
  checkSheetExists
} from "../../utils/googleSheets";

export default function ToolsIndex() {
  const [tools, setTools] = useState<AccessibilityTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDiscipline, setFilterDiscipline] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
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

  // Debug function to check sheet existence
  const checkSheetExistence = async () => {
    setDebugInfo("Checking sheet existence...");
    try {
      const toolsSheetId = import.meta.env.VITE_GOOGLE_TOOLS_SHEET_ID;
      // First try to check if 'Tools' sheet exists
      const toolsResult = await checkSheetExists(toolsSheetId, 'Tools');
      console.log("Tools sheet check result:", toolsResult);
      setDebugInfo(`${toolsResult.message}`);
      
      // If 'Tools' sheet doesn't exist, also check if 'Sheet1' exists
      if (!toolsResult.exists) {
        const sheet1Result = await checkSheetExists(toolsSheetId, 'Sheet1');
        console.log("Sheet1 check result:", sheet1Result);
        setDebugInfo(prev => `${prev}\n${sheet1Result.message}`);
      }
    } catch (err) {
      console.error("Error checking sheet existence:", err);
      setDebugInfo(`Error checking sheet: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Apply filters to tools
  const filteredTools = tools.filter(tool => {
    if (filterDiscipline && !tool.discipline.includes(filterDiscipline)) {
      return false;
    }
    if (filterSource && tool.source !== filterSource) {
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
      <Helmet>
        <title>Accessibility Tools - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="A collection of accessibility testing and development tools recommended by ustwo."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="tools-heading">
        <div className="container container-content">
          <p className="intro-text">
            These are the tools we recommend for testing and developing accessible digital products.
          </p>
          
          {/* Debug button - only visible in development */}
          {import.meta.env.DEV && (
            <div className="debug-section mb-4 p-3 border-2 border-dashed border-gray-300">
              <h3 className="text-sm font-bold mb-2">Development Debug</h3>
              <button 
                onClick={checkSheetExistence}
                className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
              >
                Check Sheet Names
              </button>
              {debugInfo && (
                <pre className="mt-2 p-2 bg-gray-100 text-xs whitespace-pre-wrap">{debugInfo}</pre>
              )}
            </div>
          )}
          
          {/* Filters */}
          <div className="filters-container mb-6">
            <h2 className="filters-heading">Filter Tools</h2>
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="disciplineFilter">Discipline:</label>
                <select 
                  id="disciplineFilter" 
                  value={filterDiscipline || ''} 
                  onChange={(e) => setFilterDiscipline(e.target.value || null)}
                >
                  <option value="">All Disciplines</option>
                  {availableFilters.disciplines.map(discipline => (
                    <option key={discipline} value={discipline}>{discipline}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="sourceFilter">Source:</label>
                <select 
                  id="sourceFilter" 
                  value={filterSource || ''} 
                  onChange={(e) => setFilterSource(e.target.value || null)}
                >
                  <option value="">All Sources</option>
                  {availableFilters.sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="button button-secondary"
                onClick={() => {
                  setFilterDiscipline(null);
                  setFilterSource(null);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Loading and error states */}
          {loading && <p className="loading">Loading tools...</p>}
          {error && <p className="error">{error}</p>}
          
          {/* Tool listings */}
          {!loading && !error && (
            <>
              <div className="tools-count mb-3">
                <p>Showing {filteredTools.length} of {tools.length} tools</p>
              </div>
              
              <div className="tools-grid">
                {filteredTools.length > 0 ? (
                  filteredTools.map(tool => (
                    <div key={tool.id} className="tool-card">
                      <h3 className="tool-name">{tool.name}</h3>
                      <p className="tool-description">{tool.description}</p>
                      
                      {tool.url && tool.url !== "Link" && tool.url !== "WIP" && (
                        <a 
                          href={tool.url.startsWith('http') ? tool.url : `https://${tool.url}`} 
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
                            <strong>For:</strong> {tool.discipline.join(', ')}
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
                  <p>No tools match the selected filters.</p>
                )}
              </div>
            </>
          )}
          
          {/* Submit CTA */}
          <div className="submit-cta mt-8">
            <h3>Know a great accessibility tool?</h3>
            <p>Share your favorite accessibility tool with the community.</p>
            <Link to="/tools/submit" className="button">
              Submit a Tool
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
} 