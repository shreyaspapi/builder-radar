/**
 * Configuration file for the BuildInPublic Mini App
 *
 * This file contains configurable values that can be easily modified
 * without changing the core application logic.
 */

// API Configuration
export const API_CONFIG = {
  // Primary API endpoint for fetching user profile data
  PRIMARY_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://getuserdata-gj2nphvrna-uc.a.run.app',

  // Fallback API endpoint (POST request) if primary fails
  FALLBACK_URL: 'https://processuser-gj2nphvrna-uc.a.run.app',

  // Legacy configuration (kept for backward compatibility)
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://getuserdata-gj2nphvrna-uc.a.run.app',
  PROFILE_ENDPOINT: '',

  // Full URL for profile endpoint (primary)
  get PROFILE_URL() {
    return this.PRIMARY_URL;
  },

  // Default timeout for API calls (in milliseconds)
  API_TIMEOUT: 10000,

  // Retry attempts for failed API calls
  MAX_RETRIES: 3,
};

// UI Configuration
export const UI_CONFIG = {
  // Loading states
  LOADING_MESSAGES: [
    'We are building your profile...',
    'Analyzing your Farcaster activity...',
    'Calculating your builder score...',
    'Processing your yapping patterns...',
    'Generating your unique profile...',
    'Crunching the numbers...',
    'Building something awesome...',
    'Almost there...',
  ],

  // Tech facts to show while loading
  TECH_FACTS: [
    "The first computer bug was an actual bug - a moth trapped in Harvard's Mark II computer in 1947.",
    'The average smartphone today has more computing power than NASA had for the Apollo 11 moon landing.',
    'The first domain name ever registered was symbolics.com on March 15, 1985.',
    'The first email was sent in 1971 by Ray Tomlinson, who also introduced the @ symbol in email addresses.',
    'The first webcam was created to monitor a coffee pot at Cambridge University in 1991.',
    'The first computer mouse was made of wood in 1964 by Douglas Engelbart.',
    'The first website is still online at info.cern.ch, created by Tim Berners-Lee in 1991.',
    'The first iPhone was announced in 2007 and cost $499 for the 4GB model.',
  ],
};

// App Configuration
export const APP_CONFIG = {
  // App name
  NAME: 'BuildInPublic',

  // App description
  DESCRIPTION:
    'Discover if you are a Builder or Yapper in the Farcaster ecosystem',

  // Default timeout for API calls (in milliseconds)
  API_TIMEOUT: 10000,

  // Retry attempts for failed API calls
  MAX_RETRIES: 3,
};
