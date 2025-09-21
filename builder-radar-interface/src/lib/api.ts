import { API_CONFIG } from './config';
import { APIResponse, ExtendedUserProfile } from './types';

/**
 * API service for the BuildInPublic Mini App
 */

/**
 * Fetches user profile data from the primary API endpoint
 * @param fid - The Farcaster ID of the user
 * @returns Promise with the user profile data
 */
async function fetchFromPrimaryEndpoint(
  fid: number
): Promise<ExtendedUserProfile> {
  const response = await fetch(`${API_CONFIG.PRIMARY_URL}?fid=${fid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(API_CONFIG.API_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Primary endpoint error! status: ${response.status}`);
  }

  const data: APIResponse = await response.json();

  if (!data.success) {
    throw new Error(
      data.message || 'Primary endpoint failed to fetch profile data'
    );
  }

  return data.data;
}

/**
 * Fetches user profile data from the fallback API endpoint (POST request)
 * @param fid - The Farcaster ID of the user
 * @returns Promise with the user profile data
 */
async function fetchFromFallbackEndpoint(
  fid: number
): Promise<ExtendedUserProfile> {
  const response = await fetch(API_CONFIG.FALLBACK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fid: fid.toString() }),
    signal: AbortSignal.timeout(API_CONFIG.API_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Fallback endpoint error! status: ${response.status}`);
  }

  const data: APIResponse = await response.json();

  if (!data.success) {
    throw new Error(
      data.message || 'Fallback endpoint failed to fetch profile data'
    );
  }

  return data.data;
}

/**
 * Fetches user profile data with automatic fallback
 * @param fid - The Farcaster ID of the user
 * @returns Promise with the user profile data
 */
export async function fetchUserProfile(
  fid: number
): Promise<ExtendedUserProfile> {
  let primaryError: Error | null = null;

  try {
    // Try primary endpoint first
    return await fetchFromPrimaryEndpoint(fid);
  } catch (error) {
    primaryError =
      error instanceof Error ? error : new Error('Primary endpoint failed');
    console.warn(
      'Primary endpoint failed, trying fallback:',
      primaryError.message
    );
  }

  try {
    // If primary fails, try fallback endpoint
    return await fetchFromFallbackEndpoint(fid);
  } catch (fallbackError) {
    const fallbackErrorMessage =
      fallbackError instanceof Error
        ? fallbackError.message
        : 'Fallback endpoint failed';
    console.error('Both endpoints failed:', {
      primary: primaryError.message,
      fallback: fallbackErrorMessage,
    });

    // Throw a comprehensive error
    throw new Error(
      `Failed to fetch profile data. Primary: ${primaryError.message}. Fallback: ${fallbackErrorMessage}`
    );
  }
}

/**
 * Fetches user profile data with retry logic
 * @param fid - The Farcaster ID of the user
 * @param maxRetries - Maximum number of retry attempts
 * @returns Promise with the user profile data
 */
export async function fetchUserProfileWithRetry(
  fid: number,
  maxRetries: number = API_CONFIG.MAX_RETRIES
): Promise<ExtendedUserProfile> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchUserProfile(fid);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Validates if the profile data is complete and valid
 * @param profile - The user profile data to validate
 * @returns boolean indicating if the profile is valid
 */
export function validateProfile(profile: ExtendedUserProfile): boolean {
  return !!(
    profile.Name &&
    profile.Summary &&
    profile.Description &&
    typeof profile.NumberOfCasts === 'number' &&
    typeof profile.Engagement === 'number' &&
    Array.isArray(profile.MVPCasts)
  );
}
