import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

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
        { status: 400 }
      )
    }

    const projectIdInt = parseInt(projectId)

    if (isNaN(projectIdInt)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectIdInt },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
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

    return NextResponse.json(milestone, { status: 201 })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
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
        { status: 400 }
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

    return NextResponse.json(milestones)
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}