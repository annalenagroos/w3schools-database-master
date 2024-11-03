import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [editableCustomerId, setEditableCustomerId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const customersPerPage = 10;

  useEffect(() => {
    fetch(`${api}/customers`)
      .then(response => response.json())
      .then(data => setCustomers(data));
  }, []);

  const handleInputChange = (customerId, field, value) => {
    setEditedCustomer(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: value,
      },
    }));
  };

  const handleSave = (customerId) => {
    const updatedCustomer = editedCustomer[customerId];
    fetch(`${api}/customers/${customerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCustomer),
    })
      .then(response => {
        if (response.ok) {
          setCustomers(customers.map(customer =>
            customer.CustomerID === customerId ? { ...customer, ...updatedCustomer } : customer
          ));
          setEditableCustomerId(null);
        } else {
          alert('Failed to update customer');
        }
      });
  };

  const handleDelete = (customerId) => {
    fetch(`${api}/customers/${customerId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setCustomers(customers.filter(customer => customer.CustomerID !== customerId));
        } else {
          alert('Failed to delete customer');
        }
      });
  };

  const handleFilterChange = (field, value) => {
    if (field === 'customerName') setFilterCustomerName(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterCustomerName('');
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter(customer => {
    return (
      filterCustomerName === '' || customer.CustomerName.toLowerCase().includes(filterCustomerName.toLowerCase())
    );
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

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
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="mb-4">
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Customer Name"
          value={filterCustomerName}
          onChange={(e) => handleFilterChange('customerName', e.target.value)}
        />
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
        onClick={() => setEditableCustomerId('new')}
      >
        Add New Customer
      </button>
      {editableCustomerId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Customer Name"
            value={editedCustomer['new']?.CustomerName || ''}
            onChange={(e) => handleInputChange('new', 'CustomerName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Contact Name"
            value={editedCustomer['new']?.ContactName || ''}
            onChange={(e) => handleInputChange('new', 'ContactName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Address"
            value={editedCustomer['new']?.Address || ''}
            onChange={(e) => handleInputChange('new', 'Address', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="City"
            value={editedCustomer['new']?.City || ''}
            onChange={(e) => handleInputChange('new', 'City', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Postal Code"
            value={editedCustomer['new']?.PostalCode || ''}
            onChange={(e) => handleInputChange('new', 'PostalCode', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Country"
            value={editedCustomer['new']?.Country || ''}
            onChange={(e) => handleInputChange('new', 'Country', e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                const newCustomer = editedCustomer['new'];
                fetch(`${api}/customers`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newCustomer),
                })
                  .then(response => response.json())
                  .then(data => {
                    setCustomers([...customers, data]);
                    setEditableCustomerId(null);
                    setEditedCustomer(prev => {
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
              onClick={() => setEditableCustomerId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('CustomerName')}>
              Customer Name {sortConfig.key === 'CustomerName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('ContactName')}>
              Contact Name {sortConfig.key === 'ContactName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Address')}>
              Address {sortConfig.key === 'Address' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('City')}>
              City {sortConfig.key === 'City' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('PostalCode')}>
              Postal Code {sortConfig.key === 'PostalCode' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Country')}>
              Country {sortConfig.key === 'Country' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map(customer => (
            <tr key={customer.CustomerID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCustomer[customer.CustomerID]?.CustomerName || customer.CustomerName}
                    onChange={(e) =>
                      handleInputChange(customer.CustomerID, 'CustomerName', e.target.value)
                    }
                  />
                ) : (
                  customer.CustomerName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCustomer[customer.CustomerID]?.ContactName || customer.ContactName}
                    onChange={(e) =>
                      handleInputChange(customer.CustomerID, 'ContactName', e.target.value)
                    }
                  />
                ) : (
                  customer.ContactName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCustomer[customer.CustomerID]?.Address || customer.Address}
                    onChange={(e) =>
                      handleInputChange(customer.CustomerID, 'Address', e.target.value)
                    }
                  />
                ) : (
                  customer.Address
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCustomer[customer.CustomerID]?.City || customer.City}
                    onChange={(e) =>
                      handleInputChange(customer.CustomerID, 'City', e.target.value)
                    }
                  />
                ) : (
                  customer.City
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCustomer[customer.CustomerID]?.PostalCode || customer.PostalCode}
                    onChange={(e) =>
                      handleInputChange(customer.CustomerID, 'PostalCode', e.target.value)
                    }
                  />
                ) : (
                  customer.PostalCode
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCustomer[customer.CustomerID]?.Country || customer.Country}
                    onChange={(e) =>
                      handleInputChange(customer.CustomerID, 'Country', e.target.value)
                    }
                  />
                ) : (
                  customer.Country
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(customer.CustomerID)}
                    >
                      Save
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableCustomerId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableCustomerId(customer.CustomerID)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(customer.CustomerID)}
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

export default CustomerList;