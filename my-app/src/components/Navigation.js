import React from 'react';
import { Link } from "react-router-dom";
import logo from './logo.png'; // Aktualisierter Pfad zum Logo

const Navigation = () => {
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-6" />
        <ul className="flex">
          <li className="mr-6">
            <Link className="text-lg hover:text-blue-600 transition duration-300 ease-in-out" to={"/products"}>Products</Link>
          </li>
          <li className="mr-6">
            <Link className="text-lg hover:text-blue-600 transition duration-300 ease-in-out" to={"/categories"}>Categories</Link>
          </li>
          <li className="mr-6">
            <Link className="text-lg hover:text-blue-600 transition duration-300 ease-in-out" to={"/suppliers"}>Suppliers</Link>
          </li>
          <li className="mr-6">
            <Link className="text-lg hover:text-blue-600 transition duration-300 ease-in-out" to={"/customers"}>Customers</Link>
          </li>
          <li className="mr-6">
            <Link className="text-lg hover:text-blue-600 transition duration-300 ease-in-out" to={"/orders"}>Orders</Link>
          </li>
          <li className="mr-6">
            <Link className="text-lg hover:text-blue-600 transition duration-300 ease-in-out" to={"/shippers"}>Shippers</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;