
import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppBanner from '@/components/WhatsAppBanner';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-vs-green to-vs-light-purple py-16 md:py-24">
        <div className="vs-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-vs-purple">Vijaya Sai Provisions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Groceries Delivered Free – Shop Now, Send on WhatsApp
            </p>
            <Link to="/products">
              <Button className="vs-button animate-pulse-light rounded-full text-lg px-8 py-6">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="vs-container">
          <h2 className="text-3xl font-semibold text-center mb-10">Why Choose Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-vs-green bg-opacity-50 p-6 rounded-lg text-center">
              <div className="bg-vs-purple bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-vs-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Fresh Products</h3>
              <p className="text-gray-600">We source the freshest groceries directly from suppliers.</p>
            </div>
            
            <div className="bg-vs-green bg-opacity-50 p-6 rounded-lg text-center">
              <div className="bg-vs-purple bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-vs-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Free Delivery</h3>
              <p className="text-gray-600">Get your groceries delivered to your doorstep for free.</p>
            </div>
            
            <div className="bg-vs-green bg-opacity-50 p-6 rounded-lg text-center">
              <div className="bg-vs-purple bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-vs-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">WhatsApp Ordering</h3>
              <p className="text-gray-600">Easily order through WhatsApp for quick service.</p>
            </div>
          </div>
        </div>
      </section>
      
      <WhatsAppBanner />
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="vs-container">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to start shopping?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Browse our selection of quality groceries and household items. We offer competitive prices and excellent service.
            </p>
            <Link to="/products">
              <Button className="vs-button">View Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
