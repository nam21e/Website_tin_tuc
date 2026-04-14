import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ArticleDetailPage } from './pages/ArticleDetailPage.jsx'
import { SearchPage } from './pages/SearchPage.jsx'
import { AdminPage } from './pages/admin/AdminPage.jsx'
import { AuthPage } from './pages/AuthPage.jsx'
import { RequireAdmin } from './components/auth/RequireAdmin.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
