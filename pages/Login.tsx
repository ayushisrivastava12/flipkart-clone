import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Basic validation to simulate "wrong" credentials
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Incorrect password! Password must be at least 6 characters.');
      return;
    }

    // Since this is a frontend clone without a real backend,
    // we will now accept ANY email and password that passes the above basic checks.
    const user = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email: email,
    };
    
    dispatch(login(user));
    
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    navigate(redirect === 'checkout' ? '/checkout' : '/');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-md flex max-w-4xl w-full min-h-[500px] overflow-hidden">
        
        {/* Left Info Panel */}
        <div className="hidden md:flex bg-blue-600 text-white w-2/5 p-8 flex-col justify-between">
           <div>
               <h2 className="text-3xl font-bold mb-4">{isLogin ? 'Login' : 'Looks like you\'re new here!'}</h2>
               <p className="text-lg text-gray-200">
                   {isLogin 
                    ? 'Get access to your Orders, Wishlist and Recommendations' 
                    : 'Sign up with your mobile number to get started'}
               </p>
           </div>
           <div className="flex justify-center">
               <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login Graphic" className="w-full" />
           </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-between">
           <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {error && (
                   <div className="bg-red-50 text-red-500 p-3 rounded text-sm border border-red-200">
                       {error}
                   </div>
                )}
                <div>
                  <input 
                      type="email" 
                      placeholder="Enter Email/Mobile number" 
                      className="w-full border border-gray-300 rounded-sm px-4 py-3 text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                </div>
                
                <div>
                  <input 
                      type="password" 
                      placeholder="Enter Password" 
                      className="w-full border border-gray-300 rounded-sm px-4 py-3 text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                </div>
                
                <p className="text-xs text-gray-500">
                    By continuing, you agree to Flipkart's <span className="text-blue-600 cursor-pointer">Terms of Use</span> and <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
                </p>

                <button 
                    type="submit" 
                    className="bg-[#fb641b] text-white py-3 font-bold rounded-sm shadow hover:shadow-lg transition"
                >
                    {isLogin ? 'Login' : 'Continue'}
                </button>
           </form>

           <div className="mt-8 text-center">
               {isLogin ? (
                   <p className="text-blue-600 font-medium cursor-pointer" onClick={() => setIsLogin(false)}>New to Flipkart? Create an account</p>
               ) : (
                   <p className="text-blue-600 font-medium cursor-pointer" onClick={() => setIsLogin(true)}>Existing User? Log in</p>
               )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Login;