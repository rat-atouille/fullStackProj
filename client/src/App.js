import './App.scss';
import { Route, Routes, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from "./components/Bar/Navbar";
import Explore from "./components/Explore/Explore";
import Home from "./components/Home/Home";
import Login from "./components/Signing/Login";
import Register from "./components/Signing/Register";
import User from "./components/UserPage/UserPage";
import Sidebar from "./components/Bar/Sidebar";
import AllMovies from './components/UserPage/MyHome/AllMovies';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentPage, setRecentPage] = useState('/all_movies'); // Default to 'All Movies'
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Update the recentPage whenever the user navigates
  useEffect(() => {
    const currentPath = window.location.pathname.split('/')[2]; // Extracts path after userId
    if (currentPath && ['all_movies', 'favourites', 'watch_later', 'finished', 'myNotes'].includes(currentPath)) {
      setRecentPage(`/${currentPath}`);
    }
  }, [window.location.pathname]);

  return (
    <div className='containerAll'>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        toggleSidebar={toggleSidebar}
        recentPage={recentPage} // Pass recentPage to Navbar
      />
      <div className={`container_app ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {isSidebarOpen && (
          <Sidebar 
            user={user} 
            setUser={setUser} 
            setIsLoggedIn={setIsLoggedIn} 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />
        )}
        {isSidebarOpen && <div className='backdrop open' onClick={toggleSidebar}></div>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home user={user} />} />
          <Route path="/Explore" element={<Explore user={user} isLoggedIn={isLoggedIn} />} />
          <Route path="/Login" element={<Login user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/Register" element={<Register />} />
          
          <Route path="/:userId" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <User user={user} setUser={setUser} isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          }>
            <Route path="all_movies" element={<AllMovies />} />
            <Route path="favourites" element={<AllMovies />} />
            <Route path="watch_later" element={<AllMovies />} />
            <Route path="finished" element={<AllMovies />} />
            <Route path="myNotes" element={<AllMovies />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
