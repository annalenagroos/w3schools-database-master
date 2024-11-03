import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editableSupplierId, setEditableSupplierId] = useState(null);
  const [editedSupplier, setEditedSupplier] = useState({});
  const [filterSupplierName, setFilterSupplierName] = useState('');
  const [filterContactName, setFilterContactName] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterPostalCode, setFilterPostalCode] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const suppliersPerPage = 10;

  useEffect(() => {
    fetch(`${api}/suppliers`)
      .then(response => response.json())
      .then(data => setSuppliers(data));
  }, []);

  const handleInputChange = (supplierId, field, value) => {
    setEditedSupplier(prev => ({
      ...prev,
      [supplierId]: {
        ...prev[supplierId],
        [field]: value,
      },
    }));
  };

  const handleSave = (supplierId) => {
    const updatedSupplier = editedSupplier[supplierId];
    fetch(`${api}/suppliers/${supplierId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSupplier),
    })
      .then(response => {
        if (response.ok) {
          setSuppliers(suppliers.map(supplier =>
            supplier.SupplierID === supplierId ? { ...supplier, ...updatedSupplier } : supplier
          ));
          setEditableSupplierId(null);
        } else {
          alert('Failed to update supplier');
        }
      });
  };

  const handleDelete = (supplierId) => {
    fetch(`${api}/suppliers/${supplierId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setSuppliers(suppliers.filter(supplier => supplier.SupplierID !== supplierId));
        } else {
          alert('Failed to delete supplier');
        }
      });
  };

  const handleFilterChange = (field, value) => {
    if (field === 'supplierName') setFilterSupplierName(value);
    if (field === 'contactName') setFilterContactName(value);
    if (field === 'address') setFilterAddress(value);
    if (field === 'city') setFilterCity(value);
    if (field === 'postalCode') setFilterPostalCode(value);
    if (field === 'country') setFilterCountry(value);
    if (field === 'phone') setFilterPhone(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterSupplierName('');
    setFilterContactName('');
    setFilterAddress('');
    setFilterCity('');
    setFilterPostalCode('');
    setFilterCountry('');
    setFilterPhone('');
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredSuppliers = sortedSuppliers.filter(supplier => 
    supplier.SupplierName.toLowerCase().includes(filterSupplierName.toLowerCase()) &&
    supplier.ContactName.toLowerCase().includes(filterContactName.toLowerCase()) &&
    supplier.Address.toLowerCase().includes(filterAddress.toLowerCase()) &&
    supplier.City.toLowerCase().includes(filterCity.toLowerCase()) &&
    supplier.PostalCode.toLowerCase().includes(filterPostalCode.toLowerCase()) &&
    supplier.Country.toLowerCase().includes(filterCountry.toLowerCase()) &&
    supplier.Phone.toLowerCase().includes(filterPhone.toLowerCase())
  );

  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);
  const totalPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);

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
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Supplier Name"
          value={filterSupplierName}
          onChange={(e) => handleFilterChange('supplierName', e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Contact Name"
          value={filterContactName}
          onChange={(e) => handleFilterChange('contactName', e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Address"
          value={filterAddress}
          onChange={(e) => handleFilterChange('address', e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by City"
          value={filterCity}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Postal Code"
          value={filterPostalCode}
          onChange={(e) => handleFilterChange('postalCode', e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Country"
          value={filterCountry}
          onChange={(e) => handleFilterChange('country', e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Phone"
          value={filterPhone}
          onChange={(e) => handleFilterChange('phone', e.target.value)}
        />
      </div>
        <div className="flex justify-end">
          <button 
            className="bg-gray-300 text-white px-4 py-2 rounded mb-4"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>      
      <button 
        className="bg-blue-300 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditableSupplierId('new')}
      >
        Add New Supplier
      </button>
      {editableSupplierId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Supplier Name"
            value={editedSupplier['new']?.SupplierName || ''}
            onChange={(e) => handleInputChange('new', 'SupplierName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Contact Name"
            value={editedSupplier['new']?.ContactName || ''}
            onChange={(e) => handleInputChange('new', 'ContactName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Address"
            value={editedSupplier['new']?.Address || ''}
            onChange={(e) => handleInputChange('new', 'Address', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="City"
            value={editedSupplier['new']?.City || ''}
            onChange={(e) => handleInputChange('new', 'City', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Postal Code"
            value={editedSupplier['new']?.PostalCode || ''}
            onChange={(e) => handleInputChange('new', 'PostalCode', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Country"
            value={editedSupplier['new']?.Country || ''}
            onChange={(e) => handleInputChange('new', 'Country', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Phone"
            value={editedSupplier['new']?.Phone || ''}
            onChange={(e) => handleInputChange('new', 'Phone', e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="bg-green-300 text-white px-4 py-2 rounded"
              onClick={() => {
                const newSupplier = editedSupplier['new'];
                fetch(`${api}/suppliers`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newSupplier),
                })
                  .then(response => response.json())
                  .then(data => {
                    setSuppliers([...suppliers, data]);
                    setEditableSupplierId(null);
                    setEditedSupplier(prev => {
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
              className="bg-red-300 text-white px-4 py-2 rounded"
              onClick={() => setEditableSupplierId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('SupplierName')}>
              Supplier Name {sortField === 'SupplierName' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('ContactName')}>
              Contact Name {sortField === 'ContactName' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Address')}>
              Address {sortField === 'Address' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('City')}>
              City {sortField === 'City' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('PostalCode')}>
              Postal Code {sortField === 'PostalCode' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Country')}>
              Country {sortField === 'Country' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Phone')}>
              Phone {sortField === 'Phone' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSuppliers.map(supplier => (
            <tr key={supplier.SupplierID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.SupplierName || supplier.SupplierName}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'SupplierName', e.target.value)
                    }
                  />
                ) : (
                  supplier.SupplierName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.ContactName || supplier.ContactName}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'ContactName', e.target.value)
                    }
                  />
                ) : (
                  supplier.ContactName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.Address || supplier.Address}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'Address', e.target.value)
                    }
                  />
                ) : (
                  supplier.Address
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.City || supplier.City}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'City', e.target.value)
                    }
                  />
                ) : (
                  supplier.City
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.PostalCode || supplier.PostalCode}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'PostalCode', e.target.value)
                    }
                  />
                ) : (
                  supplier.PostalCode
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.Country || supplier.Country}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'Country', e.target.value)
                    }
                  />
                ) : (
                  supplier.Country
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.Phone || supplier.Phone}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'Phone', e.target.value)
                    }
                  />
                ) : (
                  supplier.Phone
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-300 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(supplier.SupplierID)}
                    >
                      Save
                    </button>
                    <button 
                      className="bg-red-300 text-white px-4 py-2 rounded"
                      onClick={() => setEditableSupplierId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-yellow-300 text-white px-4 py-2 rounded"
                      onClick={() => setEditableSupplierId(supplier.SupplierID)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-300 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(supplier.SupplierID)}
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
          className="bg-gray-300 text-white px-4 py-2 rounded"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="bg-gray-300 text-white px-4 py-2 rounded"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Suppliers;