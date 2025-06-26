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
      title="WCAG Checklist"
      introText="Our third principle, think beyond touch, encourages you to ditch your touchscreen and trackpad. Using your keyboard will surface 90% of the items in this checklist, but it's helpful to have to hand to check the rest."
      theme="checklist"
    >
      <Helmet>
        <title>Checklist - ustwo Accessibility</title>
        <meta
          name="description"
          content={`Checklist and requirements guide to help ensure your digital products meet accessibility standards.`}
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
              <h2 className="h3">WCAG Principles</h2>
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
                {/* Add ID to the main content area for each section */}
                <div id={currentSection} role="region" aria-labelledby={`${currentSection}-title`}>
                  <h2 id={`${currentSection}-title`} className="checklist-title">{currentChecklistKey}</h2>
                  
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
                </div>
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
    </Layout>
  );
} 