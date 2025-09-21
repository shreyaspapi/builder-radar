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
    // Get all unique builder IDs
    const builderIds = await prisma.project.findMany({
      select: {
        builderId: true,
      },
      distinct: ['builderId'],
      orderBy: {
        builderId: 'asc',
      },
    })

    // Extract just the IDs into a simple array
    const ids = builderIds.map(builder => builder.builderId)

    return NextResponse.json(ids, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching builder IDs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}