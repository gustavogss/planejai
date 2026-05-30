import { Header } from '@/components/shared/Header'
import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
