import React from 'react'
import CoursesModules from '@/app/_components/Student/MyCourses/Courses_Modules/CoursesModules'


export default async function CoursesModulesPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const search = await searchParams;
  const watchId = search.watch as string | undefined;
  
  return (
    <CoursesModules seriesId={id} initialLessonId={watchId} />
  )
}
