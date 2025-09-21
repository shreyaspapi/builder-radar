interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

/**
 * Error display component for when profile fetching fails
 *
 * Features:
 * - Clear error message display
 * - Retry button functionality
 * - User-friendly error presentation
 * - Responsive design
 */
export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Error icon */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>

      {/* Error message */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
          {error}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={onRetry} className="btn btn-primary px-6 py-3">
          🔄 Try Again
        </button>

        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary px-6 py-3"
        >
          🔃 Refresh Page
        </button>
      </div>

      {/* Help text */}
      <div className="mt-8 text-sm text-gray-600 dark:text-gray-300">
        <p>If the problem persists, please try again later.</p>
        <p className="mt-2">
          Make sure you&apos;re connected to Farcaster and try refreshing the
          page.
        </p>
      </div>
    </div>
  );
}
