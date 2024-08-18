import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import Loader from "./../Others/Loader"; 
import './UserPage.scss';

const UserPage = ({ user }) => {
  const location = useLocation();
  const [all, setAll] = useState([]);
  const [fav, setFav] = useState([]);
  const [later, setLater] = useState([]);
  const [finished, setFinished] = useState([]);
  const [notes, setNotes] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true); 
      axios.post('http://localhost:5000/api/movies/load_data', { user })
        .then(response => {
          
          const { all_movies, notes } = response.data;
          setAll(all_movies);
          setFav(all_movies.filter(movie => movie.favourite === 1));
          setLater(all_movies.filter(movie => movie.watch_later === 1));
          setFinished(all_movies.filter(movie => movie.finished === 1));
          setNotes(notes); 
          setLoading(false); 
        })
        .catch(error => {
          console.error(error.response ? error.response.data : "Error loading data");
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    switch (location.pathname) {
      case `/${user}/favourites`:
        setCategory("favourite");
        break;
      case `/${user}/watch_later`:
        setCategory("watch_later");
        break;
      case `/${user}/finished`:
        setCategory("finished");
        break;
      case `/${user}/myNotes`:
        setCategory("notes");
        break;
      default:
        setCategory("all");
    }
  }, [location.pathname, user]);

  const updateMovieLists = (movieId, category, boolean) => {
    const updatedAll = all.map(movie =>
      movie.movie_id === movieId ? { ...movie, [category]: boolean } : movie
    );
    setAll(updatedAll);

    if (category === "all") {
      setAll(all.filter(movie => movie.movie_id !== movieId));
      setFav(fav.filter(movie => movie.movie_id !== movieId));
      setLater(later.filter(movie => movie.movie_id !== movieId));
      setFinished(finished.filter(movie => movie.movie_id !== movieId));
      setNotes(finished.filter(movie => movie.movie_id !== movieId));
    }
    if (category === "favourite") {
      boolean === 1
        ? setFav([...fav, all.find(movie => movie.movie_id === movieId)])
        : setFav(fav.filter(movie => movie.movie_id !== movieId));
    } else if (category === "watch_later") {
      boolean === 1
        ? setLater([...later, all.find(movie => movie.movie_id === movieId)])
        : setLater(later.filter(movie => movie.movie_id !== movieId));
    } else if (category === "finished") {
      boolean === 1
        ? setFinished([...finished, all.find(movie => movie.movie_id === movieId)])
        : setFinished(finished.filter(movie => movie.movie_id !== movieId));
    }  else if (category === "notes") {
      boolean === 1
        ? setNotes([...finished, all.find(movie => movie.movie_id === movieId)])
        : setNotes(finished.filter(movie => movie.movie_id !== movieId));
    } 
  };
  
  const updateNotes = (note, boolean) => {
    switch (boolean) {
      // add the new note
      case 1: 
        setNotes([note, ...notes]);
        break;
  
      // delete the note
      case 0:
        setNotes(notes.filter(element => element.review_id !== note.review_id));
        break;
    }
  };

  return (
    <div className='userPage'>
      {loading ? (
        <Loader /> 
      ) : (
        <Outlet context={{ all, fav, later, notes, finished, updateNotes, updateMovieLists, user, category }} />
      )}
    </div>
  );
};

export default UserPage;
