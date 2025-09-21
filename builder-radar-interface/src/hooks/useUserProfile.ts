import { useState, useEffect, useCallback } from 'react';
import { useMiniApp } from '@neynar/react';
import { fetchUserProfileWithRetry, validateProfile } from '../lib/api';
import { AppState } from '../lib/types';
import { UI_CONFIG } from '../lib/config';

/**
 * Custom hook for managing user profile data
 *
 * This hook handles:
 * - Fetching user profile data from the API
 * - Managing loading states with rotating messages
 * - Error handling and retry logic
 * - Profile data validation
 */
export function useUserProfile() {
  const { context } = useMiniApp();
  const [state, setState] = useState<AppState>({
    profile: null,
    loading: {
      isLoading: false,
      message: UI_CONFIG.LOADING_MESSAGES[0],
      fact: UI_CONFIG.TECH_FACTS[0],
    },
    error: null,
  });

  // Get user FID from context
  const contextUserFid = context?.user?.fid;

  // Debug logging to understand context state
  useEffect(() => {
    console.log('Mini App Context Debug:', {
      hasContext: !!context,
      hasUser: !!context?.user,
      userFid: contextUserFid,
      fullContext: context,
      isDevelopment: process.env.NODE_ENV === 'development',
    });
  }, [context, contextUserFid]);

  // Use context FID or fallback to development FID
  const userFid =
    contextUserFid || (process.env.NODE_ENV === 'development' ? 3 : undefined);

  /**
   * Updates the loading state with rotating messages and facts
   */
  const updateLoadingState = useCallback(() => {
    if (!state.loading.isLoading) return;

    const messageIndex =
      Math.floor(Date.now() / 2000) % UI_CONFIG.LOADING_MESSAGES.length;
    const factIndex =
      Math.floor(Date.now() / 3000) % UI_CONFIG.TECH_FACTS.length;

    setState((prev) => ({
      ...prev,
      loading: {
        ...prev.loading,
        message: UI_CONFIG.LOADING_MESSAGES[messageIndex],
        fact: UI_CONFIG.TECH_FACTS[factIndex],
      },
    }));
  }, [state.loading.isLoading]);

  /**
   * Fetches user profile data
   */
  const fetchProfile = useCallback(async (fid: number) => {
    if (!fid) return;

    setState((prev) => ({
      ...prev,
      loading: {
        isLoading: true,
        message: UI_CONFIG.LOADING_MESSAGES[0],
        fact: UI_CONFIG.TECH_FACTS[0],
      },
      error: null,
    }));

    try {
      const profile = await fetchUserProfileWithRetry(fid);

      if (!validateProfile(profile)) {
        throw new Error('Invalid profile data received from server');
      }

      setState((prev) => ({
        ...prev,
        profile,
        loading: {
          isLoading: false,
          message: '',
          fact: '',
        },
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch profile data';

      setState((prev) => ({
        ...prev,
        loading: {
          isLoading: false,
          message: '',
          fact: '',
        },
        error: errorMessage,
      }));
    }
  }, []);

  /**
   * Refreshes the user profile data
   */
  const refreshProfile = useCallback(() => {
    if (userFid) {
      fetchProfile(userFid);
    }
  }, [userFid, fetchProfile]);

  // Start loading animation when loading state is active
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.loading.isLoading) {
      interval = setInterval(updateLoadingState, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.loading.isLoading, updateLoadingState]);

  // Fetch profile when user FID is available
  useEffect(() => {
    if (userFid && !state.profile && !state.loading.isLoading) {
      fetchProfile(userFid);
    } else if (!userFid && !state.loading.isLoading && !state.error) {
      // If no userFid after 3 seconds, show an error
      const timer = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          loading: {
            isLoading: false,
            message: '',
            fact: '',
          },
          error:
            'Unable to access user context. Please make sure you are running this app within a Farcaster Mini App environment.',
        }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [
    userFid,
    state.profile,
    state.loading.isLoading,
    state.error,
    fetchProfile,
  ]);

  return {
    ...state,
    fetchProfile,
    refreshProfile,
    userFid,
  };
}
