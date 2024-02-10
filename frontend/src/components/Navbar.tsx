import React,{useEffect} from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../pages/AuthContext";
import leaderboardsvg from '../../public/images/logos/leaderboard.svg'
import homesvg from '../../public/images/logos/home.svg'
import '../../public/css/Navbar.css'

const Navbar:React.FC = () => {
    
    const {minutes,seconds,setMinutes,setSeconds,onGamePage,timeStart,user,setUser} = useAuth() || {};

    useEffect(() => {
      let interval: string | number | NodeJS.Timeout | undefined;
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
      if (onGamePage === true && timeStart === true) {
         interval = setInterval(updateTimer, 1000);
       }
     if(onGamePage === false) {
        setMinutes(0);
        setSeconds(0)
     }
     const handleStorageChange = () => {
      const storedName = localStorage.getItem('username');
      const storedToken = localStorage.getItem('token');
  
      // Update state if the token is deleted
      setUser({
          username: storedName || '',
          token: storedToken ? storedToken : null
      });
    };
  
      // Add event listener for changes in local storage
      window.addEventListener('storage', handleStorageChange);
  
      // Initial check on component mount
      handleStorageChange();

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
      };
    }, [onGamePage, setMinutes, setSeconds, setUser, timeStart]);

    return (
     <header data-testid="navbar" className="navbarContainer">
        <div className='left'>
            <Link to="/">
                <h1>PhotoTag</h1>
            </Link>
        </div>
        <div className='right'>
        <Link to='/api/v1/'>    
        <img className='svg svg2' data-testid='svg'src={homesvg}/>
        </Link>
        <Link to='/api/v1/scores'>    
        <img className='svg'data-testid='svg2' src={leaderboardsvg}/>
        </Link>
        <div className="nameAndTimer">
        {onGamePage ? <p data-testid='timer'>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p> : null}
        {user?.username ? <p data-testid='userCreated'>Hello, {user?.username}</p> : null}
        </div>
        </div>
     </header>
    )
} 

export default Navbar;