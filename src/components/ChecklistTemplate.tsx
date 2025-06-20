import { useState, useEffect } from "react";
import Layout from "./Layout";
import { Helmet } from 'react-helmet';
import Section from "./Section";
import Grid, { Col } from "./Grid";
import "../../public/styles/checklist.css";

interface ChecklistItem {
  criteria: string;
  name: string;
  responsible: string[];
  description: string;
  example?: string;
  status?: string;
}

interface ChecklistData {
  [key: string]: {
    "Level A": ChecklistItem[];
    "Level AA": ChecklistItem[];
    "Level AAA (Optional)"?: ChecklistItem[];
  };
}

interface ChecklistTemplateProps {
  title: string;
  allData: {
    perceivable: ChecklistData;
    operable: ChecklistData;
    understandable: ChecklistData;
    robust: ChecklistData;
  };
}

const checklistPages = [
  { name: "Perceivable", hash: "perceivable", key: "Perceivable" },
  { name: "Operable", hash: "operable", key: "Operable" },
  { name: "Understandable", hash: "understandable", key: "Understandable" },
  { name: "Robust", hash: "robust", key: "Robust" },
];

export default function ChecklistTemplate({ title, allData }: ChecklistTemplateProps) {
  const [filterResponsible, setFilterResponsible] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [completionStats, setCompletionStats] = useState({
    perceivable: 0,
    operable: 0,
    understandable: 0,
    robust: 0,
    total: 0
  });

  // Add clear all function
  const handleClearAll = () => {
    setCheckedItems(new Set());
    localStorage.removeItem('checklistCheckedItems');
    console.log('Cleared all checkboxes and localStorage');
  };

  // Load saved checked items from localStorage on component mount
  useEffect(() => {
    const loadSavedItems = () => {
      console.log('Attempting to load from localStorage...');
      try {
        const savedCheckedItems = localStorage.getItem('checklistCheckedItems');
        console.log('Raw localStorage value:', savedCheckedItems);
        
        if (savedCheckedItems) {
          const parsedItems = JSON.parse(savedCheckedItems);
          console.log('Successfully parsed items:', parsedItems);
          if (Array.isArray(parsedItems)) {
            setCheckedItems(new Set(parsedItems));
            console.log('Successfully set checked items:', Array.from(new Set(parsedItems)));
          } else {
            console.error('Parsed items is not an array:', parsedItems);
          }
        } else {
          console.log('No saved items found in localStorage');
        }
      } catch (error) {
        console.error('Error in localStorage load operation:', error);
      }
    };

    // Add a small delay to ensure component is mounted
    const timer = setTimeout(loadSavedItems, 100);
    return () => clearTimeout(timer);
  }, []);

  // Save checked items to localStorage whenever they change
  useEffect(() => {
    if (checkedItems.size === 0) return; // Don't save empty state on initial load
    
    console.log('Saving to localStorage, current checkedItems:', Array.from(checkedItems));
    try {
      const itemsToSave = JSON.stringify(Array.from(checkedItems));
      console.log('Items to save (stringified):', itemsToSave);
      localStorage.setItem('checklistCheckedItems', itemsToSave);
      console.log('Successfully saved to localStorage');
      
      // Verify the save
      const verifySave = localStorage.getItem('checklistCheckedItems');
      console.log('Verification - retrieved from localStorage:', verifySave);
    } catch (error) {
      console.error('Error in localStorage save operation:', error);
    }
  }, [checkedItems]);

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentSection(hash || 'perceivable'); // Default to 'perceivable' if no hash
    };

    // Set initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = (criteria: string) => {
    console.log('Checkbox changed for criteria:', criteria);
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(criteria)) {
        newSet.delete(criteria);
      } else {
        newSet.add(criteria);
      }
      console.log('New checked items:', Array.from(newSet));
      return newSet;
    });
  };

  // Filter function to check if an item matches the selected responsibility
  const matchesResponsibilityFilter = (item: ChecklistItem) => {
    if (!filterResponsible || filterResponsible === "All") return true;
    
    if (filterResponsible === "UX & Design") {
      return item.responsible.some((role: string) => 
        role === "UX & Design" || role === "UX" || role === "Design"
      );
    }
    
    if (filterResponsible === "Dev") {
      return item.responsible.includes("Dev");
    }
    
    return true;
  };

  // Get current data based on hash
  const getCurrentData = () => {
    switch (currentSection) {
      case 'perceivable':
        return allData.perceivable;
      case 'operable':
        return allData.operable;
      case 'understandable':
        return allData.understandable;
      case 'robust':
        return allData.robust;
      default:
        return null;
    }
  };

  const currentData = getCurrentData();
  const currentChecklistKey = currentData ? Object.keys(currentData)[0] : "";
  const currentChecklist = currentData && currentChecklistKey ? currentData[currentChecklistKey] : null;

  // Apply filters to each level if data exists
  const filteredLevelA = currentChecklist ? currentChecklist["Level A"].filter(matchesResponsibilityFilter) : [];
  const filteredLevelAA = currentChecklist ? currentChecklist["Level AA"].filter(matchesResponsibilityFilter) : [];
  const filteredLevelAAA = currentChecklist && currentChecklist["Level AAA (Optional)"] 
    ? currentChecklist["Level AAA (Optional)"].filter(matchesResponsibilityFilter) 
    : [];

  // Calculate total counts for display
  const totalUnfiltered = currentChecklist 
    ? currentChecklist["Level A"].length + 
      currentChecklist["Level AA"].length + 
      (currentChecklist["Level AAA (Optional)"]?.length || 0)
    : 0;
  const totalFiltered = filteredLevelA.length + filteredLevelAA.length + filteredLevelAAA.length;
  const isFiltering = filterResponsible && filterResponsible !== "All";

  // Calculate completion statistics
  useEffect(() => {
    const calculateCompletion = (data: ChecklistData) => {
      let total = 0;
      let completed = 0;
      
      // Iterate through each level (A, AA, AAA)
      Object.values(data).forEach((levelData) => {
        // Iterate through each item in the level
        Object.values(levelData).forEach((items: ChecklistItem[]) => {
          items.forEach((item: ChecklistItem) => {
            // Only count items that match the current filter
            if (!filterResponsible || filterResponsible === "All" || 
                (filterResponsible === "UX & Design" && 
                 (item.responsible.includes("UX & Design") || 
                  item.responsible.includes("UX") || 
                  item.responsible.includes("Design"))) ||
                (filterResponsible === "Dev" && 
                 item.responsible.includes("Dev"))) {
              total++;
              if (checkedItems.has(item.criteria)) {
                completed++;
              }
            }
          });
        });
      });
      
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const stats = {
      perceivable: calculateCompletion(allData.perceivable),
      operable: calculateCompletion(allData.operable),
      understandable: calculateCompletion(allData.understandable),
      robust: calculateCompletion(allData.robust),
      total: 0
    };

    // Calculate total completion
    let totalItems = 0;
    let totalCompleted = 0;

    Object.values(allData).forEach((data) => {
      Object.values(data).forEach((levelData) => {
        Object.values(levelData).forEach((items: ChecklistItem[]) => {
          items.forEach((item: ChecklistItem) => {
            // Only count items that match the current filter
            if (!filterResponsible || filterResponsible === "All" || 
                (filterResponsible === "UX & Design" && 
                 (item.responsible.includes("UX & Design") || 
                  item.responsible.includes("UX") || 
                  item.responsible.includes("Design"))) ||
                (filterResponsible === "Dev" && 
                 item.responsible.includes("Dev"))) {
              totalItems++;
              if (checkedItems.has(item.criteria)) {
                totalCompleted++;
              }
            }
          });
        });
      });
    });

    stats.total = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
    setCompletionStats(stats);
  }, [checkedItems, allData, filterResponsible]);

  const renderTable = (items: ChecklistItem[], level: string, hasExampleColumn: boolean = true) => {
    if (items.length === 0) return null;

    return (
      <>
        <h3>{level}{isFiltering && ` (${items.length})`}</h3>
        <table className="checklist-table" role="table" aria-label={`${level} ${currentChecklistKey} Requirements`}>
          <thead>
            <tr>
              <th scope="col">Criterion</th>
              <th scope="col">Responsible</th>
              <th scope="col">Description</th>
              {hasExampleColumn && <th scope="col">Example</th>}
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <span>{item.criteria}</span> <span><strong>{item.name}</strong></span>
                </td>
                <td>
                  <div className="responsible-pills">
                    {item.responsible.map((role, roleIndex) => (
                      <span key={roleIndex}>{role}</span>
                    ))}
                  </div>
                </td>
                <td>{item.description}</td>
                {hasExampleColumn && <td>{item.example || "—"}</td>}
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.has(item.criteria)}
                    onChange={() => handleCheckboxChange(item.criteria)}
                    aria-label={`Mark ${item.criteria} as complete`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <Layout
      title="Accessibility Checklist"
      introText="Our comprehensive accessibility checklist helps you track your progress and ensure your digital products 
      meet accessibility standards."
      theme="checklist"
    >
      <Helmet>
        <title>{title} - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content={`${title} accessibility checklist and requirements guide to help ensure your digital products meet accessibility standards.`}
        />
      </Helmet>

      {/* Filters - only show if we have data */}
      {currentData && (
        <Section className="light-background">
          <Grid>
            <Col start={1} span={12}>
              <div className="filters-bar">
                <div className="filters-container">
                  <div className="filters-row">
                    <div className="filter-group smallBodyText">
                      <label htmlFor="responsibilityFilter">Responsibility:</label>
                      <select
                        id="responsibilityFilter"
                        value={filterResponsible || ""}
                        onChange={(e) => setFilterResponsible(e.target.value || null)}
                      >
                        <option value="">All</option>
                        <option value="UX & Design">UX & Design</option>
                        <option value="Dev">Dev</option>
                      </select>
                    </div>
                    {isFiltering && (
                      <span className="smallBodyText">
                        Showing {totalFiltered} of {totalUnfiltered} requirements
                      </span>
                    )}
                    <button
                      className="button-link"
                      onClick={() => setFilterResponsible(null)}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Grid>
        </Section>
      )}

      <Section aria-labelledby="page-header" padding="bottom" className="checklist-section">
        <Grid>
          <Col start={1} span={2}>
            <nav className="checklist-sidebar" aria-label="Checklist navigation">
              <h3>WCAG Principles</h3>
              <ul>
                {checklistPages.map((page) => (
                  <li key={page.hash}>
                    <a 
                      href={`#${page.hash}`}
                      className={currentSection === page.hash ? "active" : ""}
                      aria-current={currentSection === page.hash ? "page" : undefined}
                    >
                      {page.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="smallerBodyText">
                Progress is saved between sessions.<br />
                <button
                  className="button-link"
                  onClick={handleClearAll}
                  aria-label="Clear all checkboxes"
                >
                  Clear Progress
                </button>
              </p>
            </nav>
          </Col>
          <Col start={3} span={10}>
            {currentData && currentChecklist ? (
              <>
                {/* <h2 className="checklist-title">{currentChecklistKey}</h2> */}
                
                {/* Level A Requirements */}
                {renderTable(filteredLevelA, "Level A (Must Comply)")}

                {/* Level AA Requirements */}
                {renderTable(filteredLevelAA, "Level AA (Must Comply)")}

                {/* Level AAA Requirements */}
                {filteredLevelAAA.length > 0 && 
                  renderTable(filteredLevelAAA, "Level AAA (Optional)", 
                    // Check if any item has an example to determine if we need the column
                    filteredLevelAAA.some((item: ChecklistItem) => item.example)
                  )
                }
              </>
            ) : (
              <div>
                <h2>Loading...</h2>
                <p>Loading checklist data for {currentSection}...</p>
              </div>
            )}
          </Col>
        </Grid>
      </Section>

      <div className="completion-footer">
        <div className="completion-stats">
          <span className="filter-indicator">Progress: {filterResponsible || "All"}</span>
          <span>Perceivable: {completionStats.perceivable}%</span>
          <span>Operable: {completionStats.operable}%</span>
          <span>Understandable: {completionStats.understandable}%</span>
          <span>Robust: {completionStats.robust}%</span>
          <span className="total">TOTAL: {completionStats.total}%</span>
        </div>
      </div>
    </Layout>
  );
} 