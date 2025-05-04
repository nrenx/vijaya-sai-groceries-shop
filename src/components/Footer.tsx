import React from 'react';
import { Phone } from 'lucide-react';
const Footer: React.FC = () => {
  return <footer className="bg-vs-blue text-vs-text-white shadow-inner py-6 mt-16">
      <div className="vs-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-vs-orange">Vijaya Sai Provisions</h3>
            <p className="text-vs-text-white mt-1">Quality groceries at your doorstep</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-vs-text-white flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span className="font-medium">Phone/WhatsApp:</span> 9951690420
            </p>
            <p className="text-gray-300 text-sm mt-1">© {new Date().getFullYear()} Vijaya Sai Provisions. All rights reserved.</p>
            <p className="text-vs-orange text-sm mt-1">Free Home Delivery on Orders Above ₹999</p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;