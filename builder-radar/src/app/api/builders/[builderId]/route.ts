import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ builderId: string }> }
) {
  try {
    const { builderId } = await params

    // Get all projects for this builder
    const projects = await prisma.project.findMany({
      where: {
        builderId: builderId,
      },
      include: {
        milestones: {
          orderBy: {
            targetDate: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (projects.length === 0) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      )
    }

    // Calculate builder statistics
    const totalProjects = projects.length
    const categories = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const allMilestones = projects.flatMap(project => project.milestones)
    const totalMilestones = allMilestones.length
    const completedMilestones = allMilestones.filter(m => m.isCompleted).length
    const activeMilestones = allMilestones.filter(m => !m.isCompleted).length

    // Get upcoming milestones across all projects
    const upcomingMilestones = allMilestones
      .filter(m => !m.isCompleted && m.targetDate)
      .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime())
      .slice(0, 5) // Get next 5 upcoming milestones

    const builderInfo = {
      builderId: builderId,
      totalProjects,
      categories,
      totalMilestones,
      completedMilestones,
      activeMilestones,
      milestoneCompletionRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
      upcomingMilestones: upcomingMilestones.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        targetDate: milestone.targetDate,
        projectName: projects.find(p => p.id === milestone.projectId)?.projectName,
      })),
      projects: projects.map(project => ({
        id: project.id,
        projectName: project.projectName,
        description: project.description,
        category: project.category,
        projectStartDate: project.projectStartDate,
        websiteLink: project.websiteLink,
        githubUrl: project.githubUrl,
        xUrl: project.xUrl,
        farcasterUrl: project.farcasterUrl,
        createdAt: project.createdAt,
        milestoneCount: project.milestones.length,
        completedMilestoneCount: project.milestones.filter(m => m.isCompleted).length,
      })),
    }

    return NextResponse.json(builderInfo)
  } catch (error) {
    console.error('Error fetching builder:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}