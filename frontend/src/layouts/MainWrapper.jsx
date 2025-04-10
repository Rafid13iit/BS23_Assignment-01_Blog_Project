import { Link } from 'react-router-dom';
import { AppContextProvider } from '../context/AppContext';
import Header from '../views/components/Header';
import Footer from '../views/components/Footer';
// import { useContext } from 'react';

const MainWrapper = ({ children }) => {
//   const { isLoggedin } = useContext(AppContextProvider);
//   const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainWrapper;