// Cursor rules to enforce accessibility and testing standards
module.exports = {
  name: 'Accessibility and Testing Standards',
  description: 'Enforces best practices for accessibility, CSS usage, and testing',
  
  // Rules that apply to all files in the project
  rules: [
    {
      name: 'Ensure all components have proper unit tests',
      description: 'Every component should have a corresponding test file',
      validate: ({ fileName, fileTree }) => {
        // Only check component files
        if (!fileName.match(/\.(tsx|jsx)$/) || fileName.includes('test') || fileName.includes('__tests__')) {
          return true;
        }
        
        // Skip non-component files
        if (fileName.includes('/utils/') || fileName.includes('/context/') || 
            fileName.includes('/data/') || fileName.includes('routes.tsx') || 
            fileName.includes('main.tsx')) {
          return true;
        }
        
        // Check for a corresponding test file
        const baseName = fileName.replace(/\.(tsx|jsx)$/, '');
        const testFile1 = `${baseName}.test.tsx`;
        const testFile2 = `${baseName}.test.jsx`;
        const testFile3 = fileName.replace(/\/([^/]+)\.(tsx|jsx)$/, '/__tests__/$1.test.$2');
        
        const hasTestFile = fileTree.exists(testFile1) || 
                           fileTree.exists(testFile2) || 
                           fileTree.exists(testFile3);
        
        return {
          valid: hasTestFile,
          reason: hasTestFile ? '' : `Missing test file for ${fileName}. Please create a test file using React Testing Library.`
        };
      }
    },
    {
      name: 'Enforce accessible interactive elements',
      description: 'All interactive elements must be keyboard accessible',
      validate: ({ fileContent, fileName }) => {
        // Only apply to React component files
        if (!fileName.match(/\.(tsx|jsx)$/) || fileName.includes('test') || fileName.includes('__tests__')) {
          return true;
        }
        
        const hasClickWithoutKeyboard = fileContent.match(/onClick={[^}]*}(?!\s*onKeyDown|\s*onKeyPress)/g);
        
        return {
          valid: !hasClickWithoutKeyboard,
          reason: !hasClickWithoutKeyboard ? '' : 'Found onClick handlers without keyboard event handlers. Ensure all interactive elements are keyboard accessible.'
        };
      }
    },
    {
      name: 'Enforce proper semantic HTML',
      description: 'Ensure usage of semantic HTML elements',
      validate: ({ fileContent, fileName }) => {
        // Only apply to React component files
        if (!fileName.match(/\.(tsx|jsx)$/) || fileName.includes('test') || fileName.includes('__tests__')) {
          return true;
        }
        
        // Check for interactive divs (should use buttons instead)
        const hasInteractiveDiv = fileContent.match(/<div[^>]*onClick=/g);
        
        return {
          valid: !hasInteractiveDiv,
          reason: !hasInteractiveDiv ? '' : 'Found div elements with onClick handlers. Use semantic elements like <button> instead.'
        };
      }
    },
    {
      name: 'Enforce aria attributes',
      description: 'Ensure proper ARIA usage for improved accessibility',
      validate: ({ fileContent, fileName }) => {
        // Only apply to React component files
        if (!fileName.match(/\.(tsx|jsx)$/) || fileName.includes('test') || fileName.includes('__tests__')) {
          return true;
        }
        
        // Check for common aria misuse patterns
        const hasAriaHidden = fileContent.match(/aria-hidden="true".*>(?:\s*[^<\s])/g);
        
        return {
          valid: !hasAriaHidden,
          reason: !hasAriaHidden ? '' : 'Found aria-hidden elements with content. Ensure hidden elements are not accessible to screen readers but still contain actual content.'
        };
      }
    },
    {
      name: 'No inline styles',
      description: 'Use external CSS instead of inline styles',
      validate: ({ fileContent, fileName }) => {
        // Only apply to React component files
        if (!fileName.match(/\.(tsx|jsx)$/) || fileName.includes('test') || fileName.includes('__tests__')) {
          return true;
        }
        
        const hasInlineStyles = fileContent.match(/style={{[^}]*}}/g);
        
        return {
          valid: !hasInlineStyles,
          reason: !hasInlineStyles ? '' : 'Found inline styles. Use external CSS classes instead.'
        };
      }
    },
    {
      name: 'No Tailwind CSS',
      description: 'Use regular CSS instead of Tailwind utility classes',
      validate: ({ fileContent, fileName }) => {
        // Only apply to React component files
        if (!fileName.match(/\.(tsx|jsx)$/) || fileName.includes('test') || fileName.includes('__tests__')) {
          return true;
        }
        
        // Look for common Tailwind patterns (multiple utility classes in className)
        const hasTailwindClasses = fileContent.match(/className="[^"]*\s(bg-|text-|p-|m-|flex|grid|border-)[^"]*"/g);
        
        return {
          valid: !hasTailwindClasses,
          reason: !hasTailwindClasses ? '' : 'Found Tailwind utility classes. Use regular CSS classes instead.'
        };
      }
    },
    {
      name: 'Ensure Image Alt Text',
      description: 'All images must have alt text for accessibility',
      validate: ({ fileContent, fileName }) => {
        // Only apply to React component files
        if (!fileName.match(/\.(tsx|jsx)$/) || fileName.includes('test') || fileName.includes('__tests__')) {
          return true;
        }
        
        // Check for images without alt text
        const hasImagesWithoutAlt = fileContent.match(/<img(?![^>]*alt=)[^>]*>/g);
        const hasEmptyAlt = fileContent.match(/<img[^>]*alt=""\s*[^>]*>/g);
        
        // We want to allow empty alt for decorative images, so only flag missing alt attributes
        return {
          valid: !hasImagesWithoutAlt,
          reason: !hasImagesWithoutAlt ? '' : 'Found images without alt attribute. Add appropriate alt text or empty alt for decorative images.'
        };
      }
    },
    {
      name: 'Ensure proper form labels',
      description: 'All form inputs must have associated labels',
      validate: ({ fileContent, fileName }) => {
        // Only apply to React component files with forms
        if (!fileName.match(/\.(tsx|jsx)$/) || !fileContent.includes('<form') || 
            fileName.includes('test') || fileName.includes('__tests__')) {
          return true;
        }
        
        // Check for inputs without associated labels
        // This is a simplified check - proper validation would be more complex
        const hasInputs = fileContent.match(/<input[^>]*>/g);
        const hasLabels = fileContent.match(/<label[^>]*>/g);
        
        if (!hasInputs) return true;
        
        const inputCount = hasInputs.length;
        const labelCount = hasLabels ? hasLabels.length : 0;
        
        // Simple check - might have false positives/negatives
        return {
          valid: labelCount >= inputCount,
          reason: labelCount >= inputCount ? '' : 'Found form inputs without corresponding labels. Ensure all inputs have associated labels for accessibility.'
        };
      }
    },
    {
      name: 'Proper React Router 7 usage',
      description: 'Ensure correct usage of React Router 7 APIs',
      validate: ({ fileContent, fileName }) => {
        // Only apply to files that use React Router
        if (!fileName.match(/\.(tsx|jsx)$/) || 
            fileName.includes('test') || fileName.includes('__tests__') ||
            !fileContent.includes('react-router')) {
          return true;
        }
        
        // Check for deprecated React Router APIs
        const hasDeprecatedAPIs = 
          fileContent.includes('useHistory') || 
          fileContent.includes('withRouter') ||
          fileContent.includes('Switch');
        
        return {
          valid: !hasDeprecatedAPIs,
          reason: !hasDeprecatedAPIs ? '' : 'Found deprecated React Router APIs. Use React Router 7 APIs instead (e.g., use useNavigate instead of useHistory).'
        };
      }
    },
    {
      name: 'Focus management for client-side routing',
      description: 'Ensure proper focus management when navigating between routes',
      validate: ({ fileContent, fileName }) => {
        // Only apply to files that use navigation
        if (!fileName.match(/\.(tsx|jsx)$/) || 
            fileName.includes('test') || fileName.includes('__tests__') ||
            !fileContent.includes('navigate') && !fileContent.includes('Link')) {
          return true;
        }
        
        // Check for focus management after navigation
        // This is a simplified check - might have false positives
        const hasNavigationWithoutFocus = 
          (fileContent.includes('navigate(') || fileContent.includes('<Link')) && 
          !fileContent.includes('useEffect') && 
          !fileContent.includes('focus');
        
        return {
          valid: !hasNavigationWithoutFocus,
          reason: !hasNavigationWithoutFocus ? '' : 'Consider adding focus management after navigation for better accessibility.'
        };
      }
    }
  ]
}; 