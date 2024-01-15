import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Admin from './admin';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import img from './assets/imgs/Tet-2024---KV.jpg'
import CoverImage from './views/CoverImage';

const router = createBrowserRouter([
  {
    path: '/game/:groupCode',
    element: <App />
  },
  {
    path: '/admin',
    element: <Admin />
  },
  {
    path: '*',
    element: <CoverImage src={img} />
  }
])



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);