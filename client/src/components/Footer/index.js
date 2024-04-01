import { useContext } from "react";
import UserContext from "../../utils/UserContext";
import "./index.css";

const Footer = () => {
  // const { user } = useContext(UserContext);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  };
  return (
    <div className='page-container'>
      {/* {user.name} - {user.email} */}

      <footer className='site-footer' onClick={scrollToTop}>
        <div className='footer-container'>
          <h2 onClick={scrollToTop}>Contact Info</h2>
          <ul onClick={scrollToTop}>
            <li>Manikchand Icon, Pune, Maharashtra</li>
            <li>Email: dinedash@gmail.com</li>
            <li>Phone: (123) 456-7890</li>
          </ul>
        </div>
        <div className='footer-bottom' onClick={scrollToTop}>
          <p>&copy; 2024 Dinedash All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
