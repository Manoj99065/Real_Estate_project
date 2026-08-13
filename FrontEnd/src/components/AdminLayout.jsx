// // import React from'react'
// // import {adminLayoutStyles as s}from'../assets/dummyStyles';
// // import AdminSidebar from "./AdminSidebar";


// // const AdminLayout=()=>{
// //    const [isSidebarOpen,setIsSidebarOpen]=useState(false);

// //    return(
// //       <div className={s.layout}>
// //          <AdminSidebar isOpen={isSidebarOpen} onClose={()=> setIsSidebarOpen(false)}/>
// //             <div className={s.mainwrapper}>
// //                <DashboardNabar onMenuClick={()=>setIsSidebarOpen(true)}/>
// //                   <main className={s.mainContent}>
// //                      <Outlet/>
// //                   </main>
// //          </div>
// //       </div>
// //    )
// // }


// // const


// // import React, { useState } from 'react';
// // import { Outlet } from 'react-router-dom';
// // import { AdminLayout } from './components/AdminLayout';``
// // import AdminSidebar from './AdminSidebar';
// // import DashboardNavbar from './DashboardNavbar'; // adjust path if needed

// // const AdminLayout = () => {
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// //   return (
// //     <div className={s.layout}>
// //       <AdminSidebar
// //         isOpen={isSidebarOpen}
// //         onClose={() => setIsSidebarOpen(false)}
// //       />
// //       <div className={s.mainwrapper}>
// //         <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
// //         <main className={s.mainContent}>
// //           <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminLayout;

// // import React, { useState } from 'react';
// // import { Outlet } from 'react-router-dom';
// // import { adminLayoutStyles as s } from '../assets/dummyStyles';
// // import AdminSidebar from './AdminSidebar';
// // import DashboardNavbar from './DashboardNavbar';

// // const AdminLayout = () => {
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// //   return (
// //     <div className={s.layout}>
// //       <AdminSidebar
// //         isOpen={isSidebarOpen}
// //         onClose={() => setIsSidebarOpen(false)}
// //       />
// //       <div className={s.mainwrapper}>
// //         <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
// //         <main className={s.mainContent}>
// //           <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminLayout;


// import { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import AdminSidebar from './AdminSidebar';
// import DashboardNavbar from './DashboardNavbar';
// import { adminLayoutStyles as s } from '../assets/dummyStyles';

// const AdminLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className={s.layout}>
//       <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//       <div className={s.mainwrapper}>
//         <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
//         <main className={s.mainContent}>
//           <Outlet />   {/* this renders AdminDashboard, AdminUsers, etc. */}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


// src/components/AdminLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import DashboardNavbar from './DashboardNavbar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden ml-0 md:ml-[260px]">
        <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />   {/* ← this renders AdminUsers, AdminDashboard, etc. */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;