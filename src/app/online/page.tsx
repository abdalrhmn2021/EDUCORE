'use client'

import { Suspense } from 'react'
import CoursesList from '@/components/courses/CoursesList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OnlineLearningPage() {
  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="text-center md:text-right">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            التعلم عن بعد
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl">
            تعلم من أي مكان وفي أي وقت مع برامجنا المتميزة عبر الإنترنت
          </p>
        </div>

        <Button asChild size="lg" className="hidden md:flex">
          <Link href="/dashboard/professor">
            إدارة المواد (للأساتذة)
          </Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="text-center">
            جاري التحميل...
          </div>
        }
      >
        <CoursesList type="online" />
      </Suspense>

      <div
        className="
          mt-16
          bg-blue-50
          rounded-2xl
          p-8
          md:p-12
          text-center
          md:text-right
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-8
          border
          border-blue-100
        "
      >
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-blue-900">
            لماذا تختار التعلم عن بعد؟
          </h2>

          <ul className="space-y-2 text-blue-800 list-disc list-inside">
            <li>مرونة في الوقت والمكان</li>
            <li>محتوى تعليمي متقدم</li>
            <li>تواصل مباشر مع الأساتذة</li>
            <li>شهادات معتمدة وإنجازات</li>
          </ul>
        </div>

        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-blue-900 hover:bg-blue-100"
        >
          سجل الآن
        </Button>
      </div>
    </div>
  )
}