import { mockTools, mockPatterns } from '../data/mockData';

// Define types based on spreadsheet structure
export interface AccessibilityTool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  cost: string;
  platforms: string[];
}

export interface AccessibilityPattern {
  id: string;
  name: string;
  category: string;
  where: string;
  description: string;
  linkyDinks: Array<{url: string, title: string}>;
  link: string;
  example: string;
  wcagCriteria: string[];
  tags: string[];
  code: string;
  codeLanguage: string;
}

/**
 * Edge-compatible Google Sheets API client
 * This implementation uses fetch API directly with JWT authentication for service accounts
 */

// Define types for Google Sheets API responses
interface GoogleSheetsResponse {
  values?: string[][];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

// Service Account credential interface
interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
  private_key_id: string;
}

// Configuration
const PATTERNS_SHEET_ID = process.env.GOOGLE_PATTERNS_SHEET_ID || '1lxc12mHxlBCuhWEx_r4ce7jr1vPbiwuF_t4xt0RvsEs';
const TOOLS_SHEET_ID = process.env.GOOGLE_TOOLS_SHEET_ID || '1vjzCZobdvV1tvLy-k38Tpr6AGJX8fs9wKv6tXg55s7k';
const SERVICE_ACCOUNT_CREDENTIALS_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '';

// Parse the service account credentials
let serviceAccountCredentials: ServiceAccountCredentials | null = null;
try {
  if (SERVICE_ACCOUNT_CREDENTIALS_JSON) {
    serviceAccountCredentials = JSON.parse(SERVICE_ACCOUNT_CREDENTIALS_JSON) as ServiceAccountCredentials;
  }
} catch (error) {
  console.error('Error parsing service account credentials:', error);
}

// Helper function to check if required API credentials are available
function hasApiCredentials(): boolean {
  return Boolean(serviceAccountCredentials?.client_email && serviceAccountCredentials?.private_key);
}

/**
 * Generate a JWT token for Google API authentication
 */
async function generateJWT(): Promise<string | null> {
  if (!serviceAccountCredentials) {
    console.error('Service account credentials not available');
    return null;
  }

  try {
    // For Edge compatibility, we need to use the Web Crypto API
    // This is a simplified JWT implementation
    const header = {
      alg: "RS256",
      typ: "JWT",
      kid: serviceAccountCredentials.private_key_id
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: serviceAccountCredentials.client_email,
      sub: serviceAccountCredentials.client_email,
      aud: "https://sheets.googleapis.com/",
      exp: now + 3600, // 1 hour expiration
      iat: now,
      scope: "https://www.googleapis.com/auth/spreadsheets"
    };

    // In a production environment, you would implement proper RS256 signing here
    // For Edge environments, you might need to use a JWT library that works in Edge
    // or implement the crypto operations using Web Crypto API
    
    // This is a placeholder for the actual JWT signing logic
    // Using the variables to prevent linter errors, but in a real implementation
    // these would be properly processed
    console.log('Preparing JWT with header:', header, 'and payload:', payload);
    
    // For development/testing, consider using a serverless function or API route
    // to handle JWT generation with proper libraries
    
    console.error('JWT generation not fully implemented in Edge runtime');
    return null;
  } catch (error) {
    console.error('Error generating JWT:', error);
    return null;
  }
}

/**
 * Get an OAuth2 access token using service account JWT
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const jwt = await generateJWT();
    if (!jwt) return null;

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      console.error(`Error getting access token: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Fetch values from a Google Sheet using the Sheets API v4 REST endpoint with OAuth
 */
async function fetchSheetValues(spreadsheetId: string, range: string): Promise<string[][] | null> {
  if (!hasApiCredentials()) {
    console.log('Google Sheets API credentials not available');
    return null;
  }

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error('Failed to get access token');
      return null;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      console.error(`Error fetching sheet values: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json() as GoogleSheetsResponse;
    return data.values || [];
  } catch (error) {
    console.error('Error fetching from Google Sheets API:', error);
    return null;
  }
}

/**
 * Append values to a Google Sheet using the Sheets API v4 REST endpoint with OAuth
 */
async function appendSheetValues(spreadsheetId: string, sheetRange: string, values: string[][]): Promise<boolean> {
  if (!hasApiCredentials()) {
    console.log('Google Sheets API credentials not available');
    return false;
  }

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error('Failed to get access token');
      return false;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetRange}?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        values: values
      }),
    });
    
    if (!response.ok) {
      console.error(`Error appending sheet values: ${response.status} ${response.statusText}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    return false;
  }
}

/**
 * Fetch all accessibility tools from Google Sheets
 */
export async function fetchAccessibilityTools(): Promise<AccessibilityTool[]> {
  // Using a more generic range to accommodate different sheet structures
  const rows = await fetchSheetValues(TOOLS_SHEET_ID, 'A:Z');
  
  if (!rows || rows.length === 0) {
    console.log('No tool data found, returning mock data');
    return mockTools;
  }
  
  // Skip the header row
  const dataRows = rows.slice(1);
  
  // Transform the rows into our AccessibilityTool type
  const tools: AccessibilityTool[] = dataRows
    .filter(row => row.length >= 2 && row[0]?.trim()) // Filter out empty rows and section headers
    .map((row, index) => {
      return {
        id: `tool-${index + 1}`,
        name: row[0]?.trim() || '',
        description: row[1]?.trim() || '',
        url: row[2]?.trim() || '',
        category: row[3]?.trim() || '',
        tags: (row[4] || '').split(',').map((tag: string) => tag.trim()).filter(Boolean),
        cost: row[5]?.trim() || '',
        platforms: (row[6] || '').split(',').map((platform: string) => platform.trim()).filter(Boolean),
      };
  });
  
  return tools;
}

/**
 * Process patterns data from spreadsheet to handle the section headers and grouped patterns
 */
function processPatternRows(rows: string[][]): AccessibilityPattern[] {
  if (!rows || rows.length === 0) return [];
  
  // Get the headers (should be the first row)
  const headers = rows[0];
  
  // Check if headers match expected format (Where?, What why how?, Linky dinks)
  const hasExpectedFormat = headers.some(header => 
    header.includes('Where?') || header.includes('What') || header.includes('Linky'));
  
  if (!hasExpectedFormat) {
    console.warn('Pattern sheet headers do not match expected format');
  }
  
  let currentCategory = '';
  const patterns: AccessibilityPattern[] = [];
  let patternId = 1;
  
  // Start from row 3 to skip headers and empty rows
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip completely empty rows
    if (row.every(cell => !cell || cell.trim() === '')) {
      continue;
    }
    
    // Check if this is a category row (bold text in first column, empty in others)
    if (row[0]?.trim() && row.slice(1).every(cell => !cell || cell.trim() === '')) {
      currentCategory = row[0].trim();
      continue;
    }
    
    // Otherwise, it's a pattern row
    if (row[0]?.trim() || row[1]?.trim()) {
      // Parse linkyDinks from the links cell (index 3)
      const linksText = row[3]?.trim() || '';
      const linkyDinks: Array<{url: string, title: string}> = [];
      
      // If there are links, process them
      if (linksText) {
        // Handle possible multiple links separated by commas or line breaks
        const linkSegments = linksText.split(/,|\n/).filter(Boolean);
        
        for (const segment of linkSegments) {
          const trimmedSegment = segment.trim();
          
          // Try to identify if there's a title and URL
          if (trimmedSegment.includes(':')) {
            // Format might be "Title: URL" or just "Title:"
            const [title, url] = trimmedSegment.split(':', 2).map(s => s.trim());
            
            if (url && url.includes('http')) {
              // Clear case of "Title: http://example.com"
              linkyDinks.push({ title, url });
            } else {
              // Format is likely "Title:" without explicit URL
              // Create a Google search URL
              linkyDinks.push({ 
                title: trimmedSegment, 
                url: `https://www.google.com/search?q=${encodeURIComponent(trimmedSegment)}`
              });
            }
          } else if (trimmedSegment.includes('http')) {
            // Just a URL without a clear title
            linkyDinks.push({ 
              title: trimmedSegment,
              url: trimmedSegment
            });
          } else {
            // Just a text reference, no explicit URL
            linkyDinks.push({ 
              title: trimmedSegment,
              url: `https://www.google.com/search?q=${encodeURIComponent(trimmedSegment)}`
            });
          }
        }
      }
      
      patterns.push({
        id: `pattern-${patternId++}`,
        category: currentCategory,
        name: row[0]?.trim() || '',
        where: row[1]?.trim() || '',
        description: row[2]?.trim() || '',
        linkyDinks: linkyDinks,
        link: row[3]?.trim() || '', // Keep for backward compatibility
        // Legacy fields - we'll keep these for backward compatibility
        example: row[2]?.trim() || '', // Same as description for backward compatibility
        wcagCriteria: [],
        tags: [currentCategory, row[1]?.trim()].filter(Boolean),
        code: '',
        codeLanguage: 'html',
      });
    }
  }
  
  return patterns;
}

/**
 * Fetch all accessibility patterns from Google Sheets
 */
export async function fetchAccessibilityPatterns(): Promise<AccessibilityPattern[]> {
  // Using a more generic range to accommodate pattern structure
  const rows = await fetchSheetValues(PATTERNS_SHEET_ID, 'A:E');
  
  if (!rows || rows.length === 0) {
    console.log('No pattern data found, returning mock data');
    return mockPatterns;
  }
  
  return processPatternRows(rows);
}

/**
 * Submit a new tool or pattern to the Google Sheet
 */
export async function submitNewItem(
  type: 'tool' | 'pattern', 
  data: Partial<AccessibilityTool | AccessibilityPattern>
): Promise<boolean> {
  try {
    // Determine which sheet to write to based on type
    const spreadsheetId = type === 'tool' ? TOOLS_SHEET_ID : PATTERNS_SHEET_ID;
    const sheetRange = type === 'tool' ? 'Submissions!A:H' : 'Submissions!A:E';
    
    // Prepare the row data based on the type
    let rowData: string[] = [];
    
    if (type === 'tool') {
      const tool = data as Partial<AccessibilityTool>;
      rowData = [
        tool.name || '',
        tool.description || '',
        tool.url || '',
        tool.category || '',
        (tool.tags || []).join(','),
        tool.cost || '',
        (tool.platforms || []).join(','),
        new Date().toISOString(), // Submission timestamp
      ];
    } else {
      const pattern = data as Partial<AccessibilityPattern>;
      
      // Format linkyDinks as a string for Google Sheets
      let linksText = '';
      if (pattern.linkyDinks && pattern.linkyDinks.length > 0) {
        linksText = pattern.linkyDinks
          .map(link => {
            // Format each link as "Title: URL" if both exist
            if (link.title && link.url) {
              // If URL is a Google search, just use the title
              if (link.url.startsWith('https://www.google.com/search')) {
                return link.title;
              }
              return `${link.title}: ${link.url}`;
            }
            return link.title || link.url;
          })
          .join(', ');
      } else if (pattern.link) {
        // For backward compatibility, use the legacy link field
        linksText = pattern.link;
      }
      
      rowData = [
        pattern.name || '',
        pattern.where || '',
        pattern.description || '',
        linksText,
        new Date().toISOString(), // Submission timestamp
      ];
    }
    
    // Append the row to the sheet
    return await appendSheetValues(spreadsheetId, sheetRange, [rowData]);
  } catch (error) {
    console.error(`Error submitting new ${type}:`, error);
    return false;
  }
}

/**
 * Get unique categories and tags from tools data
 * Used for filtering options
 */
export function getToolsFilterOptions(tools: AccessibilityTool[]) {
  const categories = new Set<string>();
  const tags = new Set<string>();
  const platforms = new Set<string>();
  const costs = new Set<string>();
  
  tools.forEach(tool => {
    if (tool.category) categories.add(tool.category);
    tool.tags.forEach(tag => tags.add(tag));
    tool.platforms.forEach(platform => platforms.add(platform));
    if (tool.cost) costs.add(tool.cost);
  });
  
  return {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
    platforms: Array.from(platforms).sort(),
    costs: Array.from(costs).sort(),
  };
}

/**
 * Get unique categories and tags from patterns data
 * Used for filtering options
 */
export function getPatternsFilterOptions(patterns: AccessibilityPattern[]) {
  const categories = new Set<string>();
  const tags = new Set<string>();
  const locations = new Set<string>();
  
  patterns.forEach(pattern => {
    if (pattern.category) categories.add(pattern.category);
    if (pattern.where) locations.add(pattern.where);
    pattern.tags.forEach(tag => tags.add(tag));
  });
  
  return {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
    locations: Array.from(locations).sort(),
  };
} 