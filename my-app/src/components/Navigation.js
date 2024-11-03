import React from 'react';
import {Link} from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="flex justify-between items-center py-4">
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
      </ul>
    </nav>
  );
};

export default Navigation;