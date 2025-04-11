import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Header = () => {
  const { isLoggedin, userData, logout } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinkStyles = ({isActive}) => 
    isActive 
      ? "font-medium border-b-2 border-white" 
      : "hover:text-blue-200";

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Blog App</Link>

          {/* Hamburger menu */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <NavLink to="/" className={navLinkStyles}>
                  Home
                </NavLink>
              </li>
              {isLoggedin && (
                <>
                  <li>
                    <NavLink to="/dashboard" className={navLinkStyles}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/add-post" className={navLinkStyles}>
                      New Post
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile" className={navLinkStyles}>
                      Profile
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink to="/about" className={navLinkStyles}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={navLinkStyles}>
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Desktop User Options */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedin ? (
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm">Hello, {userData?.username}</p>
                </div>
                <button onClick={logout} className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-100">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-100">
                  Log in
                </Link>
                <Link to="/register" className="bg-transparent border border-white text-white px-4 py-1 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu*/}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 pt-1 border-t border-blue-500">
            <nav>
              <ul className="flex flex-col space-y-3">
                <li>
                  <NavLink 
                    to="/" 
                    className={navLinkStyles}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </NavLink>
                </li>
                {isLoggedin && (
                  <>
                    <li>
                      <NavLink 
                        to="/dashboard" 
                        className={navLinkStyles}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/add-post" 
                        className={navLinkStyles}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        New Post
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/profile" 
                        className={navLinkStyles}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink 
                    to="/about" 
                    className={navLinkStyles}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/contact" 
                    className={navLinkStyles}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </nav>
            
            {/* Mobile User Options */}
            <div className="mt-4 pt-3 border-t border-blue-500">
              {isLoggedin ? (
                <div className="flex flex-col space-y-3">
                  <p className="text-sm">Hello, {userData?.username}</p>
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }} 
                    className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-100 w-full text-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-100 text-center"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-transparent border border-white text-white px-4 py-1 rounded-md hover:bg-blue-700 text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;