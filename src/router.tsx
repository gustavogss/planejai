import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/components/layout/RootLayout'
import { History } from '@/pages/History'
import Home from '@/pages/Home'
import { Result } from '@/pages/Result'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/resultado', element: <Result /> },
      { path: '/historico', element: <History /> },
    ],
  },
])
