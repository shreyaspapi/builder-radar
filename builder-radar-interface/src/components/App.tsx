'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useUserProfile } from '~/hooks/useUserProfile';
import { LoadingProfile } from '~/components/ui/LoadingProfile';
import { ErrorDisplay } from '~/components/ui/ErrorDisplay';
import { UserProfile } from '~/components/ui/UserProfile';
import { SimpleNavigation } from '~/components/ui/SimpleNavigation';
import ProjectsList from '~/components/ui/ProjectsList';
import BuildersList from '~/components/ui/BuildersList';
import { APP_CONFIG } from '~/lib/config';

export interface AppProps {
  title?: string;
}

/**
 * Main App component for the BuildInPublic Mini App
 *
 * This component:
 * - Integrates with the Farcaster Mini App SDK
 * - Manages user profile data fetching and display
 * - Handles loading and error states
 * - Renders different UI styles based on user role
 * - Provides a consistent layout for both Builders and Yappers
 */
export default function App({ title = APP_CONFIG.NAME }: AppProps) {
  // State to track if component has mounted on client
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'builders'>(
    'home'
  );

  // Custom hook for managing user profile data
  const { profile, loading, error, refreshProfile } = useUserProfile();

  // Handle client-side mounting to prevent hydration mismatches
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Initialize the Mini App when component mounts
  useEffect(() => {
    if (!hasMounted) return;

    const initializeApp = async () => {
      try {
        // Check if we're in a Mini App environment
        const isMiniApp = await sdk.isInMiniApp();

        if (isMiniApp) {
          // Hide the splash screen when the app is ready
          await sdk.actions.ready();
          console.log('BuildInPublic Mini App initialized successfully');
        } else {
          console.log('Not running in Mini App environment');
        }
      } catch (error) {
        console.error('Failed to initialize Mini App:', error);
      }
    };

    initializeApp();
  }, [hasMounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">{title}</h1>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching profile
  if (loading.isLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <LoadingProfile loading={loading} />
        <SimpleNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  // Show error state if profile fetching failed
  if (error) {
    return (
      <div className="min-h-screen bg-secondary">
        <ErrorDisplay error={error} onRetry={refreshProfile} />
        <SimpleNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  // Show profile when data is loaded
  if (profile) {
    return (
      <div className="min-h-screen bg-secondary">
        {activeTab === 'home' && (
          <div className="p-4 pt-6">
            <ProjectsList />
          </div>
        )}
        {activeTab === 'profile' && <UserProfile profile={profile} />}
        {activeTab === 'builders' && (
          <div className="p-4 pt-6">
            <BuildersList />
          </div>
        )}
        <SimpleNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  // Fallback state (should not normally reach here)
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Loading your profile...
        </p>
      </div>
    </div>
  );
}
