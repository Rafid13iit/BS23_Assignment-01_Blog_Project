import React from "react";

function Footer() {
    return (
        <footer>
            <div className="bg-gray-900 py-5 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                <div className="w-full md:w-5/12 mb-3 md:mb-0">
                    <div className="text-white hover:text-blue-300">
                        2019 - 2024{" "}
                        <a href="https://youtube.com/@desphixs/" className="text-white hover:text-blue-300 mx-2" target="_blank" rel="noreferrer">
                            Desphixs
                        </a>
                        | All rights reserved
                    </div>
                </div>
                <div className="w-full md:w-3/12 mb-3 md:mb-0">
                    <img src="/logo.png" className="w-48 mx-auto md:mx-0" alt="footer logo" />
                </div>
                <div className="w-full md:w-4/12">
                    <ul className="flex justify-center md:justify-end">
                        <li>
                            <a className="text-white hover:text-blue-300 px-2 text-xl" href="https://facebook.com/desphixs">
                                <i className="fab fa-facebook-square"></i>
                            </a>
                        </li>
                        <li>
                            <a className="text-white hover:text-blue-300 px-2 text-xl" href="https://twitter.com/desphixs">
                                <i className="fab fa-twitter-square"></i>
                            </a>
                        </li>
                        <li>
                            <a className="text-white hover:text-blue-300 px-2 text-xl" href="https://youtube.com/@desphixs">
                                <i className="fab fa-youtube-square"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;