'use client';

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useUserProfile } from '../hooks/useUserProfile';
import { LoadingProfile } from './ui/LoadingProfile';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { UserProfile } from './ui/UserProfile';
import { SimpleNavigation } from './ui/SimpleNavigation';
import { APP_CONFIG } from '../lib/config';

export interface AppProps {
  title?: string;
}

/**
 * Development version of the App component for testing and development
 *
 * This component includes:
 * - Test profile data display
 * - Development mode toggle
 * - Sample data for both Builder and Yapper roles
 * - Easy switching between test and live modes
 */
export default function App({ title = APP_CONFIG.NAME }: AppProps) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [testRole, setTestRole] = useState<'Builder' | 'Yapper'>('Builder');

  // Custom hook for managing user profile data
  const { profile, loading, error, refreshProfile } = useUserProfile();

  // Initialize the Mini App when component mounts
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if we're in a Mini App environment
        const isMiniApp = await sdk.isInMiniApp();

        if (isMiniApp) {
          // Hide the splash screen when the app is ready
          await sdk.actions.ready();
          console.log('BuildInPublic Mini App initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize Mini App:', error);
      }
    };

    initializeApp();
  }, []);

  // Development mode toggle
  const toggleDevMode = () => {
    setIsDevMode(!isDevMode);
  };

  // Test profile data
  const testProfiles = {
    Builder: {
      Role: 'Builder' as const,
      Name: 'vitalik.eth',
      JoinDate: '2021-01-15T10:30:00.000Z',
      Summary:
        "The OG Ethereum chad who's still shipping while others are just vibing",
      Description:
        'This absolute unit has been building the future since before most people knew what a blockchain was. Pure big brain energy with a side of humble genius vibes.',
      NumberOfCasts: 1337,
      Engagement: 42069,
      MVPCasts: [{ Cast1: 'Just shipped another protocol update :fire:' }],
      BuilderLevel: 'Legendary Builder',
      Vibe: 'Big Brain Vibes',
      SuperPower: 'Protocol Whisperer',
      BuildStreak: 69,
      CommunityImpact: 'Thought Leader',
      EmojiFlair: ':brain::zap:',
      BuilderArchetype: 'The Visionary',
      FavoriteTopics: ['Ethereum', 'Scaling', 'DeFi', 'Public Goods'],
      BuildingMood: 'Ship Mode',
    },
    Yapper: {
      Role: 'Yapper' as const,
      Name: 'crypto_enthusiast',
      JoinDate: '2022-06-20T14:15:00.000Z',
      Summary:
        'Professional opinion sharer and hot take generator extraordinaire',
      Description:
        "This person has mastered the art of sharing thoughts on every trending topic. Whether it's DeFi, NFTs, or the latest protocol drama, they always have something to say.",
      NumberOfCasts: 2048,
      Engagement: 15678,
      MVPCasts: [{ Cast1: 'Hot take: Layer 2s are the future of scaling' }],
    },
  };

  // Development mode header
  if (isDevMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Dev Mode Header */}
        <div className="bg-yellow-500 text-black p-4 text-center font-bold">
          🚧 DEVELOPMENT MODE 🚧
        </div>

        {/* Dev Controls */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTestRole('Builder')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  testRole === 'Builder'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Builder
              </button>
              <button
                onClick={() => setTestRole('Yapper')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  testRole === 'Yapper'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Yapper
              </button>
            </div>

            <button
              onClick={toggleDevMode}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Exit Dev Mode
            </button>
          </div>
        </div>

        {/* Test Profile Display */}
        <UserProfile profile={testProfiles[testRole]} />
        <SimpleNavigation />
      </div>
    );
  }

  // Production mode - show loading state while fetching profile
  if (loading.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Dev Mode Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleDevMode}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Dev Mode
          </button>
        </div>

        <LoadingProfile loading={loading} />
        <SimpleNavigation />
      </div>
    );
  }

  // Production mode - show error state if profile fetching failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Dev Mode Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleDevMode}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Dev Mode
          </button>
        </div>

        <ErrorDisplay error={error} onRetry={refreshProfile} />
        <SimpleNavigation />
      </div>
    );
  }

  // Production mode - show profile when data is loaded
  if (profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Dev Mode Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleDevMode}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Dev Mode
          </button>
        </div>

        <UserProfile profile={profile} />
        <SimpleNavigation />
      </div>
    );
  }

  // Fallback state (should not normally reach here)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Loading your profile...
        </p>

        {/* Dev Mode Toggle */}
        <button
          onClick={toggleDevMode}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Enter Dev Mode
        </button>
      </div>
    </div>
  );
}
