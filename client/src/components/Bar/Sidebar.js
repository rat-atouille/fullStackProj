import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoLogOut, IoSearch, IoHome, IoHeart, IoFilm, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import logo from '../../assets/logo.png';
import { FaClock } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import axios from 'axios';
import './Sidebar.scss';

const Sidebar = ({ user, setUser, setIsLoggedIn, isSidebarOpen, setIsSidebarOpen }) => {
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleHomeDropdown = () => {
    setIsHomeDropdownOpen(!isHomeDropdownOpen);
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      axios.post('http://localhost:5000/api/auth/logout_user', {}, { withCredentials: true })
        .then(response => {
          setUser(null);
          setIsLoggedIn(false);
          navigate('/login');
          setIsSidebarOpen(false);
        })
        .catch(error => {
          console.error('Logout failed:', error);
        });
    }
  };

  const getLinkClassName = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <span className='logo'>cine∙phile</span>
      <div className='userInfo'> <img src={logo} /> Welcome, {user}!</div>
      <ul className="menus">
        <li><Link to="/Explore" className={getLinkClassName('/Explore')}><span><IoSearch size={18} /></span>Explore</Link></li>
        <li className="home-dropdown" onClick={toggleHomeDropdown}>
          <p><span><IoHome size={18} /></span>My Home
            <span className='dropdown-icon'>
              {!isHomeDropdownOpen ? <IoChevronUp /> : <IoChevronDown />}
            </span>
          </p>
        </li>
        {!isHomeDropdownOpen && (
          <ul className='dropdown'>
            <li><Link to={`/${user}/all_movies`} className={getLinkClassName(`/${user}/all_movies`)}><span><IoFilm size={16} /></span>All Movies</Link></li>
            <li><Link to={`/${user}/favourites`} className={getLinkClassName(`/${user}/favourites`)}><span><IoHeart size={16} /></span>Favourites</Link></li>
            <li><Link to={`/${user}/watch_later`} className={getLinkClassName(`/${user}/watch_later`)}><span><FaClock size={16} /></span>Watch Later</Link></li>
            <li><Link to={`/${user}/finished`} className={getLinkClassName(`/${user}/finished`)}><span><FaCheck size={16} /></span>Finished</Link></li>
          </ul>
        )}
        <li><Link to={`/${user}/myNotes`} className={getLinkClassName(`/${user}/myNotes`)}><span><PiPencilSimpleLineFill size={18} /></span>My Notes</Link></li>
        <li className='logout' onClick={logout}><p><span><IoLogOut size={18} /></span>Logout</p></li>
      </ul>
    </div>
  );
};

export default Sidebar;
