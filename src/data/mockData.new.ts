import { AccessibilityTool, AccessibilityPattern } from "../utils/googleSheets";

/**
 * Mock accessibility tools data for development
 */
export const mockTools: AccessibilityTool[] = [
  {
    id: "tool-0",
    name: "Figma: Colour contrast checking",
    description: "Colour and contrast testing using Figma plug-ins - SHNU and NG (Dom and Kin)",
    url: "https://www.figma.com/community/plugin/731310036968334777/A11y---Focus-Orderer",
    discipline: ["Design"],
    source: "external",
    notes: ""
  },
  {
    id: "tool-1",
    name: "Polypane",
    description: "Browser tool for testing aspects of accessibility",
    url: "https://polypane.app/docs/accessibility-overview/",
    discipline: ["Design", "Tech", "QA"],
    source: "external",
    notes: ""
  },
  {
    id: "tool-2",
    name: "Accessibility Not-Checklist",
    description: "Accesibility Not check list",
    url: "https://not-checklist.intopia.digital/",
    discipline: ["Design", "Tech", "QA"],
    source: "external",
    notes: "Consider using ustwo's bespoke version in row 5"
  },
  {
    id: "tool-3",
    name: "Funkify",
    description: "Disability simulator",
    url: "https://www.funkify.org/",
    discipline: ["Design", "Tech", "QA"],
    source: "external",
    notes: ""
  },
  {
    id: "tool-4",
    name: "axe",
    description: "Unit testing",
    url: "https://www.deque.com/axe/devtools/",
    discipline: ["Tech", "QA"],
    source: "external",
    notes: ""
  },
  {
    id: "tool-5",
    name: "VO Starter",
    description: "Voiceover training app",
    url: "https://apps.apple.com/ca/app/vo-starter/id6455786629",
    discipline: ["All"],
    source: "external",
    notes: ""
  }
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
  },
  {
    id: "pattern-3",
    name: "Support all devices",
    category: "General patterns to follow",
    where: "web",
    description: "Use responsive design",
    linkyDinks: [],
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