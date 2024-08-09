import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import A from './pages/a'
import B from './pages/b'
import C from './pages/c'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/a', // base demo
    element: <A />,
  },
  {
    path: '/b', // hooks 缓存
    element: <B />,
  },
  {
    path: '/c', // 编译后的代码缓存
    element: <C />,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
