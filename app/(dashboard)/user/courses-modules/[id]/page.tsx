import React from 'react'
import CoursesModules from '@/app/_components/Student/MyCourses/Courses_Modules/CoursesModules'


export default function CoursesModulesPage({ params }: { params: { id: string } }) {
  return (
    <CoursesModules seriesId={params.id} />
  )
}
