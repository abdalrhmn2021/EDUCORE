import { notFound } from "next/navigation"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import ProfessorDashboardContent from "@/app/dashboard/professor/ProfessorDashboard"
import { StudentDashboard } from "@/components/dashboard/student.dashboard"

const roleTitles: Record<string, string> = {
  admin: "لوحة تحكم المدير",
  professor: "لوحة تحكم الأستاذ",
  student: "لوحة تحكم الطالب"
}

export function generateStaticParams() {
  return [
    { role: "admin" },
    { role: "professor" },
    { role: "student" },
  ]
}

export default async function Dashboard({params}:{params:Promise<{role:string}>}) {

    const {role} = await params

    let DashboardComponent

    switch(role){
        case "admin":
            DashboardComponent = AdminDashboard
            break;
        case "professor":
            DashboardComponent = ProfessorDashboardContent
            break;

         case "student":
            DashboardComponent = StudentDashboard
            break;

            default :
            return notFound()
    }


    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{roleTitles[role]|| "لوحة التحكم"}</h1>
                <p className="text-muted-foreground">مرحبا بك في نظام EduCore</p>
            </div>
            <DashboardComponent/>
        </div>
    )

}