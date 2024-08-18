import React from 'react';
import './Movie.scss';
import noImage from '../../assets/no_poster.png';
import { FaStar } from "react-icons/fa6";

const Movie = ({ movie, category, onToggleCategory, onDoubleClick }) => {
  const posterUrl = movie.poster_url ? movie.poster_url : noImage;
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : "Not found";
  const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : "?";

  return (
    <div className='MovieCard'>
      <div className='movie_poster'>
        <img src={posterUrl} alt={movie.title} />
      </div>
      <div className='movieInfo'>
        <p className='movie_title'>{movie.title}</p>
        <p className='movie_release'>{releaseYear}</p>
        {category !== "notes" && <span className='movie_vote'><FaStar size={12} style={{color: "#ffe234	"}} />{voteAverage}</span>}
      </div>
      {category === "all" && (
        <div className='movie_actions'>
          <label>
            <input
              type="checkbox"
              checked={movie.favourite === 1}
              onChange={(e) => onToggleCategory(movie.movie_id, 'favourite', e.target.checked ? 1 : 0)}
            /> Favourite
          </label>
          <label>
            <input
              type="checkbox"
              checked={movie.watch_later === 1}
              onChange={(e) => onToggleCategory(movie.movie_id, 'watch_later', e.target.checked ? 1 : 0)}
            /> Later
          </label>
          <label>
            <input
              type="checkbox"
              checked={movie.finished === 1}
              onChange={(e) => onToggleCategory(movie.movie_id, 'finished', e.target.checked ? 1 : 0)}
            /> Finished
          </label>
        </div>
      )}
      {category === "notes" && (
        <div className='notes'>
          <div className='urating'>
            <h3 className='ulabel'>Rating</h3>
            <p className='uReview'></p>
            </div>
        </div>
      )}
      <button className="deleteButton" onClick={() => onToggleCategory(movie.movie_id, category, 0)}>✖</button>
    </div>
  );
};

export default Movie;
