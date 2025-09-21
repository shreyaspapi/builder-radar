'use client';

import { useEffect, useState } from 'react';
import { fetchBuilders } from '~/lib/projects';
import { BuilderSummary } from '~/lib/types';

export default function BuildersList() {
  const [builders, setBuilders] = useState<BuilderSummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchBuilders()
      .then((b) => mounted && setBuilders(b))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
          >
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!builders || builders.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center text-gray-600 pt-6">
        No builders found yet.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-3">
      {builders.map((b) => (
        <div
          key={b.builderId}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900">
              Builder {b.builderId}
            </div>
            <div className="text-xs text-gray-500">
              {b.numProjects} projects
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Supporters: {b.supportersCount ?? 0} • Superfluid total:{' '}
            {b.superfluidTotal ?? 0}
          </div>
        </div>
      ))}
    </div>
  );
}
