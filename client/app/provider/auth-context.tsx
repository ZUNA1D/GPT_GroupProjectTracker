import React, { createContext, useContext, useState, useEffect } from 'react';
import  type {User}  from '@/types';
import { queryClient } from './react-query-provider';
import { useLocation, useNavigate } from 'react-router';
import { publicRoutes } from '@/lib';



interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const currentPath = useLocation().pathname;
    const isPublicRoute = publicRoutes.includes(currentPath);

    // check if the user is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            const userInfo = localStorage.getItem('user');
            if (userInfo) {
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);

            } else {
                setIsAuthenticated(false);
                if (!isPublicRoute) {
                    navigate('/sign-in');
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);


    useEffect(() => {
        const handleLogout = () => {
            logout();
            navigate('/sign-in');
        };
        // listen for logout events
        window.addEventListener('force-logout', handleLogout);
        return () => {
            // Clean up the event listener
            window.removeEventListener('force-logout', handleLogout);
        };
    }, []);
    

    const login = async (data : any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
       localStorage.removeItem('token');
       localStorage.removeItem('user'); 
        setUser(null);
        setIsAuthenticated(false);
        queryClient.clear();
    };
    const values = {
        user,
        isAuthenticated,
        isLoading,  
        login,
        logout,
    };


    useEffect(() => {
        // fetch user data from API or local storage
        const fetchUser = async () => {
            try {
                // Replace with actual API call
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);


    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};