import {ProfileForm} from "@/components/profile/ProfileForm";
import {getSession} from "@/lib/auth"
import dbConnect from "@/lib/moongodb"
import User from "@/modles/User";
import {redirect}from "next/navigation"



export default async function ProfilePage() {
  const session = await getSession()

  if (!session) redirect("/login")

  await dbConnect()

  const user = await User.findById(session.userId)
    .select("-password")
    .lean()

  if (!user) redirect("/login")

  const serializedUser = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1
          className="
            text-3xl font-bold
            bg-clip-text text-transparent
            bg-linear-to-l
            from-indigo-500
            to-purple-600
          "
        >
          البيانات الشخصية
        </h1>

        <p className="text-muted-foreground mt-2">
          إدارة معلومات حسابك الشخصي
        </p>
      </div>

      <ProfileForm user={serializedUser} />
    </div>
  )
}