import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, totalPrice, totalQuantity } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded shadow text-center max-w-md w-full">
            <img 
                src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" 
                alt="Empty Cart" 
                className="w-48 mx-auto mb-6"
            />
            <h2 className="text-xl font-medium mb-2">Your cart is empty!</h2>
            <p className="text-gray-500 mb-6 text-sm">Add items to it now.</p>
            <Link to="/" className="bg-blue-600 text-white px-8 py-2 rounded-sm font-medium shadow hover:bg-blue-700 transition">Shop Now</Link>
        </div>
      </div>
    );
  }

  const discountAmount = items.reduce((acc, item) => acc + (item.originalPrice - item.price) * item.quantity, 0);
  const originalTotalPrice = items.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-4">
        
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow-sm mb-4">
            <div className="p-4 border-b">
                 <h2 className="font-medium text-lg">My Cart ({totalQuantity})</h2>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="p-6 border-b flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1 hover:text-blue-600 cursor-pointer">{item.title}</h3>
                  <div className="text-sm text-gray-500 mb-2">Seller: RetailNet <span className="text-blue-600 font-bold ml-1">Assured</span></div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-bold text-lg text-gray-900">₹{item.price.toLocaleString()}</span>
                    <span className="text-gray-500 line-through text-sm">₹{item.originalPrice.toLocaleString()}</span>
                    <span className="text-green-600 text-sm font-bold">{item.discount}% Off</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button 
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                            disabled={item.quantity <= 1}
                        >
                            -
                        </button>
                        <input type="text" value={item.quantity} readOnly className="w-10 text-center border border-gray-300 text-sm py-1" />
                        <button 
                             className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center"
                             onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        >
                            +
                        </button>
                    </div>
                    <button 
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="font-medium text-black hover:text-blue-600 uppercase text-sm ml-4"
                    >
                        Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 sticky bottom-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-end">
                <button 
                    onClick={handleCheckout}
                    className="bg-[#fb641b] text-white py-3 px-10 text-base font-medium uppercase rounded-sm shadow hover:shadow-lg transition"
                >
                    Place Order
                </button>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="lg:w-1/3">
           <div className="bg-white shadow-sm sticky top-20">
               <div className="p-4 border-b">
                   <h3 className="text-gray-500 font-bold text-base uppercase">Price Details</h3>
               </div>
               <div className="p-4 flex flex-col gap-4">
                   <div className="flex justify-between">
                       <span className="text-gray-800">Price ({totalQuantity} items)</span>
                       <span className="text-gray-800">₹{originalTotalPrice.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between">
                       <span className="text-gray-800">Discount</span>
                       <span className="text-green-600">- ₹{discountAmount.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between">
                       <span className="text-gray-800">Delivery Charges</span>
                       <span className="text-green-600">Free</span>
                   </div>
                   <div className="border-t border-dashed my-2"></div>
                   <div className="flex justify-between font-bold text-lg text-gray-900">
                       <span>Total Amount</span>
                       <span>₹{totalPrice.toLocaleString()}</span>
                   </div>
                   <div className="border-t border-dashed my-2"></div>
                   <p className="text-green-600 font-medium text-sm">
                       You will save ₹{discountAmount.toLocaleString()} on this order
                   </p>
               </div>
               <div className="p-4 border-t text-xs text-gray-500 flex items-center gap-2">
                    <ShieldCheck size={24} className="text-gray-400" />
                    <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;