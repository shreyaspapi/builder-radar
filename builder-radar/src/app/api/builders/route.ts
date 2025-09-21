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
    // Get all unique builders with their project counts and latest project info
    const builders = await prisma.project.groupBy({
      by: ['builderId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    })

    // Get additional details for each builder
    const buildersWithDetails = await Promise.all(
      builders.map(async (builder) => {
        // Get the latest project for this builder to get more context
        const latestProject = await prisma.project.findFirst({
          where: {
            builderId: builder.builderId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            milestones: {
              where: {
                isCompleted: false,
              },
              orderBy: {
                targetDate: 'asc',
              },
            },
          },
        })

        // Get project statistics for this builder
        const projectStats = await prisma.project.groupBy({
          by: ['category'],
          where: {
            builderId: builder.builderId,
          },
          _count: {
            id: true,
          },
        })

        // Count total milestones and completed milestones
        const milestoneStats = await prisma.milestone.groupBy({
          by: ['isCompleted'],
          where: {
            project: {
              builderId: builder.builderId,
            },
          },
          _count: {
            id: true,
          },
        })

        const totalMilestones = milestoneStats.reduce((sum, stat) => sum + stat._count.id, 0)
        const completedMilestones = milestoneStats.find(stat => stat.isCompleted)?._count.id || 0

        return {
          builderId: builder.builderId,
          projectCount: builder._count.id,
          categories: projectStats.reduce((acc, stat) => {
            acc[stat.category] = stat._count.id
            return acc
          }, {} as Record<string, number>),
          totalMilestones,
          completedMilestones,
          activeMilestones: latestProject?.milestones.length || 0,
          latestProjectName: latestProject?.projectName || null,
          latestProjectDate: latestProject?.createdAt || null,
        }
      })
    )

    return NextResponse.json(buildersWithDetails, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching builders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}