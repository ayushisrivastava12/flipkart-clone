import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Checkout: React.FC = () => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (items.length === 0 && !orderPlaced) {
      navigate('/');
      return null;
  }

  const handlePlaceOrder = () => {
    // Simulate API Call
    setTimeout(() => {
        dispatch(clearCart());
        setOrderPlaced(true);
    }, 1500);
  };

  if (orderPlaced) {
      return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                  <div className="flex justify-center mb-4">
                      <CheckCircle size={64} className="text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                  <p className="text-gray-500 mb-6">Thank you {user?.name}, your order has been confirmed.</p>
                  <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Continue Shopping</button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
       <div className="max-w-[1000px] mx-auto px-4 flex flex-col md:flex-row gap-6">
           <div className="flex-1 space-y-4">
               {/* Login Section */}
               <div className="bg-white p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 text-xs mr-2 rounded-sm">1</span>
                        <span className="font-medium text-gray-600 uppercase text-sm">Login</span>
                        <div className="ml-8 font-bold text-black mt-1">{user?.name} <span className="text-gray-500 font-normal ml-2">{user?.email}</span></div>
                    </div>
                    <button className="text-blue-600 font-medium text-sm border border-gray-200 px-4 py-1 rounded-sm">CHANGE</button>
               </div>

               {/* Address Section (Mock) */}
               <div className="bg-white p-4 shadow-sm">
                   <div className="flex items-center bg-blue-600 text-white p-2 -ml-4 -mr-4 -mt-4 pl-4 mb-4">
                        <span className="bg-white text-blue-600 px-2 py-0.5 text-xs mr-2 rounded-sm font-bold">2</span>
                        <span className="font-medium uppercase text-sm">Delivery Address</span>
                   </div>
                   <div className="ml-6">
                       <p className="font-bold mb-1">{user?.name} <span className="ml-4 bg-gray-200 text-gray-600 text-xs px-2 rounded">HOME</span></p>
                       <p className="text-sm text-gray-700">123, Tech Plaza, Internet City, Web State - 560001</p>
                       <p className="text-sm text-gray-700 font-bold mt-1">9999999999</p>
                       <button className="bg-[#fb641b] text-white px-8 py-2 text-sm font-medium uppercase mt-4 rounded-sm shadow">Deliver Here</button>
                   </div>
               </div>

               {/* Order Summary */}
                <div className="bg-white p-4 shadow-sm">
                   <div className="flex items-center p-2 -ml-4 -mr-4 -mt-4 pl-4 mb-2">
                        <span className="bg-gray-200 text-blue-600 px-2 py-0.5 text-xs mr-2 rounded-sm font-bold">3</span>
                        <span className="font-medium uppercase text-gray-500 text-sm">Order Summary</span>
                   </div>
                   <div className="ml-6 flex flex-col gap-4">
                       {items.map(item => (
                           <div key={item.id} className="flex gap-4">
                               <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                               <div>
                                   <p className="text-sm font-medium">{item.title}</p>
                                   <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                   <p className="font-bold">₹{item.price.toLocaleString()}</p>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
               
               {/* Payment Options */}
               <div className="bg-white p-4 shadow-sm">
                    <div className="flex items-center bg-blue-600 text-white p-2 -ml-4 -mr-4 -mt-4 pl-4 mb-4">
                        <span className="bg-white text-blue-600 px-2 py-0.5 text-xs mr-2 rounded-sm font-bold">4</span>
                        <span className="font-medium uppercase text-sm">Payment Options</span>
                   </div>
                   <div className="ml-6 space-y-4">
                       <label className="flex items-center gap-3 cursor-pointer">
                           <input type="radio" name="payment" className="w-4 h-4 text-blue-600" />
                           <span className="text-sm">UPI</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer">
                           <input type="radio" name="payment" className="w-4 h-4 text-blue-600" />
                           <span className="text-sm">Wallets</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer">
                           <input type="radio" name="payment" className="w-4 h-4 text-blue-600" />
                           <span className="text-sm">Credit / Debit / ATM Card</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer">
                           <input type="radio" name="payment" className="w-4 h-4 text-blue-600" defaultChecked />
                           <span className="text-sm">Cash on Delivery</span>
                       </label>

                       <button 
                         onClick={handlePlaceOrder}
                         className="bg-[#fb641b] text-white px-10 py-3 text-base font-bold uppercase rounded-sm shadow hover:shadow-lg transition mt-4 w-full md:w-auto"
                       >
                           Confirm Order
                       </button>
                   </div>
               </div>
           </div>

           {/* Sidebar Price Summary */}
           <div className="md:w-1/3">
               <div className="bg-white p-4 shadow-sm sticky top-4">
                   <h3 className="text-gray-500 font-bold text-base uppercase border-b pb-4 mb-4">Price Details</h3>
                   <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Price ({items.length} items)</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t border-dashed my-2"></div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Payable</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default Checkout;