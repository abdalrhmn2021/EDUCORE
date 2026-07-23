import { Suspense } from 'react'
import { StudentDashboard } from '@/components/dashboard/student.dashboard'

export default function StudentDashboardPage() {
  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
    <h1 className="text-3xl font-bold mb-8 text-primary">الطلاب</h1>
    <Suspense fallback={<div>...</div>}>
    <StudentDashboard />
    </Suspense>
    </div>
  )
}