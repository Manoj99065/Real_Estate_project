// //



// import React, { useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import { sellerLayoutStyles as s } from '../assets/dummyStyles';
// import { useAuth } from '../context/AuthContext';

// // Import child components
// import SellerSidebar from './SellerSidebar';
// import DashboardNavbar from './DashboardNavbar';
// import PendingApproval from '../pages/seller/PendingApproval';

// const SellerLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { user } = useAuth();
//   const location = useLocation();

//   // Allow access to public dashboard routes even if seller is not approved
//   const isPublicDashboardRoute = ['/contact', '/profile'].includes(location.pathname);

//   // ✅ Debug – check what's actually coming from backend
//   console.log("User in SellerLayout:", user);
//   console.log("isApproved:", user?.isApproved);

//   return (
//     <div className={s.container}>
//       <SellerSidebar
//         isOpen={isSidebarOpen}
//         onClose={() => setIsSidebarOpen(false)}
//       />

//       <div className={s.contentWrapper}>
//         <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />

//         <main className={s.main}>
//           {/* ✅ UNCOMMENT THIS FOR APPROVAL CHECK (PRODUCTION) */}
//           {/* {user?.isApproved || isPublicDashboardRoute ? (
//             <Outlet />
//           ) : (
//             <PendingApproval />
//           )} */}

//           {/* ✅ COMMENT THIS OUT FOR PRODUCTION – SHOWS DASHBOARD DIRECTLY FOR TESTING */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SellerLayout;



// SellerLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { sellerLayoutStyles as s } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';
import SellerSidebar from './SellerSidebar';
import DashboardNavbar from './DashboardNavbar';
// import PendingApproval from '../pages/seller/PendingApproval'; // (unused, keep commented)

const SellerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // 🔹 Paths where sidebar should be hidden (buyer dashboard only)
  const noSidebarPaths = ['/my-requests']; // add '/dashboard' if you have a seller dashboard without sidebar
  const hideSidebar = noSidebarPaths.includes(location.pathname);

  return (
    <div className={s.container}>
      {/* Sidebar - hidden on buyer dashboard */}
      {!hideSidebar && (
        <SellerSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main wrapper – full width when sidebar is hidden */}
      <div className={`${s.contentWrapper} ${hideSidebar ? 'ml-0' : ''}`}>
        <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className={s.main}>
          <Outlet /> {/* BuyerDashboard or other routes */}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;