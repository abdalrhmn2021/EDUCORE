import { NextResponse } from 'next/server'
import { ClearAuthCookie } from '@/lib/auth'

export async function POST() {
    try {
        await ClearAuthCookie()

        return NextResponse.json({
            success: true,
            message: 'تم تسجيل الخروج بنجاح',
        })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json({
            success: false,
            message: 'حدث خطأ أثناء تسجيل الخروج',
            status: 500
        })
    }
}