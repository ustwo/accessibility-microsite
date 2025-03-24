import { AccessibilityTool, AccessibilityPattern } from "../utils/googleSheets";

/**
 * Mock accessibility tools data for development
 */
export const mockTools: AccessibilityTool[] = [
  {
    id: "tool-1",
    name: "WAVE",
    description: "Web Accessibility Evaluation Tool that helps authors make their web content more accessible.",
    url: "https://wave.webaim.org/",
    category: "Evaluation",
    tags: ["Automated testing", "Visual feedback", "Browser extension"],
    cost: "Free",
    platforms: ["Web"],
  },
  {
    id: "tool-2",
    name: "axe DevTools",
    description: "Browser extension and testing library for identifying accessibility issues.",
    url: "https://www.deque.com/axe/",
    category: "Evaluation",
    tags: ["Automated testing", "Browser extension", "Developer tool"],
    cost: "Free / Paid",
    platforms: ["Web", "Chrome", "Firefox"],
  },
  {
    id: "tool-3",
    name: "Colour Contrast Analyzer",
    description: "A tool to analyze color contrast for compliance with WCAG guidelines.",
    url: "https://developer.paciellogroup.com/resources/contrastanalyser/",
    category: "Design",
    tags: ["Color contrast", "WCAG compliance"],
    cost: "Free",
    platforms: ["Windows", "macOS"],
  },
  {
    id: "tool-4",
    name: "VoiceOver",
    description: "Screen reader built into macOS and iOS devices.",
    url: "https://www.apple.com/accessibility/mac/vision/",
    category: "Screen Reader",
    tags: ["Screen reader", "Testing", "Apple"],
    cost: "Free (Built-in)",
    platforms: ["macOS", "iOS"],
  },
  {
    id: "tool-5",
    name: "NVDA",
    description: "Free, open-source screen reader for Windows.",
    url: "https://www.nvaccess.org/",
    category: "Screen Reader",
    tags: ["Screen reader", "Testing", "Open source"],
    cost: "Free",
    platforms: ["Windows"],
  },
  {
    id: "tool-6",
    name: "Lighthouse",
    description: "An open-source, automated tool for improving the quality of web pages, including accessibility.",
    url: "https://developers.google.com/web/tools/lighthouse",
    category: "Evaluation",
    tags: ["Automated testing", "Performance", "Developer tool"],
    cost: "Free",
    platforms: ["Chrome", "Command line"],
  },
  {
    id: "tool-7",
    name: "Accessible Name Inspector",
    description: "Browser extension that helps inspect and understand accessible names in the browser.",
    url: "https://chrome.google.com/webstore/detail/accessible-name-inspector/iejmelgfhpgpbjadnpcnhbmjgbkhlob",
    category: "Developer",
    tags: ["ARIA", "Browser extension", "Developer tool"],
    cost: "Free",
    platforms: ["Chrome"],
  },
  {
    id: "tool-8",
    name: "Pa11y",
    description: "Command-line interface which loads web pages and highlights any accessibility issues.",
    url: "https://pa11y.org/",
    category: "Evaluation",
    tags: ["Automated testing", "CI integration", "Command line"],
    cost: "Free",
    platforms: ["Command line"],
  },
];

/**
 * Mock accessibility patterns data for development
 */
export const mockPatterns: AccessibilityPattern[] = [
  {
    id: "pattern-1",
    name: "Skip to Content Link",
    description: "A hidden link that becomes visible on focus, allowing keyboard users to skip navigation and go directly to the main content.",
    example: "Adding a skip link at the beginning of the page that targets the main content section.",
    wcagCriteria: ["2.4.1", "2.4.7", "2.1.1"],
    tags: ["Navigation", "Keyboard accessibility", "Focus management"],
    code: `<a href="#main-content" class="skip-link">Skip to main content</a>

<header>
  <!-- Navigation and header content -->
</header>

<main id="main-content" tabindex="-1">
  <!-- Main content starts here -->
</main>`,
    codeLanguage: "html",
  },
  {
    id: "pattern-2",
    name: "ARIA Expanded for Toggle Controls",
    description: "Using aria-expanded attribute to indicate the state of a toggle control to screen reader users.",
    example: "Adding aria-expanded attribute to a dropdown menu button.",
    wcagCriteria: ["4.1.2", "1.3.1"],
    tags: ["ARIA", "Toggle controls", "Disclosure widgets"],
    code: `<button 
  aria-expanded="false" 
  aria-controls="dropdown-menu"
  onclick="toggleMenu()"
>
  Menu
</button>

<ul id="dropdown-menu" hidden>
  <li><a href="/home">Home</a></li>
  <li><a href="/about">About</a></li>
  <li><a href="/contact">Contact</a></li>
</ul>

<script>
function toggleMenu() {
  const button = document.querySelector('button');
  const menu = document.getElementById('dropdown-menu');
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  
  button.setAttribute('aria-expanded', !isExpanded);
  menu.hidden = isExpanded;
}
</script>`,
    codeLanguage: "html",
  },
  {
    id: "pattern-3",
    name: "Error Summary Pattern",
    description: "A pattern for displaying form validation errors in a summary at the top of the form, with links to the corresponding form fields.",
    example: "Using an error summary to list all form errors at the top of a form, helping users find and fix errors more efficiently.",
    wcagCriteria: ["3.3.1", "3.3.3", "2.4.1"],
    tags: ["Form validation", "Error handling", "Focus management"],
    code: `<form>
  <!-- Error summary (hidden by default, shown when errors occur) -->
  <div id="error-summary" class="error-summary" aria-labelledby="error-summary-title" tabindex="-1" hidden>
    <h2 id="error-summary-title">There is a problem</h2>
    <ul class="error-summary__list">
      <!-- Error links will be populated by JavaScript -->
    </ul>
  </div>
  
  <div class="form-group">
    <label for="name" id="name-label">Full name</label>
    <input type="text" id="name" name="name" aria-describedby="name-error" />
    <div id="name-error" class="error-message" hidden></div>
  </div>
  
  <div class="form-group">
    <label for="email" id="email-label">Email address</label>
    <input type="email" id="email" name="email" aria-describedby="email-error" />
    <div id="email-error" class="error-message" hidden></div>
  </div>
  
  <button type="submit">Submit</button>
</form>

<script>
function validateForm(form) {
  // Clear previous errors
  clearErrors();
  
  const errors = [];
  
  // Validate name
  const nameInput = document.getElementById('name');
  if (!nameInput.value.trim()) {
    errors.push({
      field: 'name',
      message: 'Enter your full name',
    });
  }
  
  // Validate email
  const emailInput = document.getElementById('email');
  if (!emailInput.value.trim()) {
    errors.push({
      field: 'email',
      message: 'Enter your email address',
    });
  } else if (!isValidEmail(emailInput.value.trim())) {
    errors.push({
      field: 'email',
      message: 'Enter a valid email address',
    });
  }
  
  // If there are errors, show the error summary
  if (errors.length > 0) {
    showErrorSummary(errors);
    return false;
  }
  
  return true;
}

function showErrorSummary(errors) {
  const errorSummary = document.getElementById('error-summary');
  const errorList = errorSummary.querySelector('.error-summary__list');
  
  // Remove any existing errors
  errorList.innerHTML = '';
  
  // Add each error to the list and highlight the field
  errors.forEach(error => {
    // Add error to the summary
    const errorItem = document.createElement('li');
    const errorLink = document.createElement('a');
    errorLink.href = \`#\${error.field}\`;
    errorLink.textContent = error.message;
    errorItem.appendChild(errorLink);
    errorList.appendChild(errorItem);
    
    // Highlight the field and show inline error
    const field = document.getElementById(error.field);
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('input-error');
    
    // Show inline error message
    const errorMessageElement = document.getElementById(\`\${error.field}-error\`);
    errorMessageElement.textContent = error.message;
    errorMessageElement.hidden = false;
  });
  
  // Show the error summary
  errorSummary.hidden = false;
  
  // Focus the error summary
  errorSummary.focus();
}

function clearErrors() {
  // Hide error summary
  const errorSummary = document.getElementById('error-summary');
  errorSummary.hidden = true;
  
  // Clear all field errors
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(el => {
    el.textContent = '';
    el.hidden = true;
  });
  
  // Remove invalid attributes from inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.removeAttribute('aria-invalid');
    input.classList.remove('input-error');
  });
}

function isValidEmail(email) {
  // Simple email validation
  const parts = email.split('@');
  return parts.length === 2 && parts[0].length > 0 && parts[1].includes('.');
}

// Add form submit handler
const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  if (!validateForm(this)) {
    event.preventDefault();
  }
});
</script>`,
    codeLanguage: "html",
  },
  {
    id: "pattern-4",
    name: "Focus Trap for Modals",
    description: "Trapping focus within a modal dialog to prevent users from tabbing outside of it while it's open.",
    example: "Using JavaScript to keep focus inside a modal dialog until it's closed.",
    wcagCriteria: ["2.1.2", "2.4.3", "2.4.7"],
    tags: ["Focus management", "Modal dialogs", "Keyboard accessibility"],
    code: `<button id="open-dialog" aria-haspopup="dialog">Open Dialog</button>

<div id="dialog" role="dialog" aria-labelledby="dialog-title" aria-modal="true" hidden>
  <div class="dialog-content">
    <h2 id="dialog-title">Dialog Title</h2>
    <p>This is a modal dialog. Focus is trapped within the dialog when open.</p>
    <button id="close-dialog">Close</button>
  </div>
</div>

<script>
  const openButton = document.getElementById('open-dialog');
  const closeButton = document.getElementById('close-dialog');
  const dialog = document.getElementById('dialog');
  
  let previouslyFocusedElement;
  
  // Function to open the dialog
  function openDialog() {
    // Store the element that had focus before opening the dialog
    previouslyFocusedElement = document.activeElement;
    
    // Show the dialog
    dialog.hidden = false;
    
    // Get all focusable elements in the dialog
    const focusableElements = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    // Focus the first focusable element
    firstFocusableElement.focus();
    
    // Listen for Tab key presses
    dialog.addEventListener('keydown', trapFocus);
    
    // Function to keep focus inside the dialog
    function trapFocus(e) {
      if (e.key === 'Tab' || e.keyCode === 9) {
        // If Shift+Tab on first element, redirect to last element
        if (e.shiftKey && document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        } 
        // If Tab on last element, redirect to first element
        else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
      
      // Close on Escape key
      if (e.key === 'Escape' || e.keyCode === 27) {
        closeDialog();
      }
    }
  }
  
  // Function to close the dialog
  function closeDialog() {
    // Hide the dialog
    dialog.hidden = true;
    
    // Remove event listener
    dialog.removeEventListener('keydown', trapFocus);
    
    // Return focus to the element that had it before the dialog was opened
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
  
  // Add event listeners to open and close the dialog
  openButton.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);
</script>`,
    codeLanguage: "html",
  },
  {
    id: "pattern-5",
    name: "Accessible Autocomplete",
    description: "An accessible implementation of an autocomplete component using ARIA and keyboard interactions.",
    example: "Creating an autocomplete search field that works for keyboard and screen reader users.",
    wcagCriteria: ["4.1.2", "2.1.1", "2.4.7"],
    tags: ["ARIA", "Forms", "Keyboard accessibility", "Interactive widgets"],
    code: `<div class="autocomplete">
  <label for="autocomplete-input">Search for a country:</label>
  <input 
    type="text" 
    id="autocomplete-input" 
    autocomplete="off"
    aria-autocomplete="list"
    aria-controls="autocomplete-results"
    aria-expanded="false"
  />
  <ul 
    id="autocomplete-results" 
    role="listbox" 
    class="autocomplete-results"
    hidden
  ></ul>
</div>

<script>
  const input = document.getElementById('autocomplete-input');
  const resultsList = document.getElementById('autocomplete-results');
  
  // Sample data - in a real app, this might come from an API
  const countries = [
    'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China', 
    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece',
    'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico',
    'Netherlands', 'New Zealand', 'Norway', 'Portugal', 'Russia',
    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States'
  ];
  
  let activeIndex = -1;
  
  // Function to filter countries based on input
  function filterCountries(query) {
    return countries.filter(country => 
      country.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Function to update the results list
  function updateResults(filteredResults) {
    resultsList.innerHTML = '';
    
    if (filteredResults.length === 0) {
      input.setAttribute('aria-expanded', 'false');
      resultsList.hidden = true;
      return;
    }
    
    input.setAttribute('aria-expanded', 'true');
    resultsList.hidden = false;
    
    filteredResults.forEach((result, index) => {
      const item = document.createElement('li');
      item.textContent = result;
      item.id = \`option-\${index}\`;
      item.setAttribute('role', 'option');
      item.tabIndex = -1;
      
      item.addEventListener('click', () => {
        selectOption(result, index);
      });
      
      resultsList.appendChild(item);
    });
  }
  
  // Function to select an option
  function selectOption(value, index) {
    input.value = value;
    input.setAttribute('aria-expanded', 'false');
    resultsList.hidden = true;
    
    // Reset active index
    activeIndex = -1;
    
    // Announce to screen readers (in a real app, you might use aria-live)
    input.setAttribute('aria-activedescendant', '');
  }
  
  // Handle input changes
  input.addEventListener('input', () => {
    const query = input.value.trim();
    
    if (query.length === 0) {
      input.setAttribute('aria-expanded', 'false');
      resultsList.hidden = true;
      return;
    }
    
    const filteredResults = filterCountries(query);
    updateResults(filteredResults);
    
    // Reset active index
    activeIndex = -1;
  });
  
  // Handle keyboard navigation
  input.addEventListener('keydown', (e) => {
    const items = resultsList.querySelectorAll('[role="option"]');
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        
        if (activeIndex < items.length - 1) {
          activeIndex++;
          
          // Reset previous active item
          items.forEach(item => item.setAttribute('aria-selected', 'false'));
          
          // Set new active item
          items[activeIndex].setAttribute('aria-selected', 'true');
          input.setAttribute('aria-activedescendant', items[activeIndex].id);
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        
        if (activeIndex > 0) {
          activeIndex--;
          
          // Reset previous active item
          items.forEach(item => item.setAttribute('aria-selected', 'false'));
          
          // Set new active item
          items[activeIndex].setAttribute('aria-selected', 'true');
          input.setAttribute('aria-activedescendant', items[activeIndex].id);
        }
        break;
        
      case 'Enter':
        if (activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          selectOption(items[activeIndex].textContent, activeIndex);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        input.setAttribute('aria-expanded', 'false');
        resultsList.hidden = true;
        activeIndex = -1;
        break;
    }
  });
  
  // Handle blur event - hide results when focus leaves the component
  // In a real implementation, you would want a more sophisticated focus management system
  input.addEventListener('blur', () => {
    // Small delay to allow for selecting an option by clicking
    setTimeout(() => {
      input.setAttribute('aria-expanded', 'false');
      resultsList.hidden = true;
    }, 100);
  });
</script>`,
    codeLanguage: "html",
  },
];

/**
 * Return mock data for the loader
 */
export function getMockData() {
  return {
    tools: mockTools,
    patterns: mockPatterns,
  };
} 