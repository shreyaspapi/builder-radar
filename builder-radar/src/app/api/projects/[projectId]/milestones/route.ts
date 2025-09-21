import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const { title, description, targetDate } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400, headers: corsHeaders }
      )
    }

    const projectIdInt = parseInt(projectId)

    if (isNaN(projectIdInt)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectIdInt },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    const milestone = await prisma.milestone.create({
      data: {
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        projectId: projectIdInt,
      },
    })

    return NextResponse.json(milestone, { status: 201, headers: corsHeaders })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
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

    const milestones = await prisma.milestone.findMany({
      where: {
        projectId: projectIdInt,
      },
      orderBy: {
        targetDate: 'asc',
      },
    })

    return NextResponse.json(milestones, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}