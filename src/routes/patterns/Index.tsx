import { useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";
import Section from "../../components/Section";
import {
  type AccessibilityPattern,
  getPatternsFilterOptions,
} from "../../utils/googleSheets";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useData } from "../../context/DataContext";
import Grid, { Col } from "../../components/Grid";  

export default function PatternsIndex() {
  const { patterns, isLoadingPatterns, error, clearCache } = useData();

  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const [filterParentTitle, setFilterParentTitle] = useState<string | null>(
    null
  );
  console.log(patterns);


  // Compute filter options directly from the patterns data
  const availableFilters = getPatternsFilterOptions(patterns);

  // Apply filters to patterns
  const filteredPatterns = patterns.filter((pattern) => {
    // Skip section headers when filtering
    if (pattern.isSection) {
      return false;
    }

    if (filterCategory && filterCategory !== "All Platforms") {
      // Handle "both" category - show for both Web and Mobile filters
      if (filterCategory === "Web" && pattern.category.toLowerCase() !== "web" && pattern.category.toLowerCase() !== "both") {
        return false;
      }
      if (filterCategory === "Mobile" && pattern.category.toLowerCase() !== "mob" && pattern.category.toLowerCase() !== "both") {
        return false;
      }
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
    } else {
      // If we have sections, add to the last section
      if (acc.length > 0) {
        const lastSection = acc[acc.length - 1];
        lastSection.patterns.push(pattern);
      } else {
        // If no sections exist, create a default section for ungrouped patterns
        acc.push({
          sectionTitle: "Patterns",
          patterns: [pattern],
        });
      }
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
    (filterCategory !== null && filterCategory !== "All Platforms") ||
    filterParentTitle !== null;
  return (
    <Layout
      title="Patterns library"
      introText="Our second principle is to enjoy the patterns. These are the design
      patterns we recommend for creating accessible digital products."
      theme="patterns"
    > 
      <Helmet>
        <title>Patterns library - ustwo Accessibility</title>
        <meta
          name="description"
          content="A collection of accessible design patterns recommended by ustwo."
        />
      </Helmet>

      {/* Filters */}
      <Section className="light-background">
        <Grid>
          <Col start={1} span={12}>
            <div className="filters-bar">
                <div className="filters-container">
                  <div className="filters-row">
                    <div className="filter-group smallBodyText">
                      <label htmlFor="categoryFilter">Platform:</label>
                      <select
                        id="categoryFilter"
                        value={filterCategory || "All Platforms"}
                        onChange={(e) => setFilterCategory(e.target.value === "All Platforms" ? null : e.target.value)}
                      >
                        <option value="All Platforms">All Platforms</option>
                        <option value="Web">Web</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                    </div>

                    <div className="filter-group smallBodyText">
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
                      <span className="smallBodyText">
                        Showing {filteredPatterns.length} of{" "}
                        {patterns.filter((p) => !p.isSection).length} patterns
                      </span>
                    )}
                    <button
                      className="button-link"
                      onClick={() => {
                        setFilterCategory(null);
                        setFilterParentTitle(null);
                      }}
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
        {/* Loading and error states */}
        {isLoadingPatterns && (
          <Grid>
            <Col start={1} span={12}>
              <LoadingSpinner message="Loading patterns..." />
            </Col>
          </Grid>
        )}
        {error && (
          <Grid>
            <Col start={1} span={12}>
              <p className="error">{error}</p>
            </Col>
          </Grid>
        )}
      </Section>

      <Section padding="bottom">
        <div>
          <div>
            {/* Pattern listings */}
            {!isLoadingPatterns && !error && (
              <>
                {/* Filtered view - display as a flat grid */}
                {isFiltering ? (
                  <div className="patterns-grid">
                    {filteredPatterns.length > 0 ? (
                      filteredPatterns.map((pattern) => (
                        <div key={pattern.id} className="pattern-item">
                          <h3>{pattern.name}</h3>
                          <p className="smallBodyText noMargin">
                            {pattern.description}
                          </p>

                          {pattern.linkyDinks && pattern.linkyDinks.length > 0 && (
                            <div className="pattern-links">
                              {pattern.linkyDinks
                                .filter((link) => link.url) // Show links that have at least a URL
                                .map((link, index) => (
                                  <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pattern-link-card smallBodyText"
                                  >
                                    <img 
                                      src={`https://icons.duckduckgo.com/ip3/${
                                        // Special case for Salesforce URLs
                                        link.url.toLowerCase().includes('salesforce') 
                                          ? 'salesforce.com' 
                                          : link.url.replace(/^https?:\/\//, '').split('/')[0]
                                      }.ico`}
                                      alt=""
                                      className="pattern-link-favicon"
                                      aria-hidden="true"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    {link.title || link.url}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M19,14 L19,19 C19,20.1045695 18.1045695,21 17,21 L5,21 C3.8954305,21 3,20.1045695 3,19 L3,7 C3,5.8954305 3.8954305,5 5,5 L10,5 L10,7 L5,7 L5,19 L17,19 L17,14 L19,14 Z M18.9971001,6.41421356 L11.7042068,13.7071068 L10.2899933,12.2928932 L17.5828865,5 L12.9971001,5 L12.9971001,3 L20.9971001,3 L20.9971001,11 L18.9971001,11 L18.9971001,6.41421356 Z" fill="currentColor"/>
                                    </svg>
                                  </a>
                                ))}
                            </div>
                          )}

                          <div className="pattern-meta">
                            {pattern.category && (
                              <div className="pattern-categories">
                                {pattern.category.toLowerCase() === 'both' ? (
                                  <>
                                    <span>Mobile</span>
                                    <span>Web</span>
                                  </>
                                ) : (
                                  <span>{pattern.category.toLowerCase() === 'mob' ? 'Mobile' : 'Web'}</span>
                                )}
                              </div>
                            )}
                          </div>

                          
                        </div>
                      ))
                    ) : (
                        <Grid>
                        <Col start={1} span={12}>
                          <p>No patterns match the selected filters.</p>
                        </Col>
                      </Grid>
                    )}
                  </div>
                ) : (
                  /* Grouped view - display patterns by section */
                  <div className="patterns-by-section">
                    {groupedPatternsInSections.map((section, sectionIndex) => (
                      <div
                        key={`section-${sectionIndex}`}
                        className="pattern-section"
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
                                    className="pattern-item"
                                  >
                                    {/* Always show the pattern name */}
                                    <h3 className="pattern-name">{pattern.name}</h3>

                                    <p className="smallBodyText noMargin">
                                      {pattern.description}
                                    </p>

                                    {pattern.linkyDinks &&
                                      pattern.linkyDinks.length > 0 && (
                                        <div className="pattern-links">
                                          {pattern.linkyDinks
                                            .filter((link) => link.url) // Show links that have at least a URL
                                            .map((link, index) => (
                                              <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pattern-link-card smallBodyText"
                                              >
                                                <img 
                                                  src={`https://icons.duckduckgo.com/ip3/${
                                                    // Special case for Salesforce URLs
                                                    link.url.toLowerCase().includes('salesforce') 
                                                      ? 'salesforce.com' 
                                                      : link.url.replace(/^https?:\/\//, '').split('/')[0]
                                                  }.ico`}
                                                  alt=""
                                                  className="pattern-link-favicon"
                                                  aria-hidden="true"
                                                  onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                  }}
                                                />
                                                {link.title || link.url}
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path fillRule="evenodd" d="M19,14 L19,19 C19,20.1045695 18.1045695,21 17,21 L5,21 C3.8954305,21 3,20.1045695 3,19 L3,7 C3,5.8954305 3.8954305,5 5,5 L10,5 L10,7 L5,7 L5,19 L17,19 L17,14 L19,14 Z M18.9971001,6.41421356 L11.7042068,13.7071068 L10.2899933,12.2928932 L17.5828865,5 L12.9971001,5 L12.9971001,3 L20.9971001,3 L20.9971001,11 L18.9971001,11 L18.9971001,6.41421356 Z" fill="currentColor"/>
                                                </svg>
                                              </a>
                                            ))}
                                        </div>
                                      )}

                                    <div className="pattern-meta">
                                      {pattern.category && (
                                        <div className="pattern-categories">
                                          {pattern.category.toLowerCase() === 'both' ? (
                                            <>
                                              <span>Mobile</span>
                                              <span>Web</span>
                                            </>
                                          ) : (
                                            <span>{pattern.category.toLowerCase() === 'mob' ? 'Mobile' : 'Web'}</span>
                                          )}
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
            </div>
          </div>
        </Section>
    </Layout>
  );
}
