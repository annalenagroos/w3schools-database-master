import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function ShipperList() {
  const [shippers, setShippers] = useState([]);
  const [editableShipperId, setEditableShipperId] = useState(null);
  const [editedShipper, setEditedShipper] = useState({});
  const [filterShipperName, setFilterShipperName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const shippersPerPage = 10;

  useEffect(() => {
    fetch(`${api}/shippers`)
      .then(response => response.json())
      .then(data => setShippers(data))
      .catch(error => console.error('Error fetching shippers:', error));
  }, []);

  const handleInputChange = (shipperId, field, value) => {
    setEditedShipper(prev => ({
      ...prev,
      [shipperId]: {
        ...prev[shipperId],
        [field]: value,
      },
    }));
  };

  const handleSave = (shipperId) => {
    const updatedShipper = editedShipper[shipperId];
    fetch(`${api}/shippers/${shipperId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedShipper),
    })
      .then(response => {
        if (response.ok) {
          setShippers(shippers.map(shipper =>
            shipper.ShipperID === shipperId ? { ...shipper, ...updatedShipper } : shipper
          ));
          setEditableShipperId(null);
        } else {
          alert('Failed to update shipper');
        }
      });
  };

  const handleDelete = (shipperId) => {
    fetch(`${api}/shippers/${shipperId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setShippers(shippers.filter(shipper => shipper.ShipperID !== shipperId));
        } else {
          alert('Failed to delete shipper');
        }
      });
  };

  const handleFilterChange = (value) => {
    setFilterShipperName(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterShipperName('');
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedShippers = [...shippers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredShippers = sortedShippers.filter(shipper => {
    return (
      filterShipperName === '' || shipper.ShipperName.toLowerCase().includes(filterShipperName.toLowerCase())
    );
  });

  const indexOfLastShipper = currentPage * shippersPerPage;
  const indexOfFirstShipper = indexOfLastShipper - shippersPerPage;
  const currentShippers = filteredShippers.slice(indexOfFirstShipper, indexOfLastShipper);
  const totalPages = Math.ceil(filteredShippers.length / shippersPerPage);

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

  const exportToCSV = () => {
    const csvRows = [
      ['ShipperID', 'ShipperName', 'Phone'],
      ...shippers.map(shipper => [shipper.ShipperID, shipper.ShipperName, shipper.Phone])
    ];

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "shippers.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <Navigation />
      <h1 className="text-2xl font-bold mb-4">Shippers</h1>
      <div className="mb-4">
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Filter by Shipper Name"
          value={filterShipperName}
          onChange={(e) => handleFilterChange(e.target.value)}
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
        onClick={() => setEditableShipperId('new')}
      >
        Add New Shipper
      </button>
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={exportToCSV}
      >
        Export to CSV
      </button>
      {editableShipperId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Shipper Name"
            value={editedShipper['new']?.ShipperName || ''}
            onChange={(e) => handleInputChange('new', 'ShipperName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Phone"
            value={editedShipper['new']?.Phone || ''}
            onChange={(e) => handleInputChange('new', 'Phone', e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                const newShipper = editedShipper['new'];
                fetch(`${api}/shippers`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newShipper),
                })
                  .then(response => response.json())
                  .then(data => {
                    setShippers([...shippers, data]);
                    setEditableShipperId(null);
                    setEditedShipper(prev => {
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
              onClick={() => setEditableShipperId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('ShipperID')}>
              Shipper ID {sortConfig.key === 'ShipperID' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('ShipperName')}>
              Shipper Name {sortConfig.key === 'ShipperName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Phone')}>
              Phone {sortConfig.key === 'Phone' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentShippers.map(shipper => (
            <tr key={shipper.ShipperID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableShipperId === shipper.ShipperID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedShipper[shipper.ShipperID]?.ShipperID || shipper.ShipperID}
                    onChange={(e) =>
                      handleInputChange(shipper.ShipperID, 'ShipperID', e.target.value)
                    }
                  />
                ) : (
                  shipper.ShipperID
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableShipperId === shipper.ShipperID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedShipper[shipper.ShipperID]?.ShipperName || shipper.ShipperName}
                    onChange={(e) =>
                      handleInputChange(shipper.ShipperID, 'ShipperName', e.target.value)
                    }
                  />
                ) : (
                  shipper.ShipperName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableShipperId === shipper.ShipperID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedShipper[shipper.ShipperID]?.Phone || shipper.Phone}
                    onChange={(e) =>
                      handleInputChange(shipper.ShipperID, 'Phone', e.target.value)
                    }
                  />
                ) : (
                  shipper.Phone
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableShipperId === shipper.ShipperID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(shipper.ShipperID)}
                    >
                      Save
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableShipperId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableShipperId(shipper.ShipperID)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(shipper.ShipperID)}
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

export default ShipperList;