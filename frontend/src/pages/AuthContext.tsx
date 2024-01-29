import React, {createContext,useContext,useState,useEffect} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
     const [timeStart,setTimeStart] = useState(false);
     const [onGamePage, setOnGamePage] = useState(false);
     const [minutes, setMinutes] = useState(0);
     const [seconds, setSeconds] = useState(0);
     
     const [user,setUser] = useState(null);

     useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
    
        if (token && username) {
            setUser({ token, username });
        } else {
            setUser(null);
        }
    }, []);
    
    const userCreated = (userData) => {
        setUser(userData);
     } 
    return (
        <AuthContext.Provider value={{setUser,user,userCreated,setSeconds,setMinutes,minutes,seconds,timeStart,setTimeStart,onGamePage,setOnGamePage}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

