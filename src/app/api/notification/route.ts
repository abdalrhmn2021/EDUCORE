import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/moongodb'
import Notification from '@/models/Notification'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const notifications = await Notification.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json(notifications)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching notifications" }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { message, type, link, userId } = body

    await dbConnect()

    const targetUserId = (session.role === "admin" && userId) ? userId : session.userId

    const notification = await Notification.create({
      userId: targetUserId,
      message,
      type: type || "info",
      link,
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error creating notification" }, { status: 500 })
  }
}