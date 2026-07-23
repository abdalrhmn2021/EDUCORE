import { Suspense } from 'react'
import ProfessorDashboardContent from './ProfessorDashboard'

export default function ProfessorDashboardPage() {
  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-primary">الأساتذة</h1>
      <Suspense fallback={<div>...</div>}>
        <ProfessorDashboardContent />
      </Suspense>
    </div>
  )
}