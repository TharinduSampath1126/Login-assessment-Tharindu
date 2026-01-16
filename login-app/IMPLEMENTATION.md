# OAuth Implementation Guide

## Approach

Implemented OAuth 2.0 authentication using Google and GitHub providers with a React frontend and Node.js backend.

## Implementation Steps

### 1. Setup OAuth Providers
- Registered applications on Google Cloud Console and GitHub Developer Settings
- Obtained Client IDs and Client Secrets
- Configured redirect URIs

### 2. Frontend Implementation
- Installed `@react-oauth/google` and `react-github-login` packages
- Wrapped app with `GoogleOAuthProvider`
- Created Login component with OAuth buttons
- Handled success/error callbacks for both providers

### 3. Backend Implementation
- Created Express server with CORS enabled
- Implemented `/auth/google` endpoint:
  - Verifies Google ID token using `google-auth-library`
  - Extracts user payload
  - Generates JWT token
- Implemented `/auth/github` endpoint:
  - Exchanges authorization code for access token
  - Fetches user data from GitHub API
  - Generates JWT token

### 4. Session Management
- Store JWT token and user data in localStorage
- Auto-restore session on page reload using useEffect
- Implemented logout functionality to clear session data

### 5. Security
- Environment variables for sensitive credentials
- JWT tokens with 7-day expiration
- HTTPS-only cookies recommended for production
