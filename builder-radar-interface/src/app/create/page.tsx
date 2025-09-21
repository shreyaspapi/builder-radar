'use client';

import { useMiniApp } from '@neynar/react';
import { FormEvent, useMemo, useState } from 'react';
import { createMilestone, createProject } from '~/lib/projects';
import { Project } from '~/lib/types';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 64);
}

export default function CreateProjectPage() {
  const { context } = useMiniApp();
  const fid = context?.user?.fid?.toString();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DEFI');
  const categories = [
    'DEFI',
    'SOCIAL',
    'GAMING',
    'INFRA',
    'AI',
    'TOOLS',
    'NFT',
  ];
  const [githubUrl, setGithubUrl] = useState('');
  const [xUrl, setXUrl] = useState('');
  const [farcasterUrl, setFarcasterUrl] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [projectEvmAddress, setProjectEvmAddress] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [alreadyBuilt, setAlreadyBuilt] = useState('');
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneTargetDate, setMilestoneTargetDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const projectId = useMemo(() => slugify(name || 'new-project'), [name]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fid) {
      alert('Missing Farcaster user context. Please open within a Mini App.');
      return;
    }
    setSubmitting(true);
    const project: Project = {
      builderId: fid,
      projectName: name,
      projectId,
      description,
      category,
      projectStartDate,
      projectEvmAddress,
      websiteLink,
      whatHasBeenAlreadyBuilt: alreadyBuilt,
      githubUrl,
      xUrl,
      farcasterUrl,
    };
    const projectRes = await createProject(project);
    if (!projectRes.success) {
      setSubmitting(false);
      alert(`Failed to create project: ${projectRes.error}`);
      return;
    }

    if (milestoneTitle && milestoneTargetDate) {
      const msRes = await createMilestone(projectId, {
        title: milestoneTitle,
        description: milestoneDescription,
        targetDate: milestoneTargetDate,
      });
      if (!msRes.success) {
        // Non-blocking error
        console.warn('Failed to create milestone:', msRes.error);
      }
    }

    setSubmitting(false);
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-secondary p-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Create Project (/create)
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Name of the project
            </label>
            <input
              className="w-full border rounded-md p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description of the project
            </label>
            <textarea
              className="w-full border rounded-md p-2"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Category of the project
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Project github
            </label>
            <input
              className="w-full border rounded-md p-2"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              X of project
            </label>
            <input
              className="w-full border rounded-md p-2"
              value={xUrl}
              onChange={(e) => setXUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Farcaster of project
            </label>
            <input
              className="w-full border rounded-md p-2"
              value={farcasterUrl}
              onChange={(e) => setFarcasterUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Website link
            </label>
            <input
              className="w-full border rounded-md p-2"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Wallet Address for project (i)
            </label>
            <input
              className="w-full border rounded-md p-2"
              value={projectEvmAddress}
              onChange={(e) => setProjectEvmAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              When did you start working on this project?
            </label>
            <input
              type="date"
              className="w-full border rounded-md p-2"
              value={projectStartDate}
              onChange={(e) => setProjectStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              What has been already built?
            </label>
            <textarea
              className="w-full border rounded-md p-2"
              rows={4}
              value={alreadyBuilt}
              onChange={(e) => setAlreadyBuilt(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Set next milestone (title)
            </label>
            <input
              className="w-full border rounded-md p-2"
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Milestone description
            </label>
            <textarea
              className="w-full border rounded-md p-2"
              rows={3}
              value={milestoneDescription}
              onChange={(e) => setMilestoneDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Milestone target date
            </label>
            <input
              type="date"
              className="w-full border rounded-md p-2"
              value={milestoneTargetDate}
              onChange={(e) => setMilestoneTargetDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-3 rounded-lg bg-red-500 text-white font-semibold disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Start building in Public'}
          </button>
        </form>
      </div>
    </div>
  );
}
