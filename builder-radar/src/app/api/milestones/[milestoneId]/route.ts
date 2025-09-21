import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { milestoneId: string } }
) {
  try {
    const body = await request.json()
    const { title, description, targetDate, isCompleted } = body

    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (targetDate !== undefined) updateData.targetDate = targetDate ? new Date(targetDate) : null
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted
      updateData.completedAt = isCompleted ? new Date() : null
    }

    const milestone = await prisma.milestone.update({
      where: { id: params.milestoneId },
      data: updateData,
    })

    return NextResponse.json(milestone)
  } catch (error) {
    console.error('Error updating milestone:', error)

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { milestoneId: string } }
) {
  try {
    await prisma.milestone.delete({
      where: { id: params.milestoneId },
    })

    return NextResponse.json({ message: 'Milestone deleted successfully' })
  } catch (error) {
    console.error('Error deleting milestone:', error)

    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}