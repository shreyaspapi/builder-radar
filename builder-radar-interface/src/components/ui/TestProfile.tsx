import { ExtendedUserProfile } from '../../lib/types';

/**
 * Test component with sample profile data for development and testing
 *
 * This component provides sample data that matches the expected API response format
 * to help with development and testing of the UI components.
 */
export function TestProfile() {
  // Sample Builder profile data
  const sampleBuilderProfile: ExtendedUserProfile = {
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
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
        Test Profiles - Development Mode
      </h2>

      {/* Builder Profile Test */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-4">
          Builder Profile Test
        </h3>
        <div className="border border-pink-300 rounded-lg p-4">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(sampleBuilderProfile, null, 2)}
          </pre>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          How to Use Test Data
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Copy the JSON data above</li>
          <li>• Use it to test your API endpoint</li>
          <li>• Verify the UI renders correctly for both roles</li>
          <li>• Test the loading and error states</li>
        </ul>
      </div>
    </div>
  );
}
