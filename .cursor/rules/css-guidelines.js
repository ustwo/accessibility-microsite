// Cursor rules for CSS guidelines and best practices
module.exports = {
  name: 'CSS Guidelines',
  description: 'Provides guidelines and enforces best practices for CSS in the project',
  
  rules: [
    {
      name: 'Use descriptive class names',
      description: 'CSS class names should be descriptive and follow BEM or a similar naming convention',
      validate: ({ fileContent, fileName }) => {
        // Only apply to CSS files
        if (!fileName.endsWith('.css')) {
          return true;
        }
        
        // Check for overly generic class names
        const hasGenericClassNames = fileContent.match(/\.(item|container|wrapper|box|content|header|footer|sidebar|nav|main|section)\s*{/g);
        
        return {
          valid: !hasGenericClassNames,
          reason: !hasGenericClassNames ? '' : 'Found generic class names. Use more specific, descriptive class names like .product-list__item or .site-header.'
        };
      }
    },
    {
      name: 'Ensure keyboard focus styles',
      description: 'Interactive elements should have visible focus styles',
      validate: ({ fileContent, fileName }) => {
        // Only apply to CSS files
        if (!fileName.endsWith('.css')) {
          return true;
        }
        
        // Check if there's a focus style definition and that it doesn't remove outline
        const hasFocusStyles = fileContent.match(/:focus\s*{[^}]*}/g);
        const removesOutline = fileContent.match(/:focus\s*{[^}]*outline:\s*(none|0)[^}]*}/g);
        
        // If focus styles exist but remove outline, check if there's an alternative
        if (hasFocusStyles && removesOutline) {
          const hasAlternativeFocusStyles = 
            fileContent.match(/:focus\s*{[^}]*(box-shadow|border)[^}]*}/g) ||
            fileContent.match(/:focus-visible\s*{[^}]*}/g);
          
          return {
            valid: hasAlternativeFocusStyles,
            reason: hasAlternativeFocusStyles ? '' : 'Found focus styles that remove outline without providing an alternative visible focus indicator. This harms keyboard accessibility.'
          };
        }
        
        return true;
      }
    },
    {
      name: 'Use relative units',
      description: 'Prefer relative units (rem, em, %) over absolute units (px) for better accessibility',
      validate: ({ fileContent, fileName }) => {
        // Only apply to CSS files
        if (!fileName.endsWith('.css')) {
          return true;
        }
        
        // Count occurrences of different units
        const pxCount = (fileContent.match(/\d+px/g) || []).length;
        const remCount = (fileContent.match(/\d+rem/g) || []).length;
        const emCount = (fileContent.match(/\d+em/g) || []).length;
        const percentCount = (fileContent.match(/\d+%/g) || []).length;
        
        // Allow some px, but prefer relative units
        const relativeCount = remCount + emCount + percentCount;
        const valid = relativeCount >= pxCount || pxCount < 10;
        
        return {
          valid,
          reason: valid ? '' : 'Too many px units used. Prefer relative units (rem, em, %) for better accessibility and responsiveness.'
        };
      }
    },
    {
      name: 'Define accessible color contrast',
      description: 'Ensure color combinations meet WCAG contrast requirements',
      validate: ({ fileContent, fileName }) => {
        // Only apply to CSS variables files or theme files
        if (!fileName.endsWith('.css') || 
            (!fileName.includes('variables') && !fileName.includes('theme') && !fileName.includes('colors'))) {
          return true;
        }
        
        // This is just a reminder - actual contrast checking would require a different tool
        const hasColorDefinitions = fileContent.match(/color:|background-color:/g);
        
        return {
          valid: true,
          reason: hasColorDefinitions ? 'Remember to check color contrast ratios with a tool like WebAIM Contrast Checker to ensure they meet WCAG requirements.' : ''
        };
      }
    },
    {
      name: 'Support reduced motion',
      description: 'Respect user preferences for reduced motion',
      validate: ({ fileContent, fileName }) => {
        // Only apply to CSS files with animations or transitions
        if (!fileName.endsWith('.css') || 
            (!fileContent.includes('animation') && !fileContent.includes('transition'))) {
          return true;
        }
        
        // Check for prefers-reduced-motion media query
        const hasReducedMotionSupport = fileContent.includes('@media (prefers-reduced-motion');
        
        return {
          valid: hasReducedMotionSupport,
          reason: hasReducedMotionSupport ? '' : 'Files with animations or transitions should include a @media (prefers-reduced-motion: reduce) query to respect user preferences.'
        };
      }
    },
    {
      name: 'Maintain a logical tab order',
      description: 'Avoid using tabindex with positive values',
      validate: ({ fileContent, fileName }) => {
        // Apply to both CSS files and React component files
        if (!fileName.endsWith('.css') && !fileName.match(/\.(tsx|jsx)$/)) {
          return true;
        }
        
        // Check for tabindex with positive values
        const hasPositiveTabIndex = fileContent.match(/tabindex="[1-9]\d*"/g) || 
                                    fileContent.match(/tabIndex=\{[1-9]\d*\}/g);
        
        return {
          valid: !hasPositiveTabIndex,
          reason: !hasPositiveTabIndex ? '' : 'Found tabindex with positive values. This disrupts the natural tab order and harms keyboard accessibility. Use tabindex="0" or re-order elements in the DOM.'
        };
      }
    },
    {
      name: 'Mobile-first responsive design',
      description: 'Use a mobile-first approach for responsive styling',
      validate: ({ fileContent, fileName }) => {
        // Only apply to CSS files
        if (!fileName.endsWith('.css')) {
          return true;
        }
        
        // Check for media queries
        const mediaQueries = fileContent.match(/@media[^{]*{/g) || [];
        
        // Count min-width (mobile-first) vs max-width (desktop-first) queries
        const minWidthQueries = mediaQueries.filter(q => q.includes('min-width')).length;
        const maxWidthQueries = mediaQueries.filter(q => q.includes('max-width')).length;
        
        // If there are media queries, ensure most are min-width
        if (mediaQueries.length > 0) {
          const valid = minWidthQueries >= maxWidthQueries;
          
          return {
            valid,
            reason: valid ? '' : 'Using more max-width than min-width media queries. Prefer a mobile-first approach with min-width queries.'
          };
        }
        
        return true;
      }
    },
    {
      name: 'Avoid !important',
      description: 'Avoid using !important in CSS as it makes maintenance difficult',
      validate: ({ fileContent, fileName }) => {
        // Only apply to CSS files
        if (!fileName.endsWith('.css')) {
          return true;
        }
        
        // Count !important declarations
        const importantCount = (fileContent.match(/!important/g) || []).length;
        
        return {
          valid: importantCount <= 3, // Allow a few in special cases
          reason: importantCount <= 3 ? '' : 'Too many !important declarations. This makes CSS harder to maintain and causes specificity issues.'
        };
      }
    }
  ]
}; 