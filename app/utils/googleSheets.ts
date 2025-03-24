import { google } from 'googleapis';

// Types for our data
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
  description: string;
  example: string;
  wcagCriteria: string[];
  tags: string[];
  code: string;
  codeLanguage: string;
}

// For development purposes, you'd replace these with your actual spreadsheet values
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || 'your-spreadsheet-id';
const TOOLS_SHEET_NAME = 'Tools';
const PATTERNS_SHEET_NAME = 'Patterns';

/**
 * Get Google Sheets authorization
 */
function getGoogleSheetsClient() {
  // For public sheets, we can use API key authentication
  // For private sheets, you'd need OAuth2 or service account authentication
  const auth = process.env.GOOGLE_API_KEY 
    ? process.env.GOOGLE_API_KEY 
    : undefined;
  
  const sheets = google.sheets({
    version: 'v4',
    auth,
  });
  
  return sheets;
}

/**
 * Fetch all accessibility tools from Google Sheets
 */
export async function fetchAccessibilityTools(): Promise<AccessibilityTool[]> {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TOOLS_SHEET_NAME}!A2:H`,
    });
    
    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return [];
    }
    
    // Transform the rows into our AccessibilityTool type
    const tools: AccessibilityTool[] = rows.map((row, index) => {
      return {
        id: `tool-${index + 1}`,
        name: row[0] || '',
        description: row[1] || '',
        url: row[2] || '',
        category: row[3] || '',
        tags: (row[4] || '').split(',').map((tag: string) => tag.trim()).filter(Boolean),
        cost: row[5] || '',
        platforms: (row[6] || '').split(',').map((platform: string) => platform.trim()).filter(Boolean),
      };
    });
    
    return tools;
  } catch (error) {
    console.error('Error fetching accessibility tools:', error);
    return [];
  }
}

/**
 * Fetch all accessibility patterns from Google Sheets
 */
export async function fetchAccessibilityPatterns(): Promise<AccessibilityPattern[]> {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${PATTERNS_SHEET_NAME}!A2:G`,
    });
    
    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return [];
    }
    
    // Transform the rows into our AccessibilityPattern type
    const patterns: AccessibilityPattern[] = rows.map((row, index) => {
      return {
        id: `pattern-${index + 1}`,
        name: row[0] || '',
        description: row[1] || '',
        example: row[2] || '',
        wcagCriteria: (row[3] || '').split(',').map((criteria: string) => criteria.trim()).filter(Boolean),
        tags: (row[4] || '').split(',').map((tag: string) => tag.trim()).filter(Boolean),
        code: row[5] || '',
        codeLanguage: row[6] || 'html',
      };
    });
    
    return patterns;
  } catch (error) {
    console.error('Error fetching accessibility patterns:', error);
    return [];
  }
}

/**
 * Submit a new tool or pattern to the Google Sheet
 */
export async function submitNewItem(
  type: 'tool' | 'pattern', 
  data: Partial<AccessibilityTool | AccessibilityPattern>
): Promise<boolean> {
  try {
    const sheets = getGoogleSheetsClient();
    
    // Determine which sheet to write to
    const sheetName = type === 'tool' ? 'ToolSubmissions' : 'PatternSubmissions';
    
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
      rowData = [
        pattern.name || '',
        pattern.description || '',
        pattern.example || '',
        (pattern.wcagCriteria || []).join(','),
        (pattern.tags || []).join(','),
        pattern.code || '',
        pattern.codeLanguage || 'html',
        new Date().toISOString(), // Submission timestamp
      ];
    }
    
    // Append the row to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:H`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });
    
    return true;
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
 * Get unique tags and WCAG criteria from patterns data
 * Used for filtering options
 */
export function getPatternsFilterOptions(patterns: AccessibilityPattern[]) {
  const tags = new Set<string>();
  const wcagCriteria = new Set<string>();
  
  patterns.forEach(pattern => {
    pattern.tags.forEach(tag => tags.add(tag));
    pattern.wcagCriteria.forEach(criteria => wcagCriteria.add(criteria));
  });
  
  return {
    tags: Array.from(tags).sort(),
    wcagCriteria: Array.from(wcagCriteria).sort(),
  };
} 