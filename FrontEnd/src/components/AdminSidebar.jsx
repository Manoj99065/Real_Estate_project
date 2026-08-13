


// import React from 'react';
// import { NavLink, Link } from 'react-router-dom';
// import {
//   HiOutlineViewGrid,
//   HiOutlineUsers,
//   HiOutlineUserCircle,
//   HiOutlineLibrary,
//   HiOutlineChatAlt2,
//   HiOutlineMail,
//   HiOutlineLogout,
//   HiOutlineHome,
//   HiOutlineShoppingCart,
// } from 'react-icons/hi';
// import { adminSidebarStyles as s } from '../assets/dummyStyles';
// import { useAuth } from '../context/AuthContext';

// const AdminSidebar = ({ isOpen, onClose }) => {
//   const { logout } = useAuth();

//   const navItems = [
//     { name: "Overview", icon: HiOutlineViewGrid, path: "/admin-dashboard" },
//     { name: "Users", icon: HiOutlineUsers, path: "/admin/users" },
//     { name: "Seller Requests", icon: HiOutlineUserCircle, path: "/admin/seller-requests" },
//     { name: "Purchase Requests", icon: HiOutlineShoppingCart, path: "/admin/purchase-requests" },
//     { name: "Properties", icon: HiOutlineLibrary, path: "/admin/properties" },
//     { name: "Inquiries", icon: HiOutlineChatAlt2, path: "/admin/inquiries" },
//     { name: "Contact Inbox", icon: HiOutlineMail, path: "/admin/contacts" },
//   ];

//   return (
//     <>
//       {/* Backdrop for mobile */}
//       <div className={s.backdrop(isOpen)} onClick={onClose} />

//       {/* ✅ Sidebar - Fixed/Static position */}
//       <aside className={s.sidebar(isOpen)}>
//         <div className={s.navContainer}>
//           {/* Home Button - Fixed at Top */}
//           <div className={s.homeButtonContainer}>
//             <Link
//               to="/"
//               onClick={() => {
//                 if (window.innerWidth < 768) onClose();
//               }}
//               className={s.homeButton}
//             >
//               <HiOutlineHome size={24} />
//               <span className={s.homeButtonText}>Home</span>
//             </Link>
//           </div>

//           {/* Navigation Items - Static Middle Section */}
//           <nav className={s.navList}>
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.name}
//                 to={item.path}
//                 onClick={() => {
//                   if (window.innerWidth < 768) onClose();
//                 }}
//                 className={({ isActive }) => s.navLink(isActive)}
//               >
//                 <item.icon size={20} />
//                 <span className={s.navItemText}>{item.name}</span>
//               </NavLink>
//             ))}
//           </nav>

//           {/* Logout - Fixed at Bottom */}
//           <div className={s.logoutContainer}>
//             <button
//               onClick={() => {
//                 onClose();
//                 logout();
//               }}
//               className={s.logoutButton}
//             >
//               <HiOutlineLogout size={20} />
//               <span className={s.logoutText}>Logout</span>
//             </button>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default AdminSidebar;





import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlineLibrary,
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineShoppingCart,
} from 'react-icons/hi';
import { adminSidebarStyles as s } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Overview", icon: HiOutlineViewGrid, path: "/admin-dashboard" },
    { name: "Users", icon: HiOutlineUsers, path: "/admin/users" },
    { name: "Seller Requests", icon: HiOutlineUserCircle, path: "/admin/seller-requests" },
    { name: "Purchase Requests", icon: HiOutlineShoppingCart, path: "/admin/purchase-requests" },
    { name: "Properties", icon: HiOutlineLibrary, path: "/admin/properties" },
    { name: "Inquiries", icon: HiOutlineChatAlt2, path: "/admin/inquiries" },
    { name: "Contact Inbox", icon: HiOutlineMail, path: "/admin/contacts" },
  ];

  // Check if currently on home page
  const isHomeActive = location.pathname === '/';

  return (
    <>
      {/* Backdrop for mobile */}
      <div className={s.backdrop(isOpen)} onClick={onClose} />

      <aside className={s.sidebar(isOpen)}>
        <div className={s.navContainer}>
          {/* 🏠 Interactive Home Button */}
          <div className="px-3 mb-4">
            <Link
              to="/"
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              title="Go to Homepage"
              className={`
                relative flex items-center gap-3 py-2.5 px-4 rounded-xl
                transition-all duration-300 ease-in-out
                group
                ${isHomeActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-2 ring-emerald-200/60'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/70'
                }
              `}
            >
              {/* Background glow (appears on hover/active) */}
              <span className={`
                absolute inset-0 rounded-xl transition-opacity duration-500 pointer-events-none
                ${isHomeActive
                  ? 'opacity-100 bg-gradient-to-r from-emerald-100/50 to-emerald-50'
                  : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-emerald-50/30 to-transparent'
                }
              `} />

              {/* Icon with scale & bounce on hover */}
              <HiOutlineHome
                size={24}
                className={`
                  relative z-10 transition-transform duration-300
                  group-hover:scale-110 group-hover:-translate-y-0.5
                  ${isHomeActive ? 'text-emerald-700' : 'text-gray-500 group-hover:text-emerald-600'}
                `}
              />

              {/* Label with underline animation */}
              <span className={`
                relative z-10 font-semibold text-sm
                transition-colors duration-300
                ${isHomeActive ? 'text-emerald-700' : 'text-gray-700 group-hover:text-emerald-700'}
              `}>
                Home
              </span>

              {/* Active indicator dot (right edge) */}
              {isHomeActive && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-full shadow-md shadow-emerald-200" />
              )}

              {/* Animated underline (appears on hover or stays active) */}
              <span className={`
                absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full
                transition-all duration-300
                ${isHomeActive
                  ? 'w-8 bg-emerald-500'
                  : 'w-0 bg-emerald-400 group-hover:w-8'
                }
              `} />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl
                  transition-all duration-200 ease-in-out
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200/50'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      className={`transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                    />
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-gray-100 pt-3 mt-2">
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="
                flex items-center gap-3 w-full px-4 py-2.5 rounded-xl
                text-red-600 hover:text-red-700
                hover:bg-red-50/70
                transition-all duration-200
                group
              "
            >
              <HiOutlineLogout
                size={20}
                className="transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5"
              />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;