import { AccessibilityTool, AccessibilityPattern } from "../utils/edgeGoogleSheets";

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
    name: "Put the user in control",
    category: "General patterns to follow",
    where: "all",
    description: "Considering auto-playing a video? Just make sure you provide playback controls!",
    linkyDinks: [],
    link: "",
    // Legacy fields for backward compatibility 
    example: "Considering auto-playing a video? Just make sure you provide playback controls!",
    wcagCriteria: [],
    tags: ["General patterns to follow", "all"],
    code: "",
    codeLanguage: "html",
  },
  {
    id: "pattern-2",
    name: "Be more alternative",
    category: "General patterns to follow",
    where: "all",
    description: "Caption your videos, add descriptions to your images",
    linkyDinks: [
      { 
        title: "Youtube: How a blind person uses a website", 
        url: "https://www.google.com/search?q=Youtube: How a blind person uses a website"
      }
    ],
    link: "Youtube: How a blind person uses a website",
    // Legacy fields for backward compatibility
    example: "Caption your videos, add descriptions to your images",
    wcagCriteria: [],
    tags: ["General patterns to follow", "all"],
    code: "",
    codeLanguage: "html",
  },
  {
    id: "pattern-3",
    name: "Support all devices",
    category: "General patterns to follow",
    where: "web",
    description: "Use responsive design",
    linkyDinks: [],
    link: "",
    // Legacy fields for backward compatibility
    example: "Use responsive design",
    wcagCriteria: [],
    tags: ["General patterns to follow", "web"],
    code: "",
    codeLanguage: "html",
  },
  {
    id: "pattern-4",
    name: "Start with one thing per page",
    category: "Patterns for good forms",
    where: "all",
    description: "Asking one thing at a time turns forms into more of a conversation and works well on mobile and web.",
    linkyDinks: [
      { 
        title: "GOV.UK Service manual", 
        url: "https://www.google.com/search?q=GOV.UK Service manual"
      }
    ],
    link: "GOV.UK Service manual",
    // Legacy fields for backward compatibility
    example: "Asking one thing at a time turns forms into more of a conversation and works well on mobile and web.",
    wcagCriteria: [],
    tags: ["Patterns for good forms", "all"],
    code: "",
    codeLanguage: "html",
  },
  {
    id: "pattern-5",
    name: "Structure your form to help users",
    category: "Patterns for good forms",
    where: "all",
    description: "Asking a question doesn't necessarily mean you should use one form field. For example, date of birth is best captured with 3 text fields.",
    linkyDinks: [
      { 
        title: "GOV.UK Service manual", 
        url: "https://www.google.com/search?q=GOV.UK Service manual"
      }
    ],
    link: "GOV.UK Service manual",
    // Legacy fields for backward compatibility
    example: "Asking a question doesn't necessarily mean you should use one form field. For example, date of birth is best captured with 3 text fields.",
    wcagCriteria: [],
    tags: ["Patterns for good forms", "all"],
    code: "",
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