import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { FaShoppingBag, FaBoxOpen, FaCheckCircle, FaClock, FaTruck } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ";
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className={baseClass + "bg-green-100 text-green-800"}><FaCheckCircle /> Delivered</span>;
      case 'shipped':
        return <span className={baseClass + "bg-blue-100 text-blue-800"}><FaTruck /> Shipped</span>;
      case 'processing lenses':
      case 'processing':
        return <span className={baseClass + "bg-purple-100 text-purple-800"}><FaClock /> Processing Lenses</span>;
      case 'accepted':
        return <span className={baseClass + "bg-indigo-100 text-indigo-800"}><FaCheckCircle /> Accepted</span>;
      case 'cancelled':
        return <span className={baseClass + "bg-red-100 text-red-800"}><FaClock /> Cancelled</span>;
      case 'pending':
      default:
        return <span className={baseClass + "bg-yellow-100 text-yellow-800"}><FaClock /> Pending</span>;
    }
  };

  const getDeliveryText = (order) => {
    const createdDate = new Date(order.created_at);
    
    // Expected delivery: 5 days after creation
    const expectedDate = new Date(createdDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    const formattedExpected = expectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    if (order.status?.toLowerCase() === 'delivered') {
      const deliveredDate = new Date(order.updated_at || order.created_at);
      const formattedDelivered = deliveredDate.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return (
        <div className="bg-green-50/50 px-6 py-3 border-t border-gray-150 flex items-center gap-2 text-green-800 text-xs font-semibold">
          <FaCheckCircle className="text-green-600" />
          <span>Delivered on: {formattedDelivered}</span>
        </div>
      );
    }

    if (order.status?.toLowerCase() === 'cancelled') {
      return (
        <div className="bg-red-50/50 px-6 py-3 border-t border-gray-150 flex items-center gap-2 text-red-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          <span>Order Cancelled</span>
        </div>
      );
    }

    return (
      <div className="bg-blue-50/50 px-6 py-3 border-t border-gray-150 flex items-center gap-2 text-blue-800 text-xs font-semibold">
        <FaClock className="text-blue-600" />
        <span>Estimated Delivery by: <strong className="text-blue-900">{formattedExpected}</strong></span>
      </div>
    );
  };

  if (loading) return <div className="text-center py-20 font-bold text-lg text-primary">Loading Orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6 text-gray-300">
          <FaBoxOpen size={80} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-primary">No Orders Yet</h2>
        <p className="text-gray-500 mb-8">You haven't placed any orders with MAXVISION yet.</p>
        <Link to="/products" className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors font-bold shadow-md">
          Shop Eyewear Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-primary flex items-center gap-3">
        <FaShoppingBag className="text-secondary" /> My Orders ({orders.length})
      </h1>

      <div className="space-y-8">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
            {/* Header info */}
            <div className="bg-light px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                <div>
                  <span className="block text-xs uppercase text-gray-400 font-semibold">Order Placed</span>
                  <span className="font-medium">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-400 font-semibold">Total Amount</span>
                  <span className="font-bold text-primary">₹{order.total_amount}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-400 font-semibold">Ship To</span>
                  <span className="font-medium truncate block max-w-xs">{order.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-semibold block uppercase md:hidden">Status:</span>
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* Order Items list */}
            <div className="p-6 divide-y divide-gray-100">
              {order.items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 py-4 first:pt-0 last:pb-0">
                  <div className="w-24 h-24 bg-light rounded-lg flex items-center justify-center p-2 border border-gray-100 flex-shrink-0">
                    <img src={item.product.image || "https://via.placeholder.com/150"} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-bold text-primary text-base mb-1">{item.product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 capitalize">Frame shape: {item.product.frame_shape.replace('_', ' ')} | Material: {item.product.material}</p>
                    
                    <div className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                      <span className="font-semibold">Lens:</span> {item.lens_package.replace('_', ' ').toUpperCase()} 
                      {item.lens_price > 0 && ` (+₹${item.lens_price})`}
                    </div>
                  </div>

                  <div className="text-center sm:text-right flex-shrink-0">
                    <div className="text-gray-500 text-sm mb-1">{item.quantity}x @ ₹{item.price}</div>
                    <div className="font-extrabold text-primary text-lg">₹{item.subtotal}</div>
                  </div>
                </div>
              ))}
              
              {order.prescription_file && (
                <div className="pt-4 mt-2 flex items-center justify-between text-sm border-t border-gray-100">
                  <span className="text-gray-500 font-semibold uppercase text-xs">Prescription:</span>
                  <a 
                    href={order.prescription_file.startsWith('http') ? order.prescription_file : `http://localhost:8000${order.prescription_file}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary font-bold hover:underline flex items-center gap-1.5"
                  >
                    📄 View Uploaded Prescription
                  </a>
                </div>
              )}
            </div>

            {/* Delivery Info Footer */}
            {getDeliveryText(order)}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Orders;
