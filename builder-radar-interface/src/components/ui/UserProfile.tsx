import { ExtendedUserProfile } from '../../lib/types';
import { useMiniApp } from '@neynar/react';
import { useEffect, useState } from 'react';
import { fetchProjectsByBuilder } from '~/lib/projects';
import { Project } from '~/lib/types';

interface UserProfileProps {
  profile: ExtendedUserProfile;
}

/**
 * Main user profile component that renders different UI styles based on user role
 *
 * Features:
 * - Dynamic UI styling based on user role (Builder vs Yapper)
 * - Consistent layout structure for both roles
 * - Role-specific color schemes and visual elements
 * - Responsive design with proper spacing
 */
export function UserProfile({ profile }: UserProfileProps) {
  const isBuilder = true;
  const { context } = useMiniApp();
  const builderId = context?.user?.fid?.toString();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!builderId) return;
    setLoadingProjects(true);
    fetchProjectsByBuilder(builderId)
      .then((p) => mounted && setProjects(p))
      .finally(() => mounted && setLoadingProjects(false));
    return () => {
      mounted = false;
    };
  }, [builderId]);

  // Clean light mode colors with colorful badges
  const colors = isBuilder
    ? {
        accent: 'text-gray-700',
        accentBg: 'bg-gray-50',
        accentBorder: 'border-gray-200',
        chartColor: '#8B9DC3', // Soft blue-gray
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
      }
    : {
        accent: 'text-gray-700',
        accentBg: 'bg-gray-50',
        accentBorder: 'border-gray-200',
        chartColor: '#8B9DC3', // Soft blue-gray
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-700',
        badgeBorder: 'border-green-200',
      };

  // Format join date
  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  // Format engagement number
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-secondary p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center pt-6 pb-4">
          <h1 className="text-3xl font-bold text-primary mb-3">
            Hi {profile.Name}!
          </h1>
          <div className="mt-2">
            <button
              onClick={() => (window.location.href = '/create')}
              className="px-4 py-2 rounded-md bg-primary text-white font-medium border border-primary/10"
            >
              ➕ Add new project
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className={`text-sm font-medium ${colors.accent} mb-1`}>
                🚀 Milestones shared
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {profile.BuildStreak || 0}
              </div>
              <div className="text-xs text-gray-500">in the last month</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className={`text-sm font-medium ${colors.accent} mb-1`}>
                ✨ Aura Farmed
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatNumber(profile.Engagement)}
              </div>
              <div className="text-xs text-gray-500">users</div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-semibold ${colors.accent} mb-3`}>
            📝 Summary
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {profile.Summary}
          </p>
        </div>

        {/* Projects/Categories Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-semibold ${colors.accent} mb-4`}>
            {isBuilder
              ? '🛠️ Most shared projects'
              : '🏷️ Top categories of yapping'}
          </h3>
          <div className="space-y-3">
            {profile.MVPCasts.map((cast, index) => {
              const key = Object.keys(cast)[0];
              const value = cast[key];
              return (
                <div key={index} className="flex items-start space-x-3">
                  <span
                    className={`text-sm font-semibold ${colors.accent} min-w-[1.5rem]`}
                  >
                    {index + 1}.
                  </span>
                  <span className="text-gray-600 text-sm leading-relaxed">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-semibold ${colors.accent} mb-4`}>
            📊 Building Progress
          </h3>
          <div className="w-full h-12 bg-gray-50 rounded-lg p-2 flex items-end justify-between gap-1">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${Math.random() * 70 + 20}%`,
                  backgroundColor: colors.chartColor,
                  opacity: 0.7 + Math.random() * 0.3, // Varying opacity for subtle effect
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Builder-specific details */}
        {isBuilder && profile.BuilderLevel && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className={`font-semibold ${colors.accent} mb-1`}>
                  🎚️ Level
                </div>
                <div className="text-gray-600">{profile.BuilderLevel}</div>
              </div>
              <div>
                <div className={`font-semibold ${colors.accent} mb-1`}>
                  🌟 Vibe
                </div>
                <div className="text-gray-600">{profile.Vibe}</div>
              </div>
              <div>
                <div className={`font-semibold ${colors.accent} mb-1`}>
                  ⚡ Super Power
                </div>
                <div className="text-gray-600">{profile.SuperPower}</div>
              </div>
              <div>
                <div className={`font-semibold ${colors.accent} mb-1`}>
                  🏗️ Archetype
                </div>
                <div className="text-gray-600">{profile.BuilderArchetype}</div>
              </div>
            </div>

            {profile.FavoriteTopics && (
              <div className="mt-6">
                <div className={`font-semibold ${colors.accent} mb-3`}>
                  💡 Favorite Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.FavoriteTopics.map((topic, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full ${colors.accentBg} ${colors.accent} border ${colors.accentBorder}`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Join Date */}
        <div className="text-center text-sm text-gray-500 pb-4">
          📅 Joined Farcaster on {formatJoinDate(profile.JoinDate)}
        </div>

        {/* Projects Section */}
        <div className="pt-2 pb-8">
          <h3 className={`text-lg font-semibold ${colors.accent} mb-4`}>
            Projects
          </h3>
          {loadingProjects && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse"
                />
              ))}
            </div>
          )}
          {!loadingProjects && (!projects || projects.length === 0) && (
            <div className="text-sm text-gray-500">No projects yet.</div>
          )}
          {!loadingProjects && projects && projects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div
                  key={p.projectId}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {p.projectName}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
