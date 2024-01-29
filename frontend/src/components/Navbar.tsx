import React,{useEffect,useState} from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../pages/AuthContext";
import '../../public/css/Navbar.css'

const Navbar:React.FC = () => {
    
    // const [minutes, setMinutes] = useState(0);
    // const [seconds, setSeconds] = useState(0);
    const {minutes,seconds,setMinutes,setSeconds,onGamePage,timeStart,user,setUser,username} = useAuth();
    //console.log(username,token)
    useEffect(() => {
      let interval;
      const updateTimer = () => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1;
        if (newSeconds === 60) {
          setMinutes((prevMinutes) => prevMinutes + 1);
          return 0;
        }
        return newSeconds;
        });
      };
      console.log(minutes,seconds)
      if (onGamePage === true && timeStart === true) {
         interval = setInterval(updateTimer, 1000);
       }
     if(onGamePage === false) {
        setMinutes(0);
        setSeconds(0)
     }
     const handleStorageChange = () => {
        const storedName = localStorage.getItem('username'); // Replace 'userName' with your key
  
        // Update state if the token is deleted
        setUser((prev) => ({
            ...prev,
            username: storedName || ''
        }));
      };
  
      // Add event listener for changes in local storage
      window.addEventListener('storage', handleStorageChange);
  
      // Initial check on component mount
      handleStorageChange();

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
      };
    }, [onGamePage,timeStart]);

    return (
     <header data-testid="navbar" className="navbarContainer">
        <div className='left'>
            <Link to="/">
                <h1>PhotoTag</h1>
            </Link>
        </div>
        <div className='right'>
        {onGamePage ? <p>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p> : null}
            {/* <p>Hello,user</p> */}
            {user?.username ? <p>Hello, {user?.username}</p> : null}
        </div>
     </header>
    )
} 

export default Navbar;