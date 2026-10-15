import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/moongodb'
import User from '@/models/User'
import { hashPassword } from '@/lib/password'
import { ProfileUpdateSchema } from '@/lib/validations'

export async function PUT(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = ProfileUpdateSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { name, password } = parsed.data
    // نفس طريقة التسجيل: الإيميل دايماً small letters، عشان ما يصير حسابين لنفس الإيميل
    const email = parsed.data.email?.toLowerCase()

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