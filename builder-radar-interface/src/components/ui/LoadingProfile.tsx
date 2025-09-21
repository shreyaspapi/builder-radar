import { LoadingState } from '../../lib/types';

interface LoadingProfileProps {
  loading: LoadingState;
}

/**
 * Loading component that displays while the user profile is being fetched
 *
 * Features:
 * - Rotating loading messages
 * - Interesting tech facts
 * - Animated loading indicator
 * - Responsive design
 */
export function LoadingProfile({ loading }: LoadingProfileProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Main loading message */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          {loading.message}
        </h2>

        {/* Animated loading dots */}
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

      {/* Tech fact card */}
      <div className="max-w-md rounded-xl p-6 shadow-sm border border-gray-200 bg-white">
        <div className="text-primary text-sm font-semibold mb-2">
          💡 Did you know?
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{loading.fact}</p>
      </div>

      {/* Additional loading info */}
      <div className="mt-8 text-sm text-gray-500">
        <p>This usually takes just a few seconds...</p>
        <p className="mt-2">
          We&apos;re analyzing your Farcaster activity to create your unique
          profile!
        </p>
      </div>
    </div>
  );
}
