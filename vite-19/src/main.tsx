import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import A from './pages/a/a'
import Transition from './pages/transition'
import ToDo from './pages/todo';
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'a',
    element: <A />,
  },
  {
    path: 'transition',
    element: <Transition />,
  },
  {
    path: 'todo',
    element: <ToDo />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
