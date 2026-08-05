import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageProvider } from '@/context/LanguageContext'
import { AdminProvider } from '@/context/AdminContext'
import { ensureSeeded } from '@/lib/seed'
import { setDocumentDir } from '@/i18n'

import PublicLayout from '@/layouts/PublicLayout'
import HomePage from '@/pages/HomePage'
import PrimaryPage from '@/pages/PrimaryPage'
import PrimaryDetailPage from '@/pages/PrimaryDetailPage'
import ResalePage from '@/pages/ResalePage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import ResaleUnitDetailPage from '@/pages/ResaleUnitDetailPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'

import AdminLayout from '@/components/AdminLayout'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminOverview from '@/pages/admin/AdminOverview'
import AdminPrimaryUnits from '@/pages/admin/AdminPrimaryUnits'
import AdminResaleProjects from '@/pages/admin/AdminResaleProjects'
import AdminResaleUnits from '@/pages/admin/AdminResaleUnits'
import AdminCarousel from '@/pages/admin/AdminCarousel'
import AdminInquiries from '@/pages/admin/AdminInquiries'

function AppRoutes() {
  const { i18n } = useTranslation()

  useEffect(() => {
    setDocumentDir(i18n.language || 'ar')
    ensureSeeded()
  }, [i18n.language])

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/primary" element={<PrimaryPage />} />
        <Route path="/primary/:id" element={<PrimaryDetailPage />} />
        <Route path="/resale" element={<ResalePage />} />
        <Route path="/resale/:id" element={<ProjectDetailPage />} />
        <Route path="/resale/unit/:id" element={<ResaleUnitDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin dashboard */}
      <Route path="/admin" element={<AdminLayout><AdminOverview /></AdminLayout>} />
      <Route path="/admin/primary" element={<AdminLayout><AdminPrimaryUnits /></AdminLayout>} />
      <Route path="/admin/resale-projects" element={<AdminLayout><AdminResaleProjects /></AdminLayout>} />
      <Route path="/admin/resale-units" element={<AdminLayout><AdminResaleUnits /></AdminLayout>} />
      <Route path="/admin/carousel" element={<AdminLayout><AdminCarousel /></AdminLayout>} />
      <Route path="/admin/inquiries" element={<AdminLayout><AdminInquiries /></AdminLayout>} />
    </Routes>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AdminProvider>
    </LanguageProvider>
  )
}
