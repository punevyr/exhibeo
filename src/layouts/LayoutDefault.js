import React from 'react';
import Footer from '../components/layout/Footer';

const LayoutDefault = ({ children }) => (
  <>
    <main className="site-content">
      {children}
    </main>
    <Footer />
  </>
);

export default LayoutDefault;  