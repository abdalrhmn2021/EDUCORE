import { NotificationList } from "@/components/notifications/NotificationList"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function NotificationsPage() {
  const session = await getSession()

  if (!session) redirect("/login")

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-l from-indigo-500 to-purple-600">
            إشعارات
          </h1>

          <p className="text-muted-foreground mt-2">
            آخر التحديثات و النشاطات
          </p>
        </div>
      </div>

      <NotificationList />
    </div>
  )
}