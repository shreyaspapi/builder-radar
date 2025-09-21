'use client';

import { useEffect, useState } from 'react';
import { fetchProjects } from '~/lib/projects';
import { Project } from '~/lib/types';

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProjects()
      .then((p) => mounted && setProjects(p))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center text-gray-600 pt-6">
        No projects yet. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {projects.map((p) => (
        <div
          key={p.projectId}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {p.projectName}
              </div>
              <div className="text-xs text-gray-500 mt-1">{p.category}</div>
            </div>
            {p.websiteLink && (
              <a
                href={p.websiteLink}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-sm underline"
              >
                Visit
              </a>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {p.description}
          </p>
        </div>
      ))}
    </div>
  );
}
