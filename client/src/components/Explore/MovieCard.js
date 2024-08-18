import React from 'react';
import './MovieCard.scss';
import axios from 'axios';
import noImage from '../../assets/no_poster.png'
import { FaStar } from "react-icons/fa";

const MovieCard = ({ movie, user }) => {
  
  // add the movie to the user's list
  const addMovie = (movie_id, title) => {
    if (user == null) {
      alert("Login to add the movie");
    } else {
      axios.post('http://localhost:5000/api/movies/add_movie', { movie_id, user })
      .then(response => {
        if (response.status === 202) {
          console.log(response.data.message);
          alert(title + " has been added!");
        } else {
          console.log(response);
        }
      })
      .catch(error => {
        if (error.response) {
          const { data } = error.response;
          console.log(data.error)
          alert('Unable to add the film');
        }
      });
    }
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : noImage;
  
  return (
    <div className='card'>
      <div className='movie_poster'>
        <img src={posterUrl} alt={movie.title} />
      </div>
      <div className='movie_info'>
        <h1>{movie.title}</h1>
        <p className='release'>{movie.release_date}</p>
        <p className='rating'><span><FaStar /> </span>{movie.vote_average}</p>
        <p className='overview'>{movie.overview}</p>
      </div>
      <button className='add' onClick={() => addMovie(movie.id, movie.title)}>+</button>
    </div>
  );
};

export default MovieCard;
