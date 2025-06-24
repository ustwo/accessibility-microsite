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
 * Based on the actual CSV structure with pattern inheritance
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
    category: "web",
    where: "web",
    description: "Caption your videos, add descriptions to your images",
    linkyDinks: [
      { 
        title: "How a blind person uses a website", 
        url: "https://www.youtube.com/watch?v=OeC1WuAqQyM"
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
    name: "Support all devices",
    category: "mob",
    where: "mob",
    description: "Support portrait and landscape orientations",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-5",
    name: "Structure your content",
    category: "web",
    where: "web",
    description: "Use semantic HTML",
    linkyDinks: [
      { 
        title: "Make use of: 8 semantic tags", 
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element"
      }
    ],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-6",
    name: "Structure your content",
    category: "mob",
    where: "mob",
    description: "Setting up the accessibility tree correctly in iOS and Android makes TDD easier.",
    linkyDinks: [],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-7",
    name: "Support dark mode",
    category: "mob",
    where: "mob",
    description: "But make sure you honour the user's setting",
    linkyDinks: [
      { 
        title: "UXDesign: Peering into the a11y of Dark Mode", 
        url: "https://uxdesign.cc/peering-into-the-a11y-of-dark-mode-8c8b8b8b8b8b"
      }
    ],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-8",
    name: "Zoom all the way",
    category: "both",
    where: "both",
    description: "People should be able to zoom in up to 200% in order to read larger text without losing any content or functionality.",
    linkyDinks: [
      { 
        title: "Access guide", 
        url: "https://www.accessguide.io/guide/zoom"
      }
    ],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-9",
    name: "Zoom all the way",
    category: "web",
    where: "web",
    description: "Set all units in rem. This ensures all content on the page scales when users change the default font-size.",
    linkyDinks: [
      { 
        title: "CSS Tricks", 
        url: "https://css-tricks.com/rem-vs-em/"
      }
    ],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-10",
    name: "Zoom all the way",
    category: "mob",
    where: "mob",
    description: "Careful consideration required on mobile",
    linkyDinks: [
      { 
        title: "Medium: Font-scaling in React Native apps", 
        url: "https://medium.com/react-native-training/font-scaling-in-react-native-apps-4f3c6e5e5e5e"
      }
    ],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-11",
    name: "Colour blindness pallete - Graphs",
    category: "both",
    where: "both",
    description: "Accessible Colour Palletes",
    linkyDinks: [
      { 
        title: "Accessible Colour Palettes", 
        url: "https://www.color-blindness.com/color-blindness-tests/"
      }
    ],
    parentTitle: "General patterns to follow",
  },
  {
    id: "pattern-12",
    name: "Charts",
    category: "both",
    where: "both",
    description: "Better data Visualisation",
    linkyDinks: [
      { 
        title: "Smashing Magazine", 
        url: "https://www.smashingmagazine.com/2017/07/designing-accessible-data-visualizations/"
      }
    ],
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
    id: "pattern-13",
    name: "Start with one thing per page",
    category: "both",
    where: "both",
    description: "Asking one thing at a time turns forms into more of a conversation and works well on mobile and web.",
    linkyDinks: [
      { 
        title: "GOV.UK Service manual", 
        url: "https://www.gov.uk/service-manual/design/start-with-one-thing-per-page"
      }
    ],
    parentTitle: "Patterns for good forms",
  },
  {
    id: "pattern-14",
    name: "Structure your form to help users",
    category: "both",
    where: "both",
    description: "Asking a question doesn't necessarily mean you should use one form field. For example, date of birth is best captured with 3 text fields.",
    linkyDinks: [
      { 
        title: "GOV.UK Service manual", 
        url: "https://www.gov.uk/service-manual/design/form-structure"
      }
    ],
    parentTitle: "Patterns for good forms",
  },
  {
    id: "pattern-15",
    name: "Recovering from form errors",
    category: "mob",
    where: "mob",
    description: "One input per page\nValidation on blur (not keypress i.e. not live)\nError messages read out\nFocus moves straight back to the input",
    linkyDinks: [],
    parentTitle: "Patterns for good forms",
  },
  {
    id: "pattern-16",
    name: "Recovering from form errors",
    category: "web",
    where: "web",
    description: "Validate on submit, move focus to an Error summary component, link to the input with the error.",
    linkyDinks: [
      { 
        title: "GOV.UK Design system", 
        url: "https://design-system.service.gov.uk/components/error-summary/"
      },
      { 
        title: "National Grid's new bank account form", 
        url: "https://www.nationalgrid.com/uk/contact-us/bank-account-form"
      }
    ],
    parentTitle: "Patterns for good forms",
  },
  {
    id: "pattern-17",
    name: "Inputting dates",
    category: "both",
    where: "both",
    description: "Allow users to enter day, month and year themselves. Only use calendar controls if users need to pick a date in the near future or recent past, or in other limited situations.",
    linkyDinks: [
      { 
        title: "GOV.UK Design system", 
        url: "https://design-system.service.gov.uk/components/date-input/"
      }
    ],
    parentTitle: "Patterns for good forms",
  },
  // Section header
  {
    id: "section-3",
    name: "Patterns for interactions",
    category: "",
    where: "",
    description: "",
    linkyDinks: [],
    isSection: true,
  },
  {
    id: "pattern-18",
    name: "Support reduce motion setting",
    category: "web",
    where: "web",
    description: "Use a CSS media query to disable all animations for users who have set their system preferences to \"reduce motion\"",
    linkyDinks: [
      { 
        title: "Elijah Manor's website", 
        url: "https://elijahmanor.com/blog/reduce-motion"
      }
    ],
    parentTitle: "Patterns for interactions",
  },
  {
    id: "pattern-19",
    name: "Working with drag'n'drop",
    category: "both",
    where: "both",
    description: "Drag and drop doesn't need to be a terrible user experience for people who don't like mice.",
    linkyDinks: [
      { 
        title: "Salesforce UX", 
        url: "https://www.lightningdesignsystem.com/components/drag-and-drop/"
      }
    ],
    parentTitle: "Patterns for interactions",
  },
  {
    id: "pattern-20",
    name: "Resizing in one dimension",
    category: "both",
    where: "both",
    description: "Ensure you can use the keyboard and arrow keys for this typically-mouse-based interaction",
    linkyDinks: [
      { 
        title: "Salesforce UX", 
        url: "https://www.lightningdesignsystem.com/components/resizable-panels/"
      }
    ],
    parentTitle: "Patterns for interactions",
  },
  {
    id: "pattern-21",
    name: "Working with lists",
    category: "both",
    where: "both",
    description: "Some great examples of making common list-based interactions accessible",
    linkyDinks: [
      { 
        title: "Salesforce UX", 
        url: "https://www.lightningdesignsystem.com/components/data-tables/"
      }
    ],
    parentTitle: "Patterns for interactions",
  },
  {
    id: "pattern-22",
    name: "\"Learn more\" links",
    category: "web",
    where: "web",
    description: "Retain the Learn More format and add descriptive keywords for screen readers.",
    linkyDinks: [
      { 
        title: "NN Group: 'Learn More' Links – You Can Do Better", 
        url: "https://www.nngroup.com/articles/learn-more-links/"
      }
    ],
    parentTitle: "Patterns for interactions",
  },
  // Section header
  {
    id: "section-4",
    name: "Patterns for components",
    category: "",
    where: "",
    description: "",
    linkyDinks: [],
    isSection: true,
  },
  {
    id: "pattern-23",
    name: "Text input",
    category: "both",
    where: "both",
    description: "Include hint text in the input's label, so it is read out when input is focused / entered e.g. \"Email address, You must enter your government email...\"",
    linkyDinks: [
      { 
        title: "U.S. Web Design System", 
        url: "https://designsystem.digital.gov/components/text-input/"
      }
    ],
    parentTitle: "Patterns for components",
  },
  {
    id: "pattern-24",
    name: "Checkbox",
    category: "both",
    where: "both",
    description: "Tab moves you between checkbox options, in addition, group label is read",
    linkyDinks: [
      { 
        title: "U.S. Web Design System", 
        url: "https://designsystem.digital.gov/components/checkbox/"
      }
    ],
    parentTitle: "Patterns for components",
  },
  {
    id: "pattern-25",
    name: "Datepickers",
    category: "both",
    where: "both",
    description: "If you must use calendar control (see Inputting dates pattern above), use arrow keys to navigate between date picker dates. Use an off-the-shelf accessible date picker.",
    linkyDinks: [
      { 
        title: "GOV.UK Design system", 
        url: "https://design-system.service.gov.uk/components/date-input/"
      }
    ],
    parentTitle: "Patterns for components",
  },
  {
    id: "pattern-26",
    name: "Tooltips",
    category: "both",
    where: "both",
    description: "Tooltips should support hover, click, tap and the revealed content should be read out by screen readers.",
    linkyDinks: [
      { 
        title: "National Grid's accessible tooltip", 
        url: "https://www.nationalgrid.com/uk/accessibility"
      }
    ],
    parentTitle: "Patterns for components",
  },
  {
    id: "pattern-27",
    name: "Graphs",
    category: "both",
    where: "both",
    description: "Use a charting library that supports accessibility out-of-the-box, such as HighCharts. Define a logical keyboard navigation using ↑ ↓ → ← on keyboard",
    linkyDinks: [
      { 
        title: "Highcharts examples", 
        url: "https://www.highcharts.com/docs/accessibility/accessibility-module"
      }
    ],
    parentTitle: "Patterns for components",
  },
  {
    id: "pattern-28",
    name: "Error summary",
    category: "web",
    where: "web",
    description: "Show a list of errors with links to individual errors",
    linkyDinks: [
      { 
        title: "GOV.UK Design system", 
        url: "https://design-system.service.gov.uk/components/error-summary/"
      }
    ],
    parentTitle: "Patterns for components",
  },
  {
    id: "pattern-29",
    name: "Error message",
    category: "web",
    where: "web",
    description: "Make sure error messages appear after the label and before the input.",
    linkyDinks: [
      { 
        title: "GOV.UK Design system", 
        url: "https://design-system.service.gov.uk/components/error-message/"
      }
    ],
    parentTitle: "Patterns for components",
  },
  {
    id: "pattern-30",
    name: "Carousel",
    category: "both",
    where: "both",
    description: "Complex gestures must have a simple alternative to meet WCAG AA compliance. Here are some examples I usually refer to as inspiration for Carousel:",
    linkyDinks: [
      { 
        title: "Carousel with arrows as sliders", 
        url: "https://www.w3.org/WAI/ARIA/apg/example-index/carousel/carousel-1.html"
      },
      { 
        title: "Carousel with Pips as sliders", 
        url: "https://www.w3.org/WAI/ARIA/apg/example-index/carousel/carousel-2.html"
      },
      { 
        title: "Article on Accessible Carousels", 
        url: "https://www.smashingmagazine.com/2015/07/designing-accessible-carousels/"
      }
    ],
    parentTitle: "Patterns for components",
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