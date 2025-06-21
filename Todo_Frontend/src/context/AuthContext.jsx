import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const AuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    login: () => { },
    signup: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    // if user is already logged in or not
    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8080//api/auth/login', {
    //                 credentials: 'include' // Important for session cookies
    //             });

    //             if (response.ok) {
    //                 const userData = await response.json();
    //                 setUser(userData);
    //             }
    //         } catch (err) {
    //             console.error('Auth check failed or no path exist:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     checkAuth();
    // }, []);

    const verifySession = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/check-session', {
                credentials: 'include'
            });

            const publicPaths = ['/login', '/signup'];

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setUser({ username: data.username });
                    if (location.pathname === '/login' || location.pathname === '/signup') {
                        navigate('/home');
                    }
                } else {
                    setUser(null);
                    if (!publicPaths.includes(location.pathname)) {
                        navigate('/login');
                    }
                }
            } else {
                setUser(null);
                if (!publicPaths.includes(location.pathname)) {
                    navigate('/login');
                }
            }
        } catch (error) {
            console.error('Session verification failed:', error);
            setUser(null);
            if (!['/login', '/signup'].includes(location.pathname)) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        verifySession(); // 👈 Safe to use now
    }, [location.pathname, navigate]);

    const login = async (credentials) => {
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for session cookies
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.message === "Login successful") {
                    // Verify the session after login
                    await verifySession();
                    navigate('/home');
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const signup = async (userData) => {
        setError(null);
        try {
            const response = await fetch('http://localhost:8080//api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            // Registration successful
            const newUser = await response.json();
            console.log(newUser);

            // setUser(newUser);
            // navigate('/home'); // Redirect after successful registration

            // Automatically login using username/email and password
            const credentials = {
                username: userData.username, // or userData.email, depending on your backend
                password: userData.password,
            };

            const loginSuccess = await login(credentials); // 👈 Call login

            if (loginSuccess) {
                return true;
            } else {
                throw new Error("Auto-login after signup failed.");
            }
            // return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'GET',
                credentials: 'include'
            });
            setUser(null);
            setError(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setError("Logout failed.");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}