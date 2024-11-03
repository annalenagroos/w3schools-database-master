import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [editableOrderId, setEditableOrderId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});
  const [filterCustomerId, setFilterCustomerId] = useState('');
  const [filterShipperId, setFilterShipperId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const ordersPerPage = 10;

  useEffect(() => {
    fetch(`${api}/orders`)
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error('Error fetching orders:', error));

    fetch(`${api}/customers`)
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching customers:', error));

    fetch(`${api}/shippers`)
      .then(response => response.json())
      .then(data => setShippers(data))
      .catch(error => console.error('Error fetching shippers:', error));
  }, []);

  const handleInputChange = (orderId, field, value) => {
    setEditedOrder(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleSave = (orderId) => {
    const updatedOrder = editedOrder[orderId];
    fetch(`${api}/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedOrder),
    })
      .then(response => {
        if (response.ok) {
          setOrders(orders.map(order =>
            order.OrderID === orderId ? { ...order, ...updatedOrder } : order
          ));
          setEditableOrderId(null);
        } else {
          alert('Failed to update order');
        }
      });
  };

  const handleDelete = (orderId) => {
    fetch(`${api}/orders/${orderId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setOrders(orders.filter(order => order.OrderID !== orderId));
        } else {
          alert('Failed to delete order');
        }
      });
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(customer => customer.CustomerID === customerId);
    return customer ? customer.CustomerName : 'Unknown Customer';
  };

  const getShipperName = (shipperId) => {
    const shipper = shippers.find(shipper => shipper.ShipperID === shipperId);
    return shipper ? shipper.ShipperName : 'Unknown Shipper';
  };

  const handleFilterChange = (field, value) => {
    if (field === 'customerId') setFilterCustomerId(value);
    if (field === 'shipperId') setFilterShipperId(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterCustomerId('');
    setFilterShipperId('');
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter(order => {
    return (
      (filterCustomerId === '' || order.CustomerID === parseInt(filterCustomerId)) &&
      (filterShipperId === '' || order.ShipperID === parseInt(filterShipperId))
    );
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="mb-4">
        <select
          className="border p-2 mb-2 w-full"
          value={filterCustomerId}
          onChange={(e) => handleFilterChange('customerId', e.target.value)}
        >
          <option value="">Filter by Customer</option>
          {customers.map(customer => (
            <option key={customer.CustomerID} value={customer.CustomerID}>
              {customer.CustomerName}
            </option>
          ))}
        </select>
        <select
          className="border p-2 mb-2 w-full"
          value={filterShipperId}
          onChange={(e) => handleFilterChange('shipperId', e.target.value)}
        >
          <option value="">Filter by Shipper</option>
          {shippers.map(shipper => (
            <option key={shipper.ShipperID} value={shipper.ShipperID}>
              {shipper.ShipperName}
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
        onClick={() => setEditableOrderId('new')}
      >
        Add New Order
      </button>
      {editableOrderId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <select
            className="border p-2 mb-2 w-full"
            value={editedOrder['new']?.CustomerID || ''}
            onChange={(e) => handleInputChange('new', 'CustomerID', e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.CustomerID} value={customer.CustomerID}>
                {customer.CustomerName}
              </option>
            ))}
          </select>
          <input
            className="border p-2 mb-2 w-full"
            type="date"
            value={editedOrder['new']?.OrderDate || ''}
            onChange={(e) => handleInputChange('new', 'OrderDate', e.target.value)}
          />
          <select
            className="border p-2 mb-2 w-full"
            value={editedOrder['new']?.ShipperID || ''}
            onChange={(e) => handleInputChange('new', 'ShipperID', e.target.value)}
          >
            <option value="">Select Shipper</option>
            {shippers.map(shipper => (
              <option key={shipper.ShipperID} value={shipper.ShipperID}>
                {shipper.ShipperName}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                const newOrder = editedOrder['new'];
                fetch(`${api}/orders`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newOrder),
                })
                  .then(response => response.json())
                  .then(data => {
                    setOrders([...orders, data]);
                    setEditableOrderId(null);
                    setEditedOrder(prev => {
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
              onClick={() => setEditableOrderId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('OrderID')}>
              Order ID {sortConfig.key === 'OrderID' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('CustomerID')}>
              Customer {sortConfig.key === 'CustomerID' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('OrderDate')}>
              Order Date {sortConfig.key === 'OrderDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('ShipperID')}>
              Shipper {sortConfig.key === 'ShipperID' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order.OrderID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableOrderId === order.OrderID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedOrder[order.OrderID]?.OrderID || order.OrderID}
                    onChange={(e) =>
                      handleInputChange(order.OrderID, 'OrderID', e.target.value)
                    }
                  />
                ) : (
                  order.OrderID
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableOrderId === order.OrderID ? (
                  <select
                    className="border p-2 w-full"
                    value={editedOrder[order.OrderID]?.CustomerID || order.CustomerID}
                    onChange={(e) =>
                      handleInputChange(order.OrderID, 'CustomerID', e.target.value)
                    }
                  >
                    {customers.map(customer => (
                      <option key={customer.CustomerID} value={customer.CustomerID}>
                        {customer.CustomerName}
                      </option>
                    ))}
                  </select>
                ) : (
                  getCustomerName(order.CustomerID)
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableOrderId === order.OrderID ? (
                  <input
                    className="border p-2 w-full"
                    type="date"
                    value={editedOrder[order.OrderID]?.OrderDate || order.OrderDate}
                    onChange={(e) =>
                      handleInputChange(order.OrderID, 'OrderDate', e.target.value)
                    }
                  />
                ) : (
                  new Date(order.OrderDate).toLocaleDateString()
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableOrderId === order.OrderID ? (
                  <select
                    className="border p-2 w-full"
                    value={editedOrder[order.OrderID]?.ShipperID || order.ShipperID}
                    onChange={(e) =>
                      handleInputChange(order.OrderID, 'ShipperID', e.target.value)
                    }
                  >
                    {shippers.map(shipper => (
                      <option key={shipper.ShipperID} value={shipper.ShipperID}>
                        {shipper.ShipperName}
                      </option>
                    ))}
                  </select>
                ) : (
                  getShipperName(order.ShipperID)
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableOrderId === order.OrderID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(order.OrderID)}
                    >
                      Save
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableOrderId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableOrderId(order.OrderID)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(order.OrderID)}
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

export default OrderList;