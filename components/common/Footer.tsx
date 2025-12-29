import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-gray-400 uppercase text-xs font-bold mb-4">About</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Flipkart Stories</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-400 uppercase text-xs font-bold mb-4">Help</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Payments</a></li>
            <li><a href="#" className="hover:underline">Shipping</a></li>
            <li><a href="#" className="hover:underline">Cancellation & Returns</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-400 uppercase text-xs font-bold mb-4">Policy</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Return Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
            <li><a href="#" className="hover:underline">Security</a></li>
            <li><a href="#" className="hover:underline">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-400 uppercase text-xs font-bold mb-4">Social</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">YouTube</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 items-center">
             <span className="font-bold italic text-lg tracking-wide">FlipKart</span>
        </div>
        <div className="text-gray-400 text-xs">
          © 2007-2024 Flipkart.com
        </div>
      </div>
    </footer>
  );
};

export default Footer;
