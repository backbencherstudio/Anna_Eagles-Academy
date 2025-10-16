import React from 'react'
import CoursesModules from '@/app/_components/Student/MyCourses/Courses_Modules/CoursesModules'


export default async function CoursesModulesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <CoursesModules seriesId={id} />
  )
}
