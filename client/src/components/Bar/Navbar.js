import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.scss';
import axios from 'axios';
import { IoMenuSharp } from "react-icons/io5";

const Navbar = ({ user, setUser, isLoggedIn, setIsLoggedIn, toggleSidebar, recentPage }) => {

  const navigate = useNavigate();

  // logout
  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      axios.post('http://localhost:5000/api/auth/logout_user', {}, { withCredentials: true })
        .then(response => {
          setUser(null);
          setIsLoggedIn(false);
          navigate('/login');
        })
        .catch(error => {
          console.error('Logout failed:', error);
        });
    }
  };

  return (
    <div className='nav'>
      <div className='nav-logo'>
        {isLoggedIn && (
          <li className='menu' onClick={toggleSidebar}><IoMenuSharp size={20} /></li>
        )}
        <Link to="/Explore">
          cine∙phile <img src={logo} alt="Logo" />
        </Link>
      </div>
      <ul className='nav-menu'>
        <li className='explore'><Link to="/Explore">EXPLORE</Link></li>
        <li className='divider'>|</li>
        {isLoggedIn ? (
          <>
            <li className='logout' onClick={logout}>LOGOUT</li>
            <li className='user'><Link to={`/${user}${recentPage}`}>MY PAGE</Link></li>
          </>
        ) : (
          <>
            <li className='login'><Link to="/Login">LOGIN</Link></li>
            <li className='register'><Link to="/Register">REGISTER</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
