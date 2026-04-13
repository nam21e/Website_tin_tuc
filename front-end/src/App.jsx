import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout.jsx'
import { RequireAuth } from './components/auth/RequireAuth.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ArticleDetailPage } from './pages/ArticleDetailPage.jsx'
import { SearchPage } from './pages/SearchPage.jsx'
import { AdminPage } from './pages/admin/AdminPage.jsx'
import { AuthPage } from './pages/AuthPage.jsx'
import { UserProfilePage } from './pages/UserProfilePage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/me"
          element={
            <RequireAuth>
              <UserProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
