export const BUILDER_RADAR_BASE_URL = 'https://builder-radar.vercel.app';

import { BuilderSummary, Project, ProjectMilestone } from './types';

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${BUILDER_RADAR_BASE_URL}/api/projects`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data?.projects) ? data.projects : data;
  } catch (e) {
    console.warn('fetchProjects failed:', e);
    return [];
  }
}

export async function fetchProjectsByBuilder(
  builderId: string
): Promise<Project[]> {
  try {
    const res = await fetch(
      `${BUILDER_RADAR_BASE_URL}/api/projects?builderId=${encodeURIComponent(
        builderId
      )}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data?.projects) ? data.projects : data;
    return (list as Project[]).filter((p) => p.builderId === builderId);
  } catch (e) {
    console.warn('fetchProjectsByBuilder failed:', e);
    return [];
  }
}

export async function createProject(
  project: Project
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const res = await fetch(`${BUILDER_RADAR_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text };
    }
    const data = await res.json();
    return { success: true, project: data?.project ?? project };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function createMilestone(
  projectId: string,
  milestone: Omit<ProjectMilestone, 'projectId'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${BUILDER_RADAR_BASE_URL}/api/projects/${projectId}/milestones`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...milestone }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text };
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function fetchBuilders(): Promise<BuilderSummary[]> {
  try {
    const res = await fetch(`${BUILDER_RADAR_BASE_URL}/api/builders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data?.builders) ? data.builders : data;
  } catch (e) {
    console.warn('fetchBuilders failed:', e);
    return [];
  }
}
