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
  // Section header
  {
    id: "section-1",
    name: "General patterns to follow",
    category: "",
    where: "",
    description: "",
    linkyDinks: [],
    isSection: true,
  },
  {
    id: "pattern-1",
    name: "Put the user in control",
    category: "both",
    where: "both",
    description: "Considering auto-playing a video? Just make sure you provide playback controls!",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-2",
    name: "Be more alternative",
    category: "both",
    where: "both",
    description: "Caption your videos, add descriptions to your images",
    linkyDinks: [
      { 
        title: "Youtube: How a blind person uses a website", 
        url: "https://www.google.com/search?q=Youtube: How a blind person uses a website"
      }
    ],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-3",
    name: "Support all devices",
    category: "web",
    where: "web",
    description: "Use responsive design",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-4",
    name: "Use semantic HTML",
    category: "both",
    where: "both",
    description: "Use proper HTML elements for their intended purpose",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-5",
    name: "Provide clear navigation",
    category: "both",
    where: "both",
    description: "Ensure users can easily navigate through your content",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-6",
    name: "Use sufficient color contrast",
    category: "both",
    where: "both",
    description: "Ensure text has enough contrast against its background",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-7",
    name: "Make touch targets large enough",
    category: "mob",
    where: "mob",
    description: "Ensure touch targets are at least 44x44 points",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-8",
    name: "Provide keyboard navigation",
    category: "web",
    where: "web",
    description: "Ensure all interactive elements can be accessed via keyboard",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  // Section header
  {
    id: "section-2",
    name: "Patterns for good forms",
    category: "",
    where: "",
    description: "",
    linkyDinks: [],
    isSection: true,
  },
  {
    id: "pattern-9",
    name: "Start with one thing per page",
    category: "both",
    where: "both",
    description: "Asking one thing at a time turns forms into more of a conversation and works well on mobile and web.",
    linkyDinks: [
      { 
        title: "GOV.UK Service manual", 
        url: "https://www.google.com/search?q=GOV.UK Service manual"
      }
    ],
    parentTitle: "Patterns for good forms",
  },
  {
    id: "pattern-10",
    name: "Structure your form to help users",
    category: "both",
    where: "both",
    description: "Asking a question doesn't necessarily mean you should use one form field. For example, date of birth is best captured with 3 text fields.",
    linkyDinks: [
      { 
        title: "GOV.UK Service manual", 
        url: "https://www.google.com/search?q=GOV.UK Service manual"
      }
    ],
    parentTitle: "Patterns for good forms",
  },
  {
    id: "pattern-11",
    name: "Use clear labels",
    category: "both",
    where: "both",
    description: "Provide descriptive labels for all form fields",
    linkyDinks: [],
    parentTitle: "Patterns for good forms",
  },
  {
    id: "pattern-12",
    name: "Show validation errors clearly",
    category: "both",
    where: "both",
    description: "Display error messages in a clear and helpful way",
    linkyDinks: [],
    parentTitle: "Patterns for good forms",
  },
  {
    id: "pattern-13",
    name: "Use autocomplete where appropriate",
    category: "web",
    where: "web",
    description: "Help users fill in forms faster with autocomplete",
    linkyDinks: [],
    parentTitle: "Patterns for good forms",
  },
  // Section header
  {
    id: "section-3",
    name: "Content patterns",
    category: "",
    where: "",
    description: "",
    linkyDinks: [],
    isSection: true,
  },
  {
    id: "pattern-14",
    name: "Write clear headings",
    category: "both",
    where: "both",
    description: "Use descriptive headings that clearly indicate the content that follows",
    linkyDinks: [],
    parentTitle: "Content patterns",
  },
  {
    id: "pattern-15",
    name: "Use plain language",
    category: "both",
    where: "both",
    description: "Write in simple, clear language that everyone can understand",
    linkyDinks: [],
    parentTitle: "Content patterns",
  },
  {
    id: "pattern-16",
    name: "Provide alt text for images",
    category: "both",
    where: "both",
    description: "Describe images for users who cannot see them",
    linkyDinks: [],
    parentTitle: "Content patterns",
  },
  {
    id: "pattern-17",
    name: "Use descriptive link text",
    category: "both",
    where: "both",
    description: "Make link text clear and descriptive",
    linkyDinks: [],
    parentTitle: "Content patterns",
  },
  {
    id: "pattern-18",
    name: "Provide transcripts for audio",
    category: "both",
    where: "both",
    description: "Include text transcripts for audio content",
    linkyDinks: [],
    parentTitle: "Content patterns",
  },
  // Section header
  {
    id: "section-4",
    name: "Navigation patterns",
    category: "",
    where: "",
    description: "",
    linkyDinks: [],
    isSection: true,
  },
  {
    id: "pattern-19",
    name: "Use consistent navigation",
    category: "both",
    where: "both",
    description: "Keep navigation consistent across your site",
    linkyDinks: [],
    parentTitle: "Navigation patterns",
  },
  {
    id: "pattern-20",
    name: "Provide breadcrumbs",
    category: "web",
    where: "web",
    description: "Help users understand where they are in your site",
    linkyDinks: [],
    parentTitle: "Navigation patterns",
  },
  {
    id: "pattern-21",
    name: "Use clear menu labels",
    category: "both",
    where: "both",
    description: "Make menu items easy to understand",
    linkyDinks: [],
    parentTitle: "Navigation patterns",
  },
  {
    id: "pattern-22",
    name: "Provide skip links",
    category: "web",
    where: "web",
    description: "Allow users to skip to main content",
    linkyDinks: [],
    parentTitle: "Navigation patterns",
  },
  // Section header
  {
    id: "section-5",
    name: "Interactive patterns",
    category: "",
    where: "",
    description: "",
    linkyDinks: [],
    isSection: true,
  },
  {
    id: "pattern-23",
    name: "Use focus indicators",
    category: "both",
    where: "both",
    description: "Make it clear which element has focus",
    linkyDinks: [],
    parentTitle: "Interactive patterns",
  },
  {
    id: "pattern-24",
    name: "Provide loading states",
    category: "both",
    where: "both",
    description: "Show users when content is loading",
    linkyDinks: [],
    parentTitle: "Interactive patterns",
  },
  {
    id: "pattern-25",
    name: "Use progressive disclosure",
    category: "web",
    where: "web",
    description: "Show information progressively to avoid overwhelming users",
    linkyDinks: [],
    parentTitle: "Interactive patterns",
  },
  {
    id: "pattern-26",
    name: "Provide undo functionality",
    category: "both",
    where: "both",
    description: "Allow users to undo their actions",
    linkyDinks: [],
    parentTitle: "Interactive patterns",
  },
  {
    id: "pattern-27",
    name: "Use confirmation dialogs",
    category: "both",
    where: "both",
    description: "Ask for confirmation before destructive actions",
    linkyDinks: [],
    parentTitle: "Interactive patterns",
  },
  // Section header
  {
    id: "section-6",
    name: "Mobile-specific patterns",
    category: "",
    where: "",
    description: "",
    linkyDinks: [],
    isSection: true,
  },
  {
    id: "pattern-28",
    name: "Use swipe gestures",
    category: "mob",
    where: "mob",
    description: "Implement intuitive swipe gestures for common actions",
    linkyDinks: [],
    parentTitle: "Mobile-specific patterns",
  },
  {
    id: "pattern-29",
    name: "Optimize for thumb navigation",
    category: "mob",
    where: "mob",
    description: "Place important elements within thumb reach",
    linkyDinks: [],
    parentTitle: "Mobile-specific patterns",
  },
  {
    id: "pattern-30",
    name: "Use native patterns",
    category: "mob",
    where: "mob",
    description: "Follow platform conventions for familiar user experience",
    linkyDinks: [],
    parentTitle: "Mobile-specific patterns",
  },
  {
    id: "pattern-31",
    name: "Handle orientation changes",
    category: "mob",
    where: "mob",
    description: "Ensure your app works in both portrait and landscape",
    linkyDinks: [],
    parentTitle: "Mobile-specific patterns",
  },
  {
    id: "pattern-32",
    name: "Provide haptic feedback",
    category: "mob",
    where: "mob",
    description: "Use haptic feedback to enhance user experience",
    linkyDinks: [],
    parentTitle: "Mobile-specific patterns",
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