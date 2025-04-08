import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Header() {
    const [isLoggedIn] = useAuthStore((state) => [state.isLoggedIn, state.user]);
    
    return (
        <header className="bg-gray-900 text-white sticky top-0 z-50">
            <nav className="relative">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-3">
                        <Link className="flex-shrink-0" to="/">
                            <img className="w-48" src="https://i.postimg.cc/ZRNC1mhM/my-main-logo.png" alt="logo" />
                        </Link>
                        
                        <button 
                            className="lg:hidden flex items-center text-white"
                            type="button"
                            aria-controls="navbarCollapse"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="hidden sm:inline-block mr-2">Menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        <div className="hidden lg:flex flex-col lg:flex-row w-full lg:items-center lg:justify-between" id="navbarCollapse">
                            <div className="mt-3 lg:mt-0 px-4 flex-nowrap lg:w-96">
                                <form className="relative">
                                    <input 
                                        className="w-full py-2 pl-3 pr-10 bg-gray-700 rounded text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        type="search" 
                                        placeholder="Search Articles" 
                                        aria-label="Search" 
                                    />
                                    <Link 
                                        to="/search/" 
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </Link>
                                </form>
                            </div>
                            
                            <ul className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4 mt-4 lg:mt-0">
                                <li className="relative">
                                    <Link className="hover:text-blue-300" to="/">
                                        Home
                                    </Link>
                                </li>
                                <li className="relative group">
                                    <a 
                                        className="flex items-center hover:text-blue-300 cursor-pointer" 
                                        href="#" 
                                    >
                                        Pages
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </a>
                                    <ul className="hidden group-hover:block absolute left-0 mt-1 py-2 w-48 bg-gray-800 rounded shadow-lg z-50">
                                        <li>
                                            <Link className="block px-4 py-2 hover:bg-gray-700" to="/about/">
                                                <i className="bi bi-person-lines-fill mr-2"></i> About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="block px-4 py-2 hover:bg-gray-700" to="/contact/">
                                                <i className="bi bi-telephone-fill mr-2"></i> Contact
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative group">
                                    <a 
                                        className="flex items-center hover:text-blue-300 cursor-pointer" 
                                        href="#" 
                                    >
                                        Dashboard
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </a>
                                    <ul className="hidden group-hover:block absolute left-0 mt-1 py-2 w-48 bg-gray-800 rounded shadow-lg z-50">
                                        <li>
                                            <Link className="block px-4 py-2 hover:bg-gray-700" to="/dashboard/">
                                                <i className="fas fa-user mr-2"></i> Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="block px-4 py-2 hover:bg-gray-700" to="/posts/">
                                                <i className="bi bi-grid-fill mr-2"></i> Posts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="block px-4 py-2 hover:bg-gray-700" to="/add-post/">
                                                <i className="fas fa-plus-circle mr-2"></i> Add Post
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="block px-4 py-2 hover:bg-gray-700" to="/comments/">
                                                <i className="bi bi-chat-left-quote-fill mr-2"></i> Comments
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="block px-4 py-2 hover:bg-gray-700" to="/notifications/">
                                                <i className="fas fa-bell mr-2"></i> Notifications
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="block px-4 py-2 hover:bg-gray-700" to="/profile/">
                                                <i className="fas fa-user-gear mr-2"></i> Profile
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="flex flex-wrap gap-2">
                                    {isLoggedIn() ? (
                                        <>
                                            <Link to="/dashboard/" className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded flex items-center">
                                                Dashboard <i className="bi bi-grid-fill ml-2"></i>
                                            </Link>
                                            <Link to="/logout/" className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center">
                                                Logout <i className="fas fa-sign-out-alt ml-2"></i>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/register/" className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center">
                                                Register <i className="fas fa-user-plus ml-2"></i>
                                            </Link>
                                            <Link to="/login/" className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center">
                                                Login <i className="fas fa-sign-in-alt ml-2"></i>
                                            </Link>
                                        </>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;