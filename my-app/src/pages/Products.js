import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editableProductId, setEditableProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [filterProductName, setFilterProductName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const productsPerPage = 10;

  useEffect(() => {
    fetch(`${api}/products`)
      .then(response => response.json())
      .then(data => setProducts(data));

    fetch(`${api}/suppliers`)
      .then(response => response.json())
      .then(data => setSuppliers(data));

    fetch(`${api}/categories`)
      .then(response => response.json())
      .then(data => setCategories(data));
  }, []);

  const handleInputChange = (productId, field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSave = (productId) => {
    const updatedProduct = editedProduct[productId];
    fetch(`${api}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then(response => {
        if (response.ok) {
          setProducts(products.map(product =>
            product.ProductID === productId ? { ...product, ...updatedProduct } : product
          ));
          setEditableProductId(null);
        } else {
          alert('Failed to update product');
        }
      });
  };

  const handleDelete = (productId) => {
    fetch(`${api}/products/${productId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setProducts(products.filter(product => product.ProductID !== productId));
        } else {
          alert('Failed to delete product');
        }
      });
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(supplier => supplier.SupplierID === supplierId);
    return supplier ? supplier.SupplierName : 'Unknown Supplier';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(category => category.CategoryID === categoryId);
    return category ? category.CategoryName : 'Unknown Category';
  };

  const handleFilterChange = (field, value) => {
    if (field === 'productName') setFilterProductName(value);
    if (field === 'category') setFilterCategory(value);
    if (field === 'supplier') setFilterSupplier(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterProductName('');
    setFilterCategory('');
    setFilterSupplier('');
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredProducts = sortedProducts.filter(product => {
    return (
      (filterCategory === '' || product.CategoryID === parseInt(filterCategory)) &&
      (filterSupplier === '' || product.SupplierID === parseInt(filterSupplier))
    );
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navigation />
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="mb-4">
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Product Name"
          value={filterProductName}
          onChange={(e) => handleFilterChange('productName', e.target.value)}
        />
        <select
          className="border p-2 mb-2 w-full"
          value={filterCategory}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">Filter by Category</option>
          {categories.map(category => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.CategoryName}
            </option>
          ))}
        </select>
        <select
          className="border p-2 mb-2 w-full"
          value={filterSupplier}
          onChange={(e) => handleFilterChange('supplier', e.target.value)}
        >
          <option value="">Filter by Supplier</option>
          {suppliers.map(supplier => (
            <option key={supplier.SupplierID} value={supplier.SupplierID}>
              {supplier.SupplierName}
            </option>
          ))}
        </select>
        <div className="flex justify-end">
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditableProductId('new')}
      >
        Add New Product
      </button>
      {editableProductId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Product Name"
            value={editedProduct['new']?.ProductName || ''}
            onChange={(e) => handleInputChange('new', 'ProductName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Price"
            value={editedProduct['new']?.Price || ''}
            onChange={(e) => handleInputChange('new', 'Price', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Unit"
            value={editedProduct['new']?.Unit || ''}
            onChange={(e) => handleInputChange('new', 'Unit', e.target.value)}
          />
          <select
            className="border p-2 mb-2 w-full"
            value={editedProduct['new']?.SupplierID || ''}
            onChange={(e) => handleInputChange('new', 'SupplierID', e.target.value)}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.SupplierID} value={supplier.SupplierID}>
                {supplier.SupplierName}
              </option>
            ))}
          </select>
          <select
            className="border p-2 mb-2 w-full"
            value={editedProduct['new']?.CategoryID || ''}
            onChange={(e) => handleInputChange('new', 'CategoryID', e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.CategoryID} value={category.CategoryID}>
                {category.CategoryName}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                const newProduct = editedProduct['new'];
                fetch(`${api}/products`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newProduct),
                })
                  .then(response => response.json())
                  .then(data => {
                    setProducts([...products, data]);
                    setEditableProductId(null);
                    setEditedProduct(prev => {
                      const { new: _, ...rest } = prev;
                      return rest;
                    });
                    window.location.reload();
                  });
              }}
            >
              Save
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setEditableProductId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('ProductName')}>
              Product Name {sortConfig.key === 'ProductName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Price')}>
              Price {sortConfig.key === 'Price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Unit')}>
              Unit {sortConfig.key === 'Unit' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('SupplierID')}>
              Supplier {sortConfig.key === 'SupplierID' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('CategoryID')}>
              Category {sortConfig.key === 'CategoryID' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.ProductID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedProduct[product.ProductID]?.ProductName || product.ProductName}
                    onChange={(e) =>
                      handleInputChange(product.ProductID, 'ProductName', e.target.value)
                    }
                  />
                ) : (
                  product.ProductName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedProduct[product.ProductID]?.Price || product.Price}
                    onChange={(e) =>
                      handleInputChange(product.ProductID, 'Price', e.target.value)
                    }
                  />
                ) : (
                  product.Price
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedProduct[product.ProductID]?.Unit || product.Unit}
                    onChange={(e) =>
                      handleInputChange(product.ProductID, 'Unit', e.target.value)
                    }
                  />
                ) : (
                  product.Unit
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <select
                    className="border p-2 w-full"
                    value={editedProduct[product.ProductID]?.SupplierID || product.SupplierID}
                    onChange={(e) =>
                      handleInputChange(product.ProductID, 'SupplierID', e.target.value)
                    }
                  >
                    {suppliers.map(supplier => (
                      <option key={supplier.SupplierID} value={supplier.SupplierID}>
                        {supplier.SupplierName}
                      </option>
                    ))}
                  </select>
                ) : (
                  getSupplierName(product.SupplierID)
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <select
                    className="border p-2 w-full"
                    value={editedProduct[product.ProductID]?.CategoryID || product.CategoryID}
                    onChange={(e) =>
                      handleInputChange(product.ProductID, 'CategoryID', e.target.value)
                    }
                  >
                    {categories.map(category => (
                      <option key={category.CategoryID} value={category.CategoryID}>
                        {category.CategoryName}
                      </option>
                    ))}
                  </select>
                ) : (
                  getCategoryName(product.CategoryID)
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(product.ProductID)}
                    >
                      Save
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableProductId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableProductId(product.ProductID)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(product.ProductID)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;