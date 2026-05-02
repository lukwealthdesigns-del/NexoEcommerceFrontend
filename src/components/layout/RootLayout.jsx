

// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Navbar from '../common/Navbar';
// import Footer from '../common/Footer';
// import AdsCarousel from '../common/AdsCarousel';

// const RootLayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow pt-16">
//         <div className="container mx-auto px-4">
//           {/* Ads Carousel - Shows on all public pages */}
//           <AdsCarousel />
//           <Outlet />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default RootLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
// AdsCarousel removed from here - it's already global in App.jsx

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;