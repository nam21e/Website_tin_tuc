import { Outlet } from 'react-router-dom'
import { Header } from './header/Header.jsx'

export function SiteLayout() {
  return (
    <div className="min-h-dvh bg-slate-50">
      <Header />
      <main className="container-page py-6">
        <Outlet />
      </main>
      <footer className="border-t bg-white">
        <div className="container-page py-6 text-sm text-slate-500">
          Tin Tức | Liên Hệ | Hỗ Trợ | Chính Sách Bảo Mật | Điều Khoản Sử Dụng
        </div>
      </footer>
    </div>
  )
}

