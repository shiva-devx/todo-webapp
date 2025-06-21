import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* <img 
            src="https://via.placeholder.com/50" 
            alt="Logo" 
            className="h-10 mr-2"
          /> */}
          <h1 className="text-xl font-bold">Todo App</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            {user ? (
              <li>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;