import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { ProjectCategory } from '../../../generated/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      builderId,
      projectName,
      description,
      category,
      projectStartDate,
      projectEvmAddress,
      websiteLink,
      whatHasBeenAlreadyBuilt,
      githubUrl,
      xUrl,
      farcasterUrl,
    } = body

    // Validate required fields
    if (!builderId || !projectName || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: builderId, projectName, category' },
        { status: 400 }
      )
    }

    // Validate category
    if (!Object.values(ProjectCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: DEFI, DPIN, INFRA, SOCIAL' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        builderId,
        projectName,
        description,
        category,
        projectStartDate: projectStartDate ? new Date(projectStartDate) : null,
        projectEvmAddress,
        websiteLink,
        whatHasBeenAlreadyBuilt,
        githubUrl,
        xUrl,
        farcasterUrl,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)


    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
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

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}