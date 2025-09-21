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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ milestoneId: string }> }
) {
  try {
    const { milestoneId } = await params
    const body = await request.json()
    const { title, description, targetDate, isCompleted } = body

    const updateData: {
      title?: string
      description?: string | null
      targetDate?: Date | null
      isCompleted?: boolean
      completedAt?: Date | null
    } = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (targetDate !== undefined) updateData.targetDate = targetDate ? new Date(targetDate) : null
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted
      updateData.completedAt = isCompleted ? new Date() : null
    }

    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: updateData,
    })

    return NextResponse.json(milestone, { headers: corsHeaders })
  } catch (error) {
    console.error('Error updating milestone:', error)

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ milestoneId: string }> }
) {
  try {
    const { milestoneId } = await params
    await prisma.milestone.delete({
      where: { id: milestoneId },
    })

    return NextResponse.json({ message: 'Milestone deleted successfully' }, { headers: corsHeaders })
  } catch (error) {
    console.error('Error deleting milestone:', error)

    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}