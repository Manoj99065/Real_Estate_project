// import React from 'react';
// import Logo from './common/Logo';
// import {dahboardNavbarStyle as s}from'../assets/dummyStyles';

// const DashboardNavbar=({onMenuClick})=>{
//    return (
//       <div>
//          <header className={s.header}>
//             <button onClick={onMenuClick}className={s.menuButton}>
//                <HiMenuAlt2 size={24}/>
//             </button>

//             <div className={s.logoContainer}>
//                <Logo fontSize="1.25rem"iconSize={18}/>

//             </div>
//          </header>
//       </div>
//    )
// }

// export default DashboardNavbar



import React from 'react';
import { HiMenuAlt2 } from 'react-icons/hi'; // ← add this import
import Logo from './common/Logo';
import { dashboardNavbarStyles as s } from '../assets/dummyStyles';
const DashboardNavbar = ({ onMenuClick }) => {
  return (
    <header className={s.header}>
      <button onClick={onMenuClick} className={s.menuButton}>
        <HiMenuAlt2 size={24} />
      </button>
      <div className={s.logoContainer}>
        <Logo fontSize="1.25rem" iconSize={18} />
      </div>
    </header>
  );
};

export default DashboardNavbar;