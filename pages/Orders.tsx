import React from 'react';
import { products } from '../services/mockData';

const Orders: React.FC = () => {
  // Mock orders derived from mock products for demonstration
  const orders = [
    {
      id: 'OD1234567890',
      date: 'Oct 15, 2023',
      total: 12999,
      status: 'Delivered',
      items: [products[0]]
    },
    {
      id: 'OD9876543210',
      date: 'Sep 28, 2023',
      total: 4500,
      status: 'Delivered',
      items: [products[2], products[5]]
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-[1000px] mx-auto px-4">
        <h1 className="text-lg font-medium mb-4 text-gray-800">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
             <div key={order.id} className="bg-white p-4 shadow-sm rounded-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Order Items */}
                    <div className="flex-1">
                        {order.items.map((item, idx) => (
                             <div key={idx} className="flex gap-4 mb-4 last:mb-0">
                                 <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                                     <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain"/>
                                 </div>
                                 <div className="flex-1">
                                     <h3 className="font-medium text-sm text-gray-800 hover:text-blue-600 truncate max-w-md">{item.title}</h3>
                                     <p className="text-xs text-gray-500 mt-1">{item.description.substring(0, 60)}...</p>
                                 </div>
                             </div>
                        ))}
                    </div>

                    {/* Order Meta */}
                    <div className="md:w-1/3 flex flex-col justify-between pl-0 md:pl-4 border-l-0 md:border-l border-gray-100">
                         <div>
                            <p className="font-bold text-sm text-gray-900">₹{order.total.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-gray-800">{order.status} on {order.date}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-4">Your item has been delivered</p>
                         </div>
                    </div>
                </div>
             </div>
          ))}
          
          {orders.length === 0 && (
              <div className="bg-white p-8 text-center shadow-sm">
                  <p className="text-gray-500">No orders found.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
