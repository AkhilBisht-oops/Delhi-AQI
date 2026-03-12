import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050a18] text-gray-100">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;