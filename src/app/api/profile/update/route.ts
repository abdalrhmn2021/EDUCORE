import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/moongodb'
import User from '@/models/User'
import { hashPassword } from '@/lib/password'

export async function PUT(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, password } = body

    await dbConnect()

    if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: session.userId } })
    if (existingUser) {
    return NextResponse.json({ error: 'البريد الالكتروني مستخدم بالفعل ' }, { status: 400 })
    }
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (password) updateData.password = await hashPassword(password)

    const user = await User.findByIdAndUpdate(session.userId, updateData, { new: true }).select(`-password`)

    if(!user){
        return NextResponse.json({error:'المستخدم غير موجود'},{status:404})
    }

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'حدث خطا اثناء تحميل البيانات' }, { status: 500 })
  }
}