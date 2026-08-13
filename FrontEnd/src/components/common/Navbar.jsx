


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { navbarStyles as s } from '../../assets/dummyStyles';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const location = useLocation();

  // ✅ Admin routes par navbar hide
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = (
    <>
      {/* 🔹 GUEST LINKS (Not Logged In) */}
      {!user && (
        <>
          <Link to="/properties" className={s.navLink} onClick={() => setIsOpen(false)}>
            Browse Properties
          </Link>
          <Link to="/login" className={s.navLink} onClick={() => setIsOpen(false)}>
            Login
          </Link>
          <Link to="/register" className={s.navLink} onClick={() => setIsOpen(false)}>
            Register
          </Link>
        </>
      )}

      {/* 🔹 LOGGED-IN USER LINKS */}
      {user && (
        <>
          {/* 1️⃣ Home - Sabko dikhega */}
          <Link to="/" className={s.navLink} onClick={() => setIsOpen(false)}>
            Home
          </Link>

          {/* 2️⃣ Browse Properties - Sabko dikhega */}
          <Link to="/properties" className={s.navLink} onClick={() => setIsOpen(false)}>
            Browse Properties
          </Link>

          {/* ✅ SELLER - Sirf Home, Properties aur Dashboard */}
          {user.role === 'seller' && (
            <>
              <Link to="/dashboard" className={s.navLink} onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </>
          )}

          {/* ✅ BUYER - Wishlist, Messages, Contact Us */}
          {user.role === 'buyer' && (
            <>
              <Link to="/wishlist" className={s.navLink} onClick={() => setIsOpen(false)}>
                Wishlist
              </Link>
              <Link to="/messages" className={s.navLink} onClick={() => setIsOpen(false)}>
                Messages
              </Link>
              <Link to="/contact" className={s.navLink} onClick={() => setIsOpen(false)}>
                Contact Us
              </Link>
              <Link to="/my-requests" className={s.navLink}>Dashboard</Link>            </>
          )}

          {/* ✅ ADMIN - Admin Panel */}
          {user.role === 'admin' && (
            <>
              <Link to="/admin-dashboard" className={s.navLink} onClick={() => setIsOpen(false)}>
                Admin Panel
              </Link>
               {/* <Link to="/wishlist" className={s.navLink} onClick={() => setIsOpen(false)}> */}
                {/* Wishlist */}
              {/* </Link> */}
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <nav className={s.nav}>
        <div className={s.container}>
          <div className={s.grid}>
            <div className="justify-self-start">
              <Logo />
            </div>
            <div className={s.desktopMenu}>{navLinks}</div>

            {/* right side */}
            <div className={s.rightSection}>
              {user ? (
                <div className={s.userSection}>
                  <Link to="/profile" className="flex items-center">
                    <img
                      src={
                        user.profilePic ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                      }
                      alt="Profile"
                      className={s.avatar}
                    />
                  </Link>
                  <button onClick={logout} className={s.logoutButton}>
                    Logout
                  </button>
                </div>
              ) : null}

              <div className={s.mobileToggle} onClick={toggleMenu}>
                {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className={s.backdrop(isOpen)} onClick={() => setIsOpen(false)}></div>
      <div className={s.drawer(isOpen)}>
        <div className={s.drawerHeader}>
          <Logo onClick={() => setIsOpen(false)} />
          <HiX size={28} onClick={() => setIsOpen(false)} className={s.drawerCloseIcon} />
        </div>
        <div className={s.drawerNavLinks}>{navLinks}</div>
        {user && (
          <div className={s.drawerUserSection}>
            <div className={s.drawerUserInfo}>
              <img
                src={
                  user.profilePic ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                }
                alt="Profile"
                className={s.drawerAvatar}
              />
              <div>
                <div className={s.drawerUserName}>{user.name}</div>
                <div className={s.drawerUserEmail}>{user.email}</div>
              </div>
            </div>
            <button onClick={logout} className={s.drawerLogoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;