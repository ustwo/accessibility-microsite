import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import { fetchAccessibilityPatterns, type AccessibilityPattern, getPatternsFilterOptions } from "../../utils/googleSheets";

export default function PatternsIndex() {
  const [patterns, setPatterns] = useState<AccessibilityPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterWhere, setFilterWhere] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<{
    categories: string[];
    wheres: string[];
  }>({ categories: [], wheres: [] });

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
    if (filterCategory && pattern.category !== filterCategory) {
      return false;
    }
    if (filterWhere && pattern.where !== filterWhere) {
      return false;
    }
    return true;
  });

  return (
    <Layout title="Accessibility Patterns">
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
                <label htmlFor="categoryFilter">Category:</label>
                <select 
                  id="categoryFilter" 
                  value={filterCategory || ''} 
                  onChange={(e) => setFilterCategory(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {availableFilters.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="whereFilter">Where to Apply:</label>
                <select 
                  id="whereFilter" 
                  value={filterWhere || ''} 
                  onChange={(e) => setFilterWhere(e.target.value || null)}
                >
                  <option value="">All Contexts</option>
                  {availableFilters.wheres.map(where => (
                    <option key={where} value={where}>{where}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="button button-secondary"
                onClick={() => {
                  setFilterCategory(null);
                  setFilterWhere(null);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Loading and error states */}
          {loading && <p className="loading">Loading patterns...</p>}
          {error && <p className="error">{error}</p>}
          
          {/* Pattern listings */}
          {!loading && !error && (
            <>
              <div className="patterns-count mb-3">
                <p>Showing {filteredPatterns.length} of {patterns.length} patterns</p>
              </div>
              
              <div className="patterns-grid">
                {filteredPatterns.length > 0 ? (
                  filteredPatterns.map(pattern => (
                    <div key={pattern.id} className="pattern-card">
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
                            <strong>Category:</strong> {pattern.category}
                          </div>
                        )}
                        {pattern.where && (
                          <div className="pattern-where">
                            <strong>Where to Apply:</strong> {pattern.where}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No patterns match the selected filters.</p>
                )}
              </div>
            </>
          )}
          
          {/* Submit CTA */}
          <div className="submit-cta mt-8">
            <h3>Know a great accessibility pattern?</h3>
            <p>Share your favorite accessibility pattern with the community.</p>
            <Link to="/patterns/submit" className="button">
              Submit a Pattern
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
} 