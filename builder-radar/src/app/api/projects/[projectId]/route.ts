import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const projectIdInt = parseInt(projectId)

    if (isNaN(projectIdInt)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400, headers: corsHeaders }
      )
    }

    const project = await prisma.project.findUnique({
      where: { id: projectIdInt },
      include: {
        milestones: {
          orderBy: {
            targetDate: 'asc',
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return NextResponse.json(project, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}