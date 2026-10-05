import { createBrowserRouter } from 'react-router'
import { RootLayout } from './RootLayout'
import { CoursePage } from './pages/CoursePage'
import { ErrorPage } from './pages/ErrorPage'
import { HomePage } from './pages/HomePage'
import { LessonPage } from './pages/LessonPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SubjectPage } from './pages/SubjectPage'

// URL scheme: /:subject/:course/:lesson  (e.g. /math/ap-calculus-ab/average-vs-instantaneous-rate)
// Static routes added later (e.g. /classes, /teacher) take precedence over these dynamic ones.
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ':subjectSlug', element: <SubjectPage /> },
      { path: ':subjectSlug/:courseSlug', element: <CoursePage /> },
      { path: ':subjectSlug/:courseSlug/:lessonSlug', element: <LessonPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
