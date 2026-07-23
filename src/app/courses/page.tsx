import { Suspense } from 'react'
import CoursesList from '@/components/courses/CoursesList'

export default function UndergraduatePage() {
  return (
        <div className="container mx-auto py-10 px-4" dir="rtl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-primary">برامج البكالوريا</h1>
                <p className="text-xl text-gray-600 max-w-2xl max-auto">
                    استكشف مجموعة متنوعة من التخصصات المصممة لبناء مستقبلك المهني   
                </p>
            </div>

            <Suspense>
                <CoursesList type="undergraduate"/>
            </Suspense>
        </div>
  );
}
