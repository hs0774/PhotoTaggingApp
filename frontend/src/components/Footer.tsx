import React from 'react';
import '../../public/css/Footer.css'
import github from '../../public/images/logos/github-mark-white.png'

const Footer:React.FC = () => {
    return (
        <footer data-testid="footer" className="footerContainer"> 
            <img data-testid="footer-img" className="footerimg" src={github} alt="GitHub Logo" />    
        </footer>
       )
}

export default Footer;

