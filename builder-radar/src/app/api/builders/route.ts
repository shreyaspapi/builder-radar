import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET() {
  try {
    // Get all unique builder IDs first
    const uniqueBuilders = await prisma.project.findMany({
      select: {
        builderId: true,
      },
      distinct: ['builderId'],
    })

    // Get detailed info for each builder using simpler queries
    const buildersWithDetails = await Promise.all(
      uniqueBuilders.map(async ({ builderId }) => {
        // Get all projects for this builder
        const projects = await prisma.project.findMany({
          where: { builderId },
          include: {
            milestones: true,
          },
        })

        // Calculate statistics
        const projectCount = projects.length
        const categories = projects.reduce((acc, project) => {
          acc[project.category] = (acc[project.category] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const allMilestones = projects.flatMap(p => p.milestones)
        const totalMilestones = allMilestones.length
        const completedMilestones = allMilestones.filter(m => m.isCompleted).length
        const activeMilestones = allMilestones.filter(m => !m.isCompleted).length

        const latestProject = projects.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]

        return {
          builderId,
          projectCount,
          categories,
          totalMilestones,
          completedMilestones,
          activeMilestones,
          latestProjectName: latestProject?.projectName || null,
          latestProjectDate: latestProject?.createdAt || null,
        }
      })
    )

    // Sort by project count descending
    buildersWithDetails.sort((a, b) => b.projectCount - a.projectCount)

    return NextResponse.json(buildersWithDetails, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching builders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}