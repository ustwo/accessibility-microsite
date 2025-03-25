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
 * Google Sheets API client
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
const PATTERNS_SHEET_ID = import.meta.env.VITE_GOOGLE_PATTERNS_SHEET_ID || '1lxc12mHxlBCuhWEx_r4ce7jr1vPbiwuF_t4xt0RvsEs';
const TOOLS_SHEET_ID = import.meta.env.VITE_GOOGLE_TOOLS_SHEET_ID || '1vjzCZobdvV1tvLy-k38Tpr6AGJX8fs9wKv6tXg55s7k';
const SERVICE_ACCOUNT_CREDENTIALS_JSON = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '';

// Environment detection
const IS_DEVELOPMENT = import.meta.env.DEV || false;

// Ensure crypto is available (browser environments should have this)
const cryptoAPI = crypto || (globalThis as unknown as { crypto: Crypto }).crypto;

if (!cryptoAPI || !cryptoAPI.subtle) {
  console.error('Web Crypto API is not available in this environment');
}

// Parse the service account credentials
let serviceAccountCredentials: ServiceAccountCredentials | null = null;
try {
  console.log('SERVICE_ACCOUNT_CREDENTIALS_JSON available:', Boolean(SERVICE_ACCOUNT_CREDENTIALS_JSON));
  console.log('SERVICE_ACCOUNT_CREDENTIALS_JSON length:', SERVICE_ACCOUNT_CREDENTIALS_JSON?.length);
  
  if (SERVICE_ACCOUNT_CREDENTIALS_JSON) {
    serviceAccountCredentials = JSON.parse(SERVICE_ACCOUNT_CREDENTIALS_JSON) as ServiceAccountCredentials;
    console.log('Service account credentials parsed successfully');
    console.log('Email available:', Boolean(serviceAccountCredentials?.client_email));
    console.log('Private key available:', Boolean(serviceAccountCredentials?.private_key));
  } else {
    console.warn('No service account credentials provided');
  }
} catch (error) {
  console.error('Error parsing service account credentials:', error);
}

// Helper function to check if required API credentials are available
export function hasApiCredentials(): boolean {
  const hasCredentials = Boolean(serviceAccountCredentials?.client_email && serviceAccountCredentials?.private_key);
  console.log('hasApiCredentials check result:', hasCredentials);
  return hasCredentials;
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
    // For browser compatibility, we need to use the Web Crypto API
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
  console.log('fetchSheetValues called with:', { spreadsheetId, range, retryCount });
  
  if (!spreadsheetId || !range) {
    console.error('Missing required parameters for fetchSheetValues');
    return null;
  }

  // For development and testing, use mock data if no auth available
  if (IS_DEVELOPMENT && !hasApiCredentials()) {
    console.log('Development mode without auth, returning mock data');
    console.warn('Using mock data for spreadsheet in development mode');
    // Return some fake data to simulate a successful response
    return [
      ['Header1', 'Header2', 'Header3'],
      ['Row1Col1', 'Row1Col2', 'Row1Col3'],
      ['Row2Col1', 'Row2Col2', 'Row2Col3']
    ];
  }

  // Make sure we have a valid access token
  console.log('Getting access token...');
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error('No access token available to fetch sheet data');
    return null;
  }
  console.log('Access token obtained successfully');

  // We'll make up to retryCount + 1 attempts to fetch the data
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      console.log(`Fetch attempt ${attempt + 1} of ${retryCount + 1}`);
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueRenderOption=FORMATTED_VALUE&majorDimension=ROWS`;
      console.log('Fetching from URL:', apiUrl);
      
      // Fetch the data from Google Sheets API
      const response = await fetch(
        apiUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json() as GoogleSheetsResponse;
        console.log('Response data received:', data);
        
        if (data.values && data.values.length > 0) {
          console.log(`Found ${data.values.length} rows of data`);
          return data.values;
        } else {
          console.warn('No values found in sheet response:', data);
          return [];
        }
      } else {
        const errorText = await response.text();
        console.error(`Error fetching sheet data (attempt ${attempt + 1}): ${response.status} ${response.statusText}`);
        console.error(`Error details: ${errorText}`);

        if (attempt < retryCount) {
          // Wait a bit longer before each retry (exponential backoff)
          const waitTime = Math.pow(2, attempt) * 1000;  // 1s, 2s, 4s, etc.
          console.log(`Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    } catch (error) {
      console.error(`Error in fetch attempt ${attempt + 1}:`, error);
      
      if (attempt < retryCount) {
        // Wait before retrying
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error(`Failed to fetch sheet data after ${retryCount + 1} attempts`);
  return null;
}

/**
 * Append values to a Google Sheet using the Sheets API v4 REST endpoint with OAuth
 */
async function appendSheetValues(spreadsheetId: string, sheetRange: string, values: string[][]): Promise<boolean> {
  if (!spreadsheetId || !sheetRange || !values || values.length === 0) {
    console.error('Missing required parameters for appendSheetValues');
    return false;
  }

  // For development and testing, just log the values
  if (IS_DEVELOPMENT && !hasApiCredentials()) {
    console.warn('Development mode: Would append to spreadsheet:', { spreadsheetId, sheetRange, values });
    return true;
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error('No access token available to append sheet data');
    return false;
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      }
    );

    if (response.ok) {
      console.log('Successfully appended data to sheet');
      return true;
    } else {
      const errorText = await response.text();
      console.error(`Error appending to sheet: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('Error appending to sheet:', error);
    return false;
  }
}

/**
 * Fetch and process accessibility tools from Google Sheets
 */
export async function fetchAccessibilityTools(): Promise<AccessibilityTool[]> {
  console.log('fetchAccessibilityTools called');
  // For development without credentials, use mock data
  if (IS_DEVELOPMENT && !hasApiCredentials()) {
    console.log('Development mode detected without API credentials');
    console.warn('Using mock tools data for development');
    console.log('Mock tools data:', mockTools);
    return mockTools;
  }

  console.log('Fetching real data from sheets, development mode:', IS_DEVELOPMENT);
  console.log('Has API credentials:', hasApiCredentials());
  console.log('Tools sheet ID:', TOOLS_SHEET_ID);
  
  const rows = await fetchSheetValues(TOOLS_SHEET_ID, 'Tools!A2:G');
  console.log('Rows fetched from Google Sheets:', rows);
  
  if (!rows) {
    console.error('Failed to fetch tools data, falling back to mock data');
    // Fallback to mock data if we can't get real data, for better user experience
    return mockTools;
  }

  // Process the rows into AccessibilityTool objects
  const toolsData = rows.map((row, index) => {
    const tool: AccessibilityTool = {
      id: `tool-${index + 1}`,
      name: row[0] || '',
      description: row[1] || '',
      url: row[2] || '',
      discipline: (row[3] || '').split(',').map(s => s.trim()).filter(Boolean),
      source: row[4] || '',
      notes: row[5] || '',
    };
    return tool;
  });
  
  console.log('Processed tools data:', toolsData);
  return toolsData;
}

/**
 * Process pattern rows from Google Sheets
 */
function processPatternRows(rows: string[][]): AccessibilityPattern[] {
  return rows.reduce((patterns, row, index) => {
    // Skip header rows or empty rows
    if (row.length < 4 || !row[0]) {
      return patterns;
    }

    try {
      const linksText = row[5] || ''; // Links column
      
      // Parse links text into array of link objects
      // Format expected is a semicolon-separated list of "title: url" pairs
      const linkyDinks: Array<{ title: string; url: string }> = [];
      
      if (linksText.trim()) {
        const linkPairs = linksText.split(';');
        
        for (const pair of linkPairs) {
          const colonIndex = pair.indexOf(':');
          if (colonIndex !== -1) {
            const title = pair.substring(0, colonIndex).trim();
            let url = pair.substring(colonIndex + 1).trim();
            
            // Ensure URL has a scheme
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
              url = 'https://' + url;
            }
            
            if (title && url) {
              linkyDinks.push({ title, url });
            }
          } else if (pair.trim()) {
            // If there's no colon, assume it's just a URL
            let url = pair.trim();
            
            // Ensure URL has a scheme
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
              url = 'https://' + url;
            }
            
            if (url) {
              linkyDinks.push({ title: url, url });
            }
          }
        }
      }
      
      const pattern: AccessibilityPattern = {
        id: `pattern-${index + 1}`,
        name: row[0] || '',
        category: row[1] || '',
        where: row[2] || '',
        description: row[3] || '',
        linkyDinks,
      };
      
      patterns.push(pattern);
    } catch (error) {
      console.error(`Error processing pattern row ${index}:`, error, row);
    }
    
    return patterns;
  }, [] as AccessibilityPattern[]);
}

/**
 * Fetch and process accessibility patterns from Google Sheets
 */
export async function fetchAccessibilityPatterns(): Promise<AccessibilityPattern[]> {
  // For development without credentials, use mock data
  if (IS_DEVELOPMENT && !hasApiCredentials()) {
    console.warn('Using mock patterns data for development');
    return mockPatterns;
  }

  // Updated sheet range from 'Sheet1!A2:F' to 'Patterns!A2:F' to match the correct sheet name
  const rows = await fetchSheetValues(PATTERNS_SHEET_ID, 'Patterns!A2:F');
  if (!rows) {
    console.error('Failed to fetch patterns data, falling back to mock data');
    // Fallback to mock data if we can't get real data
    return mockPatterns;
  }

  return processPatternRows(rows);
}

/**
 * Submit a new item to the appropriate Google Sheet
 */
export async function submitNewItem(
  type: 'tool' | 'pattern', 
  data: Partial<AccessibilityTool | AccessibilityPattern>
): Promise<boolean> {
  try {
    // For development without API access
    if (IS_DEVELOPMENT && !hasApiCredentials()) {
      console.log(`MOCK: Would submit ${type} data:`, data);
      return true;
    }
    
    // Determine which sheet to use based on type
    let spreadsheetId = '';
    let range = '';
    let values: string[][] = [];
    
    if (type === 'tool') {
      spreadsheetId = TOOLS_SHEET_ID;
      range = 'Tools!A:G';
      const toolData = data as Partial<AccessibilityTool>;
      values = [[
        '', // ID (will be assigned by sheet formula)
        toolData.name || '',
        toolData.description || '',
        toolData.url || '',
        Array.isArray(toolData.discipline) ? toolData.discipline.join(', ') : '',
        toolData.source || '',
        toolData.notes || ''
      ]];
    } else if (type === 'pattern') {
      spreadsheetId = PATTERNS_SHEET_ID;
      range = 'Patterns!A:F';
      const patternData = data as Partial<AccessibilityPattern>;
      // Format links if they exist
      let linksFormatted = '';
      if (patternData.linkyDinks && patternData.linkyDinks.length > 0) {
        linksFormatted = patternData.linkyDinks.map(link => 
          `${link.title}:${link.url}`
        ).join('\n');
      }
      
      values = [[
        '', // ID (will be assigned by sheet formula)
        patternData.name || '',
        patternData.category || '',
        patternData.where || '',
        patternData.description || '',
        linksFormatted
      ]];
    } else {
      throw new Error(`Invalid item type: ${type}`);
    }
    
    // Append data to sheet
    return await appendSheetValues(spreadsheetId, range, values);
  } catch (error) {
    console.error(`Error submitting ${type}:`, error);
    return false;
  }
}

/**
 * Get filter options for tools
 */
export function getToolsFilterOptions(tools: AccessibilityTool[]) {
  const disciplines = new Set<string>();
  const sources = new Set<string>();
  
  tools.forEach(tool => {
    tool.discipline.forEach(d => disciplines.add(d));
    if (tool.source) sources.add(tool.source);
  });
  
  return {
    disciplines: Array.from(disciplines).sort(),
    sources: Array.from(sources).sort()
  };
}

/**
 * Get filter options for patterns
 */
export function getPatternsFilterOptions(patterns: AccessibilityPattern[]) {
  const categories = new Set<string>();
  const wheres = new Set<string>();
  
  patterns.forEach(pattern => {
    if (pattern.category) categories.add(pattern.category);
    if (pattern.where) wheres.add(pattern.where);
  });
  
  return {
    categories: Array.from(categories).sort(),
    wheres: Array.from(wheres).sort()
  };
}

/**
 * Test JWT generation functionality
 */
export async function testJwtGeneration(): Promise<{ success: boolean; message: string; jwt?: string }> {
  try {
    if (!hasApiCredentials()) {
      return {
        success: false,
        message: 'Missing service account credentials. Make sure your environment variables are set correctly.'
      };
    }
    
    const jwt = await generateJWT();
    if (!jwt) {
      return {
        success: false,
        message: 'Failed to generate JWT. Check console for detailed error messages.'
      };
    }
    
    return {
      success: true,
      message: 'Successfully generated JWT',
      jwt: jwt.substring(0, 20) + '...' // Only return the beginning for security
    };
  } catch (error) {
    console.error('Error in JWT test:', error);
    return {
      success: false,
      message: `Error testing JWT: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Check if the service account has permission to access a spreadsheet
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
        message: 'Missing service account credentials'
      };
    }
    
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        hasAccess: false,
        message: 'Failed to get access token'
      };
    }
    
    // Try to get just the spreadsheet metadata
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return {
        hasAccess: true,
        message: `Successfully accessed spreadsheet: ${data.properties?.title || 'Unnamed'}`,
        details: data
      };
    } else {
      const errorDetails = await response.json().catch(() => null);
      return {
        hasAccess: false,
        message: `Access denied: ${response.status} ${response.statusText}`,
        details: errorDetails
      };
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      hasAccess: false,
      message: `Error checking permissions: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// Define an interface for Google Sheets sheet properties
interface SheetProperties {
  properties?: {
    title?: string;
  };
}

/**
 * Check if a specific sheet exists in a spreadsheet
 */
export async function checkSheetExists(spreadsheetId: string, sheetName: string): Promise<{
  exists: boolean;
  message: string;
  details?: Record<string, unknown>;
}> {
  try {
    if (!hasApiCredentials()) {
      return {
        exists: false,
        message: 'Missing service account credentials'
      };
    }
    
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        exists: false,
        message: 'Failed to get access token'
      };
    }
    
    // Get the spreadsheet metadata including sheet names
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title,properties.title`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('Spreadsheet metadata:', data);
      
      if (!data.sheets || !Array.isArray(data.sheets)) {
        return {
          exists: false,
          message: 'Spreadsheet exists but no sheets were found',
          details: data
        };
      }
      
      // Check if the requested sheet exists
      const sheetExists = data.sheets.some((sheet: SheetProperties) => 
        sheet.properties?.title === sheetName
      );
      
      if (sheetExists) {
        return {
          exists: true,
          message: `Sheet '${sheetName}' found in spreadsheet: ${data.properties?.title || 'Unnamed'}`,
          details: data
        };
      } else {
        const availableSheets = data.sheets.map((sheet: SheetProperties) => sheet.properties?.title).join(', ');
        return {
          exists: false,
          message: `Sheet '${sheetName}' not found. Available sheets: ${availableSheets}`,
          details: data
        };
      }
    } else {
      const errorDetails = await response.json().catch(() => null);
      return {
        exists: false,
        message: `Failed to access spreadsheet: ${response.status} ${response.statusText}`,
        details: errorDetails
      };
    }
  } catch (error) {
    console.error('Error checking sheet existence:', error);
    return {
      exists: false,
      message: `Error checking sheet: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 