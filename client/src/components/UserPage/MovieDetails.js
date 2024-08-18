import React from 'react';
import { useLocation } from 'react-router-dom';
import './MovieDetails.scss';
import noImage from '../../assets/no_poster.png';

const MovieDetails = ({isLoggedIn}) => {
  const location = useLocation();
  const { movie } = location.state || {};  

  if (!movie) {
    return <div>No movie data found</div>;
  }

  const posterUrl = movie.poster_url ? movie.poster_url : noImage;

  return (
    <div className='movie_details_container'>
      <div className='movie_details_card'>
        <div className='movie_poster'>
          <img src={posterUrl} alt={movie.title} />
        </div>
        <div className='movie_info'>
          <h1>{movie.title}</h1>
          <p>{movie.release_date}</p>
          <p className='rating'>{movie.vote_average}</p>
          <p className='overview'>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;