import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/login/Login';
import HomePage from './components/Home';
import AddTodoForm from './components/AddTodoForm';
import UpdateTodoForm from './components/UpdateTodoForm';
import Header from './components/header/Header';
import Signup from './components/signup/Signup';

// Private Route component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route component (for already authenticated users)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/home" /> : children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header/>
        <Routes>
          {/* Default route redirects to /home if logged in, /login otherwise */}
          <Route path="/" element={
            <PrivateRoute>
              <Navigate to="/home" />
            </PrivateRoute>
          } />

          {/* Login route - only accessible when not logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          {/* Signup route -  */}
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          {/* Protected routes */}
          <Route path="/home" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />

          <Route path="/todos/add" element={
            <PrivateRoute>
              <AddTodoForm />
            </PrivateRoute>
          } />

          <Route path="/todos/new" element={
            <PrivateRoute>
              <AddTodoForm />
            </PrivateRoute>
          } />

          <Route path="/todos/edit/:id" element={
            <PrivateRoute>
              <UpdateTodoForm />
            </PrivateRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
