import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Header = () => {
  const { isLoggedin, userData, logout } = useContext(AppContext);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Blog App</Link>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <NavLink to="/" 
                  className={({isActive}) => 
                    isActive ? "font-medium border-b-2 border-white" : "hover:text-blue-200"
                  }
                >
                  Home
                </NavLink>
              </li>
              {isLoggedin && (
                <>
                  <li>
                    <NavLink to="/dashboard" 
                      className={({isActive}) => 
                        isActive ? "font-medium border-b-2 border-white" : "hover:text-blue-200"
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/add-post" 
                      className={({isActive}) => 
                        isActive ? "font-medium border-b-2 border-white" : "hover:text-blue-200"
                      }
                    >
                      New Post
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink to="/about" 
                  className={({isActive}) => 
                    isActive ? "font-medium border-b-2 border-white" : "hover:text-blue-200"
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" 
                  className={({isActive}) => 
                    isActive ? "font-medium border-b-2 border-white" : "hover:text-blue-200"
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            {isLoggedin ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <p className="text-sm">Hello, {userData?.username}</p>
                </div>
                <button onClick={logout} className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-100">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-100">
                  Login
                </Link>
                <Link to="/register" className="bg-transparent border border-white text-white px-4 py-1 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;