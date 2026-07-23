import { notFound } from "next/navigation"
import { AdminDashboard } from "@/components/dashboard/admin-dashbord"
import { ProfessorDashboard } from "@/components/dashboard/professor-dashbord"
import { StudentDashboard } from "@/components/dashboard/student.dashboard"
import { div } from "framer-motion/client";

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

export default async function Dashboard({parms}:{parms:Promise<{role:string}>}) {

    const {role} = await parms

    let DashpoardComponent 

    switch(role){
        case "admin":
            DashpoardComponent = AdminDashboard
            break;
        case "professor":
            DashpoardComponent = ProfessorDashboard
            break;

         case "student":
            DashpoardComponent = StudentDashboard
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
            <DashpoardComponent/>
        </div>
    )
    
}