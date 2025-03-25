import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import { fetchAccessibilityPatterns, type AccessibilityPattern, getPatternsFilterOptions } from "../../utils/googleSheets";
import LoadingSpinner from "../../components/LoadingSpinner";

// ScrollToTop component that uses React Router's useLocation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default function PatternsIndex() {
  const [patterns, setPatterns] = useState<AccessibilityPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterWhere, setFilterWhere] = useState<string | null>(null);
  const [filterParentTitle, setFilterParentTitle] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<{
    categories: string[];
    wheres: string[];
    parentTitles: string[];
  }>({ 
    categories: [], 
    wheres: [],
    parentTitles: []
  });

  useEffect(() => {
    async function loadPatterns() {
      try {
        setLoading(true);
        const patternsData = await fetchAccessibilityPatterns();
        setPatterns(patternsData);
        
        // Extract available filter options
        const filterOptions = getPatternsFilterOptions(patternsData);
        setAvailableFilters(filterOptions);
      } catch (err) {
        console.error("Error loading patterns:", err);
        setError("Failed to load patterns. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadPatterns();
  }, []);

  // Apply filters to patterns
  const filteredPatterns = patterns.filter(pattern => {
    // Skip section headers when filtering
    if (pattern.isSection) {
      return false;
    }
    
    if (filterCategory && pattern.category !== filterCategory) {
      return false;
    }
    
    if (filterWhere && pattern.where !== filterWhere) {
      return false;
    }
    
    if (filterParentTitle && pattern.parentTitle !== filterParentTitle) {
      return false;
    }
    
    return true;
  });

  // Group patterns by parent title for normal display (when not filtering)
  const patternsBySection = patterns.reduce((acc, pattern) => {
    if (pattern.isSection) {
      acc.push({
        sectionTitle: pattern.name,
        patterns: []
      });
    } else if (acc.length > 0) {
      const lastSection = acc[acc.length - 1];
      lastSection.patterns.push(pattern);
    }
    return acc;
  }, [] as { sectionTitle: string; patterns: AccessibilityPattern[] }[]);

  // Determine if we're filtering
  const isFiltering = filterCategory !== null || filterWhere !== null || filterParentTitle !== null;

  return (
    <Layout title="Accessibility Patterns">
      <ScrollToTop />
      <Helmet>
        <title>Accessibility Patterns - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="A collection of accessible design patterns recommended by ustwo."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="patterns-heading">
        <div className="container container-content">
          <p className="intro-text">
            These are the design patterns we recommend for creating accessible digital products.
          </p>
          
          {/* Filters */}
          <div className="filters-container mb-6">
            <h2 className="filters-heading">Filter Patterns</h2>
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="categoryFilter">Platform:</label>
                <select 
                  id="categoryFilter" 
                  value={filterCategory || ''} 
                  onChange={(e) => setFilterCategory(e.target.value || null)}
                >
                  <option value="">All Platforms</option>
                  {availableFilters.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="parentTitleFilter">Section:</label>
                <select 
                  id="parentTitleFilter" 
                  value={filterParentTitle || ''} 
                  onChange={(e) => setFilterParentTitle(e.target.value || null)}
                >
                  <option value="">All Sections</option>
                  {availableFilters.parentTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="button button-secondary"
                onClick={() => {
                  setFilterCategory(null);
                  setFilterWhere(null);
                  setFilterParentTitle(null);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Loading and error states */}
          {loading && <LoadingSpinner message="Loading patterns..." />}
          {error && <p className="error">{error}</p>}
          
          {/* Pattern listings */}
          {!loading && !error && (
            <>
              {/* Show filter count when filtering */}
              {isFiltering && (
                <div className="patterns-count mb-3">
                  <p>Showing {filteredPatterns.length} of {patterns.filter(p => !p.isSection).length} patterns</p>
                </div>
              )}
              
              {/* Filtered view - display as a flat grid */}
              {isFiltering ? (
                <div className="patterns-grid">
                  {filteredPatterns.length > 0 ? (
                    filteredPatterns.map(pattern => (
                      <div key={pattern.id} className="card pattern-card">
                        <h3 className="pattern-name">{pattern.name}</h3>
                        <p className="pattern-description">{pattern.description}</p>
                        
                        {pattern.linkyDinks && pattern.linkyDinks.length > 0 && (
                          <div className="pattern-links">
                            <h4>Resources:</h4>
                            <ul>
                              {pattern.linkyDinks.map((link, index) => (
                                <li key={index}>
                                  <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                  >
                                    {link.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="pattern-meta">
                          {pattern.category && (
                            <div className="pattern-category">
                              <strong>Platform:</strong> {pattern.category}
                            </div>
                          )}
                          {pattern.parentTitle && (
                            <div className="pattern-section">
                              <strong>Section:</strong> {pattern.parentTitle}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No patterns match the selected filters.</p>
                  )}
                </div>
              ) : (
                /* Grouped view - display patterns by section */
                <div className="patterns-by-section">
                  {patternsBySection.map((section, sectionIndex) => (
                    <div key={`section-${sectionIndex}`} className="pattern-section mb-6">
                      <h2 id={`section-${sectionIndex}`} className="section-title mb-4">{section.sectionTitle}</h2>
                      
                      <div className="patterns-grid">
                        {section.patterns.map(pattern => (
                          <div key={pattern.id} className="card pattern-card">
                            <h3 className="pattern-name">{pattern.name}</h3>
                            <p className="pattern-description">{pattern.description}</p>
                            
                            {pattern.linkyDinks && pattern.linkyDinks.length > 0 && (
                              <div className="pattern-links">
                                <h4>Resources:</h4>
                                <ul>
                                  {pattern.linkyDinks.map((link, index) => (
                                    <li key={index}>
                                      <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                      >
                                        {link.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="pattern-meta">
                              {pattern.category && (
                                <div className="pattern-category">
                                  <strong>Platform:</strong> {pattern.category}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
        </div>
      </section>
    </Layout>
  );
} 