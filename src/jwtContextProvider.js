import { createContext, useContext, useEffect, useState } from "react";

const jwtContext = createContext(null);

export const JWTProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
    useEffect(()=>{
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken){
            setIsAuthenticated(true);
            setToken(storedToken);
        }
    }, [])

    const login = (newToken, userData) => {
        localStorage.setItem('jwtToken', newToken);
        setToken(newToken);
        setIsAuthenticated(true)
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setIsAuthenticated(false);
    };

    const getAuthHeader = () => {
        if (token){
            return {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
        }
        return {};
    }
    const value = {token, isAuthenticated, login, logout, getAuthHeader};

    return <jwtContext.Provider value={value}>{children}</jwtContext.Provider>
}

export const useJWT = ()=>{
    return useContext(jwtContext);
};