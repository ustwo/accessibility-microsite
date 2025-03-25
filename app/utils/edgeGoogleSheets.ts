import { mockTools, mockPatterns } from '../data/mockData';

// Define types based on spreadsheet structure
export interface AccessibilityTool {
  id: string;
  name: string;
  description: string;
  url: string;
  discipline: string[];
  source: string;
  notes: string;
}

export interface AccessibilityPattern {
  id: string;
  name: string;
  category: string;
  where: string;
  description: string;
  linkyDinks: Array<{url: string, title: string}>;
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

// Environment detection that works in Edge functions
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || (process.env.NETLIFY_DEV === 'true');

// Ensure crypto is available (Edge environments should have this)
const cryptoAPI = crypto || (globalThis as unknown as { crypto: Crypto }).crypto;

if (!cryptoAPI || !cryptoAPI.subtle) {
  console.error('Web Crypto API is not available in this environment');
}

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
export function hasApiCredentials(): boolean {
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
    // This is a proper JWT implementation using Web Crypto API
    const header = {
      alg: "RS256",
      typ: "JWT",
      kid: serviceAccountCredentials.private_key_id
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: serviceAccountCredentials.client_email,
      sub: serviceAccountCredentials.client_email,
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600, // 1 hour expiration
      iat: now,
      scope: "https://www.googleapis.com/auth/spreadsheets"
    };

    console.log('Preparing JWT with header:', header, 'and payload:', payload);
    
    try {
      // Convert the private key from PEM format to a CryptoKey
      // First, clean up the private key by removing the header, footer, and any whitespace
      const privateKey = serviceAccountCredentials.private_key
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\s+/g, '');
      
      // Base64 decode the private key
      const binaryKey = Uint8Array.from(atob(privateKey), c => c.charCodeAt(0));
      
      // Import the private key
      const cryptoKey = await cryptoAPI.subtle.importKey(
        'pkcs8',
        binaryKey,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        false, // not extractable
        ['sign']
      );
      
      // Create the JWT parts
      const encodedHeader = btoa(JSON.stringify(header))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      const encodedPayload = btoa(JSON.stringify(payload))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Create the content to sign
      const toSign = `${encodedHeader}.${encodedPayload}`;
      
      // Sign the JWT
      const signature = await cryptoAPI.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        cryptoKey,
        new TextEncoder().encode(toSign)
      );
      
      // Convert the signature to a proper base64url string
      const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Combine all parts into the final JWT
      const jwt = `${toSign}.${encodedSignature}`;
      
      return jwt;
    } catch (cryptoError) {
      console.error('Error during JWT crypto operations:', cryptoError);
      
      // Fallback to returning a mock token for development/testing
      if (IS_DEVELOPMENT) {
        console.warn('Running in development mode - providing a mock JWT for testing');
        return 'mock.jwt.token';
      }
      return null;
    }
  } catch (error) {
    console.error('Error generating JWT:', error);
    return null;
  }
}

/**
 * Get an OAuth2 access token using service account JWT
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const jwt = await generateJWT();
    if (!jwt) {
      console.error('Failed to generate JWT');
      return null;
    }

    // For development with mock JWT
    if (jwt === 'mock.jwt.token' && IS_DEVELOPMENT) {
      console.warn('Using mock access token for development');
      return 'mock_access_token';
    }

    console.log('Attempting to exchange JWT for access token...');
    
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
      const errorText = await response.text();
      console.error(`Error getting access token: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      
      // Provide more helpful error messages for common issues
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error === 'invalid_grant') {
          if (errorData.error_description?.includes('audience')) {
            console.error('JWT AUDIENCE ERROR: The "aud" field in the JWT is incorrect. It should be "https://oauth2.googleapis.com/token"');
          } else if (errorData.error_description?.includes('expired')) {
            console.error('JWT EXPIRATION ERROR: The JWT token has expired or the expiration time is invalid');
          } else if (errorData.error_description?.includes('signature')) {
            console.error('JWT SIGNATURE ERROR: The JWT signature is invalid. Check the private key and signing algorithm');
          }
        }
      } catch (parseError) {
        // Ignore JSON parsing errors in the error response
      }
      
      return null;
    }

    console.log('Successfully obtained access token');
    const data = await response.json();
    if (!data.access_token) {
      console.error('Access token not found in response:', data);
      return null;
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Fetch values from a Google Sheet using the Sheets API v4 REST endpoint with OAuth
 * Includes retry logic for handling transient errors
 */
export async function fetchSheetValues(
  spreadsheetId: string, 
  range: string, 
  retryCount = 2
): Promise<string[][] | null> {
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

    // For development with mock access token
    if (accessToken === 'mock_access_token' && IS_DEVELOPMENT) {
      console.warn('Using mock access token - returning null to fall back to mock data');
      return null;
    }

    console.log(`Fetching data from sheet ${spreadsheetId}, range: ${range}`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
    
    let lastError: Error | null = null;
    
    // Try the request up to retryCount + 1 times
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt}/${retryCount} for fetching sheet data...`);
        // Add a small delay between retries (increasing with each retry)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
      
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error fetching sheet values: ${response.status} ${response.statusText}`);
          console.error(`Error details: ${errorText}`);
          
          // Don't retry on 4xx errors (client errors)
          if (response.status >= 400 && response.status < 500 && attempt === retryCount) {
            return null;
          }
          
          // For other errors, continue to retry
          lastError = new Error(`HTTP error ${response.status}: ${errorText}`);
          continue;
        }
        
        const data = await response.json() as GoogleSheetsResponse;
        if (data.error) {
          console.error('Google Sheets API returned an error:', data.error);
          lastError = new Error(`API error: ${data.error.message}`);
          continue;
        }
        
        console.log(`Successfully fetched data from sheet ${spreadsheetId}`);
        return data.values || [];
      } catch (fetchError) {
        console.error(`Fetch error on attempt ${attempt}:`, fetchError);
        lastError = fetchError instanceof Error ? fetchError : new Error(String(fetchError));
        
        // Continue to next retry attempt
      }
    }
    
    // If we got here, all retries failed
    console.error(`All ${retryCount + 1} attempts to fetch data failed.`, lastError);
    return null;
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
  const rows = await fetchSheetValues(TOOLS_SHEET_ID, 'A:F');
  
  if (!rows || rows.length === 0) {
    console.log('No tool data found, returning mock data');
    return mockTools;
  }
  
  // Skip the header row and any empty rows
  const dataRows = rows.slice(1).filter(row => 
    row.some(cell => cell && cell.trim() !== '')
  );
  
  // Transform the rows into our AccessibilityTool type
  const tools: AccessibilityTool[] = dataRows
    .filter(row => row.length >= 3) // At least discipline, source, and name
    .map((row, index) => {
      // Parse discipline field which can have multiple values
      const disciplineText = row[0]?.trim() || '';
      const disciplines = disciplineText.split(',')
        .map(d => d.trim())
        .filter(Boolean);
      
      return {
        id: `tool-${index + 1}`,
        discipline: disciplines,
        source: row[1]?.trim() || '',
        name: row[2]?.trim() || '',
        url: row[3]?.trim() || '',
        description: row[4]?.trim() || '',
        notes: row[5]?.trim() || '',
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
    const sheetRange = type === 'tool' ? 'Submissions!A:G' : 'Submissions!A:E';
    
    // Prepare the row data based on the type
    let rowData: string[] = [];
    
    if (type === 'tool') {
      const tool = data as Partial<AccessibilityTool>;
      rowData = [
        tool.discipline ? tool.discipline.join(', ') : '',
        tool.source || '',
        tool.name || '',
        tool.url || '',
        tool.description || '',
        tool.notes || '',
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
  const disciplines = new Set<string>();
  const sources = new Set<string>();
  
  tools.forEach(tool => {
    tool.discipline.forEach(disc => disciplines.add(disc));
    if (tool.source) sources.add(tool.source);
  });
  
  return {
    disciplines: Array.from(disciplines).sort(),
    sources: Array.from(sources).sort(),
  };
}

/**
 * Get unique categories and tags from patterns data
 * Used for filtering options
 */
export function getPatternsFilterOptions(patterns: AccessibilityPattern[]) {
  const categories = new Set<string>();
  const locations = new Set<string>();
  
  patterns.forEach(pattern => {
    if (pattern.category) categories.add(pattern.category);
    if (pattern.where) locations.add(pattern.where);
  });
  
  return {
    categories: Array.from(categories).sort(),
    locations: Array.from(locations).sort(),
  };
}

/**
 * Test helper function to check if JWT generation works
 * This can be called directly from a route to test the JWT generation
 */
export async function testJwtGeneration(): Promise<{ success: boolean; message: string; jwt?: string }> {
  try {
    // Check if credentials are available
    if (!serviceAccountCredentials) {
      return { 
        success: false, 
        message: 'Service account credentials not available' 
      };
    }
    
    // Try to generate JWT
    const jwt = await generateJWT();
    if (!jwt) {
      return { 
        success: false, 
        message: 'Failed to generate JWT' 
      };
    }
    
    return {
      success: true,
      message: 'JWT generated successfully',
      jwt: jwt.substring(0, 20) + '...' // Only return a portion of the JWT for security
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing JWT: ${error}`
    };
  }
}

/**
 * Check if the service account has access to a Google Sheet
 * This is useful for diagnosing permission issues
 */
export async function checkSheetPermission(spreadsheetId: string): Promise<{
  hasAccess: boolean;
  message: string;
  details?: Record<string, unknown>;
}> {
  try {
    if (!hasApiCredentials()) {
      return {
        hasAccess: false,
        message: 'Google API credentials not available'
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        hasAccess: false,
        message: 'Failed to get access token'
      };
    }

    // First try to get just the sheet metadata (requires less permission than data)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          hasAccess: true,
          message: `Access granted to sheet: "${data.properties.title}"`,
          details: data
        };
      } else {
        const errorText = await response.text();
        let parsedError;
        
        try {
          parsedError = JSON.parse(errorText);
        } catch (e) {
          parsedError = { message: errorText };
        }
        
        if (response.status === 403) {
          return {
            hasAccess: false,
            message: 'Permission denied: The service account does not have access to this sheet',
            details: {
              status: response.status,
              error: parsedError,
              serviceAccount: serviceAccountCredentials?.client_email,
              instructions: `Share the sheet with ${serviceAccountCredentials?.client_email} (at least with Viewer permission)`
            }
          };
        } else if (response.status === 404) {
          return {
            hasAccess: false,
            message: 'Sheet not found: The spreadsheet ID may be incorrect',
            details: {
              status: response.status,
              error: parsedError,
              spreadsheetId
            }
          };
        } else {
          return {
            hasAccess: false,
            message: `API error: ${response.status} ${response.statusText}`,
            details: {
              status: response.status,
              error: parsedError
            }
          };
        }
      }
    } catch (error) {
      return {
        hasAccess: false,
        message: `Error checking sheet permissions: ${error}`,
        details: { error: String(error) }
      };
    }
  } catch (error) {
    return {
      hasAccess: false,
      message: `Error: ${error}`,
      details: { error: String(error) }
    };
  }
} 