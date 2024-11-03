import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Products from './pages/Products';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';

const router = createBrowserRouter([
  {
    path: "",
    element: <Products />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/suppliers",
    element: <Suppliers />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
