# Google Sheets Integration & Caching Strategy

This document provides an overview of how the application integrates with Google Sheets and implements caching to improve performance.

## Overview

The application uses Google Sheets as a data source for accessibility tools and patterns. To improve performance and reduce API quota usage, we've implemented a comprehensive caching strategy using the browser's localStorage.

## Google Sheets Integration

The integration with Google Sheets works as follows:

1. **Authentication**: We use a service account with JWT authentication to access the Google Sheets API
2. **Data Fetching**: The application fetches data from two separate spreadsheets:
   - Accessibility Tools
   - Accessibility Patterns
3. **Data Processing**: Raw spreadsheet data is processed into structured objects used throughout the application

### Configuration

The integration requires several environment variables to be set:

```
VITE_GOOGLE_TOOLS_SHEET_ID=your_tools_spreadsheet_id
VITE_GOOGLE_PATTERNS_SHEET_ID=your_patterns_spreadsheet_id
VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=your_service_account_json_credentials
```

The service account credentials should be a stringified JSON object containing:
- `client_email`
- `private_key`
- `private_key_id`

## Caching Strategy

To optimize performance, we've implemented a multi-level caching strategy:

### 1. Local Storage Caching

All data from Google Sheets is cached in the browser's localStorage with the following features:

- **Time-Based Expiration**: Cache entries automatically expire after a configurable amount of time
- **Version Control**: Cache version tracking to invalidate cache when data structures change
- **Automatic Fallback**: If cache is invalid or expired, the application automatically fetches fresh data

#### Cache Keys

We use the following cache keys:

- `accessibility_tools_cache`: For storing tools data
- `accessibility_patterns_cache`: For storing patterns data
- `google_jwt_cache`: For storing the JWT token

#### Cache Duration

Default expiration times:
- Tools data: 24 hours
- Patterns data: 24 hours
- JWT token: 50 minutes (JWT tokens typically expire after 1 hour)

### 2. JWT Token Caching

To minimize the computational overhead of JWT generation:

- We cache the OAuth token obtained from JWT exchange
- This reduces the need to generate a new JWT for every request
- The token is automatically refreshed when expired

### 3. React Context for Data Sharing

We use a React Context to share cached data across components:

- Prevents duplicate API calls when navigating between pages
- Maintains a consistent app state
- Provides centralized data loading and error handling

### 4. Background Data Preloading

Data is preloaded when the application starts:

- The `DataPreloader` component loads data in the background
- Uses parallel requests with `Promise.allSettled`
- Doesn't block initial rendering

## Implementation Details

### Core Files

1. **cacheUtils.ts**: Utilities for caching data in localStorage
2. **googleSheets.ts**: Integration with Google Sheets API
3. **DataContext.tsx**: React context for data sharing
4. **DataPreloader.tsx**: Component for background data loading

### How to Use

Access the cached data from any component:

```typescript
import { useData } from '../context/DataContext';

function MyComponent() {
  const { tools, patterns, isLoadingTools, isLoadingPatterns, error, refreshData } = useData();
  
  // Use the data in your component
  // Call refreshData() to manually refresh the data
}
```

## Performance Benefits

This caching strategy provides several benefits:

1. **Faster Subsequent Page Loads**: After initial load, data comes from localStorage
2. **Reduced API Quota Usage**: Fewer API calls to Google Sheets
3. **Better User Experience**: Data appears immediately when navigating between pages
4. **Resilience to Connectivity Issues**: Cached data works even when offline
5. **Reduced Server Load**: Fewer requests to both your server and Google's servers

## Troubleshooting

If you encounter issues with the Google Sheets integration:

1. **Verify Credentials**: Ensure your service account has access to the spreadsheets
2. **Check Cache**: Try clearing the browser's localStorage
3. **Inspect Network Requests**: Look for errors in the Network tab of browser DevTools
4. **Verify Spreadsheet Structure**: Ensure your spreadsheets match the expected format
5. **JWT Debugging**: Use the `/test-jwt` route to test JWT generation 