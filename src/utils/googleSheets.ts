import { mockTools, mockPatterns } from '../data/mockData';
import { CACHE_KEYS, getFromCache, saveToCache, getCacheVersion } from './cacheUtils';

/**
 * API Rate Limiting Implementation
 * 
 * Google Sheets API has a quota of 60 read requests per minute per user
 * This implementation adds:
 * 1. A simple rate limiter to ensure we don't exceed quotas
 * 2. Enhanced caching to reduce API calls
 */

// API Rate Limiting Configuration
const API_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 50, // Keep below 60 to be safe
  REQUEST_INTERVAL_MS: 1200,    // Spread requests (~50/minute)
  SHEETS_CACHE_DURATION: 60 * 5 * 1000, // 5 minutes
}

// State tracking for rate limiting
let lastRequestTime = 0;
const requestTimestamps: number[] = [];

/**
 * Execute a request with rate limiting
 * This ensures we don't exceed Google Sheets API quotas
 */
async function executeWithRateLimit<T>(requestId: string, fn: () => Promise<T>): Promise<T> {
  // Apply rate limiting before executing
  await applyRateLimit();
  
  
  // Track this request
  const timestamp = Date.now();
  requestTimestamps.push(timestamp);
  lastRequestTime = timestamp;

  // Execute the actual request
  return fn();
}

/**
 * Wait if necessary to ensure we don't exceed rate limits
 */
async function applyRateLimit(): Promise<void> {
  const now = Date.now();
  
  // Remove timestamps older than 1 minute
  const oneMinuteAgo = now - 60000;
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }
  
  // Check if we need to wait between requests
  const timeSinceLastRequest = lastRequestTime ? now - lastRequestTime : Infinity;
  if (timeSinceLastRequest < API_CONFIG.REQUEST_INTERVAL_MS) {
    const waitTime = API_CONFIG.REQUEST_INTERVAL_MS - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms between requests`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  // Check if we've reached the max requests per minute
  if (requestTimestamps.length >= API_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    // Need to wait until the oldest request is more than a minute old
    const oldestTimestamp = requestTimestamps[0];
    const timeToWait = 60000 - (now - oldestTimestamp) + 100; // add a small buffer
    
    console.log(`Rate limit reached (${requestTimestamps.length} requests this minute). Waiting ${timeToWait}ms...`);
    await new Promise(resolve => setTimeout(resolve, timeToWait));
    
    // Recursive call to check again after waiting
    return applyRateLimit();
  }
}

// Define types based on spreadsheet structure
export interface AccessibilityTool {
  id: string;
  name: string;
  description: string;
  url: string;
  discipline: string[];
  source?: string;
  notes: string;
}

export interface AccessibilityPattern {
  id: string;
  name: string;
  category: string;
  where: string;
  description: string;
  linkyDinks: Array<{url: string, title: string}>;
  isSection?: boolean;  // Flag to indicate if this is a section header
  parentTitle?: string; // Parent section title for grouping
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
    // Check for cached JWT first
    const cachedJwt = getFromCache<string>(CACHE_KEYS.JWT, getCacheVersion('jwt'));
    if (cachedJwt) {
      console.log('Using cached JWT token');
      return cachedJwt;
    }

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
    
    // Cache the token
    saveToCache(CACHE_KEYS.JWT, data.access_token, getCacheVersion('jwt'));
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Parse a HYPERLINK formula to extract URL and display text
 */
export function parseHyperlinkFormula(formula: string): { url: string; title: string } | null {
  const match = formula.match(/^=HYPERLINK\("([^"]+)",\s*"([^"]+)"\)$/);
  if (!match) {
    return null;
  }
  return {
    url: match[1],
    title: match[2]
  };
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

  // Create a cache key specific to this request
  const cacheKey = `sheets_data_${spreadsheetId}_${range.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  // First check if we have cached data for this specific request
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheAge = Date.now() - timestamp;
      
      // Use cached data if it's less than the configured cache duration
      if (cacheAge < API_CONFIG.SHEETS_CACHE_DURATION) {
        console.log(`Using cached sheet data for ${range}, age: ${Math.round(cacheAge / 1000)}s`);
        return data;
      } else {
        console.log(`Cache expired for ${range}, age: ${Math.round(cacheAge / 1000)}s`);
        localStorage.removeItem(cacheKey);
      }
    } catch (err) {
      console.error('Error parsing cached sheet data:', err);
      localStorage.removeItem(cacheKey);
    }
  }

  // Queue the actual API request to respect rate limits
  return executeWithRateLimit<string[][] | null>(
    `fetch_sheet_${spreadsheetId}_${range}`,
    async () => {
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
          const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueRenderOption=FORMULA&majorDimension=ROWS`;
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
            const responseData = await response.json() as GoogleSheetsResponse;
            console.log('Response data received:', responseData);
            
            if (responseData.values && responseData.values.length > 0) {
              console.log(`Found ${responseData.values.length} rows of data`);
              
              // Process any HYPERLINK formulas in the data
              const processedData = responseData.values.map(row => 
                row.map(cell => {
                  if (typeof cell === 'string' && cell.startsWith('=HYPERLINK(')) {
                    const parsed = parseHyperlinkFormula(cell);
                    if (parsed) {
                      return JSON.stringify(parsed); // Convert to string to maintain array structure
                    }
                  }
                  return cell;
                })
              );
              
              // Cache the successful response
              try {
                localStorage.setItem(cacheKey, JSON.stringify({
                  data: processedData,
                  timestamp: Date.now()
                }));
                console.log(`Sheet data cached with key: ${cacheKey}`);
              } catch (cacheError) {
                console.error('Error caching sheet data:', cacheError);
              }
              
              return processedData;
            } else {
              console.warn('No values found in sheet response:', responseData);
              return [];
            }
          } else {
            const errorText = await response.text();
            console.error(`Error fetching sheet data (attempt ${attempt + 1}): ${response.status} ${response.statusText}`);
            console.error(`Error details: ${errorText}`);
            
            // Check if we hit a quota limit (429)
            if (response.status === 429) {
              console.warn('Quota exceeded - need to wait longer before retrying');
              // Wait significantly longer for quota errors
              await new Promise(resolve => setTimeout(resolve, 5000 + Math.pow(2, attempt) * 1000));
            } else if (attempt < retryCount) {
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
  );
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

  // Execute with rate limiting
  return executeWithRateLimit<boolean>(
    `append_sheet_${spreadsheetId}_${sheetRange}`,
    async () => {
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
  );
}

/**
 * Fetch and process accessibility tools from Google Sheets
 */
export async function fetchAccessibilityTools(): Promise<AccessibilityTool[]> {
  try {
    console.log('Fetching accessibility tools...');
    
    // Check for cached tools first
    const cachedTools = getFromCache<AccessibilityTool[]>(CACHE_KEYS.TOOLS, getCacheVersion('tools'));
    if (cachedTools) {
      console.log('Using cached tools');
      return cachedTools;
    }
    
    // For development without API access
    if (IS_DEVELOPMENT && !hasApiCredentials()) {
      console.log('Using mock tools data in development mode');
      return mockTools;
    }
    
    const rows = await fetchSheetValues(TOOLS_SHEET_ID, 'ustwo All Tools!A:G');
    if (!rows || rows.length <= 1) {
      return [];
    }
    
    // Skip header row and any empty rows that might be at the top
    const dataRows = rows.slice(1).filter(row => row.some(cell => cell && cell.trim() !== ''));
    
    // Map sheet data to AccessibilityTool objects and filter to only include external tools
    const tools: AccessibilityTool[] = dataRows
      // Only include rows with enough data to be useful
      .filter(row => row.length >= 4)
      // Only include external tools - column [1] is Source
      .filter(row => row[1]?.toLowerCase() === 'external')
      .map((row, index) => {
        // Extract and clean up disciplines - split on commas and handle variations
        const disciplineStr = row[0] || ''; // Discipline is in column 0
        const disciplines = disciplineStr
          .split(',')
          .map(d => d.trim())
          .filter(Boolean);
        
        // Determine URL - column [3] is URL
        let url = row[3] || '';
        // If URL doesn't start with http:// or https://, add https://
        if (url && !url.toLowerCase().startsWith('http')) {
          url = `https://${url}`;
        }
        
        return {
          id: `tool-${index}`,
          name: row[2] || '', // Name is in column 2
          description: row[4] || '', // Description is in column 4
          url: url,
          discipline: disciplines,
          source: 'external', // Hardcode to external since we filtered for it
          notes: row[5] || '' // Notes is in column 5
        };
      });
    
    console.log(`Fetched ${tools.length} external tools`);
    
    // Cache the result
    saveToCache(CACHE_KEYS.TOOLS, tools, getCacheVersion('tools'));
    
    return tools;
  } catch (error) {
    console.error('Error fetching accessibility tools:', error);
    
    // Return mock data in case of error during development
    if (IS_DEVELOPMENT) {
      console.log('Using mock tools data due to error');
      return mockTools;
    }
    
    return [];
  }
}

/**
 * Process pattern rows from Google Sheets
 */
function processPatternRows(rows: string[][]): AccessibilityPattern[] {
  const patterns: AccessibilityPattern[] = [];
  let currentParentTitle = "";
  
  console.log('Starting to process pattern rows...');
  
  rows.forEach((row, index) => {
    console.log(`Processing row ${index}:`, row);
    
    // Check if row is a section title (has only one cell with content)
    if (row.length === 1 && row[0]?.trim()) {
      currentParentTitle = row[0].trim();
      console.log(`Found section title: ${currentParentTitle}`);
      // Add as a section header
      patterns.push({
        id: `section-${index + 1}`,
        name: currentParentTitle,
        category: "",
        where: "",
        description: "",
        linkyDinks: [],
        isSection: true
      });
      return;
    }
    
    // Skip empty rows or invalid rows
    if (row.length < 2 || !row[0] && !row[1]) {
      console.log(`Skipping invalid row ${index}`);
      return;
    }

    try {
      const name = row[0]?.trim() || "";
      const where = row[1]?.trim() || "";
      const description = row[2]?.trim() || "";
      
      console.log(`Processing pattern: ${name} (${where})`);
      
      // Parse links from column 4 (index 3)
      const linkyDinks: Array<{ title: string; url: string }> = [];
      const linkFormula = row[3]?.trim() || "";
      
      if (linkFormula) {
        console.log(`Found link formula:`, linkFormula);
        
        // Try to parse as JSON first (in case it's already parsed)
        try {
          const parsedJson = JSON.parse(linkFormula);
          if (parsedJson.url && parsedJson.title) {
            console.log(`Successfully parsed JSON link:`, parsedJson);
            linkyDinks.push(parsedJson);
          }
        } catch (jsonError) {
          // If not JSON, try parsing as HYPERLINK formula
          const parsed = parseHyperlinkFormula(linkFormula);
          if (parsed) {
            console.log(`Successfully parsed HYPERLINK formula:`, parsed);
            linkyDinks.push(parsed);
          } else {
            console.log(`Failed to parse link formula:`, linkFormula);
          }
        }
      }
      
      // Only create a pattern if it has a 'where' value or a name
      if (where || name) {
        const pattern: AccessibilityPattern = {
          id: `pattern-${index + 1}`,
          name: name,
          category: where,  // Using 'where' as the category for filtering
          where: where,     // Keep the original 'where' field for compatibility
          description: description,
          linkyDinks,
          parentTitle: currentParentTitle
        };
        
        console.log(`Created pattern with ${linkyDinks.length} links:`, pattern);
        patterns.push(pattern);
      }
    } catch (error) {
      console.error(`Error processing pattern row ${index}:`, error, row);
    }
  });
  
  console.log('Finished processing all rows. Total patterns:', patterns.length);
  return patterns;
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

  console.log('Fetching fresh patterns data from spreadsheet...');
  const rows = await fetchSheetValues(PATTERNS_SHEET_ID, 'ustwo pattern library!A:H');
  
  if (!rows) {
    console.error('Failed to fetch patterns data, falling back to mock data');
    return mockPatterns;
  }

  console.log('Raw spreadsheet data:', rows);
  console.log('Number of rows:', rows.length);
  console.log('First row (headers):', rows[0]);
  
  // Log the link columns (E, F, G) from the first few rows
  rows.slice(0, 5).forEach((row, index) => {
    console.log(`Row ${index} link columns:`, {
      columnE: row[4],
      columnF: row[5],
      columnG: row[6]
    });
  });

  const patterns = processPatternRows(rows);
  console.log('Processed patterns:', patterns);
  
  // Cache the processed data
  saveToCache(CACHE_KEYS.PATTERNS, patterns, getCacheVersion('patterns'));
  
  return patterns;
}

/**
 * Submit a new item to the appropriate Google Sheet
 */
export async function submitNewItem(
  type: 'tool' | 'pattern', 
  data: Partial<AccessibilityTool | AccessibilityPattern>
): Promise<boolean> {
  try {
    // Determine which spreadsheet and sheet range to use
    let spreadsheetId: string;
    let sheetRange: string;
    let values: string[][];
    
    if (type === 'tool') {
      spreadsheetId = TOOLS_SHEET_ID;
      sheetRange = 'microsite submitted Tools!A:F';
      
      // Format the tool data
      const toolData = data as Partial<AccessibilityTool>;
      const disciplines = Array.isArray(toolData.discipline) 
        ? toolData.discipline.join(', ') 
        : (toolData.discipline || '');
      
      values = [[
        toolData.name || '',
        toolData.description || '',
        toolData.url || '',
        disciplines,
        toolData.notes || '',
        new Date().toISOString()
      ]];
    } else {
      // Pattern submission
      spreadsheetId = PATTERNS_SHEET_ID;
      sheetRange = 'pattern submissions!A:J'; // Extended range to accommodate multiple link columns
      
      // Format the pattern data
      const patternData = data as Partial<AccessibilityPattern>;
      
      // Format links as HYPERLINK formulas, one per cell
      const linkyDinks = Array.isArray(patternData.linkyDinks) ? patternData.linkyDinks : [];
      const linkFormulas = linkyDinks.map(link => 
        `=HYPERLINK("${link.url}", "${link.title}")`
      );
      
      // Pad the link formulas array to ensure we have exactly 3 cells
      while (linkFormulas.length < 3) {
        linkFormulas.push('');
      }
      
      values = [[
        patternData.name || '',           // Column A: Name
        patternData.category || '',       // Column B: Category
        patternData.where || '',          // Column C: Where
        patternData.description || '',    // Column D: Description
        linkFormulas[0],                  // Column E: Link 1
        linkFormulas[1],                  // Column F: Link 2
        linkFormulas[2],                  // Column G: Link 3
        new Date().toISOString()          // Column H: Timestamp
      ]];
    }
    
    // Let's use the append values API to add a new row
    return await appendSheetValues(spreadsheetId, sheetRange, values);
  } catch (error) {
    console.error(`Error submitting new ${type}:`, error);
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
  const parentTitles = new Set<string>();
  
  patterns.forEach(pattern => {
    // Skip section headers for category and where filters
    if (!pattern.isSection) {
      if (pattern.category) categories.add(pattern.category);
      if (pattern.where) wheres.add(pattern.where);
      if (pattern.parentTitle) parentTitles.add(pattern.parentTitle);
    }
  });
  
  return {
    categories: Array.from(categories).sort(),
    wheres: Array.from(wheres).sort(),
    parentTitles: Array.from(parentTitles).sort()
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
    
    // Execute with rate limiting
    return executeWithRateLimit(
      `check_permission_${spreadsheetId}`,
      async () => {
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
      }
    );
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
    
    // Execute with rate limiting
    return executeWithRateLimit(
      `check_sheet_exists_${spreadsheetId}_${sheetName}`,
      async () => {
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
      }
    );
  } catch (error) {
    console.error('Error checking sheet existence:', error);
    return {
      exists: false,
      message: `Error checking sheet: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 