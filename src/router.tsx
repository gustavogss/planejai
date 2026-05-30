import { History } from '@/pages/History'
import Home from '@/pages/Home'
import { Result } from '@/pages/Result'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    children: [
      { path: '/', element: <Home /> },
      { path: '/resultado', element: <Result /> },
      { path: '/historico', element: <History /> },
    ],
  },
])
