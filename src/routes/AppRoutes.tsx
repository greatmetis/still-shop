import { Route, Routes } from 'react-router'
import { DevComponentsPage } from './DevComponentsPage'
import { HomePage } from './HomePage'

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-content px-5 py-24 md:px-8 lg:px-12">
      <h1 className="font-serif text-h1">Page not found</h1>
    </main>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* The component showcase is for development only; the production build leaves it out. */}
      {import.meta.env.DEV && <Route path="/dev/components" element={<DevComponentsPage />} />}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
