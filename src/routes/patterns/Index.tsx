import { useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";
import {
  type AccessibilityPattern,
  getPatternsFilterOptions,
} from "../../utils/googleSheets";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useData } from "../../context/DataContext";

export default function PatternsIndex() {
  const { patterns, isLoadingPatterns, error, clearCache } = useData();

  // Add debug logging
  console.log("Patterns data in component:", patterns);
  console.log(
    "Patterns with links:",
    patterns.filter((p) => p.linkyDinks && p.linkyDinks.length > 0)
  );

  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterWhere, setFilterWhere] = useState<string | null>(null);
  const [filterParentTitle, setFilterParentTitle] = useState<string | null>(
    null
  );

  // Compute filter options directly from the patterns data
  const availableFilters = getPatternsFilterOptions(patterns);

  // Apply filters to patterns
  const filteredPatterns = patterns.filter((pattern) => {
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
        patterns: [],
      });
    } else if (acc.length > 0) {
      const lastSection = acc[acc.length - 1];
      lastSection.patterns.push(pattern);
    }
    return acc;
  }, [] as { sectionTitle: string; patterns: AccessibilityPattern[] }[]);

  // Group patterns by their name to handle multiple platform variants
  const groupedPatternsInSections = patternsBySection.map((section) => {
    const groupedPatterns: { [key: string]: AccessibilityPattern[] } = {};

    section.patterns.forEach((pattern) => {
      // Use the pattern name as the key for grouping, but only if it's not empty
      const name = pattern.name.trim();

      if (name) {
        // For patterns with no name but with a where/category, use them independently
        if (!groupedPatterns[name]) {
          groupedPatterns[name] = [];
        }
        groupedPatterns[name].push(pattern);
      }
    });

    return {
      ...section,
      groupedPatterns: Object.values(groupedPatterns),
    };
  });

  // Determine if we're filtering
  const isFiltering =
    filterCategory !== null ||
    filterWhere !== null ||
    filterParentTitle !== null;

  return (
    <Layout title="Accessibility Patterns">
      <Helmet>
        <title>Accessibility Patterns - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="A collection of accessible design patterns recommended by ustwo."
        />
      </Helmet>

      {/* Filters */}
      <div className="filters-bar">
        <div className="container container-content">
          <div className="filters-container">
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="categoryFilter">Platform:</label>
                <select
                  id="categoryFilter"
                  value={filterCategory || ""}
                  onChange={(e) => setFilterCategory(e.target.value || null)}
                >
                  <option value="">All Platforms</option>
                  {availableFilters.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="parentTitleFilter">Section:</label>
                <select
                  id="parentTitleFilter"
                  value={filterParentTitle || ""}
                  onChange={(e) => setFilterParentTitle(e.target.value || null)}
                >
                  <option value="">All Sections</option>
                  {availableFilters.parentTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
              {isFiltering && (
                <span>
                  Showing {filteredPatterns.length} of{" "}
                  {patterns.filter((p) => !p.isSection).length} patterns
                </span>
              )}
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
        </div>
      </div>
      <section className="content-section">
        <div className="container container-content">
          <p className="intro-text">
            Our second principle is to enjoy the patterns. These are the design
            patterns we recommend for creating accessible digital products.
          </p>
        </div>

        {/* Loading and error states */}
        {isLoadingPatterns && (
          <div className="container container-content">
            <LoadingSpinner message="Loading patterns..." />
          </div>
        )}
        {error && (
          <div className="container container-content">
            <p className="error">{error}</p>
          </div>
        )}

        {/* Pattern listings */}
        {!isLoadingPatterns && !error && (
          <>
            {/* Filtered view - display as a flat grid */}
            {isFiltering ? (
              <div className="patterns-grid">
                {filteredPatterns.length > 0 ? (
                  filteredPatterns.map((pattern) => (
                    <div key={pattern.id} className="card pattern-card">
                      <h3 className="pattern-name">{pattern.name}</h3>
                      <p className="pattern-description">
                        {pattern.description}
                      </p>

                      {pattern.linkyDinks && pattern.linkyDinks.length > 0 && (
                        <div className="pattern-links">
                          <h4>Resources:</h4>
                          <ul>
                            {pattern.linkyDinks
                              .filter((link) => link.url && link.title) // Only show links that have both URL and title
                              .map((link, index) => (
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
                  <div className="container container-content">
                    <p>No patterns match the selected filters.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Grouped view - display patterns by section */
              <div className="patterns-by-section">
                {groupedPatternsInSections.map((section, sectionIndex) => (
                  <div
                    key={`section-${sectionIndex}`}
                    className="pattern-section mb-6"
                  >
                    <h2
                      id={`section-${sectionIndex}`}
                      className="section-title"
                    >
                      {section.sectionTitle}
                    </h2>

                    <div className="patterns-grid">
                      {section.groupedPatterns.map((patternGroup) => {
                        // Get the group characteristics
                        const groupHasMultiplePlatforms =
                          patternGroup.length > 1;

                        return patternGroup
                          .map((pattern, patternIndex) => {
                            // Skip rendering empty patterns (those with no name)
                            if (!pattern.name.trim()) return null;

                            // For groups with same pattern name but different platforms
                            const isSubsequentPlatformVariant =
                              patternIndex > 0;

                            return (
                              <div
                                key={pattern.id}
                                className="card pattern-card"
                              >
                                {/* Always show the pattern name */}
                                <h3 className="pattern-name">{pattern.name}</h3>

                                {/* Add subtitle for platform-specific variants */}
                                {isSubsequentPlatformVariant && (
                                  <h4 className="pattern-subtitle">
                                    For {pattern.category} platforms
                                  </h4>
                                )}

                                {/* First variant with multiple platforms should indicate it's for that specific platform */}
                                {!isSubsequentPlatformVariant &&
                                  groupHasMultiplePlatforms && (
                                    <h4 className="pattern-subtitle">
                                      For {pattern.category} platforms
                                    </h4>
                                  )}

                                <p className="pattern-description">
                                  {pattern.description}
                                </p>

                                {pattern.linkyDinks &&
                                  pattern.linkyDinks.length > 0 && (
                                    <div className="pattern-links">
                                      <ul>
                                        {pattern.linkyDinks
                                          .filter(
                                            (link) => link.url && link.title
                                          ) // Only show links that have both URL and title
                                          .map((link, index) => (
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
                                      <strong>Platform:</strong>{" "}
                                      {pattern.category}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                          .filter(Boolean); // Filter out any null values
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
