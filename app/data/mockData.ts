import { AccessibilityTool, AccessibilityPattern } from "../utils/edgeGoogleSheets";

/**
 * Mock accessibility tools data for development
 */
export const mockTools: AccessibilityTool[] = [
  {
    id: "tool-1",
    discipline: ["All", "Client"],
    source: "ustwo",
    name: "ustwo Studio Voice",
    url: "Link",
    description: "Use this to confidently sell our work. A one pager of where we stand.",
    notes: "",
  },
  {
    id: "tool-2",
    discipline: ["All", "Client"],
    source: "ustwo",
    name: "ustwo Inclusivity Principles",
    url: "Link",
    description: "Use this as guidance for your best practice!",
    notes: "",
  },
  {
    id: "tool-3",
    discipline: ["Product", "Design", "Tech", "QA", "Client"],
    source: "ustwo",
    name: "WCAG 2.2 Checklist",
    url: "Link",
    description: "ustwo's WCAG checklist - get to know!",
    notes: "",
  },
  {
    id: "tool-4",
    discipline: ["Client"],
    source: "ustwo",
    name: "ustwo Success Stories",
    url: "Link",
    description: "Overview of standout moments across projects",
    notes: "",
  },
  {
    id: "tool-5",
    discipline: ["Design", "Tech", "Product"],
    source: "ustwo",
    name: "Pattern Library",
    url: "Link",
    description: "Apply established best practice patterns. Only create your own when you really need to.",
    notes: "",
  },
  {
    id: "tool-6",
    discipline: ["Design", "Product", "QA", "Tech"],
    source: "ustwo",
    name: "Quick review checklist",
    url: "Link",
    description: "A quick checklist to be used for reviews by Dev, Design, Product, Delivery + QA, once details of the WCAG2.2 are known",
    notes: "",
  },
  {
    id: "tool-7",
    discipline: ["All"],
    source: "ustwo",
    name: "Mobile and web testing templates",
    url: "Link",
    description: "Use these templates to capture accessibility feedback for websites and apps",
    notes: "",
  },
  {
    id: "tool-8",
    discipline: ["Delivery", "Strategy", "Product"],
    source: "ustwo",
    name: "Example Definitions of Done and Ready",
    url: "Link",
    description: "Use these to set up your dev and design teams for success",
    notes: "",
  },
  {
    id: "tool-9",
    discipline: ["All"],
    source: "ustwo",
    name: "Screen reader tutorial",
    url: "Link",
    description: "Instructions of how to use a screen reader",
    notes: "",
  },
  {
    id: "tool-10",
    discipline: ["Client"],
    source: "ustwo",
    name: "Pitch slides",
    url: "WIP",
    description: "For use in pitches to showcase our experience creating inclusive and accessible experiences",
    notes: "",
  },
  {
    id: "tool-11",
    discipline: ["Design"],
    source: "ustwo",
    name: "Colour contrast - font size - and other tools",
    url: "Link",
    description: "",
    notes: "",
  },
  {
    id: "tool-12",
    discipline: ["Design"],
    source: "external",
    name: "Figma: Colour contrast checking",
    url: "Link",
    description: "Colour and contrast testing using Figma plug-ins - SHNU and NG (Dom and Kin)",
    notes: "",
  },
  {
    id: "tool-13",
    discipline: ["Design", "Tech", "QA"],
    source: "external",
    name: "Polypane",
    url: "Link",
    description: "Browser tool for testing aspects of accessibility",
    notes: "",
  },
  {
    id: "tool-14",
    discipline: ["Design", "Tech", "QA"],
    source: "external",
    name: "Accessibility Not-Checklist",
    url: "Link",
    description: "Accesibility Not check list",
    notes: "Consider using ustwo's bespoke version in row 5",
  },
  {
    id: "tool-15",
    discipline: ["Design", "Tech", "QA"],
    source: "external",
    name: "Funkify",
    url: "Link",
    description: "Disability simulator",
    notes: "",
  },
  {
    id: "tool-16",
    discipline: ["Tech", "QA"],
    source: "external",
    name: "axe",
    url: "Link",
    description: "Unit testing",
    notes: "",
  },
  {
    id: "tool-17",
    discipline: ["All"],
    source: "external",
    name: "VO Starter",
    url: "Link",
    description: "Voiceover training app",
    notes: "",
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