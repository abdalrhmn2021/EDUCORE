import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/moongodb'
import User from '@/models/User'

export async function GET(): Promise<NextResponse> {
    try {
        const session = await getSession()

        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()

        const user = await User
            .findById(session.userId)
            .select('-password')
            .lean() // يحول النتيجة إلى كائن JavaScript عادي

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Profile fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}