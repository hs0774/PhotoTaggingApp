import React from "react";
import { Link } from 'react-router-dom';
import '../../public/Navbar.css'

const Navbar:React.FC = () => {
    return (
     <header data-testid="navbar" className="navbarContainer">
        <div className='left'>
            <Link to="/">
                <h1>PhotoTag</h1>
            </Link>
        </div>
        <div className='right'>
            <p>Hello,user</p>
            {/* {user ?
            <>
                <p>Hello, {user}</p>
            </> 
            : ''} */}
        </div>
     </header>
    )
} 

export default Navbar;